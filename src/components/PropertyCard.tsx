import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Bed, Bath, Maximize2, Heart } from 'lucide-react'
import type { Property } from '@/types'

const statusLabel: Record<string, { text: string; cls: string }> = {
  for_sale:    { text: 'For Sale',    cls: 'bg-[#11161E] text-[#C5A880]' },
  new_listing: { text: 'New Listing', cls: 'bg-[#11161E] text-[#C5A880]' },
  coming_soon: { text: 'Coming Soon', cls: 'bg-[#0e3b24] text-[#4ade80]' },
  preview:     { text: 'Preview',     cls: 'bg-[#3b2e00] text-[#C5A880]' },
  sold:        { text: 'Sold',        cls: 'bg-red-900 text-red-300' },
}

const typeLabel: Record<string, string> = {
  villa:      'Bespoke Villa',
  penthouse:  'Sky Penthouse',
  mansion:    'Modern Mansion',
  plot:       'Plot / Land',
  commercial: 'Commercial',
}

interface Props {
  property: Property
  compact?: boolean
}

export default function PropertyCard({ property, compact = false }: Props) {
  const primaryImg = property.images?.find(i => i.is_primary) ?? property.images?.[0]
  const badge      = statusLabel[property.status] ?? statusLabel.for_sale

  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-[0_15px_35px_rgba(17,22,30,0.06)]
                    hover:shadow-[0_30px_60px_rgba(17,22,30,0.12)] hover:-translate-y-2
                    transition-all duration-500">
      {/* Image */}
      <div className={`relative overflow-hidden ${compact ? 'h-48' : 'h-64'}`}>
        {primaryImg ? (
          <Image
            src={primaryImg.url}
            alt={primaryImg.alt || property.title}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1a2130] to-[#2d3a4a] flex items-center justify-center">
            <span className="text-[#C5A880]/40 text-sm">No Image</span>
          </div>
        )}

        {/* Badges */}
        <span className={`absolute top-4 left-4 text-[0.65rem] font-bold uppercase
                         tracking-widest px-3 py-1.5 rounded-sm ${badge.cls}`}>
          {badge.text}
        </span>
        <span className="absolute bottom-4 right-4 bg-[#11161E]/85 backdrop-blur-sm
                         text-white font-playfair font-bold text-base px-4 py-2
                         rounded border-l-2 border-[#C5A880]">
          {property.price_label}
        </span>

        {/* Save button */}
        <button
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/85 flex
                     items-center justify-center text-[#68717A] hover:text-red-500
                     transition-colors"
          aria-label="Save property"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="p-6">
        <p className="text-[0.7rem] font-bold uppercase tracking-widest text-[#A4855C] mb-1">
          {typeLabel[property.type] ?? property.type}
        </p>
        <h3 className="font-playfair font-semibold text-[#11161E] text-xl leading-snug mb-2">
          {property.title}
        </h3>
        <p className="flex items-center gap-1.5 text-[#68717A] text-sm mb-5">
          <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
          {property.address}
        </p>

        {/* Specs */}
        <div className="flex justify-between pt-4 border-t border-[#EAE6E1] mb-5">
          <span className="flex items-center gap-1.5 text-sm font-medium text-[#1E242B]">
            <Bed className="w-3.5 h-3.5 text-[#A4855C]" /> {property.bedrooms} BHK
          </span>
          <span className="flex items-center gap-1.5 text-sm font-medium text-[#1E242B]">
            <Bath className="w-3.5 h-3.5 text-[#A4855C]" /> {property.bathrooms} Baths
          </span>
          <span className="flex items-center gap-1.5 text-sm font-medium text-[#1E242B]">
            <Maximize2 className="w-3.5 h-3.5 text-[#A4855C]" /> {property.area_sqft.toLocaleString()} sqft
          </span>
        </div>

        {/* Interest bar (launches) */}
        {property.interest_pct != null && (
          <div className="mb-4">
            <div className="h-1 bg-[#EAE6E1] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#A4855C] to-[#C5A880] rounded-full"
                style={{ width: `${property.interest_pct}%` }}
              />
            </div>
            <p className="text-[0.68rem] text-[#68717A] mt-1">{property.interest_pct}% interest registered</p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-[0.75rem] text-[#68717A]">Agent: {property.agent_name}</span>
          <Link
            href={`/properties/${property.slug}`}
            className="flex items-center gap-1.5 text-sm font-semibold text-[#A4855C]
                       hover:text-[#11161E] transition-colors group/link"
          >
            View Details
            <span className="group-hover/link:translate-x-1 transition-transform inline-block">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
