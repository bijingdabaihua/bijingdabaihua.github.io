'use client'

import { useState } from 'react'
import { ENCRYPTED_RESUME, TOTP_CONFIG } from '@/lib/resume-data'
import type { ResumeData } from '@/types'

// ═══════════════════════════════════════════════════════════════
// Crypto utilities — Web Crypto API (browser-native)
// ═══════════════════════════════════════════════════════════════

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

function base32Decode(encoded: string): Uint8Array<ArrayBuffer> {
  const sanitized = encoded.toUpperCase().replace(/[^A-Z2-7]/g, '')
  const result: number[] = []
  let bits = 0
  let value = 0
  for (const char of sanitized) {
    const idx = BASE32_ALPHABET.indexOf(char)
    if (idx === -1) continue
    value = (value << 5) | idx
    bits += 5
    if (bits >= 8) {
      result.push((value >>> (bits - 8)) & 255)
      bits -= 8
    }
  }
  return new Uint8Array(result) as Uint8Array<ArrayBuffer>
}

function base64ToBytes(base64: string): Uint8Array<ArrayBuffer> {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes as Uint8Array<ArrayBuffer>
}

async function computeTOTP(
  secretBytes: Uint8Array<ArrayBuffer>,
  counter: number,
): Promise<string> {
  const counterBuf = new ArrayBuffer(8)
  new DataView(counterBuf).setBigUint64(0, BigInt(counter), false)

  const key = await crypto.subtle.importKey(
    'raw',
    secretBytes,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign'],
  )
  const hmac = new Uint8Array(await crypto.subtle.sign('HMAC', key, counterBuf))

  const offset = hmac[19] & 0x0f
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff)

  return (code % 1_000_000).toString().padStart(TOTP_CONFIG.digits, '0')
}

async function verifyTOTP(input: string, secretBytes: Uint8Array<ArrayBuffer>): Promise<boolean> {
  const counter = Math.floor(Date.now() / 1000 / TOTP_CONFIG.period)
  for (const c of [counter, counter - 1, counter + 1]) {
    if ((await computeTOTP(secretBytes, c)) === input) return true
  }
  return false
}

async function decryptResume(
  ciphertextB64: string,
  ivB64: string,
  saltB64: string,
  totpSecret: string,
): Promise<ResumeData> {
  const secretBytes = base32Decode(totpSecret)
  const salt = base64ToBytes(saltB64)
  const info = new TextEncoder().encode('resume-encryption') as Uint8Array<ArrayBuffer>

  const hkdfKey = await crypto.subtle.importKey(
    'raw', secretBytes, { name: 'HKDF' }, false, ['deriveBits'],
  )
  const aesKeyBytes = await crypto.subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt, info },
    hkdfKey, 256,
  )
  const aesKey = await crypto.subtle.importKey(
    'raw', aesKeyBytes, { name: 'AES-GCM' }, false, ['decrypt'],
  )

  const ciphertext = base64ToBytes(ciphertextB64)
  const iv = base64ToBytes(ivB64)
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    aesKey, ciphertext,
  )

  return JSON.parse(new TextDecoder().decode(plaintext))
}

// ═══════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════

