import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import EnquiryForm from '@/components/EnquiryForm'
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | ELITE MAKLER Indore',
  description: 'Schedule a private consultation with ELITE MAKLER senior estate advisors.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="h-52 bg-[#11161E] flex items-end pb-12 pt-20">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <p className="text-[0.72rem] font-bold tracking-[3px] uppercase text-[#C5A880] mb-2">
            GET IN TOUCH
          </p>
          <h1 className="font-playfair text-4xl font-bold text-white">Begin Your Luxury Journey</h1>
        </div>
      </div>

      <main className="flex-1 py-16 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-xl
                          shadow-[0_30px_60px_rgba(17,22,30,0.08)]">
            {/* Left — contact info */}
            <div className="bg-[#11161E] text-white p-16 flex flex-col justify-center">
              <p className="text-[0.72rem] font-bold tracking-[3px] uppercase text-[#C5A880] mb-3">
                OUR DETAILS
              </p>
              <h2 className="font-playfair text-3xl font-semibold mb-5">Contact Us</h2>
              <p className="text-white/70 mb-10 leading-relaxed font-light">
                Subscribe to our VIP list to gain exclusive access to private off-market property
                listings, or schedule a callback with our senior concierge agent.
              </p>
              <div className="space-y-7">
                {[
                  { icon: Phone, label: 'Call Executive Desk', value: '+91 731 555-LUXE', href: 'tel:+917315550000' },
                  { icon: Mail,  label: 'Private Mailbox',     value: 'concierge@ELITE MAKLER.in', href: 'mailto:concierge@ELITE MAKLER.in' },
                  { icon: MapPin,label: 'Office',              value: 'Vijay Nagar, Indore — 452010', href: '#' },
                  { icon: MessageCircle, label: 'WhatsApp Enquiry', value: '+91 97522 10368', href: 'https://wa.me/919752210368?text=Hello%20Elite%20Makler,%20I%20would%20like%20to%20enquire%20about%20a%20property.' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center
                                    justify-center text-[#C5A880] flex-shrink-0">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[0.7rem] uppercase tracking-widest text-white/40">{item.label}</p>
                      <a href={item.href} className="text-white font-medium hover:text-[#C5A880] transition-colors">
                        {item.value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — form */}
            <div className="bg-white p-16 flex flex-col justify-center">
              <h3 className="font-playfair text-2xl font-semibold text-[#11161E] mb-2">
                Request Callback
              </h3>
              <p className="text-[#68717A] text-sm mb-8">
                Our senior agent will reach you within 2 business hours.
              </p>
              <EnquiryForm dark={false} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}

