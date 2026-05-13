import { cookies } from 'next/headers'
import crypto from 'crypto'

const COOKIE_NAME = 'blog_auth'
const COOKIE_MAX_AGE = 86400 * 3 // 3 days

function getPasswordHash(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

function signToken(timestamp: number): string {
  const secret = process.env.BLOG_PASSWORD || ''
  const payload = `${timestamp}.${secret}`
  const sig = crypto.createHash('sha256').update(payload).digest('hex').slice(0, 16)
  return `${timestamp}.${sig}`
}

function verifyToken(token: string): boolean {
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [timestampStr, sig] = parts
  const timestamp = parseInt(timestampStr, 10)
  if (isNaN(timestamp)) return false
  if (Date.now() - timestamp > COOKIE_MAX_AGE * 1000) return false

  const expectedSig = crypto.createHash('sha256').update(`${timestamp}.${process.env.BLOG_PASSWORD || ''}`).digest('hex').slice(0, 16)
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))
}

export async function setAuthCookie() {
  const cookieStore = await cookies()
  const token = signToken(Date.now())
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return false
  return verifyToken(token)
}

export function verifyPassword(password: string): boolean {
  const expectedHash = getPasswordHash(process.env.BLOG_PASSWORD || '')
  const inputHash = getPasswordHash(password)
  return crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(expectedHash))
}
