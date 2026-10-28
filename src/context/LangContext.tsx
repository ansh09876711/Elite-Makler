'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Lang } from '@/lib/translations'

interface LangCtx {
  lang:      Lang
  toggleLang: () => void
}

const LangContext = createContext<LangCtx>({ lang: 'en', toggleLang: () => {} })

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    const saved = localStorage.getItem('lh_lang') as Lang | null
    if (saved === 'hi' || saved === 'en') setLang(saved)
  }, [])

  const toggleLang = () => {
    setLang(prev => {
      const next = prev === 'en' ? 'hi' : 'en'
      localStorage.setItem('lh_lang', next)
      return next
    })
  }

  return (
    <LangContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
