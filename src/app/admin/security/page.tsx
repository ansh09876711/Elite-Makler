'use client'

import { useSearchParams } from 'next/navigation'
import { Lock, Shield, Server, RefreshCw, Key, ShieldAlert } from 'lucide-react'

const MOCK_LOGINS = [
  { id: '1', email: 'vaishnoshreeconstruction@gmail.com', ip: '192.168.1.42', device: 'Chrome / Windows', status: 'success', date: '2026-07-13 18:24' },
  { id: '2', email: 'admin@elitemakler.in', ip: '103.85.12.9', device: 'Safari / iPhone', status: 'success', date: '2026-07-13 12:45' },
  { id: '3', email: 'unknown@hacker.net', ip: '45.22.109.11', device: 'Firefox / Linux', status: 'blocked', date: '2026-07-12 03:14' },
]

export default function AdminSecurityPage() {
  const searchParams = useSearchParams()
  const tabFilter = searchParams.get('tab') || 'security'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-3xl font-semibold text-white">System Security & Logs</h1>
        <p className="text-white/40 text-sm mt-1">Monitor login history logs, manage system backup restorations, and configure 2FA</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3">
        {[
          { label: 'Security Overview', val: 'security' },
          { label: 'Login Audit Logs', val: 'logs' },
        ].map(tab => (
          <a
            key={tab.val}
            href={tab.val === 'security' ? `/admin/security` : `/admin/security?tab=${tab.val}`}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              (tab.val === 'security' && tabFilter === 'security') || tabFilter === tab.val
                ? 'bg-[#C5A880] text-[#11161E]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {/* Security Overview Tab */}
      {tabFilter === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Backups card */}
          <div className="bg-[#11161E] border border-white/8 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-white font-semibold text-base flex items-center gap-2"><Server className="w-5 h-5 text-[#C5A880]" /> Database Backups</h3>
              <span className="text-emerald-400 text-xs font-semibold">Protected</span>
            </div>
            <p className="text-white/50 text-xs leading-relaxed">Daily backups are automatically generated and stored in a secure isolated storage bucket. Restoring a backup will override the current database values.</p>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs rounded-lg transition-colors">
                <RefreshCw className="w-3.5 h-3.5" /> Force Backup
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs rounded-lg transition-colors border border-red-500/25">
                Restore Database
              </button>
            </div>
          </div>

          {/* 2FA Card */}
          <div className="bg-[#11161E] border border-white/8 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-white font-semibold text-base flex items-center gap-2"><Key className="w-5 h-5 text-[#C5A880]" /> Two-Factor Authentication</h3>
              <span className="text-white/30 text-xs font-semibold">Disabled</span>
            </div>
            <p className="text-white/50 text-xs leading-relaxed">Require a verification OTP code from your authenticator app (Google Authenticator / Duo) whenever logging in to your admin portal.</p>
            <button className="px-5 py-2.5 bg-[#C5A880] text-[#11161E] font-bold text-xs rounded-lg hover:bg-[#A4855C] transition-all">
              Configure 2FA
            </button>
          </div>
        </div>
      )}

      {/* Login Logs Tab */}
      {tabFilter === 'logs' && (
        <div className="bg-[#11161E] rounded-xl border border-white/8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/8">
                  {['Admin account email', 'IP Address', 'Browser/Device details', 'Status', 'Log Time'].map(h => (
                    <th key={h} className="px-5 py-4 text-[0.68rem] font-bold uppercase tracking-widest text-white/35">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_LOGINS.map(log => (
                  <tr key={log.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4 text-white text-sm font-semibold">{log.email}</td>
                    <td className="px-5 py-4 text-white/70 text-xs font-mono">{log.ip}</td>
                    <td className="px-5 py-4 text-white/60 text-xs">{log.device}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${
                        log.status === 'success' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {log.status === 'blocked' && <ShieldAlert className="w-3.5 h-3.5" />}
                        {log.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-white/50 text-xs">{log.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
