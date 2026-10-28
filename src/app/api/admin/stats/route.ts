import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { isAdminEmail } from '@/lib/admin'

export async function GET(req: NextRequest) {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const type = req.nextUrl.searchParams.get('type')

  if (type === 'properties') {
    const { count } = await supabase.from('properties').select('*', { count: 'exact', head: true })
    return NextResponse.json({ count: count ?? 0 })
  }

  if (type === 'agents') {
    const { count } = await supabase.from('agents').select('*', { count: 'exact', head: true })
    return NextResponse.json({ count: count ?? 0 })
  }

  if (type === 'enquiries') {
    const { count } = await supabase.from('enquiries').select('*', { count: 'exact', head: true })
    const { data: recent } = await supabase
      .from('enquiries')
      .select('id, name, phone, intent, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
    return NextResponse.json({ count: count ?? 0, recent: recent ?? [] })
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}
