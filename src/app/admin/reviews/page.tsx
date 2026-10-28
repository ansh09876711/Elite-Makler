'use client'

import { useSearchParams } from 'next/navigation'
import { Star, Check, X, ShieldAlert, User } from 'lucide-react'

const MOCK_REVIEWS = [
  { id: '1', author: 'Sameer Sen', target: 'The Nipania Sky Penthouse', type: 'property', rating: 5, text: 'Absolutely spectacular panoramic views and premium luxury marble finishing. Loved it!', status: 'pending' },
  { id: '2', author: 'Rahul Varma', target: 'Amitesh Shrivastava', type: 'agent', rating: 4, text: 'Very professional, coordinated the entire site visit process and documentation seamlessly.', status: 'approved' },
  { id: '3', author: 'Neha Lulla', target: 'The Palasia Legacy Mansion', type: 'property', rating: 2, text: 'The location is excellent but ready dates were delayed and the layout design felt a bit old.', status: 'pending' },
]

export default function AdminReviewsPage() {
  const searchParams = useSearchParams()
  const filterType = searchParams.get('type') || 'properties' // 'agents' | 'reported'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-3xl font-semibold text-white">Ratings & Reviews</h1>
        <p className="text-white/40 text-sm mt-1">Monitor property and agent reviews, approve or reject feedback submissions</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3">
        {[
          { label: 'Property Reviews', val: 'properties' },
          { label: 'Agent Reviews', val: 'agents' },
        ].map(tab => (
          <a
            key={tab.val}
            href={tab.val === 'properties' ? `/admin/reviews` : `/admin/reviews?type=${tab.val}`}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              (tab.val === 'properties' && filterType === 'properties') || filterType === tab.val
                ? 'bg-[#C5A880] text-[#11161E]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {MOCK_REVIEWS.filter(r => (filterType === 'agents' ? r.type === 'agent' : r.type === 'property')).map(rev => (
          <div key={rev.id} className="bg-[#11161E] border border-white/8 rounded-xl p-5 space-y-3 hover:border-white/12 transition-all">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 text-xs">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">{rev.author}</h4>
                  <p className="text-white/35 text-[0.65rem] uppercase tracking-wider mt-0.5">Reviewed: <span className="text-[#C5A880]">{rev.target}</span></p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'text-amber-400 fill-current' : 'text-white/10'}`} />
                ))}
              </div>
            </div>

            <p className="text-white/70 text-sm leading-relaxed">{rev.text}</p>

            <div className="flex items-center justify-between border-t border-white/5 pt-3 text-xs">
              <span className={`text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                rev.status === 'approved' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'
              }`}>
                {rev.status}
              </span>

              {rev.status === 'pending' && (
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/15 text-emerald-400 font-bold rounded hover:bg-emerald-500 hover:text-[#11161E] transition-all border border-emerald-500/20">
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-red-500/15 text-red-400 font-bold rounded hover:bg-red-500 hover:text-white transition-all border border-red-500/20">
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
