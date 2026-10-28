'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import Link from 'next/link'
import { User, Mail, Phone, Calendar, ArrowRight, LogOut } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLang } from '@/context/LangContext'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const { lang } = useLang()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center px-6">
            <h2 className="font-playfair text-2xl font-semibold text-[#11161E] mb-4">
              {lang === 'en' ? 'Please login to view your profile' : 'प्रोफ़ाइल देखने के लिए लॉगिन करें'}
            </h2>
            <Link href="/" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C5A880] text-[#11161E] font-semibold text-sm rounded-full hover:bg-[#A4855C] transition-all">
              {lang === 'en' ? 'Go Home' : 'होम पर जाएं'} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const meta = user.user_metadata
  const joined = user.created_at && !isNaN(new Date(user.created_at).getTime())
    ? new Date(user.created_at).toLocaleDateString(lang === 'en' ? 'en-IN' : 'hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A'

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      <div className="h-48 bg-[#11161E] flex items-end pb-10 pt-20">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <p className="text-[0.7rem] font-bold tracking-[3px] uppercase text-[#C5A880] mb-2">
            {lang === 'en' ? 'MY ACCOUNT' : 'मेरा अकाउंट'}
          </p>
          <h1 className="font-playfair text-4xl font-bold text-white">
            {lang === 'en' ? 'My Profile' : 'मेरी प्रोफ़ाइल'}
          </h1>
        </div>
      </div>

      <main className="flex-1 py-16">
        <div className="max-w-2xl mx-auto px-6">

          {/* Avatar + Name */}
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(17,22,30,0.07)] border border-[#EAE6E1] p-8 mb-6">
            <div className="flex items-center gap-6 mb-8">
              {meta?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={meta.avatar_url} alt="Avatar"
                     className="w-20 h-20 rounded-full object-cover border-2 border-[#C5A880]" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#C5A880] flex items-center justify-center
                                text-[#11161E] font-playfair font-bold text-3xl">
                  {(meta?.full_name || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="font-playfair text-2xl font-semibold text-[#11161E]">
                  {meta?.full_name || (lang === 'en' ? 'ELITE MAKLER Member' : 'ELITE MAKLER सदस्य')}
                </h2>
                <p className="text-[#C5A880] text-sm font-medium mt-1">
                  {lang === 'en' ? 'Premium Member' : 'प्रीमियम सदस्य'}
                </p>
              </div>
            </div>

            {/* Info rows */}
            <div className="space-y-4">
              {[
                { icon: Mail,     label: lang === 'en' ? 'Email'   : 'ईमेल',   val: user.email },
                { icon: Phone,    label: lang === 'en' ? 'Phone'   : 'फ़ोन',   val: meta?.phone || (lang === 'en' ? 'Not provided' : 'नहीं दिया') },
                { icon: User,     label: lang === 'en' ? 'Name'    : 'नाम',    val: meta?.full_name || '—' },
                { icon: Calendar, label: lang === 'en' ? 'Joined'  : 'जोड़ा',  val: joined },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-4 py-3 border-b border-[#EAE6E1] last:border-0">
                  <div className="w-9 h-9 rounded-lg bg-[#C5A880]/10 flex items-center justify-center text-[#A4855C] flex-shrink-0">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[0.65rem] text-[#68717A] uppercase tracking-wide">{item.label}</p>
                    <p className="text-sm font-medium text-[#1E242B]">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(17,22,30,0.07)] border border-[#EAE6E1] p-6 mb-6">
            <h3 className="font-playfair text-lg font-semibold text-[#11161E] mb-4">
              {lang === 'en' ? 'Quick Links' : 'त्वरित लिंक'}
            </h3>
            <div className="space-y-2">
              <Link href="/saved"
                className="flex items-center justify-between px-4 py-3 rounded-xl
                           hover:bg-[#FAF9F6] transition-colors text-sm font-medium text-[#1E242B]">
                <span>❤️ {lang === 'en' ? 'Saved Properties' : 'सेव की गई प्रॉपर्टी'}</span>
                <ArrowRight className="w-4 h-4 text-[#A4855C]" />
              </Link>
              <Link href="/properties"
                className="flex items-center justify-between px-4 py-3 rounded-xl
                           hover:bg-[#FAF9F6] transition-colors text-sm font-medium text-[#1E242B]">
                <span>🏠 {lang === 'en' ? 'Browse Properties' : 'प्रॉपर्टी देखें'}</span>
                <ArrowRight className="w-4 h-4 text-[#A4855C]" />
              </Link>
              <Link href="/contact"
                className="flex items-center justify-between px-4 py-3 rounded-xl
                           hover:bg-[#FAF9F6] transition-colors text-sm font-medium text-[#1E242B]">
                <span>📞 {lang === 'en' ? 'Contact an Agent' : 'एजेंट से संपर्क करें'}</span>
                <ArrowRight className="w-4 h-4 text-[#A4855C]" />
              </Link>
            </div>
          </div>

          {/* Logout */}
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                       border border-red-200 text-red-500 text-sm font-semibold
                       hover:bg-red-50 transition-all">
            <LogOut className="w-4 h-4" />
            {lang === 'en' ? 'Sign Out' : 'साइन आउट'}
          </button>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}

