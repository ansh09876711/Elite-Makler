'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Plus, Edit, Trash2, Loader2, CheckCircle2, X, Save, Users, Phone, Download, Search } from 'lucide-react'

interface Agent {
  id: string; name: string; role: string; speciality: string
  deals_closed: number; txn_value: string; badge: string
  photo_url: string | null; phone?: string
}

const emptyAgent = { name:'', role:'', speciality:'', deals_closed:0, txn_value:'', badge:'', photo_url:'', phone:'' }

function AgentForm({ initial, onSave, onClose }: {
  initial?: Agent; onSave: () => void; onClose: () => void
}) {
  const [form,       setForm]       = useState({ ...emptyAgent, ...initial })
  const [saving,     setSaving]     = useState(false)
  const [error,      setError]      = useState('')
  // OTP states
  const [phone,      setPhone]      = useState(initial?.phone ?? '')
  const [otp,        setOtp]        = useState('')
  const [otpSent,    setOtpSent]    = useState(false)
  const [verified,   setVerified]   = useState(!!initial?.phone)
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError,   setOtpError]   = useState('')
  const [countdown,  setCountdown]  = useState(0)
  const [devOtp,     setDevOtp]     = useState('')  // shown in dev only

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [k]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }))

  const sendOTP = async () => {
    if (!phone || phone.replace(/\D/g,'').length < 10) {
      setOtpError('Enter valid 10-digit mobile number'); return
    }
    setOtpLoading(true); setOtpError('')
    const res  = await fetch('/api/admin/send-otp', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    })
    const data = await res.json()
    setOtpLoading(false)
    if (!res.ok) { setOtpError(data.error ?? 'Failed to send OTP'); return }
    setOtpSent(true)
    setCountdown(30)
    if (data.dev_otp) setDevOtp(data.dev_otp)  // dev only
  }

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) { setOtpError('Enter 6-digit OTP'); return }
    setOtpLoading(true); setOtpError('')
    const res  = await fetch('/api/admin/send-otp', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp }),
    })
    const data = await res.json()
    setOtpLoading(false)
    if (!res.ok) { setOtpError(data.error ?? 'Verification failed'); return }
    setVerified(true)
    setOtpError('')
    setForm(p => ({ ...p, phone }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!verified) { setError('Please verify mobile number first'); return }
    setSaving(true); setError('')
    const body = initial?.id ? { id: initial.id, ...form, phone } : { ...form, phone }
    const res  = await fetch('/api/admin/agents', {
      method: initial?.id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const d = await res.json()
    setSaving(false)
    if (!res.ok) { setError(d.error ?? 'Error'); return }
    onSave()
  }

  const inp = 'w-full bg-[#0d1219] border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#C5A880] transition-colors placeholder:text-white/25'
  const lbl = 'block text-[0.65rem] font-bold uppercase tracking-widest text-white/40 mb-1.5'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#11161E] rounded-2xl border border-white/10 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-[#11161E] z-10">
          <h2 className="font-playfair text-xl font-semibold text-white">
            {initial?.id ? 'Edit Agent' : 'Add New Agent'}
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Basic fields */}
          <div className="grid grid-cols-2 gap-4">
            <div><label className={lbl}>Full Name *</label><input required value={form.name} onChange={set('name')} placeholder="Rajesh Singhal" className={inp} /></div>
            <div><label className={lbl}>Role *</label><input required value={form.role} onChange={set('role')} placeholder="Senior Estate Advisor" className={inp} /></div>
          </div>
          <div><label className={lbl}>Speciality *</label><input required value={form.speciality} onChange={set('speciality')} placeholder="Bypass Road villas..." className={inp} /></div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className={lbl}>Deals Closed</label><input type="number" value={form.deals_closed} onChange={set('deals_closed')} className={inp} /></div>
            <div><label className={lbl}>Transaction Value</label><input value={form.txn_value} onChange={set('txn_value')} placeholder="₹180 Cr+" className={inp} /></div>
            <div><label className={lbl}>Badge</label><input value={form.badge} onChange={set('badge')} placeholder="Top Agent 2025" className={inp} /></div>
          </div>

          {/* ── Mobile OTP Verification ── */}
          <div className="border border-white/8 rounded-xl p-4 space-y-3 bg-white/3">
            <div className="flex items-center gap-2 mb-1">
              <Phone className="w-4 h-4 text-[#C5A880]" />
              <span className="text-sm font-semibold text-white">Mobile Verification</span>
              {verified && (
                <span className="ml-auto flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              )}
            </div>

            {/* Phone input */}
            <div className="flex gap-2">
              <div className="flex items-center bg-[#0d1219] border border-white/10 rounded-lg px-3 text-white/50 text-sm flex-shrink-0">
                🇮🇳 +91
              </div>
              <input
                type="tel" maxLength={10}
                value={phone} onChange={e => { setPhone(e.target.value); setVerified(false); setOtpSent(false); setOtp('') }}
                placeholder="10-digit mobile number"
                disabled={verified}
                className={inp + ' flex-1 ' + (verified ? 'opacity-50 cursor-not-allowed' : '')}
              />
              {!verified && (
                <button type="button" onClick={sendOTP} disabled={otpLoading || countdown > 0}
                  className="px-4 py-2 bg-[#C5A880] text-[#11161E] rounded-lg text-xs font-bold
                             hover:bg-[#A4855C] transition-colors disabled:opacity-50 whitespace-nowrap flex-shrink-0">
                  {otpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : otpSent ? (countdown > 0 ? `Resend ${countdown}s` : 'Resend OTP') : 'Send OTP'}
                </button>
              )}
              {verified && (
                <button type="button" onClick={() => { setVerified(false); setOtpSent(false); setOtp(''); setDevOtp('') }}
                  className="px-3 py-2 bg-white/8 text-white/50 rounded-lg text-xs hover:bg-white/12 transition-colors whitespace-nowrap flex-shrink-0">
                  Change
                </button>
              )}
            </div>

            {/* OTP input */}
            {otpSent && !verified && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text" maxLength={6} value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g,''))}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), verifyOTP())}
                    placeholder="Enter 6-digit OTP"
                    className={inp + ' flex-1 tracking-[6px] text-center font-bold text-lg'}
                  />
                  <button type="button" onClick={verifyOTP} disabled={otpLoading || otp.length !== 6}
                    className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold
                               hover:bg-emerald-500 transition-colors disabled:opacity-50 flex-shrink-0">
                    {otpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                  </button>
                </div>
                <p className="text-white/30 text-xs">OTP valid for 5 minutes · Check terminal for dev OTP</p>
                {/* DEV MODE: show OTP in UI */}
                {devOtp && (
                  <div className="bg-amber-500/15 border border-amber-500/30 rounded-lg px-3 py-2 flex items-center gap-2">
                    <span className="text-amber-300 text-xs">🔐 Dev OTP:</span>
                    <span className="text-amber-300 text-sm font-bold tracking-widest">{devOtp}</span>
                    <button type="button" onClick={() => setOtp(devOtp)}
                      className="ml-auto text-[0.6rem] bg-amber-500 text-[#11161E] px-2 py-0.5 rounded font-bold">
                      Fill
                    </button>
                  </div>
                )}
              </div>
            )}

            {otpError && <p className="text-red-400 text-xs bg-red-500/10 px-3 py-1.5 rounded-lg">{otpError}</p>}
          </div>

          {error && <p className="text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-white/15 text-white/60 rounded-xl text-sm hover:bg-white/5 transition-colors">Cancel</button>
            <button type="submit" disabled={saving || !verified}
              className="flex-1 py-3 bg-[#C5A880] text-[#11161E] rounded-xl text-sm font-semibold hover:bg-[#A4855C] transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Agent</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminAgentsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const filterTab = searchParams.get('tab') // 'top' | 'ratings' | 'attendance'

  const [agents,   setAgents]   = useState<Agent[]>([])
  const [loading,  setLoading]  = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editAgent,setEditAgent]= useState<Agent | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [toast,    setToast]    = useState('')
  const [search,   setSearch]   = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/agents')
    const d   = await res.json()
    setAgents(d.agents ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete agent "${name}"?`)) return
    setDeleting(id)
    const res = await fetch('/api/admin/agents', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setDeleting(null)
    if (res.ok) { showToast('Agent deleted'); load() } else showToast('Error deleting')
  }

  const filtered = agents.filter(a => {
    // 1. Search filter
    const needle = search.toLowerCase()
    const matchesSearch = a.name.toLowerCase().includes(needle) ||
                          a.role.toLowerCase().includes(needle) ||
                          a.speciality.toLowerCase().includes(needle) ||
                          (a.phone ?? '').includes(search)
    if (!matchesSearch) return false

    // 2. Tab filter
    if (filterTab === 'top') {
      return a.deals_closed >= 30
    }
    if (filterTab === 'ratings') {
      return !!a.badge
    }
    
    return true
  })

  const exportCSV = () => {
    const rows = [
      ['Name', 'Role', 'Speciality', 'Phone', 'Deals Closed', 'Transaction Value', 'Badge'],
      ...filtered.map(a => [
        a.name, a.role, a.speciality, a.phone ?? '', a.deals_closed, a.txn_value, a.badge
      ])
    ]
    const csvContent = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `agents_${filterTab || 'all'}_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#11161E] border border-[#C5A880]/40 text-white px-5 py-3 rounded-xl shadow-xl">
          <CheckCircle2 className="w-4 h-4 text-[#C5A880]" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-playfair text-3xl font-semibold text-white">Agents</h1>
          <p className="text-white/40 text-sm mt-1">{filtered.length} shown ({agents.length} total)</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/8 text-white/70 hover:text-white rounded-lg text-sm font-medium border border-white/10 hover:border-white/20 transition-all">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => { setEditAgent(null); setShowForm(true) }}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#C5A880] text-[#11161E] font-semibold text-sm rounded-lg hover:bg-[#A4855C] transition-all">
            <Plus className="w-4 h-4" /> Add Agent
          </button>
        </div>
      </div>

      {/* Search & Tabs */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search agents by name, role, speciality, phone..."
            className="w-full bg-[#11161E] border border-white/10 text-white pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#C5A880] transition-colors"
          />
        </div>

        {/* Excel-style tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-white/5 pb-2 overflow-x-auto scrollbar-none">
          {[
            { label: 'All Agents', value: '' },
            { label: 'Top Performing', value: 'top' },
            { label: 'Ratings / Badges', value: 'ratings' },
          ].map(t => (
            <button key={t.value}
              onClick={() => {
                if (t.value === '') router.push(pathname)
                else router.push(`${pathname}?tab=${t.value}`)
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                (filterTab || '') === t.value
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
                {['Agent Details', 'Speciality', 'Deals Closed', 'Transaction Value', 'Badge', 'Phone', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-4 text-[0.68rem] font-bold uppercase tracking-widest text-white/35">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? [...Array(4)].map((_, i) => (
                <tr key={i}>
                  {[...Array(7)].map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 bg-white/6 rounded animate-pulse w-24" />
                    </td>
                  ))}
                </tr>
              )) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-white/30 text-sm">
                    <Users className="w-10 h-10 text-white/15 mx-auto mb-3" />
                    No agents found matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(agent => (
                  <tr key={agent.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#C5A880]/15 flex items-center justify-center text-[#C5A880] font-bold text-sm flex-shrink-0">
                          {agent.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold">{agent.name}</p>
                          <p className="text-white/40 text-xs mt-0.5">{agent.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-white/70 text-xs">{agent.speciality}</td>
                    <td className="px-5 py-4 text-white font-semibold text-sm">{agent.deals_closed}</td>
                    <td className="px-5 py-4 text-[#C5A880] font-semibold text-sm">{agent.txn_value}</td>
                    <td className="px-5 py-4">
                      {agent.badge ? (
                        <span className="text-[0.58rem] bg-[#C5A880]/15 text-[#C5A880] px-2.5 py-1 rounded-full font-bold whitespace-nowrap">
                          {agent.badge}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-5 py-4 text-white/50 text-xs font-mono">{agent.phone || '-'}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setEditAgent(agent); setShowForm(true) }}
                          className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-400 hover:bg-blue-500/25 transition-all" title="Edit">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(agent.id, agent.name)}
                          disabled={deleting === agent.id}
                          className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center text-red-400 hover:bg-red-500/25 transition-all disabled:opacity-40" title="Delete">
                          {deleting === agent.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
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

      {showForm && (
        <AgentForm
          initial={editAgent ?? undefined}
          onSave={() => { setShowForm(false); load(); showToast(editAgent ? 'Agent updated!' : 'Agent added!') }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
