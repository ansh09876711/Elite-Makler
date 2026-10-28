'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import Link from 'next/link'
import { ArrowRight, Download, ExternalLink, Newspaper, Trophy, Star, TrendingUp } from 'lucide-react'
import { useLang } from '@/context/LangContext'

const pressArticles = [
  {
    outlet:  'Times of India',
    logo:    'TOI',
    color:   'bg-red-600',
    date:    'June 2025',
    title:   'Elite Makler Named Best Luxury Real Estate Firm in Indore',
    excerpt: 'The award-winning brokerage has closed over ₹1,000 Crore in landmark property transactions, cementing its position as Indore\'s premier luxury real estate firm.',
    href:    '#',
    tag:     'Featured',
  },
  {
    outlet:  'Business Standard',
    logo:    'BS',
    color:   'bg-blue-700',
    date:    'April 2025',
    title:   'Indore\'s Luxury Property Market Surges 18% — Elite Makler Leads the Rally',
    excerpt: 'Palasia and Vijay Nagar corridors are commanding record prices per sqft, driven by demand from HNI buyers. Elite Makler accounts for nearly 30% of premium transactions.',
    href:    '#',
    tag:     'Market Report',
  },
  {
    outlet:  'Dainik Bhaskar',
    logo:    'DB',
    color:   'bg-orange-600',
    date:    'March 2025',
    title:   'इंदौर में लग्ज़री प्रॉपर्टी — Elite Makler का दबदबा',
    excerpt: 'इंदौर के सबसे विश्वसनीय लग्ज़री रियल एस्टेट ब्रोकरेज Elite Makler ने इस वर्ष अब तक ₹310 करोड़ के सौदे पूरे किए हैं।',
    href:    '#',
    tag:     'Hindi Coverage',
  },
  {
    outlet:  'Economic Times',
    logo:    'ET',
    color:   'bg-emerald-700',
    date:    'February 2025',
    title:   'Top HNI Property Firm — MP Chapter Awards 2025',
    excerpt: 'Elite Makler was recognized as the top high-net-worth individual property specialist in Madhya Pradesh at the annual ET Real Estate Awards.',
    href:    '#',
    tag:     'Award',
  },
  {
    outlet:  'Nai Duniya',
    logo:    'ND',
    color:   'bg-purple-700',
    date:    'January 2025',
    title:   'इंदौर के रियल एस्टेट बाज़ार में Elite Makler की उपस्थिति',
    excerpt: 'विजय नगर, निपानिया और बायपास रोड पर बड़े सौदों के साथ Elite Makler ने शहर के प्रीमियम रियल एस्टेट सेगमेंट में अपनी पहचान बनाई।',
    href:    '#',
    tag:     'Hindi Coverage',
  },
  {
    outlet:  'Housing.com Blog',
    logo:    'HC',
    color:   'bg-teal-700',
    date:    'December 2024',
    title:   'Why Indore is India\'s Next Luxury Real Estate Hotspot',
    excerpt: 'Featured Elite Makler as the goto brokerage for HNI buyers looking to invest in Indore\'s booming luxury residential and commercial market.',
    href:    '#',
    tag:     'Featured',
  },
]

