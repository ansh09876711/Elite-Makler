'use client'

import { useSearchParams } from 'next/navigation'
import { Plus, MessageSquare, BookOpen, User, Tag, Edit, Trash2 } from 'lucide-react'

const MOCK_POSTS = [
  { id: '1', title: 'Why Nipania is the Hotspot for Luxury Penthouses', category: 'Market Trends', author: 'Rohan Malhotra', comments: 12, date: '2026-07-09', status: 'published' },
  { id: '2', title: '5 Things to Inspect Before Buying a Private Mansion', category: 'Buying Guides', author: 'Divya Sharma', comments: 4, date: '2026-07-06', status: 'published' },
  { id: '3', title: 'How Indore Real Estate is Reshaping in 2026', category: 'Investment', author: 'Amitesh Shrivastava', comments: 0, date: '2026-07-02', status: 'draft' },
]

export default function AdminBlogPage() {
  const searchParams = useSearchParams()
  const tabFilter = searchParams.get('tab') || 'posts'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-semibold text-white">Blog Manager</h1>
          <p className="text-white/40 text-sm mt-1">Write articles, manage comments, categories and author credits</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#C5A880] text-[#11161E] font-semibold text-sm rounded-lg hover:bg-[#A4855C] transition-all">
          <Plus className="w-4 h-4" /> Write New Post
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3">
        {[
          { label: 'All Posts', val: 'posts' },
          { label: 'Comments', val: 'comments' },
          { label: 'Categories & Tags', val: 'tags' },
        ].map(tab => (
          <a
            key={tab.val}
            href={tab.val === 'posts' ? `/admin/blog` : `/admin/blog?tab=${tab.val}`}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              (tab.val === 'posts' && tabFilter === 'posts') || tabFilter === tab.val
                ? 'bg-[#C5A880] text-[#11161E]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {/* Blog list */}
      <div className="bg-[#11161E] rounded-xl border border-white/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/8">
                {['Article Title', 'Author', 'Category', 'Comments', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-4 text-[0.68rem] font-bold uppercase tracking-widest text-white/35">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_POSTS.map(post => (
                <tr key={post.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-white text-sm font-semibold">{post.title}</p>
                    <p className="text-white/40 text-xs mt-0.5">Published: {new Date(post.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </td>
                  <td className="px-5 py-4 text-white/70 text-sm flex items-center gap-1.5 pt-6">
                    <User className="w-3.5 h-3.5 text-[#C5A880]" /> {post.author}
                  </td>
                  <td className="px-5 py-4 text-white/60 text-xs uppercase tracking-wider">
                    {post.category}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-white/50 text-xs flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-400" /> {post.comments}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                      post.status === 'published' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-white/5 text-white/40'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs font-bold text-[#C5A880]">
                    <div className="flex gap-3">
                      <button className="hover:text-white"><Edit className="w-4 h-4" /></button>
                      <button className="hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
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
