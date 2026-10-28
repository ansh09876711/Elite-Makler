'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { isAdminEmail } from '@/lib/admin'
import Link from 'next/link'
import {
  LayoutDashboard, Building2, Tag, MapPin, Users, Award,
  MessageSquare, Calendar, Wallet, Image as ImageIcon, Star, Heart,
  TrendingUp, Megaphone, BookOpen, FileText, HelpCircle, Bell,
  User, Settings, Lock, Globe, LogOut, Menu, X, ChevronDown, ChevronRight,
  Shield, Briefcase
} from 'lucide-react'

interface SubItem {
  label: string
  href: string
}

interface NavItem {
  id: string
  label: string
  icon: any
  href?: string
  subItems: SubItem[]
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
    subItems: []
  },
  {
    id: 'properties',
    label: 'Properties',
    icon: Building2,
    href: '/admin/properties',
    subItems: []
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users,
    href: '/admin/users',
    subItems: []
  },
  {
    id: 'partners',
    label: 'Partners',
    icon: Briefcase,
    href: '/admin/partners',
    subItems: []
  },
  {
    id: 'agents',
    label: 'Agents',
    icon: Award,
    href: '/admin/agents',
    subItems: []
  },
  {
    id: 'enquiries',
    label: 'Enquiries',
    icon: MessageSquare,
    href: '/admin/enquiries',
    subItems: []
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: Wallet,
    subItems: [
      { label: 'Transactions', href: '/admin/finance' },
      { label: 'Payments', href: '/admin/finance?tab=payments' },
      { label: 'Commissions', href: '/admin/finance?tab=commissions' },
      { label: 'Invoices', href: '/admin/finance?tab=invoices' },
      { label: 'Wallet', href: '/admin/finance?tab=wallet' },
      { label: 'Refunds', href: '/admin/finance?tab=refunds' },
      { label: 'Revenue', href: '/admin/finance?tab=revenue' },
    ]
  },
  {
    id: 'reviews',
    label: 'Reviews',
    icon: Star,
    subItems: [
      { label: 'Property Reviews', href: '/admin/reviews' },
      { label: 'Agent Reviews', href: '/admin/reviews?type=agents' },
      { label: 'Reported Reviews', href: '/admin/reviews?type=reported' },
      { label: 'Pending Approval', href: '/admin/reviews?status=pending' },
    ]
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: FileText,
    subItems: [
      { label: 'Sales Report', href: '/admin/reports?tab=sales' },
      { label: 'User Report', href: '/admin/reports?tab=users' },
      { label: 'Property Report', href: '/admin/reports?tab=properties' },
      { label: 'Agent Report', href: '/admin/reports?tab=agents' },
      { label: 'Finance Report', href: '/admin/reports?tab=finance' },
      { label: 'Export Excel/PDF', href: '/admin/reports?tab=export' },
    ]
  },
  {
    id: 'support',
    label: 'Support',
    icon: HelpCircle,
    subItems: [
      { label: 'Tickets', href: '/admin/support' },
      { label: 'Live Chat', href: '/admin/support?tab=chat' },
      { label: 'Contact Messages', href: '/admin/support?tab=messages' },
      { label: 'FAQ', href: '/admin/support?tab=faq' },
      { label: 'Feedback', href: '/admin/support?tab=feedback' },
    ]
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    subItems: [
      { label: 'Send Notification', href: '/admin/notifications' },
      { label: 'Email Templates', href: '/admin/notifications?tab=email' },
      { label: 'SMS Templates', href: '/admin/notifications?tab=sms' },
      { label: 'Notification History', href: '/admin/notifications?tab=history' },
    ]
  },
  {
    id: 'roles',
    label: 'Roles & Powers',
    icon: Shield,
    subItems: [
      { label: 'Partner Powers', href: '/admin/roles' },
      { label: 'Agent Powers',   href: '/admin/roles?tab=agents' },
    ]
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: User,
    subItems: [
      { label: 'Admin Users', href: '/admin/settings' },
      { label: 'Activity Logs', href: '/admin/settings?tab=logs' },
      { label: 'Login History', href: '/admin/settings?tab=logins' },
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    subItems: [
      { label: 'General', href: '/admin/settings' },
      { label: 'SEO', href: '/admin/settings?tab=seo' },
      { label: 'Theme', href: '/admin/settings?tab=theme' },
      { label: 'Social Links', href: '/admin/settings?tab=social' },
      { label: 'Contact Details', href: '/admin/settings?tab=contact' },
      { label: 'SMTP', href: '/admin/settings?tab=smtp' },
      { label: 'Payment Gateway', href: '/admin/settings?tab=gateway' },
      { label: 'API Keys', href: '/admin/settings?tab=keys' },
      { label: 'Backup', href: '/admin/settings?tab=backup' },
    ]
  },
  {
    id: 'security',
    label: 'Security',
    icon: Lock,
    subItems: [
      { label: 'Two Factor', href: '/admin/security' },
      { label: 'Login Logs', href: '/admin/security?tab=logs' },
      { label: 'Backup', href: '/admin/security/backup' },
      { label: 'Restore', href: '/admin/security/restore' },
      { label: 'Firewall', href: '/admin/security/firewall' },
    ]
  },
  {
    id: 'website',
    label: 'Website',
    icon: Globe,
    subItems: [
      { label: 'Homepage', href: '/' },
      { label: 'About Us', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Terms', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'View Website', href: '/' },
    ]
  }
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarDesktop, setSidebarDesktop] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    dashboard: true,
  })

  useEffect(() => {
    if (!loading) {
      if (!user) { router.replace('/'); return }
      if (!isAdminEmail(user.email)) { router.replace('/'); return }
    }
  }, [user, loading, router])

  // Automatically expand the section that matches active path
  useEffect(() => {
    navItems.forEach(item => {
      if (item.subItems) {
        const hasActiveSub = item.subItems.some(sub => sub.href === pathname)
        if (hasActiveSub) {
          setExpandedSections(prev => ({ ...prev, [item.id]: true }))
        }
      }
    })
  }, [pathname])

  if (loading || !user || !isAdminEmail(user.email)) {
    return (
      <div className="min-h-screen bg-[#0d1219] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50 text-sm">Verifying access...</p>
        </div>
      </div>
    )
  }

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const isExpanded = sidebarDesktop || isHovered

  return (
    <div className="min-h-screen bg-[#0d1219] flex">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden"
             onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside 
        onMouseEnter={() => !sidebarDesktop && setIsHovered(true)}
        onMouseLeave={() => !sidebarDesktop && setIsHovered(false)}
        className={`
          fixed top-0 left-0 h-full z-40 bg-[#11161E] border-r border-white/8
          flex flex-col transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          ${isExpanded ? 'w-64' : 'w-16'}
          w-64
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/8 h-16 flex-shrink-0">
          <img src="/images/logo.png" alt="EM Logo"
            className="w-8 h-8 object-contain flex-shrink-0"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
          <span className={`font-playfair text-sm font-bold text-white tracking-widest
                           transition-all duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
            ELITE <span className="text-[#C5A880] font-normal">MAKLER</span>
          </span>
        </div>

        {/* Admin info badge */}
        <div className={`mx-3 mt-3 px-3 py-2 bg-[#C5A880]/10 border border-[#C5A880]/20 rounded-lg flex-shrink-0
                        ${isExpanded ? 'block animate-fade-in' : 'hidden'}`}>
          <p className="text-[0.55rem] text-[#C5A880] font-bold uppercase tracking-widest">Super Admin</p>
          <p className="text-white/50 text-[0.65rem] truncate mt-0.5">{user.email}</p>
        </div>

        {/* Accordion Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1.5 scrollbar-thin scrollbar-thumb-white/5">
          {navItems.map(item => {
            const isSectionExpanded = !!expandedSections[item.id]
            const Icon = item.icon
            
            const isGroupActive = item.href 
              ? (pathname === item.href) 
              : item.subItems.some(sub => sub.href === pathname)

            return (
              <div key={item.id} className="space-y-1">
                {/* Header Collapsible Trigger / Direct Link */}
                {item.href ? (
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 border border-transparent ${
                      isGroupActive
                        ? 'bg-[#C5A880]/10 text-[#C5A880] border border-[#C5A880]/20'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                    title={!isExpanded ? item.label : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 flex-shrink-0 transition-transform ${isGroupActive ? 'text-[#C5A880]' : ''}`} />
                      <span className={`transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                        {item.label}
                      </span>
                    </div>
                  </Link>
                ) : (
                  <button
                    onClick={() => isExpanded && toggleSection(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 border border-transparent ${
                      isGroupActive
                        ? 'bg-[#C5A880]/10 text-[#C5A880] border border-[#C5A880]/20'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                    title={!isExpanded ? item.label : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 flex-shrink-0 transition-transform ${isGroupActive ? 'text-[#C5A880]' : ''}`} />
                      <span className={`transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                        {item.label}
                      </span>
                    </div>
                    {isExpanded && (
                      isSectionExpanded ? <ChevronDown className="w-3.5 h-3.5 opacity-60" /> : <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    )}
                  </button>
                )}

                {/* Indented Sub Menu Items */}
                {isExpanded && !item.href && isSectionExpanded && (
                  <div className="pl-8 pr-1 py-1 space-y-1 flex flex-col border-l border-white/5 ml-5 animate-slide-down">
                    {item.subItems.map((sub, idx) => {
                      const isSubActive = pathname === sub.href
                      return (
                        <Link
                          key={idx}
                          href={sub.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`text-[0.72rem] py-1.5 px-2 rounded-lg font-medium transition-all duration-150 ${
                            isSubActive
                              ? 'text-[#C5A880] bg-white/5 font-semibold'
                              : 'text-white/40 hover:text-white/80 hover:pl-3'
                          }`}
                        >
                          {sub.label}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Logout section */}
        <div className="p-3 border-t border-white/8 flex-shrink-0">
          <button onClick={signOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400/70
                       hover:text-red-400 hover:bg-red-500/10 transition-all w-full text-left"
            title={!isExpanded ? "Sign Out" : undefined}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className={`text-xs font-semibold uppercase tracking-wider ${isExpanded ? 'block' : 'hidden'}`}>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content viewport */}
      <div className={`flex-1 flex flex-col transition-all duration-300
                       ${isExpanded ? 'lg:ml-64' : 'lg:ml-16'}`}>

        {/* Top bar header */}
        <header className="h-16 bg-[#11161E] border-b border-white/8 flex items-center
                           justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(v => !v)}
              className="lg:hidden text-white/60 hover:text-white transition-colors">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button onClick={() => setSidebarDesktop(v => !v)}
              className="hidden lg:block text-white/60 hover:text-white transition-colors">
              {sidebarDesktop ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="font-playfair text-sm font-bold text-white/60 hidden sm:block">
              Elite Makler CRM
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-white/35 text-xs hidden md:block font-medium">
              {new Date().toLocaleDateString('en-IN', { weekday:'short', year:'numeric', month:'short', day:'numeric' })}
            </span>
            <Link href="/" target="_blank"
              className="text-[#C5A880] hover:text-[#A4855C] text-xs font-semibold border border-[#C5A880]/20 hover:border-[#C5A880] px-3 py-1.5 rounded-lg transition-all">
              Live Website ↗
            </Link>
            <div className="w-8 h-8 rounded-full bg-[#C5A880] flex items-center justify-center
                            text-[#11161E] font-bold text-sm shadow-md">
              {user.email?.[0].toUpperCase() ?? 'A'}
            </div>
          </div>
        </header>

        {/* Page content display */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
