'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import {
  Shield, Briefcase, Award, Check, X, Save, Loader2,
  ChevronDown, ChevronRight, AlertCircle, Search, Lock, Unlock
} from 'lucide-react'

// ─── Permission Modules ──────────────────────────────────────
const MODULES = [
  { key: 'view_properties',    label: 'View All Properties' },
  { key: 'add_properties',     label: 'Add Properties' },
  { key: 'edit_properties',    label: 'Edit Properties' },
  { key: 'delete_properties',  label: 'Delete Properties' },
  { key: 'view_enquiries',     label: 'View Enquiries' },
  { key: 'reply_enquiries',    label: 'Reply to Enquiries' },
  { key: 'view_clients',       label: 'View Clients' },
  { key: 'add_clients',        label: 'Add Clients' },
  { key: 'view_finance',       label: 'View Finance / Commissions' },
  { key: 'view_reports',       label: 'View Reports' },
  { key: 'export_reports',     label: 'Export Reports' },
  { key: 'manage_listings',    label: 'Manage Own Listings' },
  { key: 'view_appointments',  label: 'View Appointments' },
  { key: 'manage_appointments',label: 'Manage Appointments' },
  { key: 'post_reviews',       label: 'Post Reviews' },
  { key: 'view_dashboard',     label: 'View Dashboard' },
]

type PowerMap = Record<string, boolean>

function defaultPowers(): PowerMap {
  return Object.fromEntries(MODULES.map(m => [m.key, false]))
}

// ─── Types ───────────────────────────────────────────────────
interface Partner {
  id: string
  company_name: string
  owner_name: string
  email: string
  mobile: string
  status: string
  powers?: PowerMap
}

interface Agent {
  id: string
  name: string
  role: string
  phone?: string
  powers?: PowerMap
}

