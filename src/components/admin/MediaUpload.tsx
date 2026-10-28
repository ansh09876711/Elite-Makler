'use client'

import { useState, useRef, useImperativeHandle, forwardRef } from 'react'
import { X, Loader2, CheckCircle2, Image, Video } from 'lucide-react'

export interface MediaItem {
  id:        string
  file?:     File
  url?:      string
  preview:   string
  type:      'photo' | 'video'
  is_primary:boolean
  uploading: boolean
  uploaded:  boolean
  error:     string
}

export interface MediaUploadHandle {
  uploadAll: (pid: string, slug: string) => Promise<void>
}

const MediaUpload = forwardRef<MediaUploadHandle, Props>(({ propertyId, propertySlug }, ref) => {
  const [items,    setItems]    = useState<MediaItem[]>([])
  const [videoUrl, setVideoUrl] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  /* ── Add files from picker or drop ── */
  const addFiles = (fileList: FileList | File[]) => {
    const arr = Array.from(fileList).filter(f =>
      f.type.startsWith('image/') || f.type.startsWith('video/')
    )
    if (!arr.length) return
    setItems(prev => {
      const newItems: MediaItem[] = arr.map((f, i) => ({
        id:        crypto.randomUUID(),
        file:      f,
        preview:   URL.createObjectURL(f),
        type:      f.type.startsWith('video/') ? 'video' : 'photo',
        is_primary:prev.filter(p => p.type === 'photo').length === 0 && i === 0,
        uploading: false,
        uploaded:  false,
        error:     '',
      }))
      return [...prev, ...newItems]
    })
  }

  /* ── Add video URL ── */
  const addVideoUrl = () => {
    if (!videoUrl.trim()) return
    setItems(prev => [...prev, {
      id:        crypto.randomUUID(),
      url:       videoUrl.trim(),
      preview:   videoUrl.trim(),
      type:      'video',
      is_primary:false,
      uploading: false,
      uploaded:  false,
      error:     '',
    }])
    setVideoUrl('')
  }

  /* ── Remote Logger ── */
  const remoteLog = async (message: string, data: any) => {
    try {
      await fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, data })
      })
    } catch (e) {}
  }

  /* ── Upload single item ── */
  const uploadItem = async (item: MediaItem, pid: string, slug: string) => {
    if (!item.file) {
      await remoteLog('uploadItem: no file (skipping)', { id: item.id, url: item.url })
      return true // URL-only videos skip upload
    }
    await remoteLog('uploadItem: starting file upload', { name: item.file.name, size: item.file.size, type: item.file.type })
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, uploading: true, error: '' } : i))
    try {
      const fd = new FormData()
      fd.append('file',        item.file)
      fd.append('slug',        slug)
      fd.append('property_id', pid)
      fd.append('alt',         item.file.name)
      fd.append('is_primary',  item.is_primary ? 'true' : 'false')
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      await remoteLog('uploadItem: response received', { ok: res.ok, status: res.status, data })
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, uploading: false, uploaded: true } : i))
      return true
    } catch (err: any) {
      const errMsg = err.message || 'Upload failed'
      await remoteLog('uploadItem: error caught', { message: errMsg })
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, uploading: false, error: errMsg } : i))
      throw new Error(errMsg)
    }
  }

  /* ── Upload all pending — called from parent after property save ── */
  const uploadAll = async (pid: string, slug: string) => {
    await remoteLog('uploadAll called', { pid, slug, totalItems: items.length, items: items.map(i => ({ id: i.id, type: i.type, hasFile: !!i.file, uploaded: i.uploaded })) })
    const pending = items.filter(i => !i.uploaded && i.file)
    await remoteLog('uploadAll: pending items filtered', { count: pending.length })
    for (const item of pending) {
      await uploadItem(item, pid, slug)
    }
  }

  useImperativeHandle(ref, () => ({
    uploadAll
  }))

  const remove     = (id: string) => setItems(prev => prev.filter(i => i.id !== id))
  const setPrimary = (id: string) =>
    setItems(prev => prev.map(i => ({ ...i, is_primary: i.type === 'photo' && i.id === id })))

  const photos = items.filter(i => i.type === 'photo')
  const videos = items.filter(i => i.type === 'video')

  return (
    <div className="space-y-4">
      {/* Section divider */}
      <div className="flex items-center gap-2 pt-1">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-[0.6rem] font-bold uppercase tracking-widest text-[#C5A880]/60 px-2 flex items-center gap-1.5">
          <Image className="w-3 h-3" /> Photos &amp; <Video className="w-3 h-3" /> Videos
        </span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Drop zone — accepts both images and videos */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-7 text-center cursor-pointer
                    transition-all duration-200 select-none
                    ${dragOver
                      ? 'border-[#C5A880] bg-[#C5A880]/6 scale-[1.01]'
                      : 'border-white/15 hover:border-[#C5A880]/40 hover:bg-white/3'}`}
      >
        <div className="flex justify-center gap-3 text-3xl mb-2">📷 🎬</div>
        <p className="text-white/60 text-sm font-medium">
          Click or <span className="text-[#C5A880]">drag &amp; drop</span> photos or videos
        </p>
        <p className="text-white/25 text-xs mt-1">
          JPG · PNG · WEBP · MP4 · MOV · Multiple files OK
        </p>
      </div>
      <input ref={fileRef} type="file" accept="image/*,video/*" multiple
        className="hidden" onChange={e => e.target.files && addFiles(e.target.files)} />

      {/* Video URL */}
      <div className="flex gap-2">
        <input type="url" value={videoUrl} onChange={e => setVideoUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addVideoUrl())}
          placeholder="YouTube / Vimeo / Direct video URL..."
          className="flex-1 bg-[#0d1219] border border-white/10 text-white px-3 py-2.5
                     rounded-lg text-sm focus:outline-none focus:border-[#C5A880]
                     transition-colors placeholder:text-white/25" />
        <button type="button" onClick={addVideoUrl}
          className="px-4 py-2 bg-[#C5A880]/20 text-[#C5A880] rounded-lg text-sm
                     font-semibold hover:bg-[#C5A880]/30 transition-colors whitespace-nowrap">
          + Link
        </button>
      </div>

      {/* Photo grid */}
      {photos.length > 0 && (
        <div>
          <p className="text-[0.6rem] font-bold uppercase tracking-widest text-white/30 mb-2">
            Photos ({photos.length}) — hover to set main or delete
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {photos.map(photo => (
              <div key={photo.id}
                className="relative group rounded-lg overflow-hidden aspect-square bg-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.preview} alt="" className="w-full h-full object-cover" />

                {/* Status */}
                {photo.uploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-[#C5A880] animate-spin" />
                  </div>
                )}
                {photo.uploaded && !photo.uploading && (
                  <CheckCircle2 className="absolute top-1.5 right-1.5 w-4 h-4 text-emerald-400" />
                )}
                {photo.error && (
                  <div className="absolute inset-0 bg-red-900/50 flex items-center justify-center">
                    <span className="text-red-300 text-[0.6rem] font-bold">Failed</span>
                  </div>
                )}
                {photo.is_primary && (
                  <span className="absolute top-1 left-1 bg-[#C5A880] text-[#11161E]
                                   text-[0.48rem] font-bold px-1.5 py-0.5 rounded-sm uppercase">
                    Main
                  </span>
                )}

                {/* Hover actions */}
                <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100
                                transition-opacity flex items-center justify-center gap-1.5">
                  {!photo.is_primary && (
                    <button type="button" onClick={() => setPrimary(photo.id)}
                      className="text-[0.5rem] bg-[#C5A880] text-[#11161E] px-2 py-1
                                 rounded font-bold uppercase">
                      Main
                    </button>
                  )}
                  <button type="button" onClick={() => remove(photo.id)}
                    className="w-6 h-6 bg-red-500 rounded-full flex items-center
                               justify-center text-white">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Videos list */}
      {videos.length > 0 && (
        <div>
          <p className="text-[0.6rem] font-bold uppercase tracking-widest text-white/30 mb-2">
            Videos ({videos.length})
          </p>
          <div className="space-y-2">
            {videos.map(v => (
              <div key={v.id}
                className="flex items-center gap-3 bg-white/4 border border-white/8
                           rounded-lg px-3 py-2.5">
                <span className="text-xl flex-shrink-0">{v.file ? '🎬' : '🔗'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/70 truncate">
                    {v.file ? v.file.name : v.url}
                  </p>
                  {v.uploading && <p className="text-[#C5A880] text-xs">Uploading...</p>}
                  {v.uploaded  && <p className="text-emerald-400 text-xs">✓ Uploaded</p>}
                  {v.error     && <p className="text-red-400 text-xs">{v.error}</p>}
                </div>
                <button type="button" onClick={() => remove(v.id)}
                  className="text-red-400/60 hover:text-red-400 transition-colors flex-shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {items.length > 0 && (
        <p className="text-white/20 text-xs text-center">
          {items.filter(i => i.uploaded).length}/{items.length} uploaded ·
          Files will upload automatically when you save the property
        </p>
      )}
    </div>
  )
})

MediaUpload.displayName = 'MediaUpload'

export default MediaUpload
