/**
 * GET /api/admin/setup-storage
 * 
 * 'property-media' Supabase Storage bucket create karta hai (if not exists)
 * aur public access policy set karta hai.
 * 
 * Admin panel se ek baar call karo:
 *   fetch('/api/admin/setup-storage').then(r => r.json()).then(console.log)
 */
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'
import { isAdminEmail } from '@/lib/admin'

export const dynamic = 'force-dynamic'

const BUCKET = 'property-media'

export async function GET() {
  try {
    // Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminDb = createAdminClient()
    const results: string[] = []

    // ── 1. List existing buckets ──
    const { data: buckets, error: listErr } = await adminDb.storage.listBuckets()
    if (listErr) {
      return NextResponse.json({ error: 'listBuckets failed: ' + listErr.message }, { status: 500 })
    }

    const exists = buckets?.some(b => b.name === BUCKET)
    results.push(`Existing buckets: ${buckets?.map(b => b.name).join(', ') || 'none'}`)

    // ── 2. Create bucket if missing ──
    if (!exists) {
      const { error: createErr } = await adminDb.storage.createBucket(BUCKET, {
        public:           true,
        fileSizeLimit:    52_428_800, // 50 MB
        allowedMimeTypes: ['image/*', 'video/*'],
      })
      if (createErr) {
        return NextResponse.json({
          error: 'createBucket failed: ' + createErr.message,
          hint: 'Supabase Dashboard → Storage → New bucket → "property-media" (public) manually banao',
        }, { status: 500 })
      }
      results.push(`✅ Bucket "${BUCKET}" created successfully`)
    } else {
      results.push(`✅ Bucket "${BUCKET}" already exists`)
    }

    // ── 3. Test upload ──
    const png1x1 = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    )
    const testPath = `test/setup-test-${Date.now()}.png`
    const { error: testErr } = await adminDb.storage
      .from(BUCKET)
      .upload(testPath, png1x1, { contentType: 'image/png', upsert: true })

    if (testErr) {
      results.push(`❌ Test upload failed: ${testErr.message}`)
      return NextResponse.json({ success: false, results, error: testErr.message }, { status: 500 })
    }

    const { data: urlData } = adminDb.storage.from(BUCKET).getPublicUrl(testPath)
    results.push(`✅ Test upload OK — URL: ${urlData.publicUrl}`)

    // ── 4. Cleanup test file ──
    await adminDb.storage.from(BUCKET).remove([testPath])
    results.push('✅ Test file cleaned up')

    return NextResponse.json({
      success: true,
      message: 'Storage bucket ready! Ab images/videos upload honge.',
      results,
      bucket: BUCKET,
      publicUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
