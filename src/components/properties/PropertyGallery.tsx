'use client'

import { useState } from 'react'
import { Play, X, ChevronLeft, ChevronRight, Image as ImageIcon, Film, Maximize2 } from 'lucide-react'

interface ImageItem {
  id: string
  url: string
  alt?: string
  is_primary: boolean
}

interface PropertyGalleryProps {
  images: ImageItem[]
  title: string
}

function isVideoUrl(url: string) {
  if (!url) return false
  return url.includes('/video/upload/') ||
         url.includes('youtube.com') ||
         url.includes('youtu.be') ||
         url.includes('vimeo.com') ||
         /\.(mp4|webm|ogv|mov|avi|mkv|3gp)($|\?)/i.test(url)
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"

export default function PropertyGallery({ images = [], title }: PropertyGalleryProps) {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos')
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({})

  // Filter and sort media items
  const allMedia = [...images].sort((a, b) => {
    if (a.is_primary) return -1
    if (b.is_primary) return 1
    return 0
  })

  const photos = allMedia.filter(item => !isVideoUrl(item.url))
  const videos = allMedia.filter(item => isVideoUrl(item.url))

  if (images.length === 0) {
    return (
      <div className="w-full h-[40vh] bg-neutral-100 dark:bg-[#11161E] flex flex-col items-center justify-center text-neutral-400 dark:text-white/30 border border-neutral-200 dark:border-white/5 rounded-2xl gap-2 shadow-inner">
        <ImageIcon className="w-8 h-8 text-[#C5A880]/60 animate-pulse" />
        <p className="text-sm font-medium tracking-wide">No photos or videos uploaded yet</p>
      </div>
    )
  }

  // Lightbox handlers
  const handleLightboxPrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (lightboxIndex === null) return
    const currentList = activeTab === 'photos' ? photos : videos
    setLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : currentList.length - 1))
  }

  const handleLightboxNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (lightboxIndex === null) return
    const currentList = activeTab === 'photos' ? photos : videos
    setLightboxIndex(prev => (prev !== null && prev < currentList.length - 1 ? prev + 1 : 0))
  }

  // Carousel handlers
  const handleCarouselPrev = () => {
    setActivePhotoIndex(prev => (prev > 0 ? prev - 1 : photos.length - 1))
  }

  const handleCarouselNext = () => {
    setActivePhotoIndex(prev => (prev < photos.length - 1 ? prev + 1 : 0))
  }

  const handleImageError = (url: string) => {
    console.log("Image failed to load:", url)
    setFailedUrls(prev => ({ ...prev, [url]: true }))
  }

  return (
    <div className="space-y-4">
      {/* ── TABS NAVIGATION ── */}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-3">
        <div className="flex gap-2 bg-neutral-100 dark:bg-white/5 p-1 rounded-xl border border-neutral-200 dark:border-white/5 backdrop-blur-md">
          <button
            onClick={() => setActiveTab('photos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'photos'
                ? 'bg-[#C5A880] text-[#11161E] shadow-md font-bold'
                : 'text-neutral-600 dark:text-white/60 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-white/5'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Photos ({photos.length})
          </button>
          
          {videos.length > 0 && (
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'videos'
                  ? 'bg-[#C5A880] text-[#11161E] shadow-md font-bold'
                  : 'text-neutral-600 dark:text-white/60 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-white/5'
              }`}
            >
              <Film className="w-4 h-4" />
              Videos ({videos.length})
            </button>
          )}
        </div>

        <span className="text-[0.65rem] uppercase tracking-widest text-[#A4855C] font-bold bg-[#C5A880]/10 px-3 py-1 rounded-md border border-[#C5A880]/20">
          LuxeHaven Media
        </span>
      </div>

      {/* ── PHOTO SCROLLER CAROUSEL TAB ── */}
      {activeTab === 'photos' && photos.length > 0 && (
        <div className="space-y-3">
          {/* Main Visual Frame */}
          <div className="w-full h-[50vh] md:h-[65vh] relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/10 shadow-2xl bg-[#0d1219] group">
            <img
              src={failedUrls[photos[activePhotoIndex].url] ? FALLBACK_IMAGE : photos[activePhotoIndex].url}
              alt={photos[activePhotoIndex].alt || `${title} - Image ${activePhotoIndex + 1}`}
              className="w-full h-full object-cover transition-all duration-500 ease-in-out"
              onError={() => handleImageError(photos[activePhotoIndex].url)}
            />

            {/* Left navigation arrow */}
            {photos.length > 1 && (
              <button
                onClick={handleCarouselPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-[#C5A880] hover:text-[#11161E] text-white backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 z-10 shadow-lg"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Right navigation arrow */}
            {photos.length > 1 && (
              <button
                onClick={handleCarouselNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-[#C5A880] hover:text-[#11161E] text-white backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 z-10 shadow-lg"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Zoom / Fullscreen Button */}
            <button
              onClick={() => setLightboxIndex(activePhotoIndex)}
              className="absolute top-4 right-4 bg-black/55 hover:bg-[#C5A880] hover:text-[#11161E] border border-white/10 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-2xl backdrop-blur-md transition-all flex items-center gap-1.5 z-10"
            >
              <Maximize2 className="w-3.5 h-3.5" /> Fullscreen
            </button>

            {/* Bottom Floating Index Indicator */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3.5 py-1 rounded-lg text-xs font-semibold text-white/90 shadow-md">
              {activePhotoIndex + 1} / {photos.length}
            </div>
          </div>

          {/* Horizontal Preview Thumbnail Strip */}
          {photos.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto py-2.5 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-white/15 pr-2">
              {photos.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`relative w-20 h-14 md:w-28 md:h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ${
                    idx === activePhotoIndex
                      ? 'border-[#C5A880] scale-102 shadow-lg ring-2 ring-[#C5A880]/30'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={failedUrls[item.url] ? FALLBACK_IMAGE : item.url}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(item.url)}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── PREMIUM VIDEO GALLERY TAB (PREVENTS CROPPING) ── */}
      {activeTab === 'videos' && videos.length > 0 && (
        <div className="w-full max-w-4xl mx-auto relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/10 shadow-2xl bg-[#0d1219] p-4 flex flex-col md:flex-row gap-4 h-[60vh] min-h-[400px]">
          {/* Main Video Viewport */}
          <div className="flex-1 bg-black rounded-xl overflow-hidden relative flex items-center justify-center border border-white/5">
            
            {/* Blurred background layer to fill side bars gracefully */}
            {!videos[0].url.match(/(youtube\.com|youtu\.be|vimeo\.com)/) && (
              <video
                src={videos[0].url}
                className="absolute inset-0 w-full h-full object-cover filter blur-2xl opacity-40 scale-105 pointer-events-none"
                muted
                playsInline
              />
            )}
            
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              {videos[0].url.match(/(youtube\.com|youtu\.be)/) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${
                    videos[0].url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]
                  }?rel=0`}
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              ) : videos[0].url.includes('vimeo.com') ? (
                <iframe
                  src={`https://player.vimeo.com/video/${
                    videos[0].url.match(/vimeo\.com\/(\d+)/)?.[1]
                  }`}
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              ) : (
                <video
                  src={videos[0].url}
                  controls
                  className="w-full h-full object-contain"
                  preload="metadata"
                />
              )}
            </div>
            
            <button 
              onClick={() => setLightboxIndex(0)}
              className="absolute top-4 right-4 bg-[#11161E]/80 hover:bg-[#C5A880] hover:text-[#11161E] border border-white/15 px-3 py-1.5 rounded-lg text-xs font-semibold text-white/90 shadow-xl transition-all flex items-center gap-1.5 z-20"
            >
              <Maximize2 className="w-3.5 h-3.5" /> Fullscreen
            </button>
          </div>

          {/* Video List Sidebar */}
          {videos.length > 1 && (
            <div className="w-full md:w-60 flex flex-col gap-2 overflow-y-auto max-h-full pr-1">
              <p className="text-[0.6rem] font-bold uppercase tracking-widest text-white/40 mb-1">
                More Videos ({videos.length})
              </p>
              {videos.map((video, idx) => (
                <div
                  key={video.id}
                  onClick={() => setLightboxIndex(idx)}
                  className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-2.5 cursor-pointer transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#C5A880]/10 flex items-center justify-center text-[#C5A880] flex-shrink-0">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/80 font-semibold truncate">Video #{idx + 1}</p>
                    <p className="text-[0.6rem] text-white/40 uppercase tracking-wider mt-0.5">Click to play</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── DYNAMIC LIGHTBOX OVERLAY ── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-between p-4 md:p-8 select-none backdrop-blur-sm animate-fade-in"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Info Bar */}
          <div className="w-full flex items-center justify-between text-white/70 max-w-7xl">
            <span className="text-xs font-semibold font-mono tracking-widest bg-white/5 border border-white/10 px-3 py-1 rounded-md">
              {lightboxIndex + 1} / {activeTab === 'photos' ? photos.length : videos.length}
            </span>
            <button
              onClick={() => setLightboxIndex(null)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Viewer */}
          <div className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center">
            
            {/* Prev Button */}
            {(activeTab === 'photos' ? photos.length : videos.length) > 1 && (
              <button
                onClick={handleLightboxPrev}
                className="absolute left-0 md:-left-16 z-10 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#C5A880] hover:text-[#11161E] hover:border-transparent transition-all duration-300 transform -translate-x-2 md:translate-x-0"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Content box */}
            <div 
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {activeTab === 'videos' ? (
                <div className="w-full h-full max-h-[65vh] rounded-xl overflow-hidden bg-black border border-white/5 shadow-2xl flex items-center justify-center">
                  {videos[lightboxIndex].url.match(/(youtube\.com|youtu\.be)/) ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${
                        videos[lightboxIndex].url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]
                      }?autoplay=1&rel=0`}
                      className="w-full h-full border-0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  ) : videos[lightboxIndex].url.includes('vimeo.com') ? (
                    <iframe
                      src={`https://player.vimeo.com/video/${
                        videos[lightboxIndex].url.match(/vimeo\.com\/(\d+)/)?.[1]
                      }?autoplay=1`}
                      className="w-full h-full border-0"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={videos[lightboxIndex].url}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={failedUrls[photos[lightboxIndex].url] ? FALLBACK_IMAGE : photos[lightboxIndex].url}
                    alt={photos[lightboxIndex].alt || `Photo view`}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    onError={() => handleImageError(photos[lightboxIndex].url)}
                  />
                </div>
              )}
            </div>

            {/* Next Button */}
            {(activeTab === 'photos' ? photos.length : videos.length) > 1 && (
              <button
                onClick={handleLightboxNext}
                className="absolute right-0 md:-right-16 z-10 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#C5A880] hover:text-[#11161E] hover:border-transparent transition-all duration-300 transform translate-x-2 md:translate-x-0"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Caption */}
          <div className="text-center max-w-2xl px-4 py-2">
            <h4 className="text-white font-medium text-sm truncate">{title}</h4>
            <p className="text-white/40 text-[0.65rem] mt-1 font-mono uppercase tracking-wider">
              {activeTab === 'photos' ? `Photo #${lightboxIndex + 1}` : `Video #${lightboxIndex + 1}`}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
