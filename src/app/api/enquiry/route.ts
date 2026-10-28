import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, intent, message, property_id } = body

    // Basic validation
    if (!name || !phone || !intent) {
      return NextResponse.json(
        { error: 'name, phone aur intent required hain' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { error } = await supabase.from('enquiries').insert({
      name,
      email:       email    || null,
      phone,
      intent,
      message:     message  || null,
      property_id: property_id || null,
    })

    if (error) {
      console.error('Enquiry insert error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('Enquiry route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
