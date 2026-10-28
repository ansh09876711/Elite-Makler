import { createClient } from '@supabase/supabase-js'

/**
 * Admin Supabase client — service_role key se RLS bypass hota hai.
 * Sirf server-side API routes mein use karo, kabhi bhi client-side nahi.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables')
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
