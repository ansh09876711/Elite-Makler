'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import HeroSection from '@/components/home/HeroSection'
import StatsSection from '@/components/home/StatsSection'
import EmiCalculator from '@/components/EmiCalculator'
import PropertyCarousel from '@/components/PropertyCarousel'
import Link from 'next/link'
import { ArrowRight, Lock, TrendingUp } from 'lucide-react'
import { useLang } from '@/context/LangContext'
import { t } from '@/lib/translations'
import { useEffect, useState } from 'react'
import type { Property } from '@/types'
import PropertyCategories from '@/components/home/PropertyCategories'
import ServicesSection from '@/components/home/ServicesSection'
import NewsSection from '@/components/home/NewsSection'

export default function HomePage() {
  const { lang } = useLang()
  const tr = t[lang]

  const [featured, setFeatured] = useState<Property[]>([])
  const [launches, setLaunches] = useState<Property[]>([])

  useEffect(() => {
    fetch('/api/properties?featured=1&limit=6')
      .then(r => r.json())
      .then(d => setFeatured(d.properties ?? []))

    fetch('/api/properties?limit=6')
      .then(r => r.json())
      .then(d => setLaunches((d.properties ?? []).filter((p: Property) =>
        ['new_listing','coming_soon','preview'].includes(p.status)
      )))
  }, [])


  const testimonials = [
    {
      en: '"ELITE MAKLER provided a level of discretion and service that exceeded all expectations. They secured our Saket bungalow off-market within a week of our first consultation."',
      hi: '"ELITE MAKLER ने जो विवेक और सेवा दी वो हमारी सभी उम्मीदों से बढ़कर थी। उन्होंने हमारा साकेत बंगला पहली बैठक के एक हफ्ते के भीतर ऑफ-मार्केट सुरक्षित कर दिया।"',
      name: 'Rajesh & Kavita Singhal',
      title: lang === 'en' ? 'Sellers & Industrialists' : 'विक्रेता और उद्योगपति',
      initials: 'RS',
    },
    {
      en: '"Finding an ultra-modern sky penthouse in Vijay Nagar with our exact layout seemed impossible. ELITE MAKLER found the perfect match with masterful closing execution."',
      hi: '"विजय नगर में हमारे सटीक लेआउट वाला अल्ट्रा-मॉडर्न पेंटहाउस असंभव लग रहा था। ELITE MAKLER ने परफेक्ट मैच ढूंढा।"',
      name: 'Amitesh Shrivastava',
      title: lang === 'en' ? 'Tech Entrepreneur' : 'टेक उद्यमी',
      initials: 'AS',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <PropertyCategories />

      {/* Featured Properties */}
      <section className="py-20 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="block text-[0.7rem] font-bold tracking-[3px] uppercase text-[#A4855C] mb-3">
                {tr.curatedPortfolio}
              </span>
              <h2 className="font-playfair text-4xl md:text-5xl font-semibold text-[#11161E]">
                {tr.featuredEstates}
              </h2>
              <div className="w-14 h-0.5 bg-[#C5A880] mt-4" />
            </div>
            <Link href="/properties"
              className="hidden md:flex items-center gap-2 text-sm font-semibold text-[#A4855C] hover:text-[#11161E] transition-colors group">
              {tr.viewAll} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 relative">
          <PropertyCarousel properties={featured} autoPlay intervalMs={4500} />
        </div>
      </section>

      <ServicesSection />



      {/* New Launches */}
      {launches.length > 0 && (
        <section className="py-20 bg-[#FAF9F6]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="block text-[0.7rem] font-bold tracking-[3px] uppercase text-[#A4855C] mb-3">
                  {tr.justArrived}
                </span>
                <h2 className="font-playfair text-4xl md:text-5xl font-semibold text-[#11161E]">
                  {tr.newLaunches}
                </h2>
                <div className="w-14 h-0.5 bg-[#C5A880] mt-4" />
              </div>
              <Link href="/properties?status=new_listing"
                className="hidden md:flex items-center gap-2 text-sm font-semibold text-[#A4855C] hover:text-[#11161E] transition-colors group">
                {tr.viewAll} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-6 relative">
            <PropertyCarousel properties={launches} autoPlay intervalMs={3800} />
          </div>
        </section>
      )}

      {/* EMI Calculator */}
      <EmiCalculator />

      {/* About */}
      <section className="py-16 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="block text-[0.7rem] font-bold tracking-[3px] uppercase text-[#A4855C] mb-3">
                {tr.theEliteMaklerWay}
              </span>
              <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-[#11161E] leading-tight mb-4">
                {tr.pioneeringLuxury}
                <span className="text-[#A4855C]"> {tr.forOverTwoDecades}</span>
              </h2>
              <p className="text-[#68717A] leading-relaxed mb-6 text-sm">
                {lang === 'en'
                  ? "At ELITE MAKLER, we believe a home is not just coordinates — it is an architectural legacy matched to your personal ambition. We curate only the most exceptional properties across Indore."
                  : "ELITE MAKLER में, हम मानते हैं कि एक घर सिर्फ पता नहीं है — यह आपकी व्यक्तिगत महत्वाकांक्षा से मेल खाती एक वास्तुकला की विरासत है।"}
              </p>
              <ul className="space-y-3 mb-7">
                {(lang === 'en'
                  ? ['Private access to unlisted off-market pocket listings','Specialized HNI client representation','Award-winning 3D architectural staging & marketing']
                  : ['अनलिस्टेड ऑफ-मार्केट लिस्टिंग तक प्राइवेट एक्सेस','विशेष HNI क्लाइंट प्रतिनिधित्व','पुरस्कार विजेता 3D आर्किटेक्चरल स्टेजिंग']
                ).map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-[#1E242B] font-medium">
                    <span className="w-4 h-4 rounded-full bg-[#C5A880]/15 text-[#A4855C] flex items-center justify-center text-[0.6rem] flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#11161E] text-[#C5A880]
                           font-semibold text-sm rounded-full hover:bg-[#C5A880] hover:text-[#11161E]
                           transition-all duration-300 group">
                {tr.discoverLegacy}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="relative flex justify-center">
              {/* Main property image */}
              <div className="relative w-72 h-80 rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(17,22,30,0.28)]">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=85"
                  alt="Luxury Villa Indore"
                  className="w-full h-full object-cover"
                />
                {/* subtle dark-to-transparent overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1219]/60 via-transparent to-transparent" />
              </div>

              {/* Second decorative image – smaller, offset */}
              <div className="absolute -right-8 top-8 w-36 h-44 rounded-xl overflow-hidden shadow-[0_16px_40px_rgba(17,22,30,0.22)] border-2 border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&q=80"
                  alt="Luxury Interior"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating badges */}
              <div className="absolute -bottom-3 -left-3 bg-[#C5A880] text-[#11161E] px-5 py-4 rounded-xl shadow-lg z-10">
                <span className="font-playfair text-3xl font-bold block leading-none">18+</span>
                <span className="text-[0.6rem] font-bold uppercase tracking-widest mt-0.5 block opacity-70">
                  {lang === 'en' ? 'Years of Trust' : 'वर्षों का विश्वास'}
                </span>
              </div>
              <div className="absolute -top-3 left-4 bg-[#11161E] text-white px-4 py-3 rounded-xl shadow-lg border border-white/10 z-10">
                <span className="font-playfair text-lg font-bold text-[#C5A880] block leading-none">₹1,000 Cr+</span>
                <span className="text-[0.6rem] uppercase tracking-widest text-white/50 mt-0.5 block">
                  {lang === 'en' ? 'Transactions' : 'ट्रांज़ैक्शन'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#11161E] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
             style={{ backgroundImage: 'radial-gradient(#C5A880 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <span className="block text-[0.7rem] font-bold tracking-[3px] uppercase text-[#C5A880] mb-4">
            {tr.clientVerdicts}
          </span>
          <h2 className="font-playfair text-4xl font-semibold text-white mb-16">
            {tr.whatClientsSay}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map(t => (
              <div key={t.name}
                className="bg-white/5 border border-white/8 rounded-2xl p-8 text-left hover:border-[#C5A880]/30 transition-colors">
                <p className="text-[#C5A880] text-3xl font-playfair leading-none mb-4 opacity-50">"</p>
                <p className="font-playfair text-white/80 text-base leading-relaxed italic mb-6">
                  {lang === 'en' ? t.en : t.hi}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C5A880]/20 flex items-center justify-center text-[#C5A880] font-bold text-sm flex-shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-white/40 text-xs uppercase tracking-wider">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NewsSection />

      {/* CTA Strip */}
      <section className="py-20 bg-[#C5A880] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
             style={{ backgroundImage: 'radial-gradient(#11161E 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-playfair text-4xl md:text-5xl font-semibold text-[#11161E] leading-tight mb-5">
            {tr.beginJourney}
          </h2>
          <p className="text-[#11161E]/65 mb-10 leading-relaxed">
            {lang === 'en'
              ? "Schedule a private consultation with our senior advisors and discover Indore's most exceptional properties — many never listed publicly."
              : "हमारे वरिष्ठ सलाहकारों के साथ एक निजी परामर्श बुक करें और इंदौर की सबसे असाधारण प्रॉपर्टी खोजें।"}
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/contact"
              className="px-8 py-4 bg-[#11161E] text-[#C5A880] font-semibold text-sm rounded-full hover:bg-[#0d1219] transition-all shadow-[0_8px_24px_rgba(17,22,30,0.3)] hover:-translate-y-0.5">
              {tr.scheduleConsultation}
            </Link>
            <Link href="/properties"
              className="px-8 py-4 border-2 border-[#11161E]/30 text-[#11161E] font-semibold text-sm rounded-full hover:bg-[#11161E]/10 transition-all hover:-translate-y-0.5">
              {tr.browseProperties}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}


