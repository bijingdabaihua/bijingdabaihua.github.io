/**
 * 简历加密脚本
 *
 * 用法：npx tsx scripts/encrypt-resume.ts
 *
 * 功能：
 * 1. 读取 src/lib/resume-data.plain.ts 中的明文简历数据
 * 2. 生成（或复用已有的）TOTP Secret
 * 3. 用 HKDF 从 TOTP Secret 派生 AES-256 密钥
 * 4. AES-256-GCM 加密简历数据
 * 5. 写入 src/lib/resume-data.ts（加密后的数据 + TOTP 配置）
 * 6. 首次运行时显示 QR 码，扫码添加到 Google Authenticator
 */

import * as crypto from 'crypto'
import * as qrcode from 'qrcode'
import * as fs from 'fs'
import * as path from 'path'

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

function generateTOTPSecret(byteLength = 20): string {
  const bytes = crypto.randomBytes(byteLength)
  let result = ''
  let bits = 0
  let value = 0
  for (const byte of bytes) {
    value = (value << 8) | byte
    bits += 8
    while (bits >= 5) {
      result += BASE32_ALPHABET[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }
  if (bits > 0) {
    result += BASE32_ALPHABET[(value << (5 - bits)) & 31]
  }
  return result
}

function base32Decode(encoded: string): Buffer {
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
  return Buffer.from(result)
}

async function main() {
  const root = process.cwd()
  const dataTsPath = path.resolve(root, 'src/lib/resume-data.ts')
  const plainPath = path.resolve(root, 'src/lib/resume-data.plain.ts')

  // ── 1. Check for existing TOTP secret ──
  let totpSecret: string
  let isNewSecret = false

  if (fs.existsSync(dataTsPath)) {
    const existing = fs.readFileSync(dataTsPath, 'utf-8')
    const secretMatch = existing.match(/secret:\s*'([A-Z2-7]+)'/)
    if (secretMatch) {
      totpSecret = secretMatch[1]
      console.log('  🔑 复用已有的 TOTP Secret')
    } else {
      totpSecret = generateTOTPSecret()
      isNewSecret = true
      console.log('  🔑 生成新的 TOTP Secret')
    }
  } else {
    totpSecret = generateTOTPSecret()
    isNewSecret = true
    console.log('  🔑 生成新的 TOTP Secret')
  }

  // ── 2. Read plain text resume ──
  if (!fs.existsSync(plainPath)) {
    console.error('❌ 找不到 src/lib/resume-data.plain.ts')
    console.error('   请先创建该文件，包含 export const resumeData = { ... }')
    process.exit(1)
  }

  // Dynamic import — tsx handles TypeScript transpilation
  const plainModule = await import(plainPath)
  const resumeData = plainModule.resumeData

  if (!resumeData) {
    console.error('❌ resume-data.plain.ts 中未导出 resumeData')
    process.exit(1)
  }

  const plaintext = JSON.stringify(resumeData)
  console.log(`  📄 读取简历数据 (${plaintext.length} 字符)`)

  // ── 3. Derive AES-256 key via HKDF ──
  const secretBytes = base32Decode(totpSecret)
  const salt = crypto.randomBytes(32)
  const info = Buffer.from('resume-encryption')
  const aesKey = Buffer.from(crypto.hkdfSync('sha256', secretBytes, salt, info, 32))

  // ── 4. Encrypt with AES-256-GCM ──
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', aesKey, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  // Combine ciphertext + authTag (Web Crypto API expects them concatenated)
  const combined = Buffer.concat([encrypted, authTag])
  console.log('  🔒 AES-256-GCM 加密完成')

  // ── 5. Write resume-data.ts ──
  const output = `// ⚠️ 此文件由 scripts/encrypt-resume.ts 自动生成，请勿手动编辑
// 修改简历内容：编辑 src/lib/resume-data.plain.ts，然后运行 npx tsx scripts/encrypt-resume.ts
import type { ResumeData } from '@/types'
export type { ResumeData }

export const ENCRYPTED_RESUME = {
  ciphertext: '${combined.toString('base64')}',
  iv: '${iv.toString('base64')}',
  salt: '${salt.toString('base64')}',
}

export const TOTP_CONFIG = {
  secret: '${totpSecret}',
  period: 30,
  digits: 6,
  algorithm: 'SHA-1',
}
`

  fs.writeFileSync(dataTsPath, output, 'utf-8')
  console.log(`  ✅ 已写入 ${dataTsPath}`)

  // ── 6. Show QR code for first-time setup ──
  if (isNewSecret) {
    const issuer = 'bijingdabaihua'
    const label = `Resume:${issuer}`
    const otpauthUrl =
      `otpauth://totp/${encodeURIComponent(label)}?secret=${totpSecret}` +
      `&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`

    console.log('\n  ╔══════════════════════════════════╗')
    console.log('  ║  📱 首次设置 — 请扫码添加 TOTP  ║')
    console.log('  ╚══════════════════════════════════╝\n')

    // ASCII QR in terminal
    try {
      const qrString = await qrcode.toString(otpauthUrl, {
        type: 'terminal',
        small: true,
      })
      console.log(qrString)
    } catch {
      console.log('  (无法在终端显示二维码)\n')
    }

    console.log(`  Secret: ${totpSecret}`)
    console.log(`  URL:    ${otpauthUrl}`)
    console.log('\n  → 用 Google Authenticator / 1Password 扫码')
    console.log('  → 每次访问 /resume 时输入 6 位动态码\n')
  } else {
    console.log('\n  ✅ 简历已重新加密，TOTP Secret 不变（无需重新扫码）\n')
  }
}

main().catch((err) => {
  console.error('❌ 错误:', err)
  process.exit(1)
})
