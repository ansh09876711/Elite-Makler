'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight, Check, X, Filter } from 'lucide-react'

const MOCK_APPOINTMENTS = [
  { id: '1', client: 'Aarav Gupta', property: 'The Nipania Sky Penthouse', type: 'visit', date: '2026-07-14', time: '11:00 AM', agent: 'Amitesh Shrivastava', status: 'today' },
  { id: '2', client: 'Karan Malhotra', property: 'The Bypass Forest Retreat', type: 'meeting', date: '2026-07-14', time: '03:30 PM', agent: 'Rajesh Singhal', status: 'today' },
  { id: '3', client: 'Siddharth Jain', property: 'The Palasia Legacy Mansion', type: 'visit', date: '2026-07-15', time: '04:00 PM', agent: 'Divya Sharma', status: 'upcoming' },
  { id: '4', client: 'Riya Sen', property: 'The Stone & Glass Residence', type: 'meeting', date: '2026-07-16', time: '12:00 PM', agent: 'Rajesh Singhal', status: 'upcoming' },
  { id: '5', client: 'Deepak Chawla', property: 'The Ocean Breeze Penthouse', type: 'visit', date: '2026-07-12', time: '02:00 PM', agent: 'Amitesh Shrivastava', status: 'completed' },
]

export default function AdminAppointmentsPage() {
  const searchParams = useSearchParams()
  const tabFilter = searchParams.get('tab') || 'all' // 'calendar' | 'today' | 'completed'

  const filtered = MOCK_APPOINTMENTS.filter(app => {
    if (tabFilter === 'today' && app.status !== 'today') return false
    if (tabFilter === 'completed' && app.status !== 'completed') return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-semibold text-white">Appointments & Calendar</h1>
          <p className="text-white/40 text-sm mt-1">Schedule property site visits, client meetings and deal discussions</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3">
        {[
          { label: 'All Schedule', val: 'all' },
          { label: "Today's Visits", val: 'today' },
          { label: 'Completed Visits', val: 'completed' },
        ].map(tab => (
          <a
            key={tab.val}
            href={`/admin/appointments?tab=${tab.val}`}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              tabFilter === tab.val
                ? 'bg-[#C5A880] text-[#11161E]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {/* Main Grid: List + Calendar Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Schedule List */}
        <div className="lg:col-span-2 space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-[#11161E] border border-white/8 rounded-xl p-10 text-center text-white/30 text-sm">
              No appointments found for the selected tab.
            </div>
          ) : (
            filtered.map(app => (
              <div key={app.id} className="bg-[#11161E] border border-white/8 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-white/15 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[0.62rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      app.type === 'visit' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-blue-500/10 text-blue-300'
                    }`}>
                      {app.type === 'visit' ? 'Site Visit' : 'Meeting'}
                    </span>
                    <span className="text-white/35 text-xs">ID: #{app.id}</span>
                  </div>
                  <h3 className="text-white font-semibold text-base">{app.client}</h3>
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-white/50">
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#C5A880]" /> {app.property}</span>
                    <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-[#C5A880]" /> Agent: {app.agent}</span>
                  </div>
                </div>

                <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                  <div className="text-right">
                    <p className="text-white text-sm font-semibold flex items-center gap-1.5 justify-end">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A880]" /> {new Date(app.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-white/40 text-xs mt-0.5 flex items-center gap-1.5 justify-end">
                      <Clock className="w-3.5 h-3.5" /> {app.time}
                    </p>
                  </div>
                  
                  {app.status === 'today' && (
                    <div className="flex gap-1.5">
                      <button className="p-2 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-[#11161E] rounded-lg transition-colors border border-emerald-500/25">
                        <Check className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-red-500/20 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition-colors border border-red-500/25">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {app.status === 'completed' && (
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                      Completed
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right 1 Col: Calendar Widget */}
        <div className="lg:col-span-1 bg-[#11161E] border border-white/8 rounded-xl p-5 h-fit space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-white font-semibold text-sm">Calendar Preview</h3>
            <div className="flex gap-1">
              <button className="p-1 hover:bg-white/5 text-white/50 hover:text-white rounded"><ChevronLeft className="w-4 h-4" /></button>
              <button className="p-1 hover:bg-white/5 text-white/50 hover:text-white rounded"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-y-2 text-center text-xs">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <span key={d} className="text-white/20 font-bold uppercase tracking-wider">{d}</span>
            ))}
            {[...Array(31)].map((_, i) => {
              const day = i + 1
              const hasApp = [12, 14, 15, 16].includes(day)
              return (
                <div key={i} className="py-2 flex flex-col items-center justify-center relative cursor-pointer hover:bg-white/5 rounded-lg">
                  <span className={`text-white/80 font-medium ${day === 14 ? 'text-[#C5A880] font-bold' : ''}`}>
                    {day}
                  </span>
                  {hasApp && (
                    <span className="w-1.5 h-1.5 bg-[#C5A880] rounded-full absolute bottom-0.5" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
