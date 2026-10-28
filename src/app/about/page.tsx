import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { Trophy, Medal, Star, Users } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Legacy | ELITE MAKLER Indore',
  description: 'Two decades of pioneering luxury real estate in Indore.',
}

const agents = [
  { name: 'Rajesh Singhal',      role: 'Senior Estate Advisor',    spec: 'Bypass Road & Off-Market',    deals: 42, val: '₹180 Cr+', badge: '⭐ Top 2025' },
  { name: 'Amitesh Shrivastava', role: 'Luxury Penthouse Advisor', spec: 'Ultra-Premium Vertical Living', deals: 29, val: '₹240 Cr+', badge: '🏆 HNI Specialist' },
  { name: 'Divya Sharma',        role: 'Heritage Property Expert', spec: 'Palasia & Saket Mansions',     deals: 35, val: '₹310 Cr+', badge: '💎 Elite Closer' },
  { name: 'Vikram Malhotra',     role: 'Commercial Advisor',       spec: 'Office Spaces & Retail Plots', deals: 51, val: '₹420 Cr+', badge: '📈 Investment Expert' },
]

const awards = [
  { icon: Trophy, title: 'Best Luxury Broker',  body: 'Indore Real Estate Awards 2024', year: '2024' },
  { icon: Medal,  title: 'Top HNI Firm',        body: 'Economic Times Awards MP',        year: '2023' },
  { icon: Star,   title: 'Excellence in Service', body: 'CREDAI Madhya Pradesh Chapter', year: '2023' },
  { icon: Users,  title: 'Featured In',         body: 'Times of India · Business Standard · Dainik Bhaskar', year: 'Press' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="h-52 bg-[#11161E] flex items-end pb-12 pt-20">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <p className="text-[0.72rem] font-bold tracking-[3px] uppercase text-[#C5A880] mb-2">
            THE ELITE MAKLER WAY
          </p>
          <h1 className="font-playfair text-4xl font-bold text-white">Our Legacy</h1>
        </div>
      </div>

      <main className="flex-1 bg-[#FAF9F6]">
        {/* Story */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="block text-[0.72rem] font-bold tracking-[3px] uppercase text-[#A4855C] mb-3">
                  EST. 2007
                </span>
                <h2 className="font-playfair text-4xl font-semibold text-[#11161E] leading-tight mb-5">
                  Pioneering Luxury Real Estate In Indore For Over Two Decades
                </h2>
                <p className="text-[#68717A] leading-relaxed mb-4">
                  At ELITE MAKLER, we understand that finding a home is not just about coordinates;
                  it is about matching an architectural legacy to your personal ambition.
                </p>
                <p className="text-[#68717A] leading-relaxed">
                  Founded in 2007, ELITE MAKLER has curated and closed over ₹1,000 Crore in landmark
                  property transactions across Indore — establishing ourselves as the city's most
                  trusted name in ultra-luxury real estate.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-gradient-to-br
                                from-[#2d3a4a] to-[#1a2535]" />
                <div className="absolute bottom-8 left-8 bg-[#11161E] text-white p-5 rounded
                                border-l-4 border-[#C5A880]">
                  <span className="font-playfair text-4xl font-bold text-[#C5A880] block leading-none">18+</span>
                  <span className="text-xs uppercase tracking-widest text-white/60 mt-1 block">
                    Years of Trust
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Agents */}
        <section className="py-20 bg-[#F4F2EF]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="block text-[0.72rem] font-bold tracking-[3px] uppercase text-[#A4855C] mb-3">
                THE PEOPLE BEHIND THE DEALS
              </span>
              <h2 className="font-playfair text-4xl font-semibold text-[#11161E]">
                Meet Our Senior Agents
              </h2>
              <div className="w-16 h-1 bg-[#C5A880] mx-auto mt-5" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {agents.map(agent => (
                <div
                  key={agent.name}
                  className="bg-white rounded-lg overflow-hidden shadow-[0_4px_20px_rgba(17,22,30,0.06)]
                             text-center hover:-translate-y-1.5 transition-all duration-500
                             hover:shadow-[0_20px_40px_rgba(17,22,30,0.1)]"
                >
                  <div className="bg-gradient-to-br from-[#11161E] to-[#1e2a38] py-8 px-4 relative">
                    <div className="w-16 h-16 rounded-full border-2 border-[#C5A880] bg-[#C5A880]/10
                                    flex items-center justify-center text-[#C5A880] text-2xl
                                    mx-auto mb-1">
                      👤
                    </div>
                    <span className="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2
                                     bg-[#C5A880] text-[#11161E] text-[0.6rem] font-bold px-3 py-1
                                     rounded-full whitespace-nowrap">
                      {agent.badge}
                    </span>
                  </div>
                  <div className="p-5 mt-3">
                    <h3 className="font-playfair font-semibold text-[#11161E] text-base mb-0.5">
                      {agent.name}
                    </h3>
                    <p className="text-[0.68rem] font-bold uppercase tracking-widest text-[#A4855C] mb-3">
                      {agent.role}
                    </p>
                    <p className="text-xs text-[#68717A] mb-4">{agent.spec}</p>
                    <div className="flex justify-center gap-6 py-3 border-y border-[#EAE6E1] mb-4">
                      <div>
                        <p className="text-base font-bold text-[#11161E]">{agent.deals}</p>
                        <p className="text-[0.6rem] text-[#68717A] uppercase">Deals</p>
                      </div>
                      <div>
                        <p className="text-base font-bold text-[#11161E]">{agent.val}</p>
                        <p className="text-[0.6rem] text-[#68717A] uppercase">Value</p>
                      </div>
                    </div>
                    <a
                      href="/contact"
                      className="block w-full py-2 border border-[#C5A880] text-[#C5A880] text-xs
                                 font-semibold rounded hover:bg-[#C5A880] hover:text-[#11161E]
                                 transition-all"
                    >
                      Connect
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Awards */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="block text-[0.72rem] font-bold tracking-[3px] uppercase text-[#A4855C] mb-3">
                RECOGNITION & TRUST
              </span>
              <h2 className="font-playfair text-4xl font-semibold text-[#11161E]">
                Awards & Press Coverage
              </h2>
              <div className="w-16 h-1 bg-[#C5A880] mx-auto mt-5" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {awards.map(award => (
                <div
                  key={award.title}
                  className="text-center p-8 bg-white rounded-lg shadow-[0_4px_20px_rgba(17,22,30,0.06)]
                             border-b-4 border-transparent hover:border-[#C5A880]
                             hover:-translate-y-1 transition-all duration-300"
                >
                  <award.icon className="w-9 h-9 text-[#C5A880] mx-auto mb-4" />
                  <h4 className="font-playfair font-semibold text-[#11161E] mb-2">{award.title}</h4>
                  <p className="text-xs text-[#68717A] mb-3">{award.body}</p>
                  <span className="inline-block text-[0.65rem] font-bold uppercase tracking-widest
                                   text-[#A4855C] bg-[#C5A880]/10 px-3 py-1 rounded-full">
                    {award.year}
                  </span>
                </div>
              ))}
            </div>

            {/* Press logos */}
            <div className="text-center">
              <p className="text-[0.72rem] font-bold uppercase tracking-[3px] text-[#68717A] mb-5">
                AS SEEN IN
              </p>
              <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
                {['Times of India','Business Standard','Dainik Bhaskar','Nai Duniya','99acres','Housing.com'].map(press => (
                  <span
                    key={press}
                    className="font-playfair text-base font-semibold text-[#68717A]/50
                               hover:text-[#11161E] transition-colors cursor-default"
                  >
                    {press}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}

