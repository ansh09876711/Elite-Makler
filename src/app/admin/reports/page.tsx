'use client'

import { useSearchParams } from 'next/navigation'
import { FileSpreadsheet, Download, FileText, CheckCircle, TrendingUp } from 'lucide-react'

const MOCK_REPORTS = [
  { id: 'RPT-001', name: 'Q2 Property Sales Summary', type: 'sales', size: '1.2 MB', date: '2026-07-01', format: 'PDF' },
  { id: 'RPT-002', name: 'Elite Agent Performance Audits', type: 'agent', size: '850 KB', date: '2026-06-28', format: 'EXCEL' },
  { id: 'RPT-003', name: 'Property Listings Audit & Locality Spread', type: 'property', size: '2.4 MB', date: '2026-06-25', format: 'PDF' },
]

export default function AdminReportsPage() {
  const searchParams = useSearchParams()
  const tabFilter = searchParams.get('tab') || 'sales'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-semibold text-white">System Reports</h1>
          <p className="text-white/40 text-sm mt-1">Export spreadsheet ledger details, property catalogs, and agent stats</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3">
        {[
          { label: 'Sales Reports', val: 'sales' },
          { label: 'User Reports', val: 'users' },
          { label: 'Property Audits', val: 'properties' },
        ].map(tab => (
          <a
            key={tab.val}
            href={`/admin/reports?tab=${tab.val}`}
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

      {/* Actions */}
      <div className="bg-[#11161E] rounded-xl border border-white/8 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-white font-semibold text-base">Generate Custom Report</h3>
          <p className="text-white/40 text-xs mt-0.5">Filter data fields and select desired export format</p>
        </div>
        <div className="flex gap-2.5 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs rounded-lg transition-all">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export Excel
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[#C5A880] text-[#11161E] font-bold text-xs rounded-lg hover:bg-[#A4855C] transition-all">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* Reports history */}
      <div className="bg-[#11161E] rounded-xl border border-white/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/8">
                {['Report Name', 'Type', 'Format', 'File Size', 'Generation Date', 'Action'].map(h => (
                  <th key={h} className="px-5 py-4 text-[0.68rem] font-bold uppercase tracking-widest text-white/35">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_REPORTS.map(r => (
                <tr key={r.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-white text-sm font-semibold">{r.name}</p>
                    <p className="text-white/40 text-xs mt-0.5">Report ID: {r.id}</p>
                  </td>
                  <td className="px-5 py-4 text-white/60 text-xs uppercase tracking-wider">
                    {r.type}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[0.62rem] font-bold tracking-widest px-2 py-0.5 rounded ${
                      r.format === 'EXCEL' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'
                    }`}>
                      {r.format}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-white/60 text-sm">
                    {r.size}
                  </td>
                  <td className="px-5 py-4 text-white/50 text-sm">
                    {new Date(r.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-5 py-4 text-xs font-bold text-[#C5A880]">
                    <button className="flex items-center gap-1 hover:underline">
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
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
