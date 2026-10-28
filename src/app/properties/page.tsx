import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PropertyCard from '@/components/PropertyCard'
import WhatsAppButton from '@/components/WhatsAppButton'
import { createClient } from '@/lib/supabase/server'
import type { Property } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Properties | ELITE MAKLER Indore',
  description: 'Browse our complete portfolio of luxury villas, penthouses, and mansions in Indore.',
}

export const revalidate = 300

interface SearchParams {
  locality?: string
  type?: string
  price?: string
  status?: string
  q?: string
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('properties')
    .select('*, images:property_images(*)')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })

  if (sp.locality) query = query.eq('locality', sp.locality)
  if (sp.type)     query = query.eq('type', sp.type)
  if (sp.status)   query = query.eq('status', sp.status)
  if (sp.q)        query = query.ilike('title', `%${sp.q}%`)
  if (sp.price === '3-6')   query = query.gte('price', 3).lte('price', 6)
  if (sp.price === '6-10')  query = query.gte('price', 6).lte('price', 10)
  if (sp.price === '10+')   query = query.gte('price', 10)

  const { data } = await query
  const properties = (data ?? []) as Property[]

  const localityMap: Record<string, string> = {
    vijay_nagar:   'Vijay Nagar & Nipania',
    bypass_road:   'Bypass Road Estates',
    palasia_saket: 'Palasia & Saket',
    nipania:       'Nipania',
    off_market:    'Off-Market Listings',
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Page Hero */}
      <div className="h-52 bg-[#11161E] flex items-end pb-12 pt-20">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <p className="text-[0.72rem] font-bold tracking-[3px] uppercase text-[#C5A880] mb-2">
            CURATED PORTFOLIO
          </p>
          <h1 className="font-playfair text-4xl font-bold text-white">
            {sp.locality ? localityMap[sp.locality] ?? 'Properties' : 'All Properties'}
          </h1>
        </div>
      </div>

      {/* Filter bar + Results */}
      <main className="flex-1 py-14 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto px-6">
          {/* Quick filter chips */}
          <div className="flex flex-wrap gap-3 mb-10">
            {[
              { label: 'All',         href: '/properties' },
              { label: 'Vijay Nagar', href: '/properties?locality=vijay_nagar' },
              { label: 'Bypass Road', href: '/properties?locality=bypass_road' },
              { label: 'Palasia',     href: '/properties?locality=palasia_saket' },
              { label: 'Villas',      href: '/properties?type=villa' },
              { label: 'Penthouses',  href: '/properties?type=penthouse' },
              { label: 'New Launches',href: '/properties?status=new_listing' },
            ].map(chip => (
              <a
                key={chip.href}
                href={chip.href}
                className="px-5 py-2 rounded-full text-sm font-medium border border-[#EAE6E1]
                           bg-white hover:border-[#C5A880] hover:text-[#A4855C] transition-all"
              >
                {chip.label}
              </a>
            ))}
          </div>

          <p className="text-sm text-[#68717A] mb-8">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
          </p>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map(prop => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-[#68717A]">
              <p className="text-xl font-playfair mb-3">No properties found</p>
              <p className="text-sm">Try different filters or{' '}
                <a href="/properties" className="text-[#C5A880] hover:underline">view all</a>
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}