// ─── Person Power Row ─────────────────────────────────────────
function PersonPowerPanel({
  name,
  subtitle,
  powers,
  onSave,
  saving,
}: {
  name: string
  subtitle: string
  powers: PowerMap
  onSave: (powers: PowerMap) => void
  saving: boolean
}) {
  const [local, setLocal] = useState<PowerMap>({ ...defaultPowers(), ...powers })
  const [open, setOpen] = useState(false)

  // sync if parent powers change (e.g. after fetch)
  useEffect(() => {
    setLocal({ ...defaultPowers(), ...powers })
  }, [powers])

  const toggle = (key: string) =>
    setLocal(p => ({ ...p, [key]: !p[key] }))

  const enableAll  = () => setLocal(Object.fromEntries(MODULES.map(m => [m.key, true])))
  const disableAll = () => setLocal(defaultPowers())
  const allOn      = MODULES.every(m => local[m.key])
  const countOn    = MODULES.filter(m => local[m.key]).length

  return (
    <div className="bg-[#11161E] border border-white/8 rounded-xl overflow-hidden">
      {/* Accordion Header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3 text-left">
          <div className="w-9 h-9 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/20 flex items-center justify-center">
            <Shield className="w-4 h-4 text-[#C5A880]" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">{name}</p>
            <p className="text-white/35 text-xs">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Permission count pill */}
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
            countOn === 0
              ? 'bg-white/5 text-white/30'
              : countOn === MODULES.length
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'bg-[#C5A880]/10 text-[#C5A880]'
          }`}>
            {countOn}/{MODULES.length} powers
          </span>
          {open
            ? <ChevronDown className="w-4 h-4 text-white/30" />
            : <ChevronRight className="w-4 h-4 text-white/30" />
          }
        </div>
      </button>

      {/* Expanded Content */}
      {open && (
        <div className="border-t border-white/8">
          {/* Bulk actions */}
          <div className="flex items-center gap-3 px-5 py-3 bg-white/[0.015] border-b border-white/5">
            <button
              onClick={enableAll}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              <Unlock className="w-3 h-3" /> Grant All
            </button>
            <span className="text-white/15">|</span>
            <button
              onClick={disableAll}
              className="text-xs text-red-400/70 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <Lock className="w-3 h-3" /> Revoke All
            </button>
          </div>

          {/* Permission Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5">
            {MODULES.map((mod) => (
              <button
                key={mod.key}
                onClick={() => toggle(mod.key)}
                className={`flex items-center justify-between px-4 py-3 text-left transition-colors ${
                  local[mod.key]
                    ? 'bg-[#0d1219] hover:bg-[#0a0f16]'
                    : 'bg-[#11161E] hover:bg-[#0f141b]'
                }`}
              >
                <span className={`text-xs font-medium ${
                  local[mod.key] ? 'text-white' : 'text-white/30'
                }`}>
                  {mod.label}
                </span>
                <div className={`w-9 h-5 rounded-full flex-shrink-0 ml-4 relative transition-all duration-200 ${
                  local[mod.key] ? 'bg-[#C5A880]' : 'bg-white/10'
                }`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${
                    local[mod.key] ? 'left-[1.25rem]' : 'left-0.5'
                  }`} />
                </div>
              </button>
            ))}
          </div>

          {/* Save Button */}
          <div className="px-5 py-4 border-t border-white/8 flex justify-end">
            <button
              onClick={() => onSave(local)}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#C5A880] text-[#11161E] font-bold text-sm rounded-lg hover:bg-[#A4855C] transition-all disabled:opacity-50 shadow-md"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Powers
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────
export default function AdminRolesPage() {
  const supabase = createClient()
  const searchParams = useSearchParams()

  const [tab, setTab] = useState<'partners' | 'agents'>(
    searchParams.get('tab') === 'agents' ? 'agents' : 'partners'
  )
  const [search, setSearch] = useState('')

  const [partners, setPartners] = useState<Partner[]>([])
  const [agents,   setAgents]   = useState<Agent[]>([])
  const [loading,  setLoading]  = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)

  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  // ── Fetch ─────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true)
    const [pRes, aRes] = await Promise.all([
      supabase.from('partners').select('id,company_name,owner_name,email,mobile,status,powers').order('company_name'),
      supabase.from('agents').select('id,name,role,phone,powers').order('name'),
    ])
    if (!pRes.error) setPartners(pRes.data || [])
    if (!aRes.error) setAgents(aRes.data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  // ── Save partner powers ───────────────────────────────────
  const savePartnerPowers = async (id: string, powers: PowerMap) => {
    setSavingId(id)
    const { error } = await supabase
      .from('partners')
      .update({ powers })
      .eq('id', id)
    setSavingId(null)
    if (error) { showToast('Error: ' + error.message, false); return }
    showToast('Powers saved for partner!')
    setPartners(prev => prev.map(p => p.id === id ? { ...p, powers } : p))
  }

  // ── Save agent powers ─────────────────────────────────────
  const saveAgentPowers = async (id: string, powers: PowerMap) => {
    setSavingId(id)
    const { error } = await supabase
      .from('agents')
      .update({ powers })
      .eq('id', id)
    setSavingId(null)
    if (error) { showToast('Error: ' + error.message, false); return }
    showToast('Powers saved for agent!')
    setAgents(prev => prev.map(a => a.id === id ? { ...a, powers } : a))
  }

  // ── Filtered lists ────────────────────────────────────────
  const filteredPartners = partners.filter(p =>
    (p.company_name + p.owner_name + p.email)
      .toLowerCase().includes(search.toLowerCase())
  )
  const filteredAgents = agents.filter(a =>
    (a.name + (a.role || '')).toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 relative">

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold flex items-center gap-2 animate-fade-in ${
          toast.ok ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.ok ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="font-playfair text-3xl font-semibold text-white">
          Power Assignment
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Control what Partners and Agents can access and do inside the platform
        </p>
      </div>

      {/* Tab + Search row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-[#0d1219] rounded-xl border border-white/8">
          <button
            onClick={() => setTab('partners')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === 'partners'
                ? 'bg-[#C5A880] text-[#11161E] shadow-md'
                : 'text-white/40 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Partners
            <span className={`text-[0.65rem] px-1.5 py-0.5 rounded font-bold ${
              tab === 'partners' ? 'bg-[#11161E]/20' : 'bg-white/10'
            }`}>
              {partners.length}
            </span>
          </button>
          <button
            onClick={() => setTab('agents')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === 'agents'
                ? 'bg-[#C5A880] text-[#11161E] shadow-md'
                : 'text-white/40 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            Agents
            <span className={`text-[0.65rem] px-1.5 py-0.5 rounded font-bold ${
              tab === 'agents' ? 'bg-[#11161E]/20' : 'bg-white/10'
            }`}>
              {agents.length}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
          <input
            type="text"
            placeholder={tab === 'partners' ? 'Search partners...' : 'Search agents...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#0d1219] border border-white/10 text-white pl-9 pr-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#C5A880]/50 placeholder-white/20"
          />
        </div>
      </div>

      {/* Info strip */}
      <div className="flex items-start gap-3 p-4 bg-[#C5A880]/5 border border-[#C5A880]/15 rounded-xl">
        <Shield className="w-4 h-4 text-[#C5A880] mt-0.5 flex-shrink-0" />
        <p className="text-[#C5A880]/70 text-xs leading-relaxed">
          Click on any {tab === 'partners' ? 'partner' : 'agent'} below to expand their power settings.
          Toggle individual permissions using the switches, then click <strong className="text-[#C5A880]">Save Powers</strong> to apply. Changes are stored directly to the database.
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-[#C5A880] mx-auto mb-4" />
          <p className="text-white/40 text-sm">Loading...</p>
        </div>
      ) : tab === 'partners' ? (
        <div className="space-y-3">
          {filteredPartners.length === 0 ? (
            <div className="bg-[#11161E] border border-white/8 rounded-xl p-12 text-center text-white/30 text-sm">
              {partners.length === 0
                ? 'No partners found. Add partners from the Partners section first.'
                : 'No partners match your search.'}
            </div>
          ) : (
            filteredPartners.map(p => (
              <PersonPowerPanel
                key={p.id}
                name={p.company_name}
                subtitle={`${p.owner_name} · ${p.email}`}
                powers={p.powers || {}}
                saving={savingId === p.id}
                onSave={(powers) => savePartnerPowers(p.id, powers)}
              />
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAgents.length === 0 ? (
            <div className="bg-[#11161E] border border-white/8 rounded-xl p-12 text-center text-white/30 text-sm">
              {agents.length === 0
                ? 'No agents found. Add agents from the Agents section first.'
                : 'No agents match your search.'}
            </div>
          ) : (
            filteredAgents.map(a => (
              <PersonPowerPanel
                key={a.id}
                name={a.name}
                subtitle={a.role || 'Agent'}
                powers={a.powers || {}}
                saving={savingId === a.id}
                onSave={(powers) => saveAgentPowers(a.id, powers)}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}
