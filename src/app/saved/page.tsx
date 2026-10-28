'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import Link from 'next/link'
import { Heart, ArrowRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLang } from '@/context/LangContext'

export default function SavedPage() {
  const { user } = useAuth()
  const { lang } = useLang()

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      <div className="h-48 bg-[#11161E] flex items-end pb-10 pt-20">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <p className="text-[0.7rem] font-bold tracking-[3px] uppercase text-[#C5A880] mb-2">
            {lang === 'en' ? 'MY ACCOUNT' : 'मेरा अकाउंट'}
          </p>
          <h1 className="font-playfair text-4xl font-bold text-white">
            {lang === 'en' ? 'Saved Properties' : 'सेव की गई प्रॉपर्टी'}
          </h1>
        </div>
      </div>

      <main className="flex-1 py-16">
        <div className="max-w-6xl mx-auto px-6">
          {!user ? (
            /* Not logged in */
            <div className="text-center py-24">
              <div className="w-20 h-20 rounded-full bg-[#C5A880]/10 flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-[#C5A880]" />
              </div>
              <h2 className="font-playfair text-2xl font-semibold text-[#11161E] mb-3">
                {lang === 'en' ? 'Login to view saved properties' : 'सेव की गई प्रॉपर्टी देखने के लिए लॉगिन करें'}
              </h2>
              <p className="text-[#68717A] mb-8">
                {lang === 'en'
                  ? 'Save properties you love and access them anytime.'
                  : 'अपनी पसंदीदा प्रॉपर्टी सेव करें और कभी भी देखें।'}
              </p>
              <Link href="/"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C5A880]
                           text-[#11161E] font-semibold text-sm rounded-full
                           hover:bg-[#A4855C] transition-all">
                {lang === 'en' ? 'Go to Home' : 'होम पर जाएं'} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            /* Logged in — empty state (heart button functionality coming soon) */
            <div className="text-center py-24">
              <div className="w-20 h-20 rounded-full bg-[#C5A880]/10 flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-[#C5A880]" />
              </div>
              <h2 className="font-playfair text-2xl font-semibold text-[#11161E] mb-3">
                {lang === 'en' ? 'No saved properties yet' : 'अभी कोई सेव की गई प्रॉपर्टी नहीं'}
              </h2>
              <p className="text-[#68717A] mb-8">
                {lang === 'en'
                  ? 'Browse properties and click the ♥ heart icon to save them here.'
                  : 'प्रॉपर्टी ब्राउज़ करें और ♥ हार्ट आइकन दबाकर यहाँ सेव करें।'}
              </p>
              <Link href="/properties"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C5A880]
                           text-[#11161E] font-semibold text-sm rounded-full
                           hover:bg-[#A4855C] transition-all">
                {lang === 'en' ? 'Browse Properties' : 'प्रॉपर्टी देखें'} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
