'use client'

import { useEffect, useState } from 'react'
import { Building2, MessageSquare, Users, TrendingUp, Eye, Plus, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

interface Stats {
  properties: number
  enquiries:  number
  agents:     number
  views:      number
}

interface RecentEnquiry {
  id: string
  name: string
  phone: string
  intent: string
  created_at: string
}

export default function AdminDashboard() {
  const [stats,    setStats]    = useState<Stats>({ properties: 0, enquiries: 0, agents: 0, views: 0 })
  const [enquiries, setEnquiries] = useState<RecentEnquiry[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, eRes, aRes] = await Promise.all([
          fetch('/api/admin/stats?type=properties'),
          fetch('/api/admin/stats?type=enquiries'),
          fetch('/api/admin/stats?type=agents'),
        ])
        const [p, e, a] = await Promise.all([pRes.json(), eRes.json(), aRes.json()])
        setStats({ properties: p.count ?? 0, enquiries: e.count ?? 0, agents: a.count ?? 0, views: 1284 })
        setEnquiries(e.recent ?? [])
      } catch { /* ignore */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const cards = [
    { icon: Building2,    label: 'Total Properties', val: stats.properties, color: 'text-blue-400',   bg: 'bg-blue-400/10',   href: '/admin/properties' },
    { icon: MessageSquare,label: 'Enquiries',         val: stats.enquiries,  color: 'text-[#C5A880]', bg: 'bg-[#C5A880]/10',  href: '/admin/enquiries' },
    { icon: Users,        label: 'Agents',            val: stats.agents,     color: 'text-emerald-400',bg: 'bg-emerald-400/10',href: '/admin/agents' },
    { icon: Eye,          label: 'Site Views',        val: stats.views,      color: 'text-purple-400', bg: 'bg-purple-400/10', href: '/admin/analytics' },
  ]

  const intentColor: Record<string, string> = {
    buy:    'bg-blue-500/20 text-blue-300',
    sell:   'bg-emerald-500/20 text-emerald-300',
    rent:   'bg-amber-500/20 text-amber-300',
    invest: 'bg-purple-500/20 text-purple-300',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-3xl font-semibold text-white">Dashboard</h1>
          <p className="text-white/40 text-sm mt-1">Welcome back, Admin</p>
        </div>
        <Link href="/admin/properties?action=new"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#C5A880] text-[#11161E]
                     font-semibold text-sm rounded-lg hover:bg-[#A4855C] transition-all">
          <Plus className="w-4 h-4" /> Add Property
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {cards.map(card => (
          <Link key={card.label} href={card.href}
            className="bg-[#11161E] rounded-xl p-5 border border-white/8
                       hover:border-[#C5A880]/30 transition-all group">
            <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            {loading ? (
              <div className="h-8 w-16 bg-white/10 rounded animate-pulse mb-1" />
            ) : (
              <p className="font-playfair text-3xl font-bold text-white">{card.val.toLocaleString()}</p>
            )}
            <p className="text-white/45 text-xs mt-1">{card.label}</p>
            <div className="flex items-center gap-1 mt-2 text-[0.65rem] text-[#C5A880] opacity-0 group-hover:opacity-100 transition-opacity">
              View all <ArrowUpRight className="w-2.5 h-2.5" />
            </div>
          </Link>
        ))}
      </div>

      {/* Two col grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Recent Enquiries */}
        <div className="bg-[#11161E] rounded-xl border border-white/8 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
            <h2 className="text-white font-semibold text-sm">Recent Enquiries</h2>
            <Link href="/admin/enquiries" className="text-[#C5A880] text-xs hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-white/5">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="px-6 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-white/10 rounded w-32 animate-pulse" />
                    <div className="h-2.5 bg-white/5 rounded w-20 animate-pulse" />
                  </div>
                </div>
              ))
            ) : enquiries.length > 0 ? enquiries.slice(0, 5).map(enq => (
              <div key={enq.id} className="px-6 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#C5A880]/15 flex items-center justify-center
                                text-[#C5A880] font-bold text-xs flex-shrink-0">
                  {enq.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{enq.name}</p>
                  <p className="text-white/40 text-xs">{enq.phone}</p>
                </div>
                <span className={`text-[0.6rem] font-bold uppercase px-2 py-0.5 rounded-full ${intentColor[enq.intent] ?? 'bg-white/10 text-white/50'}`}>
                  {enq.intent}
                </span>
              </div>
            )) : (
              <div className="px-6 py-8 text-center text-white/30 text-sm">No enquiries yet</div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#11161E] rounded-xl border border-white/8 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/8">
            <h2 className="text-white font-semibold text-sm">Quick Actions</h2>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            {[
              { label: 'Add Property',    icon: '🏠', href: '/admin/properties' },
              { label: 'View Enquiries',  icon: '📬', href: '/admin/enquiries' },
              { label: 'Manage Agents',   icon: '👥', href: '/admin/agents' },
              { label: 'View Analytics',  icon: '📊', href: '/admin/analytics' },
              { label: 'Upload Images',   icon: '🖼️',  href: '/admin/properties' },
              { label: 'View Live Site',  icon: '🌐', href: '/' },
            ].map(action => (
              <Link key={action.label} href={action.href}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/4
                           hover:bg-white/8 border border-white/6 hover:border-[#C5A880]/30
                           transition-all text-sm text-white/70 hover:text-white">
                <span className="text-xl">{action.icon}</span>
                <span className="text-xs font-medium leading-tight">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Price Trends */}
      <div className="bg-[#11161E] rounded-xl border border-white/8 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-semibold text-sm">Indore Market — Price Trends (2025-26)</h2>
          <TrendingUp className="w-4 h-4 text-[#C5A880]" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { loc: 'Vijay Nagar', price: '₹8,500/sqft', yoy: '+14.2%' },
            { loc: 'Bypass Road', price: '₹5,200/sqft', yoy: '+9.8%' },
            { loc: 'Palasia',     price: '₹9,800/sqft', yoy: '+18.5%' },
            { loc: 'Nipania',     price: '₹7,100/sqft', yoy: '+11.3%' },
          ].map(t => (
            <div key={t.loc} className="bg-white/4 rounded-lg p-4 border border-white/6">
              <p className="text-white/50 text-xs mb-2">{t.loc}</p>
              <p className="font-playfair text-lg font-bold text-[#C5A880]">{t.price}</p>
              <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full mt-2">
                {t.yoy} YoY
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
