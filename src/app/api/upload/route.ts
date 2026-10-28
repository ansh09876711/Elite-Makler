import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { isAdminEmail } from '@/lib/admin'

export const dynamic = 'force-dynamic'

// ── Next.js App Router body size limit increase (50 MB) ──
export const maxDuration = 60 // seconds

/** Ensure 'property-media' bucket exists — create if missing */
async function ensureBucket(adminDb: ReturnType<typeof createAdminClient>) {
  const BUCKET = 'property-media'
  const { data: buckets, error: listErr } = await adminDb.storage.listBuckets()
  if (listErr) {
    console.error('listBuckets error:', listErr.message)
    return // proceed anyway
  }
  const exists = buckets?.some(b => b.name === BUCKET)
  if (!exists) {
    console.log(`Bucket "${BUCKET}" not found — creating...`)
    const { error: createErr } = await adminDb.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 52_428_800, // 50 MB
      allowedMimeTypes: ['image/*', 'video/*'],
    })
    if (createErr) {
      console.error('createBucket error:', createErr.message)
    } else {
      console.log(`Bucket "${BUCKET}" created successfully`)
    }
  }
}

export async function POST(req: NextRequest) {
  console.log('=== UPLOAD API ROUTE HIT ===')
  try {
    // ── Auth check — only admins can upload ──
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !isAdminEmail(user.email)) {
      console.error('Upload auth failed — user:', user?.email)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminDb = createAdminClient()

    // ── Make sure the bucket exists before uploading ──
    await ensureBucket(adminDb)

    const formData   = await req.formData()
    const file       = formData.get('file')        as File | null
    const propSlug   = formData.get('slug')        as string | null
    const propertyId = formData.get('property_id') as string | null
    const alt        = formData.get('alt')         as string || ''
    const isPrimary  = formData.get('is_primary')  === 'true'

    console.log('Upload params:', { file: file?.name, propSlug, propertyId, isPrimary })

    if (!file || !propSlug || !propertyId) {
      return NextResponse.json({ error: 'file, slug, property_id required' }, { status: 400 })
    }

    // ── Upload to Supabase Storage ──
    const ext       = file.name.split('.').pop()?.toLowerCase() || 'bin'
    const fileName  = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const storagePath = `properties/${propSlug}/${fileName}`

    const bytes  = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    console.log(`Uploading to storage: ${storagePath} (${buffer.length} bytes, type: ${file.type})`)

    const { error: storageError } = await adminDb.storage
      .from('property-media')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert:      false,
      })

    if (storageError) {
      console.error('Storage upload error:', storageError)
      return NextResponse.json({ error: `Storage error: ${storageError.message}` }, { status: 500 })
    }

    // ── Get public URL ──
    const { data: urlData } = adminDb.storage
      .from('property-media')
      .getPublicUrl(storagePath)

    const publicUrl = urlData.publicUrl
    console.log('File uploaded, public URL:', publicUrl)

    // ── Save to property_images table ──
    const { data: imageRow, error: dbError } = await adminDb
      .from('property_images')
      .insert({
        property_id: propertyId,
        url:         publicUrl,
        public_id:   storagePath,
        alt,
        is_primary:  isPrimary,
        order_index: 0,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Image insert error:', dbError)
      return NextResponse.json({ error: dbError.message ?? 'DB save failed' }, { status: 500 })
    }

    console.log('Image row saved:', imageRow?.id)

    return NextResponse.json({
      success:   true,
      url:       publicUrl,
      public_id: storagePath,
      image:     imageRow,
    })
  } catch (err: any) {
    console.error('Upload route error:', err.message, err.stack)
    return NextResponse.json({ error: 'Server error: ' + err.message }, { status: 500 })
  }
}
