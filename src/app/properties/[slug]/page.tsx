import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import EnquiryForm from '@/components/EnquiryForm'
import PropertyGallery from '@/components/properties/PropertyGallery'
import { getPropertyBySlug } from '@/lib/queries'
import { MapPin, Bed, Bath, Maximize2, Calendar, CheckCircle2, ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

// Force dynamic — property pages fetched at request time
export const dynamic    = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const property = await getPropertyBySlug(slug)
  if (!property) return { title: 'Property Not Found | LuxeHaven' }
  return {
    title: `${property.title} | LuxeHaven`,
    description: property.description.slice(0, 160),
  }
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const property = await getPropertyBySlug(slug)
  if (!property) notFound()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Image & Video Gallery */}
        <div className="max-w-6xl mx-auto px-6 pt-6">
          <PropertyGallery images={property.images ?? []} title={property.title} />
        </div>

        {/* Detail Grid */}
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left — main info */}
            <div className="lg:col-span-2">
              <Link
                href="/properties"
                className="inline-flex items-center gap-1.5 text-sm text-[#68717A]
                           hover:text-[#C5A880] mb-6 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Properties
              </Link>

              <p className="text-[0.7rem] font-bold uppercase tracking-widest text-[#A4855C] mb-2">
                {property.type}
              </p>
              <h1 className="font-playfair text-4xl font-bold text-[#11161E] leading-tight mb-3">
                {property.title}
              </h1>
              <p className="flex items-center gap-1.5 text-[#68717A] mb-6">
                <MapPin className="w-4 h-4 text-[#C5A880]" /> {property.address}
              </p>

              {/* Price + specs strip */}
              <div className="flex flex-wrap items-center gap-6 p-5 bg-white rounded-xl
                              shadow-[0_4px_20px_rgba(17,22,30,0.06)] mb-8">
                <div>
                  <p className="text-xs text-[#68717A] uppercase tracking-widest">Price</p>
                  <p className="font-playfair text-2xl font-bold text-[#11161E]">
                    {property.price_label}
                  </p>
                </div>
                <div className="w-px h-10 bg-[#EAE6E1]" />
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Bed className="w-4 h-4 text-[#A4855C]" /> {property.bedrooms} Bedrooms
                </span>
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Bath className="w-4 h-4 text-[#A4855C]" /> {property.bathrooms} Baths
                </span>
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Maximize2 className="w-4 h-4 text-[#A4855C]" /> {property.area_sqft.toLocaleString()} sqft
                </span>
                {property.ready_date && (
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="w-4 h-4 text-[#A4855C]" /> Ready {property.ready_date}
                  </span>
                )}
              </div>

              {/* Description */}
              <h2 className="font-playfair text-2xl font-semibold text-[#11161E] mb-4">
                About This Property
              </h2>
              <p className="text-[#68717A] leading-relaxed mb-8">{property.description}</p>

              {/* Amenities */}
              {property.amenities?.length > 0 && (
                <>
                  <h2 className="font-playfair text-2xl font-semibold text-[#11161E] mb-5">
                    Amenities & Features
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map(a => (
                      <div key={a} className="flex items-center gap-2.5 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#A4855C] flex-shrink-0" />
                        {a}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Right — Sticky Enquiry Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-[#11161E] rounded-xl p-7">
                <p className="text-xs text-[#C5A880] font-bold uppercase tracking-widest mb-1">
                  REQUEST INFORMATION
                </p>
                <h3 className="font-playfair text-xl font-semibold text-white mb-2">
                  Enquire About This Property
                </h3>
                <p className="text-white/50 text-sm mb-6">
                  Our agent will contact you within 2 hours.
                </p>
                <EnquiryForm propertyId={property.id} dark />
                <div className="mt-5 pt-5 border-t border-white/10 text-center">
                  <p className="text-white/40 text-xs mb-3">Or reach us directly</p>
                  <a
                    href="tel:+917315550000"
                    className="block text-[#C5A880] font-semibold text-sm"
                  >
                    +91 731 555-LUXE
                  </a>
                  <p className="text-white/30 text-xs mt-1">
                    Agent: {property.agent_name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
