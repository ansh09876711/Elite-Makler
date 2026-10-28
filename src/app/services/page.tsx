import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import Link from 'next/link'
import { Compass, Target, Scale, Home, TrendingUp, Camera } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Services | ELITE MAKLER Indore',
  description: 'Bespoke real estate services — acquisition, marketing, legal, and concierge support.',
}

const services = [
  {
    icon: Compass,
    title: 'Exclusive Property Acquisition',
    desc: 'Personalized search and acquisition of off-market premium assets tailored directly to your investment portfolio and lifestyle in Indore.',
    points: ['Off-market pocket listings', 'HNI client representation', 'RERA-verified properties only'],
  },
  {
    icon: Target,
    title: 'Elite Local Marketing',
    desc: 'World-class architectural photography, high-definition cinematic walk-throughs, and targeted local reach for luxury sellers.',
    points: ['3D virtual tours', 'Drone cinematography', 'Print & digital campaigns'],
  },
  {
    icon: Scale,
    title: 'Private Concierge & Legal Support',
    desc: 'End-to-end guidance through complex legal transactions, RERA compliance, taxation consulting, and customized closing solutions.',
    points: ['RERA compliance checks', 'Title verification', 'Tax planning & stamp duty'],
  },
  {
    icon: Home,
    title: 'Property Management',
    desc: 'Full-service property management for HNI clients — tenant sourcing, rent collection, maintenance coordination, and monthly reporting.',
    points: ['Tenant screening', 'Maintenance coordination', 'Monthly P&L reports'],
  },
  {
    icon: TrendingUp,
    title: 'Investment Advisory',
    desc: 'Data-driven investment guidance on commercial and residential assets with yield analysis, rental benchmarking, and exit strategy planning.',
    points: ['Yield analysis', 'Rental benchmarking', 'Exit strategy planning'],
  },
  {
    icon: Camera,
    title: 'Staging & Photography',
    desc: 'Professional staging consultation, interior styling, and architectural photography to maximize visual appeal and sales price.',
    points: ['Interior staging', 'Architectural photography', 'Virtual staging'],
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="h-52 bg-[#11161E] flex items-end pb-12 pt-20">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <p className="text-[0.72rem] font-bold tracking-[3px] uppercase text-[#C5A880] mb-2">
            OUR SERVICE SUITE
          </p>
          <h1 className="font-playfair text-4xl font-bold text-white">Bespoke Real Estate Services</h1>
        </div>
      </div>

      <main className="flex-1 bg-[#FAF9F6]">
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map(svc => (
                <div
                  key={svc.title}
                  className="bg-white rounded-lg p-8 border border-[#EAE6E1]
                             hover:border-[#C5A880] hover:-translate-y-1.5
                             transition-all duration-500 shadow-[0_4px_20px_rgba(17,22,30,0.04)]
                             hover:shadow-[0_20px_40px_rgba(17,22,30,0.08)]"
                >
                  <div className="w-12 h-12 rounded-lg bg-[#C5A880]/10 flex items-center
                                  justify-center text-[#A4855C] mb-6">
                    <svc.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-playfair text-xl font-semibold text-[#11161E] mb-3">
                    {svc.title}
                  </h3>
                  <p className="text-[#68717A] text-sm leading-relaxed mb-5">{svc.desc}</p>
                  <ul className="space-y-2">
                    {svc.points.map(pt => (
                      <li key={pt} className="flex items-center gap-2 text-sm font-medium text-[#1E242B]">
                        <span className="text-[#A4855C] text-xs">✓</span> {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA strip */}
        <section className="py-20 bg-[#11161E] text-white text-center">
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="font-playfair text-3xl font-semibold mb-4">
              Ready to Begin?
            </h2>
            <p className="text-white/65 mb-8 leading-relaxed">
              Schedule a confidential consultation with our senior advisors to understand
              how ELITE MAKLER can serve your real estate goals in Indore.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/contact"
                className="px-7 py-3.5 bg-[#C5A880] text-[#11161E] font-semibold text-sm
                           rounded hover:bg-[#A4855C] transition-all"
              >
                Schedule Consultation
              </Link>
              <Link
                href="/properties"
                className="px-7 py-3.5 border border-white/30 text-white text-sm
                           font-medium rounded hover:bg-white/10 transition-all"
              >
                Browse Properties
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}

