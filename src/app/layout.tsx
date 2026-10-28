import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { LangProvider } from '@/context/LangContext'
import { AuthProvider } from '@/context/AuthContext'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'Elite Makler | Luxury Real Estate Indore',
  description:
    'Discover curated luxury properties, penthouses, and private estates in Indore. Experience bespoke real estate service with Elite Makler.',
  keywords: 'luxury real estate indore, villas indore, penthouses indore, ELITE MAKLER',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <LangProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LangProvider>
      </body>
    </html>
  )
}


