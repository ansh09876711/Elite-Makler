import { createClient } from '@/lib/supabase/server'
import type { Property, Enquiry } from '@/types'

/** Sabhi featured properties fetch karo */
export async function getFeaturedProperties(): Promise<Property[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('properties')
    .select('*, images:property_images(*)')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) { console.error('getFeaturedProperties:', error); return [] }
  return (data ?? []) as Property[]
}

/** Ek property slug se fetch karo */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('properties')
    .select('*, images:property_images(*)')
    .eq('slug', slug)
    .single()

  if (error) { console.error('getPropertyBySlug:', error); return null }
  return data as Property
}

/** Locality se properties filter karo */
export async function getPropertiesByLocality(locality: string): Promise<Property[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('properties')
    .select('*, images:property_images(*)')
    .eq('locality', locality)
    .order('created_at', { ascending: false })

  if (error) { console.error('getPropertiesByLocality:', error); return [] }
  return (data ?? []) as Property[]
}

/** New launches fetch karo */
export async function getNewLaunches(): Promise<Property[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('properties')
    .select('*, images:property_images(*)')
    .in('status', ['new_listing', 'coming_soon', 'preview'])
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) { console.error('getNewLaunches:', error); return [] }
  return (data ?? []) as Property[]
}

/** Search — title, locality, type se */
export async function searchProperties(query: string): Promise<Property[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('properties')
    .select('*, images:property_images(*)')
    .or(`title.ilike.%${query}%,address.ilike.%${query}%,type.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(12)

  if (error) { console.error('searchProperties:', error); return [] }
  return (data ?? []) as Property[]
}

/** Enquiry submit karo */
export async function submitEnquiry(
  enquiry: Omit<Enquiry, 'id' | 'created_at'>
): Promise<boolean> {
  const supabase = await createClient()
  const { error } = await supabase.from('enquiries').insert(enquiry)
  if (error) { console.error('submitEnquiry:', error); return false }
  return true
}
