'use client'

import Link from 'next/link'
import { Send, Phone, Mail, MapPin, Clock } from 'lucide-react'
import { useState } from 'react'
import { useLang } from '@/context/LangContext'

export default function Footer() {
  const { lang } = useLang()
  const [email, setEmail] = useState('')
  const [sent,  setSent]  = useState(false)

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true); setEmail('')
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <footer className="bg-[#0d1219] text-white/60 relative overflow-hidden">

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
           style={{ backgroundImage: 'radial-gradient(#C5A880 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* Gold top border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C5A880]/50 to-transparent" />

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {/* Brand col */}
          <div className="lg:col-span-2">
            {/* Logo + Name */}
            <Link href="/" className="flex items-center gap-3 mb-5 group">
              <img src="/images/logo.png" alt="EM Logo"
                className="w-20 h-20 object-contain transition-transform group-hover:scale-105"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              <div>
                <span className="font-playfair text-2xl font-bold text-white tracking-widest block">
                  ELITE <span className="text-[#C5A880] font-normal">MAKLER</span>
                </span>
                <span className="text-[0.65rem] tracking-[3px] uppercase text-[#C5A880]/60 font-medium">
                  Elite Real Estate · Indore
                </span>
              </div>
            </Link>

            <p className="text-sm leading-6 text-white/50 mb-4 max-w-sm">
              {lang === 'en'
                ? 'Indore\'s most trusted luxury real estate brokerage. Delivering architectural legacies and elite concierge service since 2007.'
                : 'इंदौर का सबसे विश्वसनीय लग्ज़री रियल एस्टेट ब्रोकरेज। 2007 से एलीट सेवा प्रदान कर रहे हैं।'}
            </p>

            {/* Contact info */}
            <div className="space-y-2 mb-5">
              {[
                { icon: Phone,   val: '+91 731 555-LUXE',           href: 'tel:+917315550000' },
                { icon: Mail,    val: 'concierge@ELITE MAKLER.in',      href: 'mailto:concierge@ELITE MAKLER.in' },
                { icon: MapPin,  val: 'Vijay Nagar, Indore — 452010', href: '#' },
                { icon: Clock,   val: 'Mon–Sat: 9AM – 7PM',          href: '#' },
              ].map(item => (
                <a key={item.val} href={item.href}
                  className="flex items-center gap-2.5 text-xs text-white/45 hover:text-[#C5A880] transition-colors group">
                  <item.icon className="w-3.5 h-3.5 text-[#C5A880]/60 group-hover:text-[#C5A880] flex-shrink-0" />
                  {item.val}
                </a>
              ))}
            </div>

            {/* Social icons */}
            <div className="flex gap-2.5">
              {[
                { label: 'Instagram', icon: '📸', href: '#',  bg: 'hover:bg-gradient-to-br hover:from-[#833ab4] hover:via-[#fd1d1d] hover:to-[#fcb045]' },
                { label: 'Facebook',  icon: '💬', href: '#',  bg: 'hover:bg-[#1877f2]' },
                { label: 'YouTube',   icon: '▶️',  href: '#',  bg: 'hover:bg-[#ff0000]' },
                { label: 'LinkedIn',  icon: '💼', href: '#',  bg: 'hover:bg-[#0a66c2]' },
                { label: 'WhatsApp',  icon: '📱', href: 'https://wa.me/919752210368', bg: 'hover:bg-[#25D366]' },
              ].map(s => (
                <a key={s.label} href={s.href} target={s.href !== '#' ? '_blank' : undefined}
                   aria-label={s.label}
                   className={`w-9 h-9 rounded-full bg-white/6 border border-white/8
                              flex items-center justify-center text-sm
                              hover:border-transparent hover:text-white hover:scale-110
                              transition-all duration-200 ${s.bg}`}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company col */}
          <div>
            <h4 className="font-playfair text-white text-base font-semibold mb-5 flex items-center gap-2">
              <span className="w-4 h-px bg-[#C5A880]" />
              {lang === 'en' ? 'Company' : 'कंपनी'}
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: '/about',        en: 'Our Legacy',       hi: 'हमारी विरासत' },
                { href: '/services',     en: 'Our Services',     hi: 'हमारी सेवाएं' },
                { href: '/localities',   en: 'All Localities',   hi: 'सभी इलाके' },
                { href: '/press',        en: 'Press & Media',    hi: 'प्रेस और मीडिया' },
                { href: '/contact',      en: 'Contact Us',       hi: 'संपर्क करें' },
                { href: '/about#agents', en: 'Our Agents',       hi: 'हमारे एजेंट' },
                { href: '/profile',      en: 'My Account',       hi: 'मेरा अकाउंट' },
                { href: '/saved',        en: 'Saved Properties', hi: 'सेव्ड प्रॉपर्टी' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="text-sm text-white/50 hover:text-[#C5A880] hover:pl-2
                               transition-all duration-200 flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-[#C5A880]/0 group-hover:bg-[#C5A880] transition-all flex-shrink-0" />
                    {lang === 'en' ? l.en : l.hi}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter col */}
          <div>
            <h4 className="font-playfair text-white text-base font-semibold mb-5 flex items-center gap-2">
              <span className="w-4 h-px bg-[#C5A880]" />
              {lang === 'en' ? 'Newsletter' : 'न्यूज़लेटर'}
            </h4>
            <p className="text-sm text-white/45 leading-relaxed mb-4">
              {lang === 'en'
                ? 'Get exclusive access to off-market listings and weekly market insights.'
                : 'ऑफ-मार्केट लिस्टिंग और साप्ताहिक मार्केट अपडेट के लिए जुड़ें।'}
            </p>
            <form onSubmit={handleNewsletter} className="mb-5">
              <div className="flex">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder={lang === 'en' ? 'Your Email Address' : 'ईमेल पता'}
                  required
                  className="flex-1 bg-white/5 border border-white/10 text-white text-sm
                             px-4 py-3 rounded-l-lg placeholder:text-white/25
                             focus:outline-none focus:border-[#C5A880] transition-colors" />
                <button type="submit"
                  className="bg-[#C5A880] text-[#11161E] px-4 rounded-r-lg
                             hover:bg-[#A4855C] transition-colors font-semibold">
                  {sent ? '✓' : <Send className="w-4 h-4" />}
                </button>
              </div>
              {sent && <p className="text-[#C5A880] text-xs mt-2">✓ {lang === 'en' ? 'Subscribed!' : 'सब्सक्राइब हो गए!'}</p>}
            </form>

            {/* RERA Badge */}
            <div className="bg-white/4 border border-white/8 rounded-xl p-4">
              <p className="text-[0.62rem] font-bold uppercase tracking-widest text-[#C5A880] mb-2">
                🏛 RERA Registered
              </p>
              <p className="text-[0.68rem] text-white/40 leading-relaxed">
                All transactions RERA compliant. Madhya Pradesh RERA Reg. No. MP-RERA-2024-XXX
              </p>
            </div>
          </div>
        </div>

        {/* Divider with gold */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C5A880]/20 to-transparent mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-white/30">
            <span>© 2026 ELITE MAKLER Brokerage Pvt. Ltd.</span>
            <span className="hidden sm:block">·</span>
            <span>{lang === 'en' ? 'All rights reserved.' : 'सर्वाधिकार सुरक्षित।'}</span>
            <span className="hidden sm:block">·</span>
            <span>Made with ❤️ in Indore</span>
          </div>
          <div className="flex items-center gap-5 text-xs">
            {[
              { href: '/privacy',      en: 'Privacy Policy',  hi: 'गोपनीयता नीति' },
              { href: '/terms',        en: 'Terms of Service', hi: 'सेवा शर्तें' },
              { href: '/sitemap.xml',  en: 'Sitemap',          hi: 'साइटमैप' },
            ].map(l => (
              <Link key={l.href} href={l.href}
                className="text-white/30 hover:text-[#C5A880] transition-colors">
                {lang === 'en' ? l.en : l.hi}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

