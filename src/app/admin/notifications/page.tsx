'use client'

import { useSearchParams } from 'next/navigation'
import { Bell, Mail, MessageSquare, Send, CheckCircle } from 'lucide-react'

const MOCK_NOTIFS = [
  { id: '1', title: 'Monsoon Discount Live Notification', channel: 'push', audience: 'All App Users', date: '2026-07-12', status: 'sent' },
  { id: '2', title: 'Welcome Onboarding Email Campaign', channel: 'email', audience: 'New Registered Buyers', date: '2026-07-10', status: 'active' },
  { id: '3', title: 'Lead Call Back Alert Notification', channel: 'sms', audience: 'Indore Agents Group', date: '2026-07-08', status: 'sent' },
]

export default function AdminNotificationsPage() {
  const searchParams = useSearchParams()
  const tabFilter = searchParams.get('tab') || 'send'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-semibold text-white">Notification Center</h1>
          <p className="text-white/40 text-sm mt-1">Broadcast push notifications, SMS campaigns and custom email templates</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3">
        {[
          { label: 'Broadcast Sender', val: 'send' },
          { label: 'Email/SMS Templates', val: 'templates' },
          { label: 'History Logs', val: 'history' },
        ].map(tab => (
          <a
            key={tab.val}
            href={tab.val === 'send' ? `/admin/notifications` : `/admin/notifications?tab=${tab.val}`}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              (tab.val === 'send' && tabFilter === 'send') || tabFilter === tab.val
                ? 'bg-[#C5A880] text-[#11161E]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {/* Main Broadcast Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Broadcast Form (2 Cols) */}
        <div className="lg:col-span-2 bg-[#11161E] border border-white/8 rounded-xl p-5 space-y-4">
          <h3 className="text-white font-semibold text-base">Send Instant Alert</h3>
          <div className="space-y-3">
            <div>
              <label className="text-white/40 text-xs uppercase tracking-wider font-bold">Audience Target</label>
              <select className="w-full mt-1.5 bg-[#0d1219] border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#C5A880]">
                <option>All Registered Users</option>
                <option>Active Agents Only</option>
                <option>Premium Buyers Group</option>
              </select>
            </div>
            <div>
              <label className="text-white/40 text-xs uppercase tracking-wider font-bold">Channel</label>
              <select className="w-full mt-1.5 bg-[#0d1219] border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#C5A880]">
                <option>App Push Notification 🔔</option>
                <option>Transactional Email ✉️</option>
                <option>Alert SMS Text 📱</option>
              </select>
            </div>
            <div>
              <label className="text-white/40 text-xs uppercase tracking-wider font-bold">Alert Message Text</label>
              <textarea
                placeholder="Type your notification message content here..."
                rows={4}
                className="w-full mt-1.5 bg-[#0d1219] border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#C5A880] placeholder-white/20"
              />
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#C5A880] hover:bg-[#A4855C] text-[#11161E] font-bold text-sm rounded-lg transition-all shadow-md">
            <Send className="w-4 h-4" /> Broadcast Notification Now
          </button>
        </div>

        {/* History panel (1 Col) */}
        <div className="lg:col-span-1 bg-[#11161E] border border-white/8 rounded-xl p-5 h-fit space-y-4">
          <h3 className="text-white font-semibold text-sm border-b border-white/5 pb-2">Recent Logs</h3>
          <div className="space-y-3">
            {MOCK_NOTIFS.map(n => (
              <div key={n.id} className="space-y-1">
                <p className="text-white font-medium text-xs truncate">{n.title}</p>
                <div className="flex items-center justify-between text-[0.65rem] text-white/35">
                  <span className="capitalize">{n.channel} · {n.audience}</span>
                  <span className="text-emerald-400 font-bold">{n.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