export default function ResumeClient() {
  const [code, setCode] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [cryptoError, setCryptoError] = useState(false)

  const verifyCode = async (input: string) => {
    if (input.length !== 6) return

    if (!window.crypto?.subtle) {
      setCryptoError(true)
      return
    }

    setLoading(true)
    setError('')

    const timeout = setTimeout(() => {
      setLoading(false)
      setError('验证超时，请刷新页面后重试。')
    }, 10_000)

    try {
      const secretBytes = base32Decode(TOTP_CONFIG.secret)
      const isValid = await verifyTOTP(input, secretBytes)
      if (!isValid) {
        setError('验证码无效，请检查手机时间同步后重试。')
        return
      }

      const data = await decryptResume(
        ENCRYPTED_RESUME.ciphertext,
        ENCRYPTED_RESUME.iv,
        ENCRYPTED_RESUME.salt,
        TOTP_CONFIG.secret,
      )
      setResumeData(data)
      setUnlocked(true)
    } catch (err) {
      console.error('[Resume] 验证/解密失败:', err)
      setError('解密失败，请刷新页面后重试。')
    } finally {
      clearTimeout(timeout)
      setLoading(false)
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 6)
    setCode(digits)
    setError('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && code.length === 6 && !loading) {
      verifyCode(code)
    }
  }

  // ── Crypto not available ──
  if (cryptoError) {
    return (
      <div className="pt-4">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-xl p-8 shadow-sm border w-full max-w-md text-center">
            <h1 className="text-xl font-bold text-text-dark mb-2">环境不支持</h1>
            <p className="text-text-secondary text-sm">
              当前浏览器不支持 Web Crypto API，请使用 HTTPS 或现代浏览器访问。
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ── Password gate ──
  if (!unlocked) {
    return (
      <div className="pt-4">
        <div className="flex items-center justify-center min-h-[60vh] print:hidden">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-[rgba(0,0,0,0.04)] w-full max-w-md text-center">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#5b7fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                <circle cx="12" cy="16" r="1" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-text-dark mb-2">简历访问验证</h1>
            <p className="text-text-secondary text-sm mb-6">
              请输入 Authenticator 中的 6 位动态验证码
            </p>
            <div className="space-y-4">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={handleInput}
                placeholder="000000"
                disabled={loading}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 text-center text-2xl tracking-[0.3em] border border-border-light rounded-lg text-text-dark placeholder:text-text-secondary/30 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors font-mono disabled:opacity-50"
                autoFocus
              />
              {loading && <p className="text-text-secondary text-xs animate-pulse">验证中…</p>}
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button
                type="button"
                onClick={() => verifyCode(code)}
                disabled={code.length !== 6 || loading}
                className="w-full bg-brand text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer"
              >
                {loading ? '验证中…' : `验证 (${code.length}/6)`}
              </button>
              <p className="text-text-secondary/40 text-[10px] mt-4">
                验证码每 30 秒自动更换 · Google Authenticator
              </p>
            </div>
          </div>
        </div>
        <div className="hidden print:block text-center py-20">
          <p className="text-text-secondary">此页面需要验证后导出 PDF。</p>
        </div>
      </div>
    )
  }

  // ── Resume display ──
  if (!resumeData) return null

  const { personalInfo, summary, skills, experience, education, projects } = resumeData

  const contactItems = [
    personalInfo.email && { label: 'Email', value: personalInfo.email, href: `mailto:${personalInfo.email}` },
    personalInfo.github && { label: 'GitHub', value: `github.com/${personalInfo.github}`, href: `https://github.com/${personalInfo.github}` },
    personalInfo.website && { label: 'Website', value: personalInfo.website.replace(/^https?:\/\//, ''), href: personalInfo.website },
    personalInfo.phone && { label: 'Phone', value: personalInfo.phone },
    personalInfo.location && { label: 'Location', value: personalInfo.location },
    personalInfo.linkedin && { label: 'LinkedIn', value: personalInfo.linkedin, href: personalInfo.linkedin },
  ].filter(Boolean) as { label: string; value: string; href?: string }[]

  return (
    <div className="pt-4">
      <div className="flex justify-end mb-4 print:hidden">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          下载 PDF / 打印
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 sm:p-10 shadow-sm border border-[rgba(0,0,0,0.04)] print:shadow-none print:border-none print:p-0 print:rounded-none">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-dark mb-1 print:text-2xl">{personalInfo.name}</h1>
          <p className="text-lg text-brand font-medium mb-4 print:text-base">{personalInfo.title}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-text-secondary print:text-xs print:gap-x-4">
            {contactItems.map((item) => (
              <span key={item.label} className="inline-flex items-center gap-1">
                <span className="text-text-secondary/50 text-xs">{item.label}</span>
                {item.href ? (
                  <a href={item.href} className="text-text-primary hover:text-brand transition-colors no-underline" target="_blank" rel="noopener noreferrer">{item.value}</a>
                ) : (
                  <span className="text-text-primary">{item.value}</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {summary && (
          <Section title="个人简介">
            <p className="text-text-primary leading-relaxed text-sm">{summary}</p>
          </Section>
        )}

        {skills.length > 0 && skills.some((s) => s.items.length > 0) && (
          <Section title="技能">
            <div className="space-y-3">
              {skills.filter((s) => s.items.length > 0).map((skill) => (
                <div key={skill.category} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                  <span className="text-sm font-semibold text-text-dark min-w-[80px] shrink-0 print:text-xs">{skill.category}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {skill.items.map((item) => (
                      <span key={item} className="text-xs px-2.5 py-0.5 bg-brand/5 text-brand rounded-full font-medium print:bg-gray-100 print:text-text-dark print:border print:border-border-light">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {experience.length > 0 && experience.some((e) => e.company || e.position) && (
          <Section title="工作经历">
            <div className="space-y-6">
              {experience.filter((e) => e.company || e.position).map((exp, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-brand/20 print:border-gray-300">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1">
                    <div>
                      <h3 className="text-base font-semibold text-text-dark print:text-sm">{exp.position}</h3>
                      <p className="text-sm text-brand font-medium print:text-xs">{exp.company}</p>
                    </div>
                    <span className="text-xs text-text-secondary shrink-0">{exp.startDate}{exp.endDate ? ` — ${exp.endDate}` : ' — 至今'}</span>
                  </div>
                  {exp.highlights.length > 0 && exp.highlights[0] && (
                    <ul className="space-y-1">
                      {exp.highlights.map((h, j) => (
                        <li key={j} className="text-sm text-text-primary leading-relaxed flex gap-2">
                          <span className="text-brand/40 shrink-0 mt-0.5">•</span><span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {education.length > 0 && education.some((e) => e.school) && (
          <Section title="教育背景">
            <div className="space-y-4">
              {education.filter((e) => e.school).map((edu, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div>
                    <h3 className="text-base font-semibold text-text-dark print:text-sm">{edu.school}</h3>
                    <p className="text-sm text-text-secondary print:text-xs">{edu.degree}{edu.major && ` · ${edu.major}`}</p>
                  </div>
                  <span className="text-xs text-text-secondary shrink-0">{edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ' — 至今'}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="项目经验">
            <div className="space-y-5">
              {projects.map((proj, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="text-base font-semibold text-text-dark print:text-sm">{proj.name}</h3>
                    {proj.url && (
                      <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-xs text-brand hover:underline no-underline">
                        {proj.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-text-primary leading-relaxed mb-2">{proj.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.tech.map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 bg-brand/5 text-brand rounded-full font-medium print:bg-gray-100 print:text-text-dark print:border print:border-border-light">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-7 print:mb-5">
      <h2 className="text-base font-bold text-text-dark mb-3 pb-1.5 border-b border-border-light print:text-sm print:border-gray-300">{title}</h2>
      {children}
    </section>
  )
}
