'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { CheckCircle2, TrendingUp, IndianRupee, Calculator, Clock } from 'lucide-react'
import { useLang } from '@/context/LangContext'
import { t } from '@/lib/translations'

function fmtINR(v: number) { return '₹' + Math.round(v).toLocaleString('en-IN') }
function fmtCr(v: number) {
  if (v >= 10_000_000) return '₹' + (v / 10_000_000).toFixed(2) + ' Cr'
  if (v >= 100_000)    return '₹' + (v / 100_000).toFixed(1) + ' L'
  return fmtINR(v)
}

interface SliderProps {
  label: string; value: number; min: number; max: number
  step: number; display: string; onChange: (v: number) => void; percent: number
}
function Slider({ label, value, min, max, step, display, onChange, percent }: SliderProps) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[0.62rem] font-bold uppercase tracking-[2px] text-[#68717A]">{label}</span>
        <span className="text-xs font-bold text-[#11161E] bg-[#F4F2EF] px-2.5 py-0.5 rounded-full min-w-[64px] text-center">{display}</span>
      </div>
      <div className="relative h-5 flex items-center">
        <div className="absolute w-full h-1 bg-[#EAE6E1] rounded-full" />
        <div className="absolute h-1 bg-gradient-to-r from-[#A4855C] to-[#C5A880] rounded-full pointer-events-none transition-all duration-100" style={{ width: `${percent}%` }} />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="relative w-full h-1 appearance-none bg-transparent cursor-pointer z-10
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5
                     [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2
                     [&::-webkit-slider-thumb]:border-[#A4855C]
                     [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(164,133,92,0.4)]
                     [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110
                     [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
                     [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white
                     [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#A4855C] [&::-moz-range-thumb]:border-solid" />
      </div>
    </div>
  )
}

export default function EmiCalculator() {
  const { lang } = useLang()
  const tr = t[lang]

  const [price,  setPrice]  = useState(50_000_000)
  const [dp,     setDp]     = useState(20)
  const [rate,   setRate]   = useState(8.5)
  const [tenure, setTenure] = useState(20)

  const results = useMemo(() => {
    const P   = price * (1 - dp / 100)
    const r   = rate / 12 / 100
    const n   = tenure * 12
    const emi = r > 0 && n > 0 ? (P * r * Math.pow(1+r,n)) / (Math.pow(1+r,n) - 1) : 0
    return { P, emi, total: emi * n, interest: emi * n - P }
  }, [price, dp, rate, tenure])

  const pricePct  = ((price  - 1_000_000)  / (500_000_000 - 1_000_000)) * 100
  const dpPct     = ((dp     - 10)         / 70)                          * 100
  const ratePct   = ((rate   - 5)          / 10)                          * 100
  const tenurePct = ((tenure - 1)          / 29)                          * 100

  const features = lang === 'en'
    ? ['Instant EMI calculation','Adjust tenure & interest rate','See total interest payable','Based on current SBI / HDFC rates']
    : ['तुरंत EMI गणना','अवधि और ब्याज दर बदलें','कुल ब्याज देखें','वर्तमान SBI / HDFC दरों पर आधारित']

  return (
    <section className="py-16 bg-[#F4F2EF] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
           style={{ backgroundImage: 'radial-gradient(#A4855C 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <span className="block text-[0.7rem] font-bold tracking-[3px] uppercase text-[#A4855C] mb-4">
              {tr.financialPlanning}
            </span>
            <h2 className="font-playfair text-5xl font-semibold text-[#11161E] leading-tight mb-5">
              {lang === 'en' ? <>Home Loan<br /><span className="text-[#A4855C]">EMI Calculator</span></> : <>{tr.emiCalculator}</>}
            </h2>
            <p className="text-[#68717A] leading-relaxed mb-8 text-[0.95rem]">
              {lang === 'en'
                ? 'Plan your luxury property investment with our easy estimator. Get an instant monthly breakdown before making a decision.'
                : 'हमारे आसान EMI कैलकुलेटर से अपने लग्ज़री प्रॉपर्टी निवेश की योजना बनाएं।'}
            </p>
            <ul className="space-y-3.5 mb-10">
              {features.map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-[#1E242B] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#A4855C] flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: IndianRupee, en: 'Min Down Payment', hi: 'न्यूनतम डाउन पेमेंट', val: '10%' },
                { icon: TrendingUp,  en: 'Best Rate',        hi: 'सर्वोत्तम ब्याज दर',   val: '8.35% p.a.' },
                { icon: Clock,       en: 'Max Tenure',       hi: 'अधिकतम अवधि',           val: '30 Years' },
                { icon: Calculator,  en: 'Pre-approval',     hi: 'प्री-अप्रूवल',           val: 'Same Day' },
              ].map(item => (
                <div key={item.en} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-[#EAE6E1] hover:border-[#C5A880] transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-[#C5A880]/10 flex items-center justify-center text-[#A4855C] flex-shrink-0">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[0.6rem] text-[#68717A] uppercase tracking-wide">{lang === 'en' ? item.en : item.hi}</p>
                    <p className="text-sm font-semibold text-[#11161E]">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calculator */}
          <div className="bg-white rounded-2xl shadow-[0_12px_40px_rgba(17,22,30,0.09)] border border-[#EAE6E1] overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-[#F4F2EF]">
              <h3 className="font-playfair text-xl font-semibold text-[#11161E]">{tr.calculateEmi}</h3>
              <p className="text-[#68717A] text-[0.72rem] mt-0.5">
                {lang === 'en' ? 'Move sliders for instant results' : 'तुरंत परिणाम के लिए स्लाइडर हिलाएं'}
              </p>
            </div>
            <div className="px-6 py-5">
              <Slider label={tr.propertyPrice}  value={price}  min={1_000_000} max={500_000_000} step={500_000} display={fmtCr(price)}               percent={pricePct}  onChange={setPrice} />
              <Slider label={`${tr.downPayment} (${dp}%)`} value={dp} min={10} max={80} step={1} display={`${dp}%`} percent={dpPct} onChange={setDp} />
              <Slider label={tr.interestRate}   value={rate}   min={5}         max={15}           step={0.1}     display={`${rate.toFixed(1)}%`}       percent={ratePct}   onChange={setRate} />
              <Slider label={tr.loanTenure}     value={tenure} min={1}         max={30}           step={1}       display={`${tenure} ${lang==='en'?'Yrs':'वर्ष'}`} percent={tenurePct} onChange={setTenure} />
              <div className="bg-[#11161E] rounded-xl p-4 mb-4">
                <div className="text-center pb-3 mb-3 border-b border-white/10">
                  <p className="text-[0.58rem] text-white/40 uppercase tracking-[2px] mb-1">{tr.monthlyEmi}</p>
                  <p className="font-playfair text-2xl font-bold text-[#C5A880]">
                    {fmtINR(results.emi)}<span className="text-xs font-normal text-white/30 ml-1">/{lang==='en'?'mo':'माह'}</span>
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { key: 'loanAmount' as const,    val: fmtCr(results.P) },
                    { key: 'totalInterest' as const, val: fmtCr(results.interest) },
                    { key: 'totalPayable' as const,  val: fmtCr(results.total) },
                  ].map(m => (
                    <div key={m.key} className="bg-white/5 rounded-lg p-2">
                      <p className="text-[0.5rem] text-white/35 uppercase tracking-wide mb-0.5">{tr[m.key]}</p>
                      <p className="text-xs font-semibold text-white">{m.val}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Link href="/contact"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#C5A880]
                           text-[#11161E] font-semibold text-sm rounded-lg hover:bg-[#A4855C]
                           hover:text-white transition-all duration-300 hover:-translate-y-0.5">
                {tr.applyHomeLoan} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
