'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Home, Tag } from 'lucide-react'
import { useLang } from '@/context/LangContext'
import { t } from '@/lib/translations'

export default function HeroSection() {
  const router = useRouter()
  const { lang } = useLang()
  const tr = t[lang]

  const [location, setLocation] = useState('')
  const [type,     setType]     = useState('')
  const [price,    setPrice]    = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (location) params.set('locality', location)
    if (type)     params.set('type', type)
    if (price)    params.set('price', price)
    router.push(`/properties?${params.toString()}`)
  }

  return (
    <section
      className="relative w-full min-h-screen flex flex-col text-white hero-section"
      style={{
        backgroundImage: `
          linear-gradient(to bottom,
            rgba(13,18,25,0.45) 0%,
            rgba(13,18,25,0.55) 40%,
            rgba(13,18,25,0.92) 100%
          ),
          url('/images/hero-bg.jpg'),
          linear-gradient(160deg, #0d1219 0%, #1a2535 50%, #0d1219 100%)
        `,
        backgroundSize: 'cover, cover, cover',
        backgroundPosition: 'center top, center top, center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Subtle decorative overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
           style={{ backgroundImage: 'radial-gradient(#C5A880 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[30%] left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C5A880]/8 to-transparent" />
        <div className="absolute bottom-[28%] left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C5A880]/8 to-transparent" />
        <div className="absolute top-0 left-[8%] h-full w-px bg-gradient-to-b from-transparent via-[#C5A880]/6 to-transparent" />
        <div className="absolute top-0 right-[8%] h-full w-px bg-gradient-to-b from-transparent via-[#C5A880]/6 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center flex-1 text-center px-6 pt-32 pb-10">

        <div className="flex items-center gap-3 mb-8">
          <span className="h-px w-10 bg-[#C5A880]/50" />
          <span className="text-[0.7rem] font-bold tracking-[4px] uppercase text-[#C5A880]">
            {tr.heroSub}
          </span>
          <span className="h-px w-10 bg-[#C5A880]/50" />
        </div>

        <h1 className="font-playfair font-semibold leading-tight mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          {tr.heroTitle1}<br />
          {lang === 'en'
            ? <><span>Finds </span><em className="text-[#C5A880] font-normal">{tr.heroTitle2}</em></>
            : <em className="text-[#C5A880] font-normal">{tr.heroTitle2}</em>
          }
        </h1>

        <p className="text-white/65 font-light leading-relaxed max-w-xl mx-auto mb-10 text-base md:text-lg">
          {tr.heroDesc}
        </p>

        <div className="flex justify-center gap-4 flex-wrap mb-16">
          <Link href="/properties"
            className="px-8 py-3.5 bg-[#C5A880] text-[#11161E] font-semibold text-sm
                       rounded-full hover:bg-[#A4855C] transition-all hover:-translate-y-0.5
                       shadow-[0_8px_24px_rgba(197,168,128,0.3)]">
            {tr.explorePortfolio}
          </Link>
          <Link href="/about"
            className="px-8 py-3.5 border border-white/25 text-white font-medium text-sm
                       rounded-full hover:bg-white/8 hover:border-white/50 transition-all hover:-translate-y-0.5">
            {tr.ourLegacy}
          </Link>
        </div>

        {/* Search bar */}
        <div className="w-full max-w-3xl bg-white/95 backdrop-blur-md rounded-2xl px-6 py-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 text-left">
              <label className="flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-widest text-[#1E242B] mb-1.5">
                <MapPin className="w-3 h-3 text-[#A4855C]" />
                {lang === 'en' ? 'Location' : 'स्थान'}
              </label>
              <select value={location} onChange={e => setLocation(e.target.value)}
                className="w-full bg-[#F4F2EF] border border-[#D5CECE] px-3 py-2.5 rounded-lg text-sm text-[#1E242B] focus:outline-none focus:border-[#C5A880] transition-colors">
                <option value="">{lang === 'en' ? 'Any Location' : 'कोई भी स्थान'}</option>
                <option value="vijay_nagar">Vijay Nagar & Nipania</option>
                <option value="bypass_road">Bypass Road</option>
                <option value="palasia_saket">Palasia & Saket</option>
              </select>
            </div>
            <div className="flex-1 text-left">
              <label className="flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-widest text-[#1E242B] mb-1.5">
                <Home className="w-3 h-3 text-[#A4855C]" />
                {lang === 'en' ? 'Type' : 'प्रकार'}
              </label>
              <select value={type} onChange={e => setType(e.target.value)}
                className="w-full bg-[#F4F2EF] border border-[#D5CECE] px-3 py-2.5 rounded-lg text-sm text-[#1E242B] focus:outline-none focus:border-[#C5A880] transition-colors">
                <option value="">{lang === 'en' ? 'All Types' : 'सभी प्रकार'}</option>
                <option value="villa">{lang === 'en' ? 'Villa' : 'विला'}</option>
                <option value="penthouse">{lang === 'en' ? 'Penthouse' : 'पेंटहाउस'}</option>
                <option value="mansion">{lang === 'en' ? 'Mansion' : 'मैन्शन'}</option>
                <option value="plot">{lang === 'en' ? 'Plot / Land' : 'प्लॉट / जमीन'}</option>
              </select>
            </div>
            <div className="flex-1 text-left">
              <label className="flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-widest text-[#1E242B] mb-1.5">
                <Tag className="w-3 h-3 text-[#A4855C]" />
                {lang === 'en' ? 'Budget' : 'बजट'}
              </label>
              <select value={price} onChange={e => setPrice(e.target.value)}
                className="w-full bg-[#F4F2EF] border border-[#D5CECE] px-3 py-2.5 rounded-lg text-sm text-[#1E242B] focus:outline-none focus:border-[#C5A880] transition-colors">
                <option value="">{lang === 'en' ? 'Any Price' : 'कोई भी कीमत'}</option>
                <option value="3-6">₹3 Cr – ₹6 Cr</option>
                <option value="6-10">₹6 Cr – ₹10 Cr</option>
                <option value="10+">₹10 Cr+</option>
              </select>
            </div>
            <button type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-[#11161E] text-[#C5A880]
                         font-semibold text-sm rounded-lg hover:bg-[#C5A880] hover:text-[#11161E]
                         transition-all whitespace-nowrap flex-shrink-0">
              <Search className="w-4 h-4" />
              {lang === 'en' ? 'Search' : 'खोजें'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
