import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { isAdminEmail } from '@/lib/admin'

// In-memory OTP store (for dev — use Redis/DB in production)
// Key: phone, Value: { otp, expiresAt }
const otpStore = new Map<string, { otp: string; expiresAt: number }>()

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: NextRequest) {
  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { phone } = await req.json()
  if (!phone || phone.length < 10) {
    return NextResponse.json({ error: 'Valid phone number required' }, { status: 400 })
  }

  // Clean phone number
  const cleanPhone = phone.replace(/\D/g, '').slice(-10)
  const otp = generateOTP()
  const expiresAt = Date.now() + 5 * 60 * 1000 // 5 minutes

  // Store OTP
  otpStore.set(cleanPhone, { otp, expiresAt })

  // ── PRODUCTION: Uncomment one of these SMS providers ──
  //
  // Option 1: Fast2SMS (India — free tier available)
  // const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
  //   method: 'POST',
  //   headers: { authorization: process.env.FAST2SMS_API_KEY! },
  //   body: new URLSearchParams({
  //     route: 'otp', variables_values: otp, numbers: cleanPhone,
  //   }),
  // })
  //
  // Option 2: Twilio
  // const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)
  // await twilio.messages.create({
  //   body: `Elite Makler OTP: ${otp}. Valid for 5 minutes.`,
  //   from: process.env.TWILIO_PHONE,
  //   to: `+91${cleanPhone}`,
  // })

  // DEV MODE: Log OTP to console
  console.log(`\n🔐 OTP for +91${cleanPhone}: ${otp} (expires in 5 min)\n`)

  return NextResponse.json({
    success: true,
    message: `OTP sent to +91${cleanPhone}`,
    // DEV ONLY — remove in production:
    dev_otp: process.env.NODE_ENV === 'development' ? otp : undefined,
  })
}

export async function PUT(req: NextRequest) {
  // Verify OTP
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { phone, otp } = await req.json()
  if (!phone || !otp) {
    return NextResponse.json({ error: 'Phone and OTP required' }, { status: 400 })
  }

  const cleanPhone = phone.replace(/\D/g, '').slice(-10)
  const stored = otpStore.get(cleanPhone)

  if (!stored) {
    return NextResponse.json({ error: 'OTP not sent or expired. Request again.' }, { status: 400 })
  }
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(cleanPhone)
    return NextResponse.json({ error: 'OTP expired. Request a new one.' }, { status: 400 })
  }
  if (stored.otp !== otp.trim()) {
    return NextResponse.json({ error: 'Incorrect OTP. Please try again.' }, { status: 400 })
  }

  // OTP verified — clean up
  otpStore.delete(cleanPhone)
  return NextResponse.json({ success: true, verified: true })
}
