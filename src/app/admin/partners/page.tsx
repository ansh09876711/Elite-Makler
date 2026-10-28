'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Briefcase, Plus, Search, Filter, CheckCircle2, User, Building, Phone, Mail, Award, Globe, FileText, Check, X, ShieldAlert, Loader2, Trash2, Download } from 'lucide-react'

interface Partner {
  id: string
  company_name: string
  owner_name: string
  logo_url?: string
  rera_number: string
  gst_number?: string
  pan_number?: string
  email: string
  mobile: string
  office_address: string
  bank_details?: string
  website?: string
  total_listings: number
  total_sales: number
  revenue_generated: number
  commission_pct: number
  status: 'active' | 'pending' | 'blocked'
}

export default function AdminPartnersPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const filterStatus = searchParams.get('filter') // 'pending' | 'verified' | 'featured'
  
  const supabase = createClient()
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  
  // Form modal state
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newPartner, setNewPartner] = useState({
    company_name: '',
    owner_name: '',
    rera_number: '',
    gst_number: '',
    pan_number: '',
    email: '',
    mobile: '',
    office_address: '',
    bank_details: '',
    website: '',
    commission_pct: 1.5,
  })

  // Fetch data on load
  useEffect(() => {
    async function fetchPartners() {
      try {
        const { data, error } = await supabase
          .from('partners')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setPartners(data || [])
        if (data && data.length > 0) {
          setSelectedPartner(data[0])
        }
      } catch (err) {
        console.error('Error fetching partners:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPartners()

    // Realtime Database Subscription
    const channel = supabase
      .channel('realtime_partners')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'partners' },
        (payload) => {
          console.log('Realtime change received:', payload)
          if (payload.eventType === 'INSERT') {
            const newRecord = payload.new as Partner
            setPartners(prev => [newRecord, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            const updatedRecord = payload.new as Partner
            setPartners(prev => prev.map(p => p.id === updatedRecord.id ? updatedRecord : p))
            setSelectedPartner(prev => prev?.id === updatedRecord.id ? updatedRecord : prev)
          } else if (payload.eventType === 'DELETE') {
            const deletedRecord = payload.old as { id: string }
            setPartners(prev => prev.filter(p => p.id !== deletedRecord.id))
            setSelectedPartner(prev => prev?.id === deletedRecord.id ? null : prev)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Action handlers
  const updateStatus = async (partnerId: string, status: 'active' | 'pending' | 'blocked') => {
    try {
      const { error } = await supabase
        .from('partners')
        .update({ status })
        .eq('id', partnerId)
      if (error) throw error
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  const deletePartner = async (partnerId: string, companyName: string) => {
    if (!confirm(`Delete "${companyName}"? This cannot be undone.`)) return
    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', partnerId)
      if (error) throw error
      // clear selection if deleted partner was selected
      setSelectedPartner(prev => prev?.id === partnerId ? null : prev)
    } catch (err: any) {
      alert('Error deleting: ' + (err.message || err))
    }
  }

  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('partners')
        .insert([{
          ...newPartner,
          status: 'active' // Add as active by default from admin panel
        }])
        .select()

      if (error) throw error
      setAddModalOpen(false)
      // Reset form
      setNewPartner({
        company_name: '',
        owner_name: '',
        rera_number: '',
        gst_number: '',
        pan_number: '',
        email: '',
        mobile: '',
        office_address: '',
        bank_details: '',
        website: '',
        commission_pct: 1.5,
      })
    } catch (err: any) {
      alert(err.message || 'Error creating partner')
    } finally {
      setSaving(false)
    }
  }

  const filtered = partners.filter(p => {
    if (filterStatus === 'pending' && p.status !== 'pending') return false
    if (filterStatus === 'verified' && p.status !== 'active') return false
    if (filterStatus === 'blocked' && p.status !== 'blocked') return false
    
    return p.company_name.toLowerCase().includes(search.toLowerCase()) || 
           p.owner_name.toLowerCase().includes(search.toLowerCase()) ||
           p.rera_number.toLowerCase().includes(search.toLowerCase())
  })

  const exportCSV = () => {
    const rows = [
      ['Company Name', 'Owner Name', 'RERA Number', 'Email', 'Mobile', 'Address', 'Status', 'Listings', 'Sales', 'Commission %'],
      ...filtered.map(p => [
        p.company_name, p.owner_name, p.rera_number, p.email, p.mobile, p.office_address, p.status, p.total_listings, p.total_sales, p.commission_pct
      ])
    ]
    const csvContent = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `partners_${filterStatus || 'all'}_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-playfair text-3xl font-semibold text-white">Partners & Channel Management</h1>
          <p className="text-white/40 text-sm mt-1">Manage external broker partners, real estate builders, and commissions · {filtered.length} shown ({partners.length} total)</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/8 text-white/70 hover:text-white rounded-lg text-sm font-medium border border-white/10 hover:border-white/20 transition-all">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button 
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#C5A880] text-[#11161E] font-semibold text-sm rounded-lg hover:bg-[#A4855C] transition-all"
          >
            <Plus className="w-4 h-4" /> Add Partner
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Partners', count: partners.length, icon: Briefcase, color: 'text-blue-400' },
          { label: 'Pending Approval', count: partners.filter(p => p.status === 'pending').length, icon: Filter, color: 'text-amber-400' },
          { label: 'Partner Sales Count', count: partners.reduce((acc, p) => acc + p.total_sales, 0), icon: Award, color: 'text-emerald-400' },
          { label: 'Total Listings Contributed', count: partners.reduce((acc, p) => acc + p.total_listings, 0), icon: FileText, color: 'text-[#C5A880]' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#11161E] border border-white/8 rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-white text-2xl font-bold mt-1.5">{stat.count}</h3>
            </div>
            <div className={`p-3 rounded-lg bg-white/5 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Search & Tabs */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search partners by company name, owner, RERA number..."
            className="w-full bg-[#11161E] border border-white/10 text-white pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#C5A880] transition-colors"
          />
        </div>

        {/* Excel-style tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-white/5 pb-2 overflow-x-auto scrollbar-none">
          {[
            { label: 'All Partners', value: '' },
            { label: 'Pending Approval', value: 'pending' },
            { label: 'Active / Verified', value: 'verified' },
            { label: 'Blocked', value: 'blocked' },
          ].map(t => (
            <button key={t.value}
              onClick={() => {
                if (t.value === '') router.push(pathname)
                else router.push(`${pathname}?filter=${t.value}`)
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                (filterStatus || '') === t.value
                  ? 'bg-[#C5A880] text-[#11161E] font-bold'
                  : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: List + Detail View */}
      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-[#C5A880] mx-auto mb-4" />
          <p className="text-white/40 text-sm">Loading partners database...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left List Pane */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#11161E] rounded-xl border border-white/8 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/8">
                      {['Company / Owner', 'RERA No', 'Sales / Listings', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-5 py-4 text-[0.68rem] font-bold uppercase tracking-widest text-white/35">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-10 text-white/30 text-sm">
                          No partners found matching criteria. Please add one or run migration.
                        </td>
                      </tr>
                    ) : (
                      filtered.map(p => (
                        <tr 
                          key={p.id} 
                          onClick={() => setSelectedPartner(p)}
                          className={`cursor-pointer transition-colors ${
                            selectedPartner?.id === p.id ? 'bg-[#C5A880]/5 hover:bg-[#C5A880]/8' : 'hover:bg-white/3'
                          }`}
                        >
                          <td className="px-5 py-4">
                            <p className="text-white text-sm font-semibold">{p.company_name}</p>
                            <p className="text-white/40 text-xs mt-0.5">{p.owner_name} · {p.email}</p>
                          </td>
                          <td className="px-5 py-4 text-white/70 text-xs font-mono">{p.rera_number}</td>
                          <td className="px-5 py-4 text-white/60 text-xs">
                            Sales: <span className="text-emerald-400 font-bold">{p.total_sales}</span> / Listings: <span className="text-white font-bold">{p.total_listings}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                              p.status === 'active' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              {p.status === 'pending' && (
                                <>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); updateStatus(p.id, 'active') }}
                                    className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/25 transition-all"
                                    title="Approve Partner"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); updateStatus(p.id, 'blocked') }}
                                    className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center text-red-400 hover:bg-red-500/25 transition-all"
                                    title="Decline / Block"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                              {p.status === 'active' && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); updateStatus(p.id, 'blocked') }}
                                  className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center text-red-400 hover:bg-red-500/25 transition-all"
                                  title="Block Partner"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {p.status === 'blocked' && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); updateStatus(p.id, 'active') }}
                                  className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/25 transition-all"
                                  title="Re-activate Partner"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={(e) => { e.stopPropagation(); deletePartner(p.id, p.company_name) }}
                                className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                                title="Delete partner"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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

          {/* Right Detail Pane */}
          <div className="lg:col-span-1 bg-[#11161E] border border-white/8 rounded-xl p-5 h-fit space-y-4">
            {selectedPartner ? (
              <div className="space-y-4">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="text-white font-semibold text-lg">{selectedPartner.company_name}</h3>
                  <p className="text-white/40 text-xs mt-0.5">Partner Profile details</p>
                </div>

                <div className="space-y-3 text-xs">
                  {[
                    { icon: User, label: 'Owner Name', value: selectedPartner.owner_name },
                    { icon: Building, label: 'Office Address', value: selectedPartner.office_address },
                    { icon: Phone, label: 'Mobile Number', value: selectedPartner.mobile },
                    { icon: Mail, label: 'Email Address', value: selectedPartner.email },
                    { icon: Globe, label: 'Website Link', value: selectedPartner.website || 'Not provided' },
                    { icon: FileText, label: 'RERA Number', value: selectedPartner.rera_number },
                    { icon: FileText, label: 'GST Number', value: selectedPartner.gst_number || 'Not provided' },
                    { icon: FileText, label: 'PAN Number', value: selectedPartner.pan_number || 'Not provided' },
                    { icon: Award, label: 'Revenue Commission %', value: `${selectedPartner.commission_pct}%` },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-3 py-1.5 border-b border-white/5 last:border-0">
                      <item.icon className="w-4 h-4 text-[#C5A880] flex-shrink-0" />
                      <div>
                        <p className="text-white/30 text-[0.62rem] uppercase tracking-wider">{item.label}</p>
                        <p className="text-white font-medium mt-0.5 leading-relaxed">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {selectedPartner.status === 'pending' ? (
                    <button 
                      onClick={() => updateStatus(selectedPartner.id, 'active')}
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-[#11161E] font-bold text-xs rounded-lg transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                  ) : selectedPartner.status === 'active' ? (
                    <button 
                      onClick={() => updateStatus(selectedPartner.id, 'blocked')}
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-3.5 h-3.5" /> Block
                    </button>
                  ) : (
                    <button 
                      onClick={() => updateStatus(selectedPartner.id, 'active')}
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-emerald-500/80 hover:bg-emerald-500 text-[#11161E] font-bold text-xs rounded-lg transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" /> Unblock
                    </button>
                  )}
                  <button 
                    onClick={() => deletePartner(selectedPartner.id, selectedPartner.company_name)}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-bold text-xs border border-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-white/30 text-xs">
                Select a partner from the list to view profile details.
              </div>
            )}
          </div>

        </div>
      )}

      {/* ── CREATE PARTNER MODAL DIALOG ── */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#11161E] border border-white/10 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
              <h3 className="text-white font-semibold text-base flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#C5A880]" /> Add Channel Partner
              </h3>
              <button onClick={() => setAddModalOpen(false)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreatePartner} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-thin">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-white/40 text-xs uppercase tracking-wider font-bold">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={newPartner.company_name}
                    onChange={e => setNewPartner(prev => ({ ...prev, company_name: e.target.value }))}
                    className="w-full mt-1 bg-[#0d1219] border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs uppercase tracking-wider font-bold">Owner Name *</label>
                  <input
                    type="text"
                    required
                    value={newPartner.owner_name}
                    onChange={e => setNewPartner(prev => ({ ...prev, owner_name: e.target.value }))}
                    className="w-full mt-1 bg-[#0d1219] border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs uppercase tracking-wider font-bold">Mobile *</label>
                  <input
                    type="text"
                    required
                    value={newPartner.mobile}
                    onChange={e => setNewPartner(prev => ({ ...prev, mobile: e.target.value }))}
                    className="w-full mt-1 bg-[#0d1219] border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-white/40 text-xs uppercase tracking-wider font-bold">Email *</label>
                  <input
                    type="email"
                    required
                    value={newPartner.email}
                    onChange={e => setNewPartner(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full mt-1 bg-[#0d1219] border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs uppercase tracking-wider font-bold">RERA Number *</label>
                  <input
                    type="text"
                    required
                    value={newPartner.rera_number}
                    onChange={e => setNewPartner(prev => ({ ...prev, rera_number: e.target.value }))}
                    className="w-full mt-1 bg-[#0d1219] border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs uppercase tracking-wider font-bold">Commission %</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPartner.commission_pct}
                    onChange={e => setNewPartner(prev => ({ ...prev, commission_pct: parseFloat(e.target.value) }))}
                    className="w-full mt-1 bg-[#0d1219] border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs uppercase tracking-wider font-bold">GST Number</label>
                  <input
                    type="text"
                    value={newPartner.gst_number}
                    onChange={e => setNewPartner(prev => ({ ...prev, gst_number: e.target.value }))}
                    className="w-full mt-1 bg-[#0d1219] border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs uppercase tracking-wider font-bold">PAN Number</label>
                  <input
                    type="text"
                    value={newPartner.pan_number}
                    onChange={e => setNewPartner(prev => ({ ...prev, pan_number: e.target.value }))}
                    className="w-full mt-1 bg-[#0d1219] border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-white/40 text-xs uppercase tracking-wider font-bold">Office Address *</label>
                  <input
                    type="text"
                    required
                    value={newPartner.office_address}
                    onChange={e => setNewPartner(prev => ({ ...prev, office_address: e.target.value }))}
                    className="w-full mt-1 bg-[#0d1219] border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#C5A880] text-[#11161E] font-bold text-sm rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Partner Details'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
