import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { isAdminEmail } from '@/lib/admin'

export async function GET() {
  // Verify session & admin
  const serverSupabase = await createServerClient()
  const { data: { user } } = await serverSupabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Use service role client to list all auth users
  const admin = createAdminClient()
  try {
    // Supabase Admin: list users
    const res = await admin.auth.admin.listUsers()
    const users = res.data?.users ?? []
    return NextResponse.json({ users })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch users' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  // Verify admin session
  const serverSupabase = await createServerClient()
  const { data: { user } } = await serverSupabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { userId, action } = body as { userId: string; action: 'verify' | 'block' | 'unblock' }

  if (!userId || !action) {
    return NextResponse.json({ error: 'Missing userId or action' }, { status: 400 })
  }

  const admin = createAdminClient()
  try {
    if (action === 'block') {
      // Ban the user via Supabase Admin
      await admin.auth.admin.updateUserById(userId, {
        ban_duration: '876600h', // ~100 years = effectively permanent
        user_metadata: { status: 'blocked' }
      })
    } else if (action === 'unblock') {
      await admin.auth.admin.updateUserById(userId, {
        ban_duration: 'none',
        user_metadata: { status: 'active' }
      })
    } else if (action === 'verify') {
      await admin.auth.admin.updateUserById(userId, {
        email_confirm: true,
        user_metadata: { status: 'verified' }
      })
    }
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update user' }, { status: 500 })
  }
}
