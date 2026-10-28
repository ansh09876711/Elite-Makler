import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(url, serviceKey)

async function test() {
  const { data: properties, error: e1 } = await supabase.from('properties').select('id, title, slug')
  console.log('Properties:', properties)

  const { data: images, error: e2 } = await supabase.from('property_images').select('*')
  console.log('Images:', images)
}

test()
