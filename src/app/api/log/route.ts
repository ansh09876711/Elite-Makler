import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { message, data } = await req.json()
    console.log(`[CLIENT-LOG] ${message}`, JSON.stringify(data, null, 2))
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message })
  }
}
