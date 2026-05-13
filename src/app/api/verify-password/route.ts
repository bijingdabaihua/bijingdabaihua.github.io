import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, setAuthCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password required' }, { status: 400 })
    }

    if (!verifyPassword(password)) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
    }

    await setAuthCookie()
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
