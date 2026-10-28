import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const adminDb = createAdminClient()

    // Upload a tiny 1×1 transparent PNG to Supabase Storage
    const png1x1 = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    )

    const testPath = `test/ping-${Date.now()}.png`

    const { error: uploadError } = await adminDb.storage
      .from('property-media')
      .upload(testPath, png1x1, { contentType: 'image/png', upsert: true })

    if (uploadError) {
      return NextResponse.json({ success: false, step: 'upload', error: uploadError.message })
    }

    const { data: urlData } = adminDb.storage
      .from('property-media')
      .getPublicUrl(testPath)

    return NextResponse.json({
      success: true,
      message: 'Supabase Storage upload works!',
      publicUrl: urlData.publicUrl,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message })
  }
}
