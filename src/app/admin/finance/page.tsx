'use client'

import { useSearchParams } from 'next/navigation'
import { Wallet, IndianRupee, FileText, ArrowUpRight, TrendingUp, CheckCircle } from 'lucide-react'

const MOCK_FINANCE = [
  { id: 'TXN-1092', property: 'Palasia Legacy Mansion', type: 'commission', amount: 150000, date: '2026-07-10', status: 'completed' },
  { id: 'TXN-1091', property: 'Bypass Forest Retreat', type: 'sale', amount: 4500000, date: '2026-07-08', status: 'completed' },
  { id: 'TXN-1090', property: 'Nipania Sky Penthouse', type: 'rent', amount: 45000, date: '2026-07-05', status: 'pending' },
]

export default function AdminFinancePage() {
  const searchParams = useSearchParams()
  const tabFilter = searchParams.get('tab') || 'transactions'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-3xl font-semibold text-white">Finance & Billing</h1>
        <p className="text-white/40 text-sm mt-1">Track payments, commission splits, invoices and revenue</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3">
        {[
          { label: 'Transactions', val: 'transactions' },
          { label: 'Payments & Revenue', val: 'payments' },
          { label: 'Invoices', val: 'invoices' },
        ].map(tab => (
          <a
            key={tab.val}
            href={`/admin/finance?tab=${tab.val}`}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              tabFilter === tab.val
                ? 'bg-[#C5A880] text-[#11161E]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#11161E] border border-white/8 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Total Sales Revenue</p>
            <h3 className="text-white text-2xl font-bold mt-1.5 flex items-center"><IndianRupee className="w-5 h-5 text-[#C5A880]" /> 45,00,000</h3>
          </div>
          <div className="p-3 rounded-lg bg-white/5 text-emerald-400"><TrendingUp className="w-5 h-5" /></div>
        </div>

        <div className="bg-[#11161E] border border-white/8 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Brokerage/Commission</p>
            <h3 className="text-white text-2xl font-bold mt-1.5 flex items-center"><IndianRupee className="w-5 h-5 text-[#C5A880]" /> 1,50,000</h3>
          </div>
          <div className="p-3 rounded-lg bg-white/5 text-[#C5A880]"><Wallet className="w-5 h-5" /></div>
        </div>

        <div className="bg-[#11161E] border border-white/8 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Pending Dues</p>
            <h3 className="text-white text-2xl font-bold mt-1.5 flex items-center"><IndianRupee className="w-5 h-5 text-[#C5A880]" /> 45,000</h3>
          </div>
          <div className="p-3 rounded-lg bg-white/5 text-amber-400"><ClockIcon className="w-5 h-5" /></div>
        </div>
      </div>

      {/* Main Table view */}
      <div className="bg-[#11161E] rounded-xl border border-white/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/8">
                {['Transaction ID', 'Property Details', 'Type', 'Amount', 'Date', 'Status'].map(h => (
                  <th key={h} className="px-5 py-4 text-[0.68rem] font-bold uppercase tracking-widest text-white/35">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_FINANCE.map(t => (
                <tr key={t.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-5 py-4 text-white text-sm font-semibold">{t.id}</td>
                  <td className="px-5 py-4 text-white/70 text-sm">{t.property}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      t.type === 'sale' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-blue-500/10 text-blue-300'
                    }`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-white text-sm font-bold">
                    ₹{t.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-4 text-white/50 text-sm">
                    {new Date(t.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${
                      t.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {t.status === 'completed' ? <CheckCircle className="w-3.5 h-3.5" /> : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ClockIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
