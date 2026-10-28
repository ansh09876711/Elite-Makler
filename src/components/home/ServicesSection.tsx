'use client'

import { Compass, Target, Scale, ArrowRight } from 'lucide-react'
import { useLang } from '@/context/LangContext'
import Link from 'next/link'

const services = [
  {
    icon: Compass,
    titleEn: 'Exclusive Property Acquisition',
    titleHi: 'अनन्य संपत्ति अधिग्रहण',
    descEn: 'Personalized search and acquisition of off-market premium assets tailored directly to your investment portfolio and lifestyle in Indore.',
    descHi: 'इंदौर में आपके निवेश पोर्टफोलियो और जीवन शैली के अनुकूल सीधे ऑफ-मार्केट प्रीमियम संपत्तियों की व्यक्तिगत खोज और अधिग्रहण।',
  },
  {
    icon: Target,
    titleEn: 'Elite Local Marketing',
    titleHi: 'अभिजात वर्ग स्थानीय विपणन',
    descEn: 'World-class architectural photography, high-definition cinematic walk-throughs, and local targeted reach for luxury sellers.',
    descHi: 'विश्व स्तरीय वास्तुकला फोटोग्राफी, उच्च परिभाषा सिनेमाई वॉक-थ्रू, और लक्जरी विक्रेताओं के लिए स्थानीय लक्षित पहुंच।',
  },
  {
    icon: Scale,
    titleEn: 'Private Concierge & Legal Support',
    titleHi: 'निजी कंसीयज और कानूनी सहायता',
    descEn: 'End-to-end guidance through complex legal transactions, RERA compliance, taxation consulting, and customized closing solutions.',
    descHi: 'जटिल कानूनी लेनदेन, रेरा अनुपालन, कराधान परामर्श, और अनुकूलित समापन समाधानों के माध्यम से शुरू से अंत तक मार्गदर्शन।',
  },
]

export default function ServicesSection() {
  const { lang } = useLang()

  return (
    <section className="py-24 bg-[#11161E] relative overflow-hidden">
      {/* Background image with heavy overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=70"
          alt=""
          className="w-full h-full object-cover opacity-10"
          aria-hidden="true"
        />
      </div>
      {/* Decorative background grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#C5A880 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C5A880]/5 to-transparent" />
        <div className="absolute bottom-[20%] left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C5A880]/5 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="block text-[0.7rem] font-bold tracking-[4px] uppercase text-[#C5A880] mb-3">
            {lang === 'en' ? 'OUR SERVICE SUITE' : 'हमारी सेवाएं'}
          </span>
          <h2 className="font-playfair text-4xl md:text-5xl font-semibold text-white leading-tight">
            {lang === 'en' ? 'Bespoke Real Estate Services' : 'बेस्पोक रियल एस्टेट सेवाएं'}
          </h2>
          <div className="w-14 h-0.5 bg-[#C5A880] mt-4 mx-auto" />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div 
                key={index}
                className="bg-white/[0.03] border border-white/[0.06] hover:border-[#C5A880]/30 
                           rounded-2xl p-8 hover:bg-white/[0.05] transition-all duration-500 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#C5A880]/10 flex items-center justify-center mb-6 
                                group-hover:bg-[#C5A880]/20 transition-all duration-300">
                  <Icon className="w-5 h-5 text-[#C5A880]" />
                </div>
                <h3 className="font-playfair text-xl font-medium text-white mb-4 group-hover:text-[#C5A880] transition-colors duration-300">
                  {lang === 'en' ? service.titleEn : service.titleHi}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-6 font-light">
                  {lang === 'en' ? service.descEn : service.descHi}
                </p>
                <Link 
                  href="/services" 
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C5A880] group-hover:gap-3 transition-all duration-300"
                >
                  {lang === 'en' ? 'Learn More' : 'अधिक जानें'} 
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
