'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { TrendingUp, ArrowUpRight, FileText, Printer, ArrowLeft, Layers, CheckCircle2, MessageSquare, Loader2, Download } from 'lucide-react'

export default function AnalyticsPage() {
  const searchParams = useSearchParams()
  const tabFilter = searchParams.get('tab') || 'overview' // 'overview' | 'reports'

  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalEnquiries: 0,
    soldCount: 0,
    featuredCount: 0,
    avgPrice: 0,
  })
  
  const [recentProperties, setRecentProperties] = useState<any[]>([])
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([])

  // On-screen generated report state
  const [activeReport, setActiveReport] = useState<{
    type: 'properties' | 'enquiries'
    title: string
    date: string
    data: any[]
  } | null>(null)

  // Fetch real-time data from Supabase
  const loadStats = async () => {
    try {
      const { data: props, error: propsErr } = await supabase
        .from('properties')
        .select('price, status, featured, area_sqft')
      
      if (propsErr) throw propsErr

      const { count: enqCount, error: enqErr } = await supabase
        .from('enquiries')
        .select('*', { count: 'exact', head: true })

      if (enqErr) throw enqErr

      const total = props?.length || 0
      const sold = props?.filter(p => p.status === 'sold').length || 0
      const featured = props?.filter(p => p.featured === true).length || 0
      
      const totalVal = props?.reduce((acc, p) => acc + Number(p.price || 0), 0) || 0
      const avg = total > 0 ? (totalVal / total) : 0

      setStats({
        totalProperties: total,
        totalEnquiries: enqCount || 0,
        soldCount: sold,
        featuredCount: featured,
        avgPrice: avg,
      })

      const { data: recProps } = await supabase
        .from('properties')
        .select('title, price, price_label, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

      const { data: recEnqs } = await supabase
        .from('enquiries')
        .select('name, phone, intent, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentProperties(recProps || [])
      setRecentEnquiries(recEnqs || [])

    } catch (err) {
      console.error('Error loading CRM stats:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()

    const propsChannel = supabase
      .channel('crm_stats_properties')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, () => {
        loadStats()
      })
      .subscribe()

    const enqsChannel = supabase
      .channel('crm_stats_enquiries')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'enquiries' }, () => {
        loadStats()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(propsChannel)
      supabase.removeChannel(enqsChannel)
    }
  }, [])

  // Generate on-screen report
  const generateOnScreenReport = async (type: 'properties' | 'enquiries') => {
    setLoading(true)
    try {
      if (type === 'properties') {
        const { data, error } = await supabase
          .from('properties')
          .select('title, type, locality, price, area_sqft, status, created_at')
          .order('created_at', { ascending: false })
        if (error) throw error

        setActiveReport({
          type: 'properties',
          title: 'LUXEHAVEN PROPERTIES AUDIT REPORT',
          date: new Date().toLocaleString('en-IN'),
          data: data || []
        })
      } else {
        const { data, error } = await supabase
          .from('enquiries')
          .select('name, email, phone, intent, message, created_at')
          .order('created_at', { ascending: false })
        if (error) throw error

        setActiveReport({
          type: 'enquiries',
          title: 'LUXEHAVEN CLIENT LEADS REPORT',
          date: new Date().toLocaleString('en-IN'),
          data: data || []
        })
      }
    } catch (err) {
      console.error('Error generating report:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20 print:hidden">
        <Loader2 className="w-10 h-10 animate-spin text-[#C5A880] mx-auto mb-4" />
        <p className="text-white/40 text-sm">Aggregating live CRM analytics data...</p>
      </div>
    )
  }

  // ── RENDER PRINTABLE ON-SCREEN REPORT SHEET ──
  if (activeReport) {
    return (
      <div className="space-y-6">
        {/* Back and Print Actions (Hidden in browser Print PDF mode) */}
        <div className="flex justify-between items-center bg-[#11161E] border border-white/8 p-4 rounded-xl print:hidden">
          <button 
            onClick={() => setActiveReport(null)}
            className="flex items-center gap-2 text-white/60 hover:text-white text-xs font-semibold uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" /> Close Report
          </button>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#C5A880] text-[#11161E] font-bold text-xs rounded-lg hover:bg-[#A4855C] transition-all shadow-md"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
        </div>

        {/* The Official Report Sheet Document */}
        <div className="bg-white text-[#11161E] p-8 md:p-12 rounded-2xl shadow-xl space-y-8 border border-neutral-200 print:border-0 print:shadow-none print:p-0">
          
          {/* Header branding */}
          <div className="flex justify-between items-start border-b-2 border-[#C5A880] pb-6">
            <div>
              <h2 className="font-playfair text-2xl font-bold tracking-widest text-[#11161E]">ELITE MAKLER</h2>
              <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">Luxury Real Estate CRM System</p>
              <p className="text-[0.68rem] text-neutral-400 mt-1">Palasia Corridor, Indore, India</p>
            </div>
            <div className="text-right">
              <span className="text-[0.68rem] font-bold uppercase tracking-widest bg-neutral-100 text-neutral-600 px-3 py-1 rounded-md">
                OFFICIAL REPORT
              </span>
              <p className="text-xs text-neutral-400 mt-2">Generated on: <span className="text-neutral-700 font-semibold">{activeReport.date}</span></p>
            </div>
          </div>

          {/* Report Title */}
          <div className="text-center space-y-1.5 py-2">
            <h1 className="font-playfair text-xl font-bold tracking-wider text-neutral-800 uppercase">{activeReport.title}</h1>
            <p className="text-xs text-neutral-400 font-semibold tracking-wider uppercase">Scope: Indore Division FY 2026</p>
          </div>

          {/* KPI metrics in the document */}
          <div className="grid grid-cols-3 gap-4 border-y border-neutral-100 py-4">
            <div className="text-center">
              <p className="text-neutral-400 text-[0.62rem] uppercase font-bold tracking-wider">Report Item Count</p>
              <p className="text-neutral-800 text-lg font-bold mt-0.5">{activeReport.data.length} Records</p>
            </div>
            <div className="text-center border-x border-neutral-100">
              <p className="text-neutral-400 text-[0.62rem] uppercase font-bold tracking-wider">Source Database</p>
              <p className="text-neutral-800 text-lg font-bold mt-0.5">Supabase Public</p>
            </div>
            <div className="text-center">
              <p className="text-neutral-400 text-[0.62rem] uppercase font-bold tracking-wider">Authorization Code</p>
              <p className="text-neutral-800 text-xs font-mono font-bold mt-1 text-[#C5A880]">EM-AUDIT-992</p>
            </div>
          </div>

          {/* Table Data list */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-400 font-bold">
                  {activeReport.type === 'properties' ? (
                    <>
                      <th className="py-2.5">Title</th>
                      <th className="py-2.5">Type</th>
                      <th className="py-2.5">Locality</th>
                      <th className="py-2.5 text-right">Price</th>
                      <th className="py-2.5 text-right">Sqft</th>
                      <th className="py-2.5 text-right">Status</th>
                    </>
                  ) : (
                    <>
                      <th className="py-2.5">Client Name</th>
                      <th className="py-2.5">Email</th>
                      <th className="py-2.5">Phone</th>
                      <th className="py-2.5">Intent</th>
                      <th className="py-2.5">Message</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                {activeReport.data.map((row, idx) => (
                  <tr key={idx}>
                    {activeReport.type === 'properties' ? (
                      <>
                        <td className="py-3 font-semibold text-neutral-800">{row.title}</td>
                        <td className="py-3 capitalize">{row.type}</td>
                        <td className="py-3 capitalize">{row.locality?.replace('_', ' ')}</td>
                        <td className="py-3 text-right font-bold text-neutral-800">₹{row.price} Cr</td>
                        <td className="py-3 text-right">{row.area_sqft} sqft</td>
                        <td className="py-3 text-right capitalize font-semibold text-[#C5A880]">{row.status}</td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 font-semibold text-neutral-800">{row.name}</td>
                        <td className="py-3">{row.email || 'N/A'}</td>
                        <td className="py-3 font-mono">{row.phone}</td>
                        <td className="py-3 uppercase text-[0.68rem] font-bold text-neutral-600">{row.intent}</td>
                        <td className="py-3 max-w-[200px] truncate text-neutral-400">{row.message || '-'}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Official Signatures footer */}
          <div className="flex justify-between items-end pt-12 text-xs">
            <div>
              <p className="text-neutral-400">System generated report.</p>
              <p className="text-neutral-300 text-[0.62rem] mt-0.5">No physical signature required.</p>
            </div>
            <div className="text-center border-t border-neutral-200 pt-3 px-6">
              <p className="font-semibold text-neutral-700">Super Admin Authority</p>
              <p className="text-neutral-400 text-[0.62rem] mt-0.5">Elite Makler Real Estate</p>
            </div>
          </div>

        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 print:hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-semibold text-white">
            {tabFilter === 'reports' ? 'Quick Reports Manager' : 'Live Statistics & Trends'}
          </h1>
          <p className="text-white/40 text-sm mt-1">Real-time metrics parsed from database tables</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3">
        {[
          { label: 'Live Overview', val: 'overview' },
          { label: 'Quick Reports', val: 'reports' },
        ].map(tab => (
          <a
            key={tab.val}
            href={tab.val === 'overview' ? `/admin/analytics` : `/admin/analytics?tab=${tab.val}`}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              (tab.val === 'overview' && tabFilter === 'overview') || tabFilter === tab.val
                ? 'bg-[#C5A880] text-[#11161E]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {/* ── TAB 1: OVERVIEW & TRENDS ── */}
      {tabFilter === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Live Listings Count', val: stats.totalProperties, suffix: ' Properties' },
              { label: 'Avg Listings Price', val: `₹${stats.avgPrice.toFixed(2)} Cr`, suffix: '' },
              { label: 'Total Enquiries', val: stats.totalEnquiries, suffix: ' Submissions' },
              { label: 'Featured Listings', val: stats.featuredCount, suffix: ' VIP' },
            ].map(c => (
              <div key={c.label} className="bg-[#11161E] rounded-xl p-5 border border-white/8">
                <p className="text-white/40 text-xs mb-2">{c.label}</p>
                <p className="font-playfair text-2xl font-bold text-white">{c.val}</p>
                <p className="text-white/35 text-[0.62rem] mt-1.5 uppercase tracking-wide">{c.suffix}</p>
              </div>
            ))}
          </div>

          {/* Quick lists split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Recent Properties list */}
            <div className="bg-[#11161E] border border-white/8 rounded-xl p-5 space-y-4">
              <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#C5A880]" /> Newly Added Listings
              </h3>
              <div className="space-y-3.5">
                {recentProperties.map((p, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs pb-3 border-b border-white/5 last:border-0 last:pb-0">
                    <div>
                      <p className="text-white font-semibold">{p.title}</p>
                      <p className="text-white/30 text-[0.65rem] mt-0.5">Status: <span className="capitalize text-emerald-400">{p.status}</span></p>
                    </div>
                    <span className="text-[#C5A880] font-bold">{p.price_label || `₹${p.price} Cr`}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Enquiries list */}
            <div className="bg-[#11161E] border border-white/8 rounded-xl p-5 space-y-4">
              <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#C5A880]" /> Latest Client Leads
              </h3>
              <div className="space-y-3.5">
                {recentEnquiries.map((e, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs pb-3 border-b border-white/5 last:border-0 last:pb-0">
                    <div>
                      <p className="text-white font-semibold">{e.name}</p>
                      <p className="text-white/30 text-[0.65rem] mt-0.5">Phone: {e.phone}</p>
                    </div>
                    <span className="text-blue-300 font-bold uppercase tracking-wider text-[0.62rem] bg-blue-500/10 px-2 py-0.5 rounded">
                      {e.intent}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── TAB 2: QUICK REPORTS ── */}
      {tabFilter === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Properties Audit Report Card */}
          <div className="bg-[#11161E] border border-white/8 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-white font-semibold text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#C5A880]" /> Properties Audit Report
              </h3>
              <span className="text-xs text-white/30">{stats.totalProperties} items</span>
            </div>
            <p className="text-white/50 text-xs leading-relaxed">
              Generate inventory parameters containing listing slugs, addresses, sqft areas, feature status, price metrics, and closed deals categories.
            </p>
            <button 
              onClick={() => generateOnScreenReport('properties')}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#C5A880] hover:bg-[#A4855C] text-[#11161E] font-bold text-xs rounded-lg transition-colors"
            >
              <FileText className="w-3.5 h-3.5" /> Generate & Preview Report
            </button>
          </div>

          {/* Enquiries Leads Report Card */}
          <div className="bg-[#11161E] border border-white/8 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-white font-semibold text-base flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#C5A880]" /> Enquiries Lead Report
              </h3>
              <span className="text-xs text-white/30">{stats.totalEnquiries} items</span>
            </div>
            <p className="text-white/50 text-xs leading-relaxed">
              Generate records of client submissions, contact information logs, intent classifications, message strings, and reference IDs.
            </p>
            <button 
              onClick={() => generateOnScreenReport('enquiries')}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#C5A880] hover:bg-[#A4855C] text-[#11161E] font-bold text-xs rounded-lg transition-colors"
            >
              <FileText className="w-3.5 h-3.5" /> Generate & Preview Report
            </button>
          </div>

        </div>
      )}
    </div>
  )
}
