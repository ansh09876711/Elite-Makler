'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, MapPin, Bed, Maximize2 } from 'lucide-react'
import Link from 'next/link'
import type { Property } from '@/types'

const localityLabel: Record<string, string> = {
  vijay_nagar:   'Vijay Nagar, Indore',
  bypass_road:   'Bypass Road, Indore',
  palasia_saket: 'Palasia, Indore',
  nipania:       'Nipania, Indore',
  off_market:    'Off-Market',
}

const statusColor: Record<string, string> = {
  for_sale:    'bg-[#C5A880] text-[#11161E]',
  new_listing: 'bg-emerald-500 text-white',
  coming_soon: 'bg-blue-500 text-white',
  preview:     'bg-amber-500 text-[#11161E]',
  sold:        'bg-red-500 text-white',
}

const statusLabel: Record<string, string> = {
  for_sale:    'For Sale',
  new_listing: 'New Launch',
  coming_soon: 'Coming Soon',
  preview:     'Preview',
  sold:        'Sold',
}

/* ── Single card — full image with bottom overlay ── */
function PropCard({
  property,
  className = '',
}: {
  property: Property
  className?: string
}) {
  const img = property.images?.find(i => i.is_primary) ?? property.images?.[0]

  return (
    <Link
      href={`/properties/${property.slug}`}
      className={`group relative rounded-2xl overflow-hidden block cursor-pointer ${className}`}
      style={{ background: 'linear-gradient(135deg,#1a2535,#0f1923)' }}
    >
      {/* Full-bleed image */}
      {img && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img.url}
          alt={property.title}
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover
                     group-hover:scale-105 transition-transform duration-700"
        />
      )}

      {/* Gradient — strong at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

      {/* Status pill — top-left */}
      <span className={`absolute top-4 left-4 text-[0.62rem] font-bold uppercase
                       tracking-wider px-2.5 py-1 rounded-full z-10
                       ${statusColor[property.status] ?? 'bg-[#C5A880] text-[#11161E]'}`}>
        {statusLabel[property.status] ?? 'For Sale'}
      </span>

      {/* Price — top-right */}
      <span className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white
                       font-playfair font-bold text-sm px-3 py-1 rounded-full z-10
                       border border-white/20">
        {property.price_label}
      </span>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
        {/* Locality */}
        <p className="flex items-center gap-1.5 text-[#C5A880] text-[0.65rem]
                      font-semibold uppercase tracking-wider mb-1">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          {localityLabel[property.locality] ?? property.locality}
        </p>

        {/* Title */}
        <h3 className="font-playfair font-semibold text-white leading-snug mb-3
                       group-hover:text-[#C5A880] transition-colors line-clamp-2">
          {property.title}
        </h3>

        {/* Mini specs strip */}
        <div className="flex items-center gap-3 text-white/60 text-xs">
          <span className="flex items-center gap-1">
            <Bed className="w-3 h-3" /> {property.bedrooms} BHK
          </span>
          <span className="w-px h-3 bg-white/20" />
          <span className="flex items-center gap-1">
            <Maximize2 className="w-3 h-3" /> {property.area_sqft.toLocaleString()} sqft
          </span>
        </div>
      </div>
    </Link>
  )
}

/* ── Bento grid for a single "frame" of 3 properties ── */
function BentoFrame({ items }: { items: Property[] }) {
  const [left, right1, right2] = [items[0], items[1], items[2]]

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full">
      {/* Left — tall featured card */}
      {left && (
        <div className="md:col-span-3">
          <PropCard property={left} className="h-[420px] md:h-[480px] w-full" />
        </div>
      )}

      {/* Right — 2 stacked cards */}
      <div className="md:col-span-2 flex flex-col gap-4">
        {right1 && (
          <PropCard property={right1} className="h-[200px] md:h-[228px] w-full" />
        )}
        {right2 && (
          <PropCard property={right2} className="h-[200px] md:h-[228px] w-full" />
        )}
      </div>
    </div>
  )
}

/* ── Main Carousel ── */
interface Props {
  properties: Property[]
  autoPlay?: boolean
  intervalMs?: number
}

export default function PropertyCarousel({
  properties,
  autoPlay = true,
  intervalMs = 5000,
}: Props) {
  // Split properties into frames of 3
  const frames: Property[][] = []
  for (let i = 0; i < properties.length; i += 3) {
    frames.push(properties.slice(i, i + 3))
  }
  // Last frame might have < 3 — pad with first items
  if (frames.length > 0 && frames[frames.length - 1].length < 3) {
    const last = frames[frames.length - 1]
    while (last.length < 3) last.push(properties[last.length % properties.length])
  }

  const trackRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const total = frames.length

  const goTo = useCallback((idx: number) => {
    const c = ((idx % total) + total) % total
    setCurrent(c)
    const el = trackRef.current
    if (!el) return
    el.scrollTo({ left: c * el.offsetWidth, behavior: 'smooth' })
  }, [total])

  // Auto-play
  useEffect(() => {
    if (!autoPlay || total <= 1) return
    const id = setInterval(() => goTo(current + 1), intervalMs)
    return () => clearInterval(id)
  }, [autoPlay, current, intervalMs, goTo, total])

  return (
    <div className="relative group/car select-none">

      {/* Track */}
      <div
        ref={trackRef}
        className="flex overflow-hidden w-full"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {frames.map((frame, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-full px-1"
            style={{ scrollSnapAlign: 'start' }}
          >
            <BentoFrame items={frame} />
          </div>
        ))}
      </div>

      {/* Prev / Next */}
      {total > 1 && (
        <>
          <button
            onClick={() => goTo(current - 1)}
            aria-label="Previous"
            className="absolute -left-5 top-1/2 -translate-y-1/2 z-20
                       w-10 h-10 rounded-full bg-white shadow-lg border border-[#EAE6E1]
                       flex items-center justify-center
                       hover:bg-[#C5A880] hover:text-white hover:border-[#C5A880]
                       opacity-0 group-hover/car:opacity-100 transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => goTo(current + 1)}
            aria-label="Next"
            className="absolute -right-5 top-1/2 -translate-y-1/2 z-20
                       w-10 h-10 rounded-full bg-white shadow-lg border border-[#EAE6E1]
                       flex items-center justify-center
                       hover:bg-[#C5A880] hover:text-white hover:border-[#C5A880]
                       opacity-0 group-hover/car:opacity-100 transition-all duration-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Dots */}
      {total > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {frames.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Frame ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 h-1.5 bg-[#C5A880]'
                  : 'w-1.5 h-1.5 bg-[#D5CECE] hover:bg-[#A4855C]'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
