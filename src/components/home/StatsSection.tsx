'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '@/context/LangContext'

const statsData = [
  { target: 150,  suffix: '+',    en: 'Premium Properties Listed',     hi: 'प्रीमियम प्रॉपर्टीज़' },
  { target: 1000, suffix: 'Cr+',  en: 'Transactions Completed',         hi: 'ट्रांज़ैक्शन पूर्ण' },
  { target: 99,   suffix: '%',    en: 'Client Satisfaction Rate',       hi: 'क्लाइंट संतुष्टि' },
  { target: 18,   suffix: '+',    en: 'Years of Industry Excellence',   hi: 'वर्षों का अनुभव' },
]

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref   = useRef<HTMLSpanElement>(null)
  const done  = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !done.current) {
        done.current = true
        const duration = 1800
        const inc      = target / (duration / 16)
        let current    = 0
        const tick = () => {
          current += inc
          if (current < target) { setCount(Math.floor(current)); requestAnimationFrame(tick) }
          else setCount(target)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.4 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref} className="font-playfair text-5xl font-bold text-[#11161E]">
      {count}
    </span>
  )
}

export default function StatsSection() {
  const { lang } = useLang()

  return (
    <section className="py-16 bg-[#FAF9F6]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statsData.map(stat => (
            <div key={stat.en}
              className="text-center p-8 bg-white rounded-md
                         shadow-[0_15px_35px_rgba(17,22,30,0.06)]
                         border-b-4 border-transparent hover:border-[#C5A880]
                         hover:-translate-y-1 transition-all duration-500"
            >
              <div className="flex items-end justify-center gap-0.5">
                <CountUp target={stat.target} suffix={stat.suffix} />
                <span className="font-playfair text-3xl font-semibold text-[#A4855C] mb-1">
                  {stat.suffix}
                </span>
              </div>
              <p className="text-sm text-[#68717A] mt-2 font-medium uppercase tracking-wide">
                {lang === 'en' ? stat.en : stat.hi}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
