import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { isAdminEmail } from '@/lib/admin'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code  = searchParams.get('code')
  const next  = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data } = await supabase.auth.exchangeCodeForSession(code)

    // Admin email → redirect to admin dashboard
    if (data?.user && isAdminEmail(data.user.email)) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.redirect(new URL(next, request.url))
}
