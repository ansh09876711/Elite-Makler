'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Phone, User, LogOut, Heart, ChevronDown, LayoutDashboard } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLang } from '@/context/LangContext'
import { t } from '@/lib/translations'
import AuthModal from './AuthModal'

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [authOpen,   setAuthOpen]   = useState(false)
  const [authMode,   setAuthMode]   = useState<'login' | 'register'>('login')
  const [userMenu,   setUserMenu]   = useState(false)

  const { user, signOut, loading, isAdmin } = useAuth()
  const { lang, toggleLang }             = useLang()
  const tr = t[lang]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode)
    setAuthOpen(true)
    setMenuOpen(false)
  }

  const navLinks = [
    { href: '/',           label: tr.home },
    { href: '/properties', label: tr.properties },
    { href: '/localities', label: tr.localities },
    { href: '/services',   label: tr.services },
    { href: '/about',      label: tr.about },
    { href: '/contact',    label: tr.contact },
  ]

  // Dynamic Theme Helpers
  const textTheme = scrolled 
    ? 'text-white/70 hover:text-white' 
    : 'text-[#1E242B]/80 hover:text-[#C5A880]'
  const titleTheme = scrolled 
    ? 'text-white' 
    : 'text-[#1E242B]'
  const borderTheme = scrolled 
    ? 'border-white/20 hover:border-[#C5A880]/50 text-white/70 hover:text-white' 
    : 'border-[#1E242B]/20 hover:border-[#C5A880] text-[#1E242B]/70 hover:text-[#1E242B]'
  const iconButtonTheme = scrolled
    ? 'bg-white/10 hover:bg-white/15 text-white'
    : 'bg-[#1E242B]/5 hover:bg-[#1E242B]/10 text-[#1E242B]'

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'h-20 bg-[#11161E]/96 backdrop-blur-md shadow-lg border-b border-white/5'
            : 'h-24 bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <img
              src="/images/logo.png"
              alt="EM Real Estate Logo"
              className="w-14 h-14 object-contain"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            <span className={`font-playfair text-lg font-bold tracking-widest transition-colors duration-300 ${titleTheme}`}>
              ELITE <span className="text-[#C5A880] font-normal">MAKLER</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#C5A880] hover:after:w-full after:transition-all after:duration-300 py-1 ${textTheme}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-3">

            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-xs font-semibold ${borderTheme}`}
              aria-label="Toggle language"
            >
              <span className="text-sm">{lang === 'en' ? '🇮🇳' : '🇬🇧'}</span>
              {lang === 'en' ? 'हिंदी' : 'EN'}
            </button>

            {/* Auth — not logged in */}
            {!loading && !user && (
              <>
                <button
                  onClick={() => openAuth('login')}
                  className={`text-sm font-semibold transition-colors duration-300 ${scrolled ? 'text-white/75 hover:text-white' : 'text-[#1E242B]/75 hover:text-[#C5A880]'}`}
                >
                  {tr.login}
                </button>
                <button
                  onClick={() => openAuth('register')}
                  className="px-4 py-2 bg-[#C5A880] text-[#11161E] font-semibold text-xs
                             rounded-full hover:bg-[#A4855C] transition-all shadow-md"
                >
                  {tr.register}
                </button>
              </>
            )}

            {/* Auth — logged in */}
            {!loading && user && (
              <div className="relative">
                <button
                  onClick={() => setUserMenu(v => !v)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${iconButtonTheme}`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#C5A880] flex items-center
                                  justify-center text-[#11161E] text-xs font-bold shadow-sm">
                    {user.email?.[0].toUpperCase() ?? 'U'}
                  </div>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>

                {userMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenu(false)} />
                    <div className="absolute right-0 top-10 bg-white rounded-xl
                                    shadow-2xl border border-[#EAE6E1] py-2 w-48 z-20 animate-fade-in">
                      <div className="px-4 py-2 border-b border-[#EAE6E1]">
                        <p className="text-xs font-semibold text-[#11161E] truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#1E242B]
                                   hover:bg-[#FAF9F6] transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-[#A4855C]" /> {tr.myProfile}
                      </Link>
                      <Link
                        href="/saved"
                        onClick={() => setUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#1E242B]
                                   hover:bg-[#FAF9F6] transition-colors"
                      >
                        <Heart className="w-3.5 h-3.5 text-[#A4855C]" /> {tr.savedProperties}
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#1E242B]
                                     hover:bg-[#FAF9F6] transition-colors"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-[#A4855C]" /> {tr.dashboard}
                        </Link>
                      )}
                      <button
                        onClick={() => { signOut(); setUserMenu(false) }}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500
                                   hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" /> {tr.logout}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Schedule Visit */}
            <Link
              href="/contact"
              className={`px-4 py-2 border text-xs font-bold rounded-full transition-all duration-300 ${
                scrolled
                  ? 'border-[#C5A880]/50 text-[#C5A880] hover:bg-[#C5A880] hover:text-[#11161E]'
                  : 'border-[#1E242B]/30 text-[#1E242B] hover:bg-[#1E242B] hover:text-white'
              }`}
            >
              {tr.scheduleVisit}
            </Link>
          </div>

          {/* Mobile actions */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Language toggle mobile */}
            <button
              onClick={toggleLang}
              className={`text-xs px-2 py-1 rounded border transition-all font-semibold ${
                scrolled 
                  ? 'text-white/70 border-white/20 hover:border-[#C5A880]/50' 
                  : 'text-[#1E242B]/75 border-[#1E242B]/20 hover:border-[#C5A880]'
              }`}
            >
              {lang === 'en' ? 'हि' : 'EN'}
            </button>
            <a
              href="tel:+917315550000"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${iconButtonTheme}`}
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMenuOpen(v => !v)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${iconButtonTheme}`}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <nav
        className={`fixed top-0 right-0 h-full w-72 z-50 bg-[#11161E] flex flex-col
                    transition-transform duration-300 lg:hidden
                    ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="EM Logo"
              className="w-8 h-8 object-contain rounded"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            <span className="font-playfair text-lg font-bold text-white tracking-widest">
              ELITE <span className="text-[#C5A880] font-normal">MAKLER</span>
            </span>
          </div>
          <button onClick={() => setMenuOpen(false)} className="text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <ul className="flex-1 py-4 overflow-y-auto">
          {navLinks.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-6 py-3.5 text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
              >
                {link.label}
              </Link>
            </li>
          ))}
          {user && isAdmin && (
            <li>
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-6 py-3.5 text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
              >
                <LayoutDashboard className="w-4 h-4" /> {tr.dashboard}
              </Link>
            </li>
          )}
        </ul>
      </nav>
      {/* Auth Modal */}
      <AuthModal
        open={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onSwitch={(mode) => setAuthMode(mode)}
      />
    </>
  )
}
