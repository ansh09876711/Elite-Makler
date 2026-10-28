import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { isAdminEmail } from '@/lib/admin'

/**
 * Auth check — verify karo ki logged-in user admin hai.
 * Returns user if admin, null otherwise.
 */
async function authCheck() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) return null
  return user
}

// GET all properties (admin)
export async function GET() {
  const user = await authCheck()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Admin client for RLS bypass on read (includes all statuses)
  const adminDb = createAdminClient()
  const { data, error } = await adminDb
    .from('properties')
    .select('*, images:property_images(*)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ properties: data ?? [] })
}

// POST — create new property
export async function POST(req: NextRequest) {
  const user = await authCheck()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  // Service role client — RLS bypass for insert
  const adminDb = createAdminClient()
  const { data, error } = await adminDb
    .from('properties')
    .insert(body)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ property: data }, { status: 201 })
}

// PATCH — update property
export async function PATCH(req: NextRequest) {
  const user = await authCheck()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, ...updates } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const adminDb = createAdminClient()
  const { data, error } = await adminDb
    .from('properties')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ property: data })
}

// DELETE — delete property
export async function DELETE(req: NextRequest) {
  const user = await authCheck()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const adminDb = createAdminClient()
  const { error } = await adminDb
    .from('properties')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
