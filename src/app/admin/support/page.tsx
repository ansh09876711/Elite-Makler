'use client'

import { useSearchParams } from 'next/navigation'
import { HelpCircle, MessageSquare, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react'

const MOCK_TICKETS = [
  { id: 'TCK-201', user: 'Harish Rawat', subject: 'Enquiry form not responding on mobile screen', priority: 'high', status: 'open', date: '2026-07-12' },
  { id: 'TCK-202', user: 'Roshni Shah', subject: 'Cannot load 3D floor plan brochures', priority: 'medium', status: 'open', date: '2026-07-11' },
  { id: 'TCK-203', user: 'Kunal Kapoor', subject: 'Agent commission payout query', priority: 'low', status: 'closed', date: '2026-07-09' },
]

export default function AdminSupportPage() {
  const searchParams = useSearchParams()
  const tabFilter = searchParams.get('tab') || 'tickets'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-3xl font-semibold text-white">Support & Help Desk</h1>
        <p className="text-white/40 text-sm mt-1">Review user issues, manage FAQ questions, and access live chat logs</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3">
        {[
          { label: 'Support Tickets', val: 'tickets' },
          { label: 'Live Chat Logs', val: 'chat' },
          { label: 'Manage FAQ', val: 'faq' },
        ].map(tab => (
          <a
            key={tab.val}
            href={tab.val === 'tickets' ? `/admin/support` : `/admin/support?tab=${tab.val}`}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              (tab.val === 'tickets' && tabFilter === 'tickets') || tabFilter === tab.val
                ? 'bg-[#C5A880] text-[#11161E]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {/* Support list */}
      <div className="space-y-4">
        {MOCK_TICKETS.map(t => (
          <div key={t.id} className="bg-[#11161E] border border-white/8 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-white/12 transition-all">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className={`text-[0.62rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  t.priority === 'high' ? 'bg-red-500/10 text-red-300' : t.priority === 'medium' ? 'bg-amber-500/10 text-amber-300' : 'bg-blue-500/10 text-blue-300'
                }`}>
                  {t.priority} priority
                </span>
                <span className="text-white/30 text-xs">ID: #{t.id}</span>
              </div>
              <h3 className="text-white font-semibold text-base">{t.subject}</h3>
              <p className="text-xs text-white/50">Requested by: <span className="text-white/80">{t.user}</span> · {new Date(t.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
            </div>

            <div className="flex items-center gap-5 border-t md:border-t-0 border-white/5 pt-3 md:pt-0 w-full md:w-auto justify-between">
              <span className={`inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider ${
                t.status === 'open' ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {t.status === 'open' ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                {t.status}
              </span>

              <button className="flex items-center gap-1 text-xs font-bold text-[#C5A880] hover:underline">
                Open Ticket <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
