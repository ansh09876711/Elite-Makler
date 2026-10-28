'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import {
  Phone, Mail, MessageSquare, Calendar, Building2,
  Trash2, Loader2, CheckCircle2, Search, Download, X
} from 'lucide-react'

interface Enquiry {
  id: string; name: string; email: string | null; phone: string
  intent: string; message: string | null; created_at: string
  property_id: string | null
}

const intentColor: Record<string, string> = {
  buy:    'bg-blue-500/20 text-blue-300 border-blue-500/20',
  sell:   'bg-emerald-500/20 text-emerald-300 border-emerald-500/20',
  rent:   'bg-amber-500/20 text-amber-300 border-amber-500/20',
  invest: 'bg-purple-500/20 text-purple-300 border-purple-500/20',
}

export default function EnquiriesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const typeParam = searchParams.get('type')
  const intentParam = searchParams.get('intent') || searchParams.get('filter')
  const filter = intentParam || (
    typeParam === 'contact' ? 'invest' :
    typeParam === 'callback' ? 'buy' :
    typeParam === 'visit' ? 'sell' :
    typeParam === 'appointment' ? 'rent' :
    typeParam || 'all'
  )

  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [deleting,  setDeleting]  = useState<string | null>(null)
  const [toast,     setToast]     = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/enquiries')
      const d   = await res.json()
      setEnquiries(d.enquiries ?? [])
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this enquiry?')) return
    setDeleting(id)
    const res = await fetch('/api/admin/enquiries', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setDeleting(null)
    if (res.ok) { showToast('Enquiry deleted'); load() }
    else showToast('Error deleting')
  }

  const exportCSV = () => {
    const rows = [['Name','Email','Phone','Intent','Message','Date'],
      ...filtered.map(e => [e.name, e.email ?? '', e.phone, e.intent, e.message ?? '', new Date(e.created_at).toLocaleDateString()])]
    const csv  = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const link = document.createElement('a')
    link.href  = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    link.download = 'enquiries.csv'
    link.click()
  }

  const filtered = enquiries
    .filter(e => filter === 'all' || e.intent === filter)
    .filter(e =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.phone.includes(search) ||
      (e.email ?? '').toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#11161E] border border-[#C5A880]/40 text-white px-5 py-3 rounded-xl shadow-xl">
          <CheckCircle2 className="w-4 h-4 text-[#C5A880]" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-semibold text-white">Enquiries</h1>
          <p className="text-white/40 text-sm mt-1">{enquiries.length} total · {filtered.length} shown</p>
        </div>
        <button onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/8 text-white/70
                     hover:text-white rounded-lg text-sm font-medium transition-all border border-white/10 hover:border-white/20">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>
      {/* Search & Tabs */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, phone or email..."
            className="w-full bg-[#11161E] border border-white/10 text-white pl-10 pr-4 py-3
                       rounded-xl text-sm placeholder:text-white/25 focus:outline-none
                       focus:border-[#C5A880] transition-colors" />
        </div>

        {/* Excel-style tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-white/5 pb-2 overflow-x-auto scrollbar-none">
          {[
            { label: 'All Enquiries', value: '' },
            { label: 'Buy', value: 'buy' },
            { label: 'Sell', value: 'sell' },
            { label: 'Rent', value: 'rent' },
            { label: 'Invest', value: 'invest' },
          ].map(t => (
            <button key={t.value}
              onClick={() => {
                if (t.value === '') router.push(pathname)
                else router.push(`${pathname}?filter=${t.value}`)
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                (filter === 'all' ? '' : filter) === t.value
                  ? 'bg-[#C5A880] text-[#11161E] font-bold'
                  : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table view */}
      <div className="bg-[#11161E] rounded-xl border border-white/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/8">
                {['Client Details', 'Intent', 'Message / Enquiry', 'Linked Property', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-4 text-[0.68rem] font-bold uppercase tracking-widest text-white/35">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? [...Array(4)].map((_, i) => (
                <tr key={i}>
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 bg-white/6 rounded animate-pulse w-24" />
                    </td>
                  ))}
                </tr>
              )) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-white/30 text-sm">
                    <MessageSquare className="w-10 h-10 text-white/15 mx-auto mb-3" />
                    No enquiries found.
                  </td>
                </tr>
              ) : (
                filtered.map(enq => (
                  <tr key={enq.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-white text-sm font-semibold">{enq.name}</p>
                      <p className="text-white/40 text-xs mt-0.5">{enq.phone} {enq.email ? `· ${enq.email}` : ''}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[0.58rem] font-bold uppercase px-2.5 py-1 rounded-full border ${intentColor[enq.intent] ?? 'bg-white/10 text-white/50 border-white/10'}`}>
                        {enq.intent}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-white/70 text-xs max-w-xs truncate leading-relaxed" title={enq.message ?? ''}>
                      {enq.message || '-'}
                    </td>
                    <td className="px-5 py-4 text-white/50 text-xs">
                      {enq.property_id ? (
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-[#C5A880]" /> Linked
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-5 py-4 text-white/50 text-xs whitespace-nowrap">
                      {new Date(enq.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <a href={`tel:${enq.phone}`}
                          className="w-8 h-8 rounded-lg bg-[#C5A880]/15 flex items-center justify-center text-[#C5A880] hover:bg-[#C5A880]/25 transition-all" title="Call">
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a href={`https://wa.me/91${enq.phone.replace(/\D/g,'')}`} target="_blank"
                          className="w-8 h-8 rounded-lg bg-[#25D366]/15 flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/25 transition-all" title="WhatsApp">
                          <span className="text-[0.7rem] font-bold">WA</span>
                        </a>
                        <button onClick={() => handleDelete(enq.id)}
                          disabled={deleting === enq.id}
                          className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center text-red-400 hover:bg-red-500/25 transition-all disabled:opacity-40" title="Delete">
                          {deleting === enq.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
