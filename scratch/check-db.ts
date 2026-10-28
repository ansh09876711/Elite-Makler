import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

const supabase = createClient(url, serviceKey)

async function test() {
  const res = await supabase.from('properties').select('id, title, slug')
  console.log('Properties:', res.data)
}

void test()
