'use client'

import { useSearchParams } from 'next/navigation'
import { Image, Video, FileText, Globe, UploadCloud, FolderOpen } from 'lucide-react'

export default function AdminMediaPage() {
  const searchParams = useSearchParams()
  const typeFilter = searchParams.get('type') || 'images'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-3xl font-semibold text-white">Media Library</h1>
        <p className="text-white/40 text-sm mt-1">Manage property images, vertical videos, floor plans, and brochures</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3">
        {[
          { label: 'Images', val: 'images' },
          { label: 'Videos', val: 'videos' },
          { label: 'Floor Plans', val: 'floorplans' },
          { label: 'Brochures & Documents', val: 'documents' },
        ].map(tab => (
          <a
            key={tab.val}
            href={tab.val === 'images' ? `/admin/media` : `/admin/media?type=${tab.val}`}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              (tab.val === 'images' && typeFilter === 'images') || typeFilter === tab.val
                ? 'bg-[#C5A880] text-[#11161E]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {/* Upload Zone */}
      <div className="border border-dashed border-white/20 hover:border-[#C5A880]/50 rounded-2xl p-10 text-center bg-[#11161E]/50 cursor-pointer transition-colors group">
        <UploadCloud className="w-10 h-10 text-white/30 group-hover:text-[#C5A880] mx-auto mb-3 transition-colors" />
        <h3 className="text-white font-semibold text-base">Drag & drop your files here</h3>
        <p className="text-white/40 text-xs mt-1">Supports high-res JPG, PNG, MP4 format media files</p>
      </div>

      {/* Media Grid Placeholder */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-[#11161E] rounded-xl border border-white/8 overflow-hidden relative group">
            <div className="aspect-[4/3] bg-gradient-to-br from-[#1a2130] to-[#0d1219] flex items-center justify-center text-white/20">
              {typeFilter === 'videos' ? (
                <Video className="w-8 h-8 opacity-45" />
              ) : typeFilter === 'floorplans' || typeFilter === 'documents' ? (
                <FileText className="w-8 h-8 opacity-45" />
              ) : (
                <FolderOpen className="w-8 h-8 opacity-45" />
              )}
            </div>
            <div className="p-3">
              <p className="text-white/70 text-xs font-semibold truncate">Asset_{i+1}.ext</p>
              <p className="text-white/30 text-[0.65rem] mt-0.5">Size: 2.4 MB</p>
            </div>
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
              <button className="px-3 py-1 bg-white text-[#11161E] rounded text-xs font-bold hover:bg-neutral-200">View</button>
              <button className="px-3 py-1 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
