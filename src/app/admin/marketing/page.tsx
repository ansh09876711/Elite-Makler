'use client'

import { useSearchParams } from 'next/navigation'
import { Megaphone, Plus, Percent, Mail, Bell, Settings } from 'lucide-react'

const MOCK_CAMPAIGNS = [
  { id: '1', title: 'Monsoon Premier Villa Launch', channel: 'email', sent: 1200, opened: 820, status: 'completed' },
  { id: '2', title: 'New Launch - Nipania BHK3 discounts', channel: 'sms', sent: 500, opened: 450, status: 'completed' },
  { id: '3', title: 'Sukhliya Plots Festival Coupon', channel: 'coupon', code: 'EMFEST10', discount: '10% off service fee', status: 'active' },
]

export default function AdminMarketingPage() {
  const searchParams = useSearchParams()
  const tabFilter = searchParams.get('tab') || 'banners'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-semibold text-white">Marketing Campaigns</h1>
          <p className="text-white/40 text-sm mt-1">Manage marketing banners, popup campaigns, coupons, and newsletters</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#C5A880] text-[#11161E] font-semibold text-sm rounded-lg hover:bg-[#A4855C] transition-all">
          <Plus className="w-4 h-4" /> Create Campaign
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3">
        {[
          { label: 'Banners & Popups', val: 'banners' },
          { label: 'Coupons', val: 'coupons' },
          { label: 'Campaign History', val: 'history' },
        ].map(tab => (
          <a
            key={tab.val}
            href={tab.val === 'banners' ? `/admin/marketing` : `/admin/marketing?tab=${tab.val}`}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              (tab.val === 'banners' && tabFilter === 'banners') || tabFilter === tab.val
                ? 'bg-[#C5A880] text-[#11161E]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {/* Campaign List */}
      <div className="space-y-4">
        {MOCK_CAMPAIGNS.map(c => (
          <div key={c.id} className="bg-[#11161E] border border-white/8 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-white/12 transition-all">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className={`text-[0.62rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  c.channel === 'coupon' ? 'bg-amber-500/10 text-amber-300' : 'bg-blue-500/10 text-blue-300'
                }`}>
                  {c.channel === 'coupon' ? 'Coupon code' : c.channel}
                </span>
                <span className="text-white/30 text-xs">ID: #{c.id}</span>
              </div>
              <h3 className="text-white font-semibold text-base">{c.title}</h3>
              {c.code && (
                <p className="text-xs text-white/50">Promo Code: <code className="bg-white/5 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">{c.code}</code> ({c.discount})</p>
              )}
            </div>

            <div className="flex items-center gap-6 border-t md:border-t-0 border-white/5 pt-3 md:pt-0 w-full md:w-auto justify-between">
              {c.sent && (
                <div className="text-right">
                  <p className="text-white text-xs">Sent: <span className="font-semibold">{c.sent.toLocaleString()}</span></p>
                  <p className="text-white/50 text-[0.65rem] mt-0.5">Open Rate: <span className="text-emerald-400 font-bold">{Math.round((c.opened / c.sent) * 100)}%</span></p>
                </div>
              )}
              
              <span className={`text-[0.65rem] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
                c.status === 'active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-white/5 border-white/8 text-white/40'
              }`}>
                {c.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
