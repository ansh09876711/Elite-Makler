'use client'

import { useState } from 'react'
import { Check, Loader2, MessageCircle } from 'lucide-react'

interface Props {
  propertyId?: string
  dark?: boolean
}

const WHATSAPP_NUMBER = '919752210368'

const intentLabels: Record<string, string> = {
  buy: 'Buying Property',
  sell: 'Selling Property',
  rent: 'Renting Property',
  invest: 'Commercial Investment',
}

export default function EnquiryForm({ propertyId, dark = true }: Props) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', intent: '', message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const buildWhatsappUrl = () => {
    const lines = [
      'Hello Elite Makler,',
      `Name: ${form.name || '[Name]'}`,
      `Mobile: ${form.phone || '[Mobile Number]'}`,
      form.email ? `Email: ${form.email}` : undefined,
      `Interested In: ${intentLabels[form.intent] ?? (form.intent || 'Not specified')}`,
      form.message ? `Message: ${form.message}` : undefined,
      propertyId ? `Property ID: ${propertyId}` : undefined,
    ].filter(Boolean).join('\n')

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`
  }

  const handleWhatsApp = () => {
    if (!form.name || !form.phone || !form.intent) {
      window.alert('Please enter your name, mobile number and interest before sending WhatsApp enquiry.')
      return
    }

    window.open(buildWhatsappUrl(), '_blank', 'noopener,noreferrer')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, property_id: propertyId ?? null }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setForm({ name: '', email: '', phone: '', intent: '', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const inputCls = dark
    ? 'bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#C5A880]'
    : 'bg-[#FAF9F6] border border-[#D5CECE] text-[#1E242B] placeholder:text-[#68717A] focus:border-[#C5A880]'

  const base = 'w-full px-4 py-3.5 rounded text-sm outline-none transition-colors duration-200 ' + inputCls

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text" required placeholder="Full Name"
          value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
          className={base}
        />
        <input
          type="tel" required placeholder="Mobile Number"
          value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
          className={base}
        />
      </div>
      <input
        type="email" placeholder="Email Address (optional)"
        value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
        className={base}
      />
      <select
        required value={form.intent}
        onChange={e => setForm(p => ({ ...p, intent: e.target.value }))}
        className={base + (dark ? ' [&>option]:bg-[#11161E]' : ' [&>option]:bg-white')}
      >
        <option value="" disabled>Interested In...</option>
        <option value="buy">Buying Property</option>
        <option value="sell">Selling Property</option>
        <option value="rent">Renting Property</option>
        <option value="invest">Commercial Investment</option>
      </select>
      <textarea
        rows={4} placeholder="Message (Optional)"
        value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
        className={base + ' resize-none'}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="submit" disabled={status === 'loading' || status === 'success'}
          className="w-full py-3.5 bg-[#C5A880] text-[#11161E] font-semibold text-sm
                     rounded hover:bg-[#A4855C] transition-colors flex items-center
                     justify-center gap-2 disabled:opacity-70"
        >
          {status === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
          {status === 'success' && <Check className="w-4 h-4" />}
          {status === 'success'
            ? 'Request Sent!'
            : status === 'error'
            ? 'Error — Try Again'
            : 'Submit Enquiry'}
        </button>

        <button
          type="button"
          onClick={handleWhatsApp}
          className="w-full py-3.5 border border-[#C5A880] text-[#C5A880] font-semibold text-sm
                     rounded hover:bg-[#C5A880]/10 transition-colors flex items-center
                     justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" /> WhatsApp Enquiry
        </button>
      </div>
    </form>
  )
}
