'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Home, Key, Building2, TreePine, ArrowRight } from 'lucide-react'
import { useLang } from '@/context/LangContext'

const tabs = [
  { id: 'buy', labelEn: 'Buy', labelHi: 'खरीदें', icon: Home },
  { id: 'rent', labelEn: 'Rent', labelHi: 'किराया', icon: Key },
  { id: 'commercial', labelEn: 'Commercial', labelHi: 'कमर्शियल', icon: Building2 },
  { id: 'plots', labelEn: 'Plots / Land', labelHi: 'प्लॉट / जमीन', icon: TreePine },
]

const categories = [
  {
    icon: Home,
    nameEn: 'Villas & Bungalows',
    nameHi: 'विला और बंगलो',
    descEn: 'Private estates with open lawns and bespoke architecture',
    descHi: 'खुले लॉन और बेस्पोक आर्किटेक्चर वाले निजी एस्टेट',
    link: '/properties?type=villa',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80',
  },
  {
    icon: Building2,
    nameEn: 'Penthouses',
    nameHi: 'पेंटहाउस',
    descEn: 'Sky-high living with panoramic city views',
    descHi: 'पैनोरमिक शहर के नज़ारों के साथ आसमान छूता जीवन',
    link: '/properties?type=penthouse',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80',
  },
  {
    icon: Building2,
    nameEn: 'Luxury Mansions',
    nameHi: 'लक्ज़री मैन्शन',
    descEn: 'Grand heritage-style homes in prime Indore localities',
    descHi: 'इंदौर के प्रमुख इलाकों में भव्य विरासत शैली के घर',
    link: '/properties?type=mansion',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
  },
  {
    icon: Key,
    nameEn: 'Off-Market Listings',
    nameHi: 'ऑफ-मार्केट लिस्टिंग',
    descEn: 'Exclusive private deals not listed publicly anywhere',
    descHi: 'कहीं भी सार्वजनिक रूप से सूचीबद्ध न किए गए विशेष निजी सौदे',
    link: '/properties?locality=off_market',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f28f8d8b?w=400&q=80',
  },
]

export default function PropertyCategories() {
  const { lang } = useLang()
  const [activeTab, setActiveTab] = useState('buy')

  return (
    <section className="py-20 bg-[#FAF9F6]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-10">
          <span className="block text-[0.7rem] font-bold tracking-[3px] uppercase text-[#A4855C] mb-3">
            {lang === 'en' ? 'EXPLORE YOUR OPTIONS' : 'अपने विकल्प जानें'}
          </span>
          <h2 className="font-playfair text-4xl md:text-5xl font-semibold text-[#11161E]">
            {lang === 'en' ? 'What Are You Looking For?' : 'आप क्या ढूंढ रहे हैं?'}
          </h2>
          <div className="w-14 h-0.5 bg-[#C5A880] mt-4 mx-auto" />
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 flex-wrap mb-12">
          {tabs.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300
                  ${isActive
                    ? 'bg-[#C5A880] text-[#11161E] shadow-[0_4px_16px_rgba(197,168,128,0.35)]'
                    : 'bg-white border border-[#E5E0DA] text-[#68717A] hover:border-[#C5A880] hover:text-[#A4855C]'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {lang === 'en' ? tab.labelEn : tab.labelHi}
              </button>
            )
          })}
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map(cat => {
            const Icon = cat.icon
            return (
              <Link
                key={cat.nameEn}
                href={cat.link}
                className="group bg-white rounded-2xl border border-[#EAE6E1] hover:border-[#C5A880]/40
                           hover:shadow-[0_12px_40px_rgba(197,168,128,0.15)] transition-all duration-400
                           hover:-translate-y-1 overflow-hidden"
              >
                {/* Image thumbnail */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.nameEn}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11161E]/50 to-transparent" />
                  <div className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center shadow">
                    <Icon className="w-4 h-4 text-[#A4855C]" />
                  </div>
                </div>

                {/* Text content */}
                <div className="p-5 text-center">
                  <h3 className="font-playfair text-lg font-semibold text-[#11161E] mb-1.5">
                    {lang === 'en' ? cat.nameEn : cat.nameHi}
                  </h3>
                  <p className="text-[#68717A] text-sm leading-relaxed mb-3">
                    {lang === 'en' ? cat.descEn : cat.descHi}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-[#A4855C] text-sm font-semibold
                                   group-hover:gap-2.5 transition-all">
                    {lang === 'en' ? 'Explore' : 'देखें'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
