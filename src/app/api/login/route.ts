import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const HARDCODED_EMAIL = 'fayez.zouari@insat.ucar.tn'
const HARDCODED_PASSWORD = 'password'

export async function POST(request: Request) {
  const { email, password } = await request.json()
  const cookieStore = await cookies()
  if (email === HARDCODED_EMAIL && password === HARDCODED_PASSWORD) {
    cookieStore.set('auth', 'true', { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ success: false }, { status: 401 })
  }
}

