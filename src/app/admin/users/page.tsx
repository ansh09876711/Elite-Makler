'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Users, UserCheck, ShieldAlert, Award, Search, Plus, Shield, Download, Check, X, Loader2 } from 'lucide-react'

// Poll interval in ms for near-real-time updates
const POLL_INTERVAL = 5000

interface SupabaseRawUser {
  id: string
  email?: string
  created_at?: string
  email_confirmed_at?: string
  user_metadata?: {
    full_name?: string
    name?: string
    phone?: string
    role?: string
    status?: string
    account_type?: string
  }
}

interface AdminUser {
  id: string
  name?: string
  email?: string
  phone?: string
  role?: string
  status?: string
  type?: string
  date?: string
}

/**
 * Safely formats an ISO date string to Indian locale (DD MMM YYYY).
 * Returns 'N/A' if the date is null, undefined, empty, or invalid.
 */
function formatDisplayDate(dateStr?: string | null): string {
  if (!dateStr || typeof dateStr !== 'string') return 'N/A'
  const parsed = new Date(dateStr)
  if (isNaN(parsed.getTime())) return 'N/A'
  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

export default function AdminUsersPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const roleFilter = searchParams.get('role') // 'buyer' | 'seller'
  const statusFilter = searchParams.get('status') // 'verified' | 'premium' | 'blocked' | 'deleted'
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      const json: { users?: SupabaseRawUser[] } = await res.json()
      const raw = Array.isArray(json.users) ? json.users : []
      // Map Supabase auth user shape to AdminUser
      const mapped: AdminUser[] = raw.map((u) => ({
        id: u.id,
        name: u.user_metadata?.full_name || u.user_metadata?.name || '-',
        email: u.email,
        phone: u.user_metadata?.phone || '-',
        role: u.user_metadata?.role || 'buyer',
        status: u.email_confirmed_at ? 'verified' : 'pending',
        type: u.user_metadata?.account_type || 'regular',
        date: u.created_at ? new Date(u.created_at).toISOString() : undefined,
      }))
      setUsers(mapped)
    } catch (err) {
      console.error('Failed fetching users', err)
    } finally { setLoading(false) }
  }

  useEffect(() => {
    fetchUsers()
    const id = setInterval(fetchUsers, POLL_INTERVAL)
    return () => clearInterval(id)
  }, [])

  // Filter logic
  const source = users
  const filtered = source.filter(u => {
    if (roleFilter && u.role !== roleFilter) return false
    if (statusFilter === 'verified' && u.status !== 'verified') return false
    if (statusFilter === 'premium' && u.type !== 'premium') return false
    if (statusFilter === 'blocked' && u.status !== 'blocked') return false
    if (statusFilter === 'deleted' && u.status !== 'deleted') return false

    const needle = search.toLowerCase()
    return (u.name ?? '').toLowerCase().includes(needle) ||
           (u.email ?? '').toLowerCase().includes(needle) ||
           (u.phone ?? '').includes(search)
  })

  const handleUserStatus = async (userId: string, action: 'verify' | 'block' | 'unblock') => {
    setUpdatingId(userId)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      })
      if (res.ok) {
        showToast(action === 'verify' ? 'User verified!' : action === 'block' ? 'User blocked' : 'User unblocked')
        fetchUsers()
      } else {
        showToast('Error updating user')
      }
    } catch {
      showToast('Error updating user')
    } finally {
      setUpdatingId(null)
    }
  }

  const exportCSV = () => {
    const rows = [
      ['Name', 'Email', 'Phone', 'Role', 'Status', 'Account Type', 'Registration Date'],
      ...filtered.map(u => [
        u.name ?? '-', u.email ?? '-', u.phone ?? '-', u.role ?? '-', u.status ?? '-', u.type ?? '-', formatDisplayDate(u.date)
      ])
    ]
    const csvContent = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `users_${roleFilter || statusFilter || 'all'}_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#11161E] border border-[#C5A880]/40 text-white px-5 py-3 rounded-xl shadow-xl">
          <Check className="w-4 h-4 text-[#C5A880]" /> {toast}
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-playfair text-3xl font-semibold text-white">User Management</h1>
          <p className="text-white/40 text-sm mt-1">Manage buyers, sellers, and verified user accounts · {filtered.length} shown ({users.length} total)</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/8 text-white/70 hover:text-white rounded-lg text-sm font-medium border border-white/10 hover:border-white/20 transition-all">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#C5A880] text-[#11161E] font-semibold text-sm rounded-lg hover:bg-[#A4855C] transition-all">
            <Plus className="w-4 h-4" /> Add New User
          </button>
        </div>
      </div>

      {/* Quick stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
          { label: 'Total Users', count: users.length, icon: Users, color: 'text-blue-400' },
          { label: 'Premium Accounts', count: users.filter(u => u.type === 'premium').length, icon: Award, color: 'text-amber-400' },
          { label: 'Verified Accounts', count: users.filter(u => u.status === 'verified').length, icon: UserCheck, color: 'text-emerald-400' },
          { label: 'Blocked Accounts', count: users.filter(u => u.status === 'blocked').length, icon: ShieldAlert, color: 'text-red-400' },
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

      {/* Search and Tabs */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users by name, email, phone..."
            className="w-full bg-[#11161E] border border-white/10 text-white pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#C5A880] transition-colors"
          />
        </div>

        {/* Excel-style tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-white/5 pb-2 overflow-x-auto scrollbar-none">
          {[
            { label: 'All Users', key: null, value: null },
            { label: 'Buyers', key: 'role', value: 'buyer' },
            { label: 'Sellers', key: 'role', value: 'seller' },
            { label: 'Verified', key: 'status', value: 'verified' },
            { label: 'Premium', key: 'status', value: 'premium' },
            { label: 'Blocked', key: 'status', value: 'blocked' },
            { label: 'Deleted', key: 'status', value: 'deleted' },
          ].map(t => {
            const isActive = t.key === null
              ? (!roleFilter && !statusFilter)
              : (t.key === 'role' ? roleFilter === t.value : statusFilter === t.value)
            return (
              <button key={t.label}
                onClick={() => {
                  if (t.key === null) router.push(pathname)
                  else router.push(`${pathname}?${t.key}=${t.value}`)
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-[#C5A880] text-[#11161E] font-bold'
                    : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
                }`}>
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Table list */}
      <div className="bg-[#11161E] rounded-xl border border-white/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/8">
                {['User Details', 'Role', 'Status', 'Account Type', 'Registration Date', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-4 text-[0.68rem] font-bold uppercase tracking-widest text-white/35">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-white/30 text-sm">
                    No users found matching query filters.
                  </td>
                </tr>
              ) : (
                filtered.map(u => (
                  <tr key={u.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-white text-sm font-semibold">{u.name}</p>
                      <p className="text-white/40 text-xs mt-0.5">{u.email} · {u.phone}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[0.65rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        u.role === 'buyer' ? 'bg-blue-500/10 text-blue-300' : 'bg-purple-500/10 text-purple-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                        u.status === 'verified' ? 'text-emerald-400' : u.status === 'blocked' ? 'text-red-400' : 'text-amber-400'
                      }`}>
                        {u.status === 'verified' && <Shield className="w-3.5 h-3.5 fill-current" />}
                        {u.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold ${u.type === 'premium' ? 'text-[#C5A880]' : 'text-white/50'}`}>
                        {u.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-white/60 text-sm whitespace-nowrap">
                      {formatDisplayDate(u.date)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {updatingId === u.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-white/40" />
                        ) : (
                          <>
                            {u.status !== 'verified' && (
                              <button
                                onClick={() => handleUserStatus(u.id, 'verify')}
                                className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/25 transition-all"
                                title="Verify / Approve user"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {u.status !== 'blocked' ? (
                              <button
                                onClick={() => handleUserStatus(u.id, 'block')}
                                className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center text-red-400 hover:bg-red-500/25 transition-all"
                                title="Block user"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUserStatus(u.id, 'unblock')}
                                className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/25 transition-all"
                                title="Unblock user"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </>
                        )}
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
