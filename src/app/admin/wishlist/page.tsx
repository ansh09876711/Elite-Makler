'use client'

import { useSearchParams } from 'next/navigation'
import { Heart, TrendingUp, Eye, MapPin, Building2 } from 'lucide-react'

const MOCK_SAVED = [
  { id: '1', title: 'The Nipania Sky Penthouse', address: 'Nipania, Indore', saves: 42, views: 1205, type: 'penthouse' },
  { id: '2', title: 'The Bypass Forest Retreat', address: 'Bypass Road, Indore', saves: 38, views: 980, type: 'villa' },
  { id: '3', title: 'The Palasia Legacy Mansion', address: 'Saket, Indore', saves: 29, views: 840, type: 'mansion' },
]

export default function AdminWishlistPage() {
  const searchParams = useSearchParams()
  const tabFilter = searchParams.get('tab') || 'wishlist'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-3xl font-semibold text-white">Wishlist & Saved Properties</h1>
        <p className="text-white/40 text-sm mt-1">Track which properties are trending and saved most by registered buyers</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3">
        {[
          { label: 'Saved Insights', val: 'wishlist' },
          { label: 'Trending Properties', val: 'trending' },
        ].map(tab => (
          <a
            key={tab.val}
            href={tab.val === 'wishlist' ? `/admin/wishlist` : `/admin/wishlist?tab=${tab.val}`}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              (tab.val === 'wishlist' && tabFilter === 'wishlist') || tabFilter === tab.val
                ? 'bg-[#C5A880] text-[#11161E]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {/* Analytics widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#11161E] border border-white/8 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Total Wishlist Saves</p>
            <h3 className="text-white text-2xl font-bold mt-1.5 flex items-center gap-1.5"><Heart className="w-5 h-5 text-red-400 fill-current" /> 109 Saves</h3>
          </div>
        </div>
        <div className="bg-[#11161E] border border-white/8 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Avg Saves Per Listing</p>
            <h3 className="text-white text-2xl font-bold mt-1.5">6.8</h3>
          </div>
        </div>
        <div className="bg-[#11161E] border border-white/8 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Conversion Interest</p>
            <h3 className="text-white text-2xl font-bold mt-1.5 text-emerald-400">+14%</h3>
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-[#11161E] rounded-xl border border-white/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/8">
                {['Property details', 'Type', 'Saves Count', 'Views Count', 'Score'].map(h => (
                  <th key={h} className="px-5 py-4 text-[0.68rem] font-bold uppercase tracking-widest text-white/35">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_SAVED.map(p => (
                <tr key={p.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-white text-sm font-semibold">{p.title}</p>
                    <p className="text-white/40 text-xs mt-0.5 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {p.address}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-white/60 text-xs capitalize flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#C5A880]" /> {p.type}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-red-400 font-semibold text-sm flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 fill-current" /> {p.saves}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-white/70 text-sm flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" /> {p.views.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-bold text-[#C5A880] flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> High Interest
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