const awards = [
  { icon: Trophy, title: 'Best Luxury Broker',    body: 'Indore Real Estate Awards',       year: '2024', color: 'text-yellow-400',  bg: 'bg-yellow-400/10' },
  { icon: Star,   title: 'Top HNI Firm — MP',     body: 'Economic Times Awards',            year: '2023', color: 'text-blue-400',    bg: 'bg-blue-400/10' },
  { icon: Trophy, title: 'Excellence in Service', body: 'CREDAI Madhya Pradesh Chapter',    year: '2023', color: 'text-[#C5A880]',   bg: 'bg-[#C5A880]/10' },
  { icon: Star,   title: 'Best Marketing Campaign',body: 'Realty+ Property Awards',         year: '2022', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { icon: TrendingUp,title:'₹1,000 Cr Milestone', body: 'Total Transaction Value Achieved', year: '2024', color: 'text-purple-400',  bg: 'bg-purple-400/10' },
  { icon: Star,   title: 'Top 10 Brokers India',  body: '99acres.com Annual Rankings',      year: '2023', color: 'text-rose-400',    bg: 'bg-rose-400/10' },
]

const mediaKit = [
  { label: 'Brand Logo Pack (PNG + SVG)',       size: '2.4 MB',  type: 'ZIP' },
  { label: 'Company Overview Brochure (PDF)',   size: '4.1 MB',  type: 'PDF' },
  { label: 'High-Res Property Photos',          size: '18.2 MB', type: 'ZIP' },
  { label: 'Executive Bios & Headshots',        size: '3.7 MB',  type: 'ZIP' },
  { label: 'Press Release — Q1 2025',           size: '0.8 MB',  type: 'PDF' },
]

export default function PressPage() {
  const { lang } = useLang()

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      {/* Hero Banner */}
      <div className="bg-[#0d1219] pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
             style={{ backgroundImage: 'radial-gradient(#C5A880 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 text-[0.7rem] font-bold tracking-[3px] uppercase
                           text-[#C5A880] mb-4">
            <Newspaper className="w-3.5 h-3.5" />
            {lang === 'en' ? 'Press & Media' : 'प्रेस और मीडिया'}
          </span>
          <h1 className="font-playfair text-4xl md:text-5xl font-semibold text-white mb-4">
            {lang === 'en' ? 'News & Recognition' : 'समाचार और पुरस्कार'}
          </h1>
          <div className="w-16 h-0.5 bg-[#C5A880] mx-auto mb-6" />
          <p className="text-white/55 max-w-xl mx-auto text-sm leading-relaxed">
            {lang === 'en'
              ? 'Elite Makler in the news — awards, features, and press coverage from India\'s leading publications.'
              : 'Elite Makler की खबरें — भारत के प्रमुख प्रकाशनों में पुरस्कार और प्रेस कवरेज।'}
          </p>

          {/* Press Inquiry CTA */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href="/contact"
              className="flex items-center gap-2 px-6 py-3 bg-[#C5A880] text-[#11161E]
                         font-semibold text-sm rounded-full hover:bg-[#A4855C] transition-all">
              {lang === 'en' ? 'Press Enquiry' : 'प्रेस संपर्क'}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a href="#media-kit"
              className="flex items-center gap-2 px-6 py-3 border border-white/25 text-white
                         text-sm font-medium rounded-full hover:bg-white/10 transition-all">
              <Download className="w-3.5 h-3.5" />
              {lang === 'en' ? 'Download Media Kit' : 'मीडिया किट डाउनलोड'}
            </a>
          </div>
        </div>
      </div>

      <main className="flex-1">

        {/* Stats strip */}
        <div className="bg-white border-b border-[#EAE6E1]">
          <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: '18+',     label: lang === 'en' ? 'Years in Business'   : 'वर्षों का अनुभव' },
              { num: '₹1000Cr+',label: lang === 'en' ? 'Transactions Closed' : 'ट्रांज़ैक्शन' },
              { num: '6',       label: lang === 'en' ? 'Awards Won'          : 'पुरस्कार' },
              { num: '12+',     label: lang === 'en' ? 'Media Features'      : 'मीडिया फ़ीचर' },
            ].map(s => (
              <div key={s.label}>
                <p className="font-playfair text-2xl font-bold text-[#11161E]">{s.num}</p>
                <p className="text-xs text-[#68717A] uppercase tracking-wide mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Press Articles */}
        <section className="py-16 max-w-5xl mx-auto px-6">
          <div className="mb-10">
            <span className="block text-[0.7rem] font-bold tracking-[3px] uppercase text-[#A4855C] mb-2">
              {lang === 'en' ? 'IN THE NEWS' : 'समाचार में'}
            </span>
            <h2 className="font-playfair text-3xl font-semibold text-[#11161E]">
              {lang === 'en' ? 'Recent Press Coverage' : 'हाल की प्रेस कवरेज'}
            </h2>
            <div className="w-12 h-0.5 bg-[#C5A880] mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pressArticles.map((article, i) => (
              <a key={i} href={article.href}
                className="group bg-white rounded-xl border border-[#EAE6E1] overflow-hidden
                           hover:border-[#C5A880] hover:shadow-[0_8px_30px_rgba(17,22,30,0.08)]
                           transition-all duration-300 flex flex-col">
                {/* Card top */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F4F2EF]">
                  <div className="flex items-center gap-3">
                    <span className={`w-9 h-9 rounded-lg ${article.color} text-white
                                     flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                      {article.logo}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#11161E]">{article.outlet}</p>
                      <p className="text-[0.65rem] text-[#68717A]">{article.date}</p>
                    </div>
                  </div>
                  <span className="text-[0.6rem] font-bold uppercase tracking-wide px-2.5 py-1
                                   bg-[#C5A880]/10 text-[#A4855C] rounded-full">
                    {article.tag}
                  </span>
                </div>
                {/* Card body */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-playfair font-semibold text-[#11161E] text-base leading-snug mb-3
                                 group-hover:text-[#A4855C] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-[#68717A] text-sm leading-relaxed flex-1 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-1.5 text-[#A4855C] text-xs font-semibold mt-4
                                  group-hover:gap-3 transition-all">
                    {lang === 'en' ? 'Read Article' : 'लेख पढ़ें'}
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Awards */}
        <section className="py-16 bg-[#11161E] relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]"
               style={{ backgroundImage: 'radial-gradient(#C5A880 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="relative max-w-5xl mx-auto px-6">
            <div className="mb-10 text-center">
              <span className="block text-[0.7rem] font-bold tracking-[3px] uppercase text-[#C5A880] mb-2">
                {lang === 'en' ? 'RECOGNITION' : 'पुरस्कार'}
              </span>
              <h2 className="font-playfair text-3xl font-semibold text-white">
                {lang === 'en' ? 'Awards & Honours' : 'पुरस्कार और सम्मान'}
              </h2>
              <div className="w-12 h-0.5 bg-[#C5A880] mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {awards.map((award, i) => (
                <div key={i}
                  className="bg-white/4 border border-white/8 rounded-xl p-6
                             hover:border-[#C5A880]/30 transition-colors">
                  <div className={`w-11 h-11 rounded-xl ${award.bg} flex items-center
                                  justify-center mb-4`}>
                    <award.icon className={`w-5 h-5 ${award.color}`} />
                  </div>
                  <p className="text-white font-semibold text-sm mb-1">{award.title}</p>
                  <p className="text-white/45 text-xs mb-3 leading-relaxed">{award.body}</p>
                  <span className={`text-[0.62rem] font-bold uppercase tracking-widest
                                   px-2.5 py-1 rounded-full ${award.bg} ${award.color}`}>
                    {award.year}
                  </span>
                </div>
              ))}
            </div>

            {/* Press logos */}
            <div className="mt-14 text-center">
              <p className="text-[0.65rem] font-bold uppercase tracking-[3px] text-white/30 mb-5">
                {lang === 'en' ? 'AS SEEN IN' : 'इनमें प्रकाशित'}
              </p>
              <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
                {['Times of India','Business Standard','Dainik Bhaskar','Nai Duniya','Economic Times','99acres','Housing.com'].map(p => (
                  <span key={p}
                    className="font-playfair text-sm md:text-base font-semibold
                               text-white/25 hover:text-[#C5A880] transition-colors cursor-default">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Media Kit */}
        <section id="media-kit" className="py-16 max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="block text-[0.7rem] font-bold tracking-[3px] uppercase text-[#A4855C] mb-2">
                {lang === 'en' ? 'MEDIA KIT' : 'मीडिया किट'}
              </span>
              <h2 className="font-playfair text-3xl font-semibold text-[#11161E] mb-4">
                {lang === 'en' ? 'Download Resources' : 'संसाधन डाउनलोड करें'}
              </h2>
              <div className="w-12 h-0.5 bg-[#C5A880] mb-5" />
              <p className="text-[#68717A] text-sm leading-relaxed mb-6">
                {lang === 'en'
                  ? 'For journalists, bloggers, and media professionals — download our official brand assets, high-resolution images, and press releases.'
                  : 'पत्रकारों और मीडिया पेशेवरों के लिए — हमारे आधिकारिक ब्रांड एसेट और प्रेस रिलीज़ डाउनलोड करें।'}
              </p>
              {/* Press contact */}
              <div className="bg-[#11161E] rounded-xl p-5">
                <p className="text-[0.65rem] font-bold uppercase tracking-widest text-[#C5A880] mb-3">
                  {lang === 'en' ? 'Press Contact' : 'प्रेस संपर्क'}
                </p>
                <p className="text-white font-semibold text-sm mb-1">Media Relations Team</p>
                <p className="text-white/50 text-xs mb-3">Elite Makler Brokerage Pvt. Ltd.</p>
                <a href="mailto:press@elitemakler.in"
                  className="text-[#C5A880] text-sm hover:underline block">
                  press@elitemakler.in
                </a>
                <a href="tel:+917315550000"
                  className="text-white/50 text-xs mt-1 hover:text-white transition-colors block">
                  +91 731 555-LUXE
                </a>
              </div>
            </div>

            {/* Downloads */}
            <div className="space-y-3">
              {mediaKit.map((item, i) => (
                <div key={i}
                  className="flex items-center gap-4 bg-white border border-[#EAE6E1]
                             rounded-xl px-5 py-4 hover:border-[#C5A880] transition-all group cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-[#C5A880]/10 flex items-center
                                  justify-center flex-shrink-0">
                    <Download className="w-4 h-4 text-[#A4855C]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#11161E] truncate">{item.label}</p>
                    <p className="text-xs text-[#68717A]">{item.type} · {item.size}</p>
                  </div>
                  <span className="text-[0.62rem] font-bold uppercase text-[#A4855C]
                                   bg-[#C5A880]/10 px-2.5 py-1 rounded-full group-hover:bg-[#C5A880]
                                   group-hover:text-[#11161E] transition-all">
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 bg-[#C5A880] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
               style={{ backgroundImage: 'radial-gradient(#11161E 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="relative max-w-2xl mx-auto px-6 text-center">
            <h2 className="font-playfair text-3xl font-semibold text-[#11161E] mb-3">
              {lang === 'en' ? 'Want to Feature Elite Makler?' : 'Elite Makler को फ़ीचर करना चाहते हैं?'}
            </h2>
            <p className="text-[#11161E]/65 text-sm mb-7 leading-relaxed">
              {lang === 'en'
                ? 'For interviews, expert commentary, or story pitches — our team is available for media requests.'
                : 'इंटरव्यू, एक्सपर्ट कमेंटरी या स्टोरी के लिए हमारी टीम से संपर्क करें।'}
            </p>
            <Link href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#11161E] text-[#C5A880]
                         font-semibold text-sm rounded-full hover:bg-[#0d1219] transition-all
                         shadow-[0_8px_20px_rgba(17,22,30,0.25)]">
              {lang === 'en' ? 'Get in Touch' : 'संपर्क करें'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
