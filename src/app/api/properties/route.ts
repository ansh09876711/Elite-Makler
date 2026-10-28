import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const locality = searchParams.get('locality')
  const type     = searchParams.get('type')
  const featured = searchParams.get('featured')
  const q        = searchParams.get('q')
  const limit    = Number(searchParams.get('limit') ?? 12)

  const supabase = await createClient()
  let query = supabase
    .from('properties')
    .select('*, images:property_images(*)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (locality)         query = query.eq('locality', locality)
  if (type)             query = query.eq('type', type)
  if (featured === '1') query = query.eq('featured', true)
  if (q)                query = query.ilike('title', `%${q}%`)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ properties: data ?? [] })
}
