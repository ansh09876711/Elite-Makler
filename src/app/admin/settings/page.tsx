'use client'

import { useAuth } from '@/context/AuthContext'
import { isAdminEmail } from '@/lib/admin'
import { Shield, Mail, Phone, Globe, Key, HardDrive, Server, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { useState } from 'react'

export default function AdminSettingsPage() {
  const { user } = useAuth()

  const [storageStatus, setStorageStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [storageMsg,    setStorageMsg]    = useState('')
  const [storageDetail, setStorageDetail] = useState<string[]>([])

  const setupStorage = async () => {
    setStorageStatus('loading')
    setStorageMsg('')
    setStorageDetail([])
    try {
      const res  = await fetch('/api/admin/setup-storage')
      const data = await res.json()
      if (data.success) {
        setStorageStatus('ok')
        setStorageMsg(data.message || 'Storage bucket ready!')
        setStorageDetail(data.results || [])
      } else {
        setStorageStatus('error')
        setStorageMsg(data.error || 'Setup failed')
        setStorageDetail(data.results || [])
      }
    } catch (e: any) {
      setStorageStatus('error')
      setStorageMsg(e.message || 'Network error')
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-playfair text-3xl font-semibold text-white">Settings</h1>

      {/* Admin Info */}
      <div className="bg-[#11161E] rounded-xl border border-white/8 p-6">
        <h2 className="text-white font-semibold text-sm mb-5 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#C5A880]" /> Admin Account
        </h2>
        <div className="space-y-4">
          {[
            { icon: Mail,  label: 'Admin Email',  val: user?.email ?? '—' },
            { icon: Shield,label: 'Role',         val: isAdminEmail(user?.email) ? 'Super Admin' : 'User' },
            { icon: Key,   label: 'Auth Method',  val: user?.app_metadata?.provider === 'google' ? 'Google OAuth' : 'Email / Password' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-4 py-3 border-b border-white/6 last:border-0">
              <div className="w-8 h-8 rounded-lg bg-[#C5A880]/10 flex items-center justify-center text-[#A4855C]">
                <item.icon className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-white/40 text-[0.65rem] uppercase tracking-wide">{item.label}</p>
                <p className="text-white text-sm font-medium">{item.val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Storage Setup ── */}
      <div className="bg-[#11161E] rounded-xl border border-white/8 p-6">
        <h2 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-[#C5A880]" /> Supabase Storage Setup
        </h2>
        <p className="text-white/40 text-xs mb-4 leading-relaxed">
          Image/video upload ke liye <code className="bg-white/8 px-1.5 py-0.5 rounded text-white/60">property-media</code> bucket
          Supabase mein exist karna chahiye. Neeche button dabao — bucket automatically create ho jaayega.
        </p>

        <button
          onClick={setupStorage}
          disabled={storageStatus === 'loading'}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#C5A880] text-[#11161E] font-semibold
                     text-sm rounded-lg hover:bg-[#A4855C] transition-all disabled:opacity-60"
        >
          {storageStatus === 'loading'
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Setting up...</>
            : <><HardDrive className="w-4 h-4" /> Setup Storage Bucket</>}
        </button>

        {storageStatus !== 'idle' && (
          <div className={`mt-4 rounded-lg p-4 border ${
            storageStatus === 'ok'
              ? 'bg-emerald-500/10 border-emerald-500/25'
              : storageStatus === 'error'
              ? 'bg-red-500/10 border-red-500/25'
              : 'bg-white/5 border-white/10'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {storageStatus === 'ok'
                ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                : storageStatus === 'error'
                ? <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                : <Loader2 className="w-4 h-4 text-white/40 animate-spin flex-shrink-0" />}
              <p className={`text-sm font-medium ${
                storageStatus === 'ok' ? 'text-emerald-300' :
                storageStatus === 'error' ? 'text-red-300' : 'text-white/60'
              }`}>{storageMsg}</p>
            </div>
            {storageDetail.length > 0 && (
              <ul className="space-y-0.5 mt-2">
                {storageDetail.map((line, i) => (
                  <li key={i} className="text-xs text-white/40">{line}</li>
                ))}
              </ul>
            )}
            {storageStatus === 'error' && (
              <p className="text-xs text-amber-300/70 mt-3 leading-relaxed">
                Manual fix: <a href="https://supabase.com/dashboard/project/odrisbaabgeyhzaauqtl/storage/buckets"
                  target="_blank" rel="noopener noreferrer"
                  className="underline text-amber-300 hover:text-amber-200">
                  Supabase Dashboard → Storage
                </a> mein jaake &ldquo;property-media&rdquo; naam ka Public bucket create karo.
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── DB Constraints Fix ── */}
      <div className="bg-[#11161E] rounded-xl border border-white/8 p-6">
        <h2 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
          <Server className="w-4 h-4 text-[#C5A880]" /> Database Constraint Fix
        </h2>
        <p className="text-white/40 text-xs mb-4 leading-relaxed">
          DB schema mein <code className="bg-white/8 px-1.5 py-0.5 rounded text-white/60">type</code>,{' '}
          <code className="bg-white/8 px-1.5 py-0.5 rounded text-white/60">status</code>, aur{' '}
          <code className="bg-white/8 px-1.5 py-0.5 rounded text-white/60">locality</code> columns ke purane CHECK
          constraints hain jo <em>apartment, house, for_rent</em> jaise values accept nahi karte.
          Iska matlab — kuch properties save hi nahi hongi aur upload trigger nahi hoga.
        </p>
        <div className="bg-[#0d1219] rounded-lg p-4 text-xs text-emerald-300 font-mono leading-relaxed overflow-auto mb-4 border border-white/8">
          <p className="text-white/30 mb-2">-- Supabase SQL Editor mein ye paste karke Run karo:</p>
          <p>ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_type_check;</p>
          <p>ALTER TABLE properties ADD CONSTRAINT properties_type_check</p>
          <p className="pl-4">CHECK (type IN (&apos;villa&apos;,&apos;penthouse&apos;,&apos;mansion&apos;,&apos;apartment&apos;,&apos;house&apos;,&apos;plot&apos;,&apos;commercial&apos;));</p>
          <p className="mt-2">ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_status_check;</p>
          <p>ALTER TABLE properties ADD CONSTRAINT properties_status_check</p>
          <p className="pl-4">CHECK (status IN (&apos;for_sale&apos;,&apos;for_rent&apos;,&apos;new_listing&apos;,&apos;coming_soon&apos;,&apos;preview&apos;,&apos;sold&apos;));</p>
          <p className="mt-2">ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_locality_check;</p>
        </div>
        <a
          href="https://supabase.com/dashboard/project/odrisbaabgeyhzaauqtl/sql/new"
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/15 text-blue-300
                     text-sm font-semibold rounded-lg hover:bg-blue-500/25 transition-colors border border-blue-500/25"
        >
          Open Supabase SQL Editor ↗
        </a>
        <p className="text-white/25 text-[0.65rem] mt-3">
          Full SQL file: <code>supabase/fix_constraints.sql</code>
        </p>
      </div>

      {/* Contact Info */}
      <div className="bg-[#11161E] rounded-xl border border-white/8 p-6">
        <h2 className="text-white font-semibold text-sm mb-5">Business Contact Info</h2>
        <div className="space-y-4">
          {[
            { icon: Phone, label: 'Phone',   val: '+91 731 555-LUXE' },
            { icon: Mail,  label: 'Email',   val: 'concierge@elitemakler.in' },
            { icon: Globe, label: 'Website', val: 'localhost:3000' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-4 py-3 border-b border-white/6 last:border-0">
              <div className="w-8 h-8 rounded-lg bg-white/6 flex items-center justify-center text-white/50">
                <item.icon className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-white/40 text-[0.65rem] uppercase tracking-wide">{item.label}</p>
                <p className="text-white text-sm">{item.val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
