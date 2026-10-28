import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Localities | ELITE MAKLER Indore',
  description: 'Explore luxury properties by neighbourhood in Indore.',
}

const localities = [
  {
    name: 'Vijay Nagar & Nipania',
    slug: 'vijay_nagar',
    count: 38,
    avgPrice: '₹8,500/sqft',
    yoy: '+14.2%',
    desc: "Indore's most premium residential corridor. Home to sky penthouses, ultra-modern villas, and gated communities catering to Indore's tech and business elite.",
    highlights: ['IT Corridor proximity', 'Best schools & hospitals', 'Premium retail & dining'],
  },
  {
    name: 'Bypass Road Estates',
    slug: 'bypass_road',
    count: 24,
    avgPrice: '₹5,200/sqft',
    yoy: '+9.8%',
    desc: 'Verdant retreats with sprawling green surrounds. Ideal for luxury villas, farmhouses, and private estates seeking privacy away from the city bustle.',
    highlights: ['Green belt location', 'Large plot sizes', 'Farm house opportunities'],
  },
  {
    name: 'Palasia & Saket',
    slug: 'palasia_saket',
    count: 19,
    avgPrice: '₹9,800/sqft',
    yoy: '+18.5%',
    desc: 'Heritage addresses with colonial grandeur. The most prestigious ZIP code in Indore — commanding the highest price appreciation year on year.',
    highlights: ['Heritage architecture', 'Central location', 'Highest appreciation'],
  },
  {
    name: 'Nipania',
    slug: 'nipania',
    count: 12,
    avgPrice: '₹7,100/sqft',
    yoy: '+11.3%',
    desc: "Emerging as Indore's new premium skyline with penthouse developments and high-rise luxury towers that offer 360° views of the city.",
    highlights: ['New skyline', 'Premium penthouses', 'City views'],
  },
]

export default function LocalitiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="h-52 bg-[#11161E] flex items-end pb-12 pt-20">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <p className="text-[0.72rem] font-bold tracking-[3px] uppercase text-[#C5A880] mb-2">
            PRIME LOCATIONS
          </p>
          <h1 className="font-playfair text-4xl font-bold text-white">Explore By Neighbourhood</h1>
        </div>
      </div>

      <main className="flex-1 bg-[#FAF9F6] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {localities.map(loc => (
              <div
                key={loc.slug}
                className="bg-white rounded-xl overflow-hidden border border-[#EAE6E1]
                           hover:border-[#C5A880] hover:shadow-[0_20px_40px_rgba(17,22,30,0.08)]
                           transition-all duration-400"
              >
                <div className="h-40 bg-gradient-to-br from-[#1a2130] to-[#2d3a4a] relative">
                  <div className="absolute inset-0 flex items-end p-5">
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-bold
                                       uppercase tracking-widest text-[#4ade80] bg-[#4ade80]/10
                                       px-3 py-1 rounded-full mb-2">
                        📈 {loc.yoy} YoY
                      </span>
                      <h2 className="font-playfair text-2xl font-semibold text-white">
                        {loc.name}
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-6 mb-4 text-sm">
                    <span className="font-medium text-[#1E242B]">
                      🏠 {loc.count} Properties
                    </span>
                    <span className="font-medium text-[#1E242B]">
                      💰 {loc.avgPrice}
                    </span>
                  </div>
                  <p className="text-[#68717A] text-sm leading-relaxed mb-5">{loc.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {loc.highlights.map(h => (
                      <span
                        key={h}
                        className="text-[0.68rem] font-semibold text-[#A4855C] bg-[#C5A880]/10
                                   px-3 py-1 rounded-full"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/properties?locality=${loc.slug}`}
                    className="flex items-center gap-2 text-sm font-semibold text-[#A4855C]
                               hover:text-[#11161E] transition-colors"
                  >
                    View All Properties <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}

