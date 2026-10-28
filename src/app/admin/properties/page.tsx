'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Plus, Edit, Trash2, Eye, Building2, MapPin, Bed,
  X, Save, Loader2, CheckCircle2, AlertCircle, Download, Check
} from 'lucide-react'
import type { Property } from '@/types'
import MediaUpload, { MediaUploadHandle } from '@/components/admin/MediaUpload'

// ── Indore ki sabhi colonies
const LOCALITIES = [
  // Premium
  'vijay_nagar', 'nipania', 'palasia_saket', 'bypass_road',
  // Main colonies
  'ab_road', 'aerodrome', 'annapurna', 'aranya',
  'bhanwarkuan', 'bhawarkuan', 'bicholi_hapsi', 'bicholi_mardana',
  'bombay_hospital', 'chandan_nagar', 'chandragupt', 'chhota_bangarda',
  'devguradia', 'dhar_road', 'electronic_complex',
  'futi_kothi', 'geeta_bhawan', 'guru_nanak', 'gumasta_nagar',
  'hindi_nagar', 'indrapuri', 'jail_road',
  'kanadiya_road', 'kesar_bagh', 'khajrana',
  'lasudiya', 'lasudia_mori', 'lokmanya_nagar', 'luv_kush',
  'mahalaxmi_nagar', 'malharganj', 'manglia', 'marimata',
  'marimata_chouraha', 'mig_colony', 'mr_10', 'mr_9',
  'nanda_nagar', 'navlakha', 'new_palasia', 'niranjanpur',
  'old_palasia', 'omaxe_city',
  'palhar_nagar', 'pardesipura', 'pipliyahana', 'pithampur_road',
  'rajendra_nagar', 'rajiv_gandhi', 'rau', 'residency_area',
  'ring_road', 'ring_road_colony',
  'saket', 'sanawadia', 'sangam_nagar', 'sapna_sangeeta',
  'sarwate', 'scheme_54', 'scheme_71', 'scheme_74', 'scheme_78',
  'shreenath', 'silicon_city', 'skema', 'sneh_nagar',
  'srinath_nagar', 'subhash_nagar', 'sudama_nagar', 'super_corridor',
  'tejaji_nagar', 'tilak_nagar', 'tukoganj',
  'ujjain_road', 'usha_nagar',
  'vallabh_nagar', 'veena_nagar', 'vijay_nagar_ext',
  'vishnupuri', 'yeshwant_niwas',
  'off_market',
]

const LOCALITY_LABELS: Record<string, string> = {
  vijay_nagar:       'Vijay Nagar',
  nipania:           'Nipania',
  palasia_saket:     'Palasia & Saket',
  bypass_road:       'Bypass Road',
  ab_road:           'AB Road',
  aerodrome:         'Aerodrome Area',
  annapurna:         'Annapurna',
  aranya:            'Aranya',
  bhanwarkuan:       'Bhanwarkuan',
  bhawarkuan:        'Bhawarkuan',
  bicholi_hapsi:     'Bicholi Hapsi',
  bicholi_mardana:   'Bicholi Mardana',
  bombay_hospital:   'Bombay Hospital Area',
  chandan_nagar:     'Chandan Nagar',
  chandragupt:       'Chandragupt Colony',
  chhota_bangarda:   'Chhota Bangarda',
  devguradia:        'Devguradia',
  dhar_road:         'Dhar Road',
  electronic_complex:'Electronic Complex',
  futi_kothi:        'Futi Kothi',
  geeta_bhawan:      'Geeta Bhawan',
  guru_nanak:        'Guru Nanak Nagar',
  gumasta_nagar:     'Gumasta Nagar',
  hindi_nagar:       'Hindi Nagar',
  indrapuri:         'Indrapuri Colony',
  jail_road:         'Jail Road',
  kanadiya_road:     'Kanadiya Road',
  kesar_bagh:        'Kesar Bagh',
  khajrana:          'Khajrana',
  lasudiya:          'Lasudiya',
  lasudia_mori:      'Lasudia Mori',
  lokmanya_nagar:    'Lokmanya Nagar',
  luv_kush:          'Luv Kush Square',
  mahalaxmi_nagar:   'Mahalaxmi Nagar',
  malharganj:        'Malharganj',
  manglia:           'Manglia',
  marimata:          'Marimata',
  marimata_chouraha: 'Marimata Chouraha',
  mig_colony:        'MIG Colony',
  mr_10:             'MR-10 Road',
  mr_9:              'MR-9 Road',
  nanda_nagar:       'Nanda Nagar',
  navlakha:          'Navlakha',
  new_palasia:       'New Palasia',
  niranjanpur:       'Niranjanpur',
  old_palasia:       'Old Palasia',
  omaxe_city:        'Omaxe City',
  palhar_nagar:      'Palhar Nagar',
  pardesipura:       'Pardesipura',
  pipliyahana:       'Pipliyahana',
  pithampur_road:    'Pithampur Road',
  rajendra_nagar:    'Rajendra Nagar',
  rajiv_gandhi:      'Rajiv Gandhi Square Area',
  rau:               'Rau',
  residency_area:    'Residency Area',
  ring_road:         'Ring Road',
  ring_road_colony:  'Ring Road Colony',
  saket:             'Saket',
  sanawadia:         'Sanawadia',
  sangam_nagar:      'Sangam Nagar',
  sapna_sangeeta:    'Sapna Sangeeta',
  sarwate:           'Sarwate Bus Stand Area',
  scheme_54:         'Scheme No. 54',
  scheme_71:         'Scheme No. 71',
  scheme_74:         'Scheme No. 74',
  scheme_78:         'Scheme No. 78',
  shreenath:         'Shreenath Colony',
  silicon_city:      'Silicon City',
  skema:             'Skema',
  sneh_nagar:        'Sneh Nagar',
  srinath_nagar:     'Srinath Nagar',
  subhash_nagar:     'Subhash Nagar',
  sudama_nagar:      'Sudama Nagar',
  super_corridor:    'Super Corridor',
  tejaji_nagar:      'Tejaji Nagar',
  tilak_nagar:       'Tilak Nagar',
  tukoganj:          'Tukoganj',
  ujjain_road:       'Ujjain Road',
  usha_nagar:        'Usha Nagar',
  vallabh_nagar:     'Vallabh Nagar',
  veena_nagar:       'Veena Nagar',
  vijay_nagar_ext:   'Vijay Nagar Extension',
  vishnupuri:        'Vishnupuri',
  yeshwant_niwas:    'Yeshwant Niwas Road',
  off_market:        '🔒 Off-Market (Private)',
}

const TYPES   = ['villa','penthouse','mansion','apartment','house','plot','commercial']
const STATUSES = ['for_sale','for_rent','new_listing','coming_soon','preview','sold','pending','draft','archived','trash']

// ── Smart Price Input ──────────────────────────────────────────
type PriceUnit = 'rupee' | 'thousand' | 'lakh' | 'crore'

const UNIT_MULTIPLIERS: Record<PriceUnit, number> = {
  rupee:    1,
  thousand: 1_000,
  lakh:     100_000,
  crore:    10_000_000,
}

const UNIT_LABELS: Record<PriceUnit, string> = {
  rupee:    'Rupee (₹)',
  thousand: 'Thousand',
  lakh:     'Lakh',
  crore:    'Crore',
}

function formatPriceLabel(amount: number, unit: PriceUnit): string {
  const total = amount * UNIT_MULTIPLIERS[unit]
  if (total === 0) return ''
  if (total >= 10_000_000) {
    const cr = total / 10_000_000
    return `₹${cr % 1 === 0 ? cr : parseFloat(cr.toFixed(2))} Cr`
  }
  if (total >= 100_000) {
    const l = total / 100_000
    return `₹${l % 1 === 0 ? l : parseFloat(l.toFixed(2))} Lakh`
  }
  if (total >= 1_000) {
    const k = total / 1_000
    return `₹${k % 1 === 0 ? k : parseFloat(k.toFixed(1))}K`
  }
  return `₹${total.toLocaleString('en-IN')}`
}

function toCrores(amount: number, unit: PriceUnit): number {
  return (amount * UNIT_MULTIPLIERS[unit]) / 10_000_000
}

function PriceInput({
  priceInCrores, priceLabel, onChange,
}: {
  priceInCrores: number
  priceLabel: string
  onChange: (crores: number, label: string) => void
}) {
  const [amount, setAmount] = useState<string>('')
  const [unit,   setUnit]   = useState<PriceUnit>('crore')

  // Init from existing value
  useEffect(() => {
    if (priceInCrores > 0 && amount === '') {
      setAmount(String(priceInCrores))
      setUnit('crore')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (newAmount: string, newUnit: PriceUnit) => {
    setAmount(newAmount)
    setUnit(newUnit)
    const num = parseFloat(newAmount) || 0
    const label = num > 0 ? formatPriceLabel(num, newUnit) : ''
    onChange(toCrores(num, newUnit), label)
  }

  const inp = 'bg-[#0d1219] border border-white/10 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#C5A880] transition-colors placeholder:text-white/25'

  return (
    <div>
      <div className="flex rounded-lg overflow-hidden border border-white/10 focus-within:border-[#C5A880] transition-colors">
        <span className="flex items-center px-3 bg-[#0d1219] text-white/40 text-sm border-r border-white/10 flex-shrink-0">
          ₹
        </span>
        <input
          type="number"
          min="0"
          step="any"
          value={amount}
          onChange={e => handleChange(e.target.value, unit)}
          placeholder="Enter amount"
          className={inp + ' flex-1 min-w-0 border-none rounded-none'}
        />
        <select
          value={unit}
          onChange={e => handleChange(amount, e.target.value as PriceUnit)}
          className={inp + ' border-none border-l border-white/10 rounded-none bg-[#0d1219] text-[#C5A880] font-semibold cursor-pointer flex-shrink-0 [&>option]:bg-[#11161E]'}
          style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }}
        >
          {(Object.keys(UNIT_LABELS) as PriceUnit[]).map(u => (
            <option key={u} value={u}>{UNIT_LABELS[u]}</option>
          ))}
        </select>
      </div>
      {/* Live preview */}
      {amount && parseFloat(amount) > 0 && (
        <p className="text-[#C5A880] text-xs mt-1.5 font-semibold">
          = {formatPriceLabel(parseFloat(amount), unit)}
          <span className="text-white/30 font-normal ml-2">
            ({toCrores(parseFloat(amount), unit).toFixed(4)} Cr stored)
          </span>
        </p>
      )}
    </div>
  )
}

// ── Searchable Locality Combobox ──────────────────────────────
function LocalityCombobox({ value, onChange }: {
  value: string
  onChange: (val: string) => void
}) {
  const [query, setQuery] = useState('')
  const [open,  setOpen]  = useState(false)

  const displayLabel = LOCALITY_LABELS[value] ?? (value ? value.replace(/_/g, ' ') : '')

  const filtered = query.trim() === ''
    ? LOCALITIES
    : LOCALITIES.filter(l =>
        (LOCALITY_LABELS[l] ?? l).toLowerCase().includes(query.toLowerCase())
      )

  const select = (loc: string, label?: string) => {
    // Store slug or raw custom value
    const slug = loc || query.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
    onChange(slug)
    // Update LOCALITY_LABELS dynamically if custom
    if (label && !LOCALITY_LABELS[slug]) LOCALITY_LABELS[slug] = label
    setQuery('')
    setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered.length === 1) {
        // Exact single match — select it
        select(filtered[0])
      } else if (query.trim()) {
        // No match or multiple — use typed value as custom
        const slug  = query.trim().toLowerCase().replace(/\s+/g,'_').replace(/[^a-z0-9_]/g,'')
        const label = query.trim()
        LOCALITY_LABELS[slug] = label
        onChange(slug)
        setQuery('')
        setOpen(false)
      }
    }
    if (e.key === 'Escape') { setOpen(false); setQuery('') }
  }

  return (
    <div className="relative">
      <div className={`flex items-center bg-[#0d1219] border rounded-lg
                       ${open ? 'border-[#C5A880]' : 'border-white/10'}`}>
        <input
          value={open ? query : displayLabel}
          onFocus={() => { setOpen(true); setQuery('') }}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onKeyDown={handleKeyDown}
          placeholder="Search or type new locality..."
          className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30"
        />
        {value && (
          <button type="button" onClick={() => { onChange(''); setQuery(''); setOpen(false) }}
            className="px-2 text-white/25 hover:text-white/60 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <span className="px-3 text-white/25 text-xs">{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setQuery('') }} />

          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-[#1a2130]
                          border border-white/15 rounded-xl shadow-2xl overflow-hidden">

            {/* Hint when typing custom */}
            {query.trim() !== '' && filtered.length === 0 && (
              <button type="button"
                onClick={() => {
                  const slug  = query.trim().toLowerCase().replace(/\s+/g,'_').replace(/[^a-z0-9_]/g,'')
                  LOCALITY_LABELS[slug] = query.trim()
                  onChange(slug); setQuery(''); setOpen(false)
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[#C5A880]
                           font-semibold hover:bg-[#C5A880]/10 transition-colors">
                ↵ Add &ldquo;{query.trim()}&rdquo; as new locality
              </button>
            )}

            {/* Press Enter hint when typing & has no exact match */}
            {query.trim() !== '' && filtered.length > 0 && !filtered.some(l => (LOCALITY_LABELS[l] ?? l).toLowerCase() === query.toLowerCase()) && (
              <div className="px-4 py-2 text-[0.65rem] text-white/30 border-b border-white/8">
                Press <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white/50">Enter</kbd> to add &ldquo;{query.trim()}&rdquo; as custom locality
              </div>
            )}

            {/* Scrollable list */}
            <div className="overflow-y-auto max-h-52">
              {filtered.map((loc, idx) => {
                const isPremium    = ['vijay_nagar','nipania','palasia_saket','bypass_road'].includes(loc)
                const prevPremium  = idx > 0 && ['vijay_nagar','nipania','palasia_saket','bypass_road'].includes(filtered[idx-1])
                const showAllHeader = query === '' && !isPremium && (idx === 0 || prevPremium)
                return (
                  <div key={loc}>
                    {query === '' && idx === 0 && (
                      <div className="px-4 py-1 text-[0.58rem] font-bold uppercase tracking-widest text-[#C5A880]/50 bg-[#C5A880]/5">
                        ⭐ Premium
                      </div>
                    )}
                    {showAllHeader && (
                      <div className="px-4 py-1 text-[0.58rem] font-bold uppercase tracking-widest text-white/25 bg-white/3">
                        📍 All Colonies
                      </div>
                    )}
                    <button type="button"
                      onClick={() => select(loc)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                                 ${value === loc
                                   ? 'bg-[#C5A880]/15 text-[#C5A880] font-semibold'
                                   : 'text-white/75 hover:bg-white/6 hover:text-white'}`}>
                      {LOCALITY_LABELS[loc] ?? loc.replace(/_/g,' ')}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const statusColor: Record<string, string> = {
  for_sale:    'bg-blue-500/20 text-blue-300',
  for_rent:    'bg-teal-500/20 text-teal-300',
  new_listing: 'bg-emerald-500/20 text-emerald-300',
  coming_soon: 'bg-amber-500/20 text-amber-300',
  preview:     'bg-purple-500/20 text-purple-300',
  sold:        'bg-red-500/20 text-red-300',
  pending:     'bg-yellow-500/20 text-yellow-300',
  draft:       'bg-gray-500/20 text-gray-300',
  archived:    'bg-neutral-500/20 text-neutral-300',
  trash:       'bg-rose-950/40 text-rose-400 border border-rose-900/30',
}

const emptyForm = {
  title:'', slug:'', type:'villa', locality:'vijay_nagar', address:'',
  price:0, price_label:'', bedrooms:0, bathrooms:0, area_sqft:0,
  status:'for_sale', agent_name:'', description:'', featured:false,
  amenities:[] as string[], interest_pct:null as number|null, ready_date:''
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
}

type FormData = typeof emptyForm

function PropertyForm({
  initial, onSave, onClose
}: {
  initial?: Partial<FormData> & { id?: string }
  onSave: () => void
  onClose: () => void
}) {
  const [form,    setForm]    = useState<FormData>({ ...emptyForm, ...initial })
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')
  const [amenityInput, setAmenityInput] = useState('')
  const mediaRef = useRef<MediaUploadHandle>(null)

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
    const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked
               : e.target.type === 'number'  ? Number(e.target.value)
               : e.target.value
    setForm(p => ({ ...p, [k]: val }))
    if (k === 'title' && !initial?.id) setForm(p => ({ ...p, slug: slugify(e.target.value as string), [k]: e.target.value as string }))
  }

  const addAmenity = () => {
    if (!amenityInput.trim()) return
    setForm(p => ({ ...p, amenities: [...p.amenities, amenityInput.trim()] }))
    setAmenityInput('')
  }
  const removeAmenity = (i: number) => setForm(p => ({ ...p, amenities: p.amenities.filter((_,idx) => idx !== i) }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setError('')
    const body = initial?.id ? { id: initial.id, ...form } : form
    const res = await fetch('/api/admin/properties', {
      method:  initial?.id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    })
    const data = await res.json()
    
    if (!res.ok) {
      setSaving(false)
      setError(data.error ?? 'Error saving property')
      return
    }

    // Naye properties ke liye save response se ID nikal kar upload request mein use karenge
    const savedId = initial?.id || data.property?.id
    const savedSlug = form.slug
    if (savedId && mediaRef.current) {
      try {
        await mediaRef.current.uploadAll(savedId, savedSlug)
      } catch (uploadErr: any) {
        setSaving(false)
        setError('Media upload failed: ' + (uploadErr.message || 'Unknown error'))
        return
      }
    }

    setSaving(false)
    onSave()
  }

  const inputCls = 'w-full bg-[#0d1219] border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#C5A880] transition-colors placeholder:text-white/25'
  const labelCls = 'block text-[0.65rem] font-bold uppercase tracking-widest text-white/40 mb-1.5'

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-black/70 backdrop-blur-sm">
      <div className="relative bg-[#11161E] rounded-2xl border border-white/10 w-full max-w-2xl my-8 shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="font-playfair text-xl font-semibold text-white">
            {initial?.id ? 'Edit Property' : 'Add New Property'}
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title + Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Property Title *</label>
              <input required value={form.title} onChange={set('title')} placeholder="The Bypass Forest Retreat" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Slug *</label>
              <input required value={form.slug} onChange={set('slug')} placeholder="bypass-forest-retreat" className={inputCls} />
            </div>
          </div>

          {/* Type + Locality + Status */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Type *</label>
              <select value={form.type} onChange={set('type')} className={inputCls + ' [&>option]:bg-[#11161E]'}>
                {TYPES.map(t => (
                  <option key={t} value={t}>
                    {t === 'villa' ? 'Villa' : t === 'penthouse' ? 'Penthouse' :
                     t === 'mansion' ? 'Mansion' : t === 'apartment' ? 'Apartment' :
                     t === 'house' ? 'House' : t === 'plot' ? 'Plot / Land' : 'Commercial'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Locality *</label>
              <LocalityCombobox
                value={form.locality}
                onChange={val => setForm(p => ({ ...p, locality: val }))}
              />
            </div>
            <div>
              <label className={labelCls}>Status *</label>
              <select value={form.status} onChange={set('status')} className={inputCls + ' [&>option]:bg-[#11161E]'}>
                <option value="for_sale">For Sale</option>
                <option value="for_rent">For Rent</option>
                <option value="new_listing">New Listing</option>
                <option value="coming_soon">Coming Soon</option>
                <option value="preview">Preview</option>
                <option value="sold">Sold</option>
                <option value="pending">Pending Approval</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
                <option value="trash">Trash</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className={labelCls}>Address *</label>
            <input required value={form.address} onChange={set('address')} placeholder="Vijay Nagar, Indore" className={inputCls} />
          </div>

          {/* Price + Price Label */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Price Amount *</label>
              <PriceInput
                priceInCrores={form.price}
                priceLabel={form.price_label}
                onChange={(crores, label) => setForm(p => ({ ...p, price: crores, price_label: label }))}
              />
            </div>
            <div>
              <label className={labelCls}>Price Label</label>
              <input
                value={form.price_label}
                onChange={set('price_label')}
                placeholder="₹4.85 Cr / On Request"
                className={inputCls}
              />
              <p className="text-white/25 text-[0.6rem] mt-1">Auto-filled · Edit manually if needed</p>
            </div>
          </div>

          {/* Beds + Baths + Sqft */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Bedrooms *</label>
              <input required type="number" value={form.bedrooms} onChange={set('bedrooms')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Bathrooms *</label>
              <input required type="number" step="0.5" value={form.bathrooms} onChange={set('bathrooms')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Area (sqft) *</label>
              <input required type="number" value={form.area_sqft} onChange={set('area_sqft')} className={inputCls} />
            </div>
          </div>

          {/* Agent */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Agent Name *</label>
              <input required value={form.agent_name} onChange={set('agent_name')} placeholder="Rajesh Singhal" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Ready Date</label>
              <input value={form.ready_date ?? ''} onChange={set('ready_date')} placeholder="Dec 2025" className={inputCls} />
            </div>
          </div>

          {/* Interest % */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Interest % (launches only)</label>
              <input type="number" min="0" max="100"
                value={form.interest_pct ?? ''} onChange={e => setForm(p => ({ ...p, interest_pct: e.target.value ? Number(e.target.value) : null }))}
                placeholder="72" className={inputCls} />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form.featured}
                  onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))}
                  className="w-4 h-4 accent-[#C5A880]" />
                <span className="text-white/70 text-sm">Featured property</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description *</label>
            <textarea required rows={3} value={form.description} onChange={set('description')}
              placeholder="Describe the property..." className={inputCls + ' resize-none'} />
          </div>

          {/* Amenities */}
          <div>
            <label className={labelCls}>Amenities</label>
            <div className="flex gap-2 mb-2">
              <input value={amenityInput} onChange={e => setAmenityInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                placeholder="Private Pool, Smart Home..." className={inputCls + ' flex-1'} />
              <button type="button" onClick={addAmenity}
                className="px-4 py-2.5 bg-[#C5A880]/20 text-[#C5A880] rounded-lg text-sm hover:bg-[#C5A880]/30 transition-colors">
                Add
              </button>
            </div>
            {form.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.amenities.map((a, i) => (
                  <span key={i} className="flex items-center gap-1.5 bg-white/8 text-white/70 text-xs px-2.5 py-1 rounded-full">
                    {a}
                    <button type="button" onClick={() => removeAmenity(i)} className="text-white/40 hover:text-red-400 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── Media Upload ── */}
          <MediaUpload
            ref={mediaRef}
            propertyId={initial?.id}
            propertySlug={form.slug}
          />

          {error && (
            <div className="flex items-center gap-2 bg-red-500/15 border border-red-500/30 rounded-lg px-4 py-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 border border-white/15 text-white/60 rounded-xl text-sm hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-3 bg-[#C5A880] text-[#11161E] rounded-xl text-sm font-semibold
                         hover:bg-[#A4855C] transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Property</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminPropertiesPage() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const pathname     = usePathname()

  const [properties, setProperties] = useState<Property[]>([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [editProp,   setEditProp]   = useState<Property | null>(null)
  const [toast,      setToast]      = useState('')
  const [deleting,   setDeleting]   = useState<string | null>(null)

  // ✅ FIX: showForm ab URL se drive hota hai — tab switch karne par bhi open rehta hai
  const action   = searchParams.get('action')  // 'new' | 'edit' | null
  const showForm = action === 'new' || action === 'edit'

  const openNew = () => {
    setEditProp(null)
    router.push(`${pathname}?action=new`)
  }

  const openEdit = (prop: Property) => {
    setEditProp(prop)
    router.push(`${pathname}?action=edit&id=${prop.id}`)
  }

  const closeForm = () => {
    router.push(pathname)
  }

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/properties')
    const d   = await res.json()
    setProperties(d.properties ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  // When URL has action=edit, sync the editProp from loaded properties
  useEffect(() => {
    const editId = searchParams.get('id')
    if (action === 'edit' && editId && properties.length > 0) {
      const found = properties.find(p => p.id === editId)
      if (found) setEditProp(found)
    }
  }, [action, searchParams, properties])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    const res = await fetch('/api/admin/properties', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setDeleting(null)
    if (res.ok) { showToast('Property deleted'); load() }
    else showToast('Error deleting property')
  }

  const handleApprove = async (id: string) => {
    const res = await fetch('/api/admin/properties', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'for_sale' }),
    })
    if (res.ok) { showToast('Property approved!'); load() }
    else showToast('Error approving property')
  }

  const handleDecline = async (id: string) => {
    const res = await fetch('/api/admin/properties', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'draft' }),
    })
    if (res.ok) { showToast('Property declined (moved to drafts)'); load() }
    else showToast('Error declining property')
  }

  const exportCSV = () => {
    const rows = [
      ['Title', 'Locality', 'Address', 'Type', 'Price (Cr)', 'Price Label', 'Bedrooms', 'Bathrooms', 'Area (sqft)', 'Status', 'Featured', 'Agent'],
      ...filtered.map(p => [
        p.title, p.locality, p.address, p.type, p.price, p.price_label, p.bedrooms, p.bathrooms, p.area_sqft, p.status, p.featured ? 'Yes' : 'No', p.agent_name
      ])
    ]
    const csvContent = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `properties_${filter || 'all'}_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filter = searchParams.get('filter') // e.g. 'pending', 'featured', 'sold', 'rented', 'draft', 'archived', 'trash'

  const filtered = properties.filter(p => {
    // 1. Search filter
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                          p.address.toLowerCase().includes(search.toLowerCase())
    if (!matchesSearch) return false

    // 2. Tab/Category filter
    if (!filter) {
      // By default, hide draft, archived, and trashed listings from "All Properties"
      return p.status !== 'draft' && p.status !== 'archived' && p.status !== 'trash'
    }

    if (filter === 'featured') {
      return p.featured === true
    }
    if (filter === 'rented') {
      return p.status === 'for_rent'
    }

    return p.status === filter
  })

  const getPageHeading = () => {
    switch (filter) {
      case 'pending': return { title: 'Pending Approval', desc: 'Properties waiting for admin verification' }
      case 'featured': return { title: 'Featured Properties', desc: 'Properties highlighted on the homepage' }
      case 'sold': return { title: 'Sold Properties', desc: 'Properties marked as sold' }
      case 'rented': return { title: 'Rented Properties', desc: 'Properties listed for rent' }
      case 'draft': return { title: 'Draft Properties', desc: 'Saved drafts (unpublished)' }
      case 'archived': return { title: 'Archived Properties', desc: 'Old listings moved to archive' }
      case 'trash': return { title: 'Trash / Deleted', desc: 'Properties deleted and moved to trash' }
      default: return { title: 'Properties', desc: 'All active listings on the website' }
    }
  }

  const { title: pageTitle, desc: pageDesc } = getPageHeading()

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#11161E] border border-[#C5A880]/40 text-white px-5 py-3 rounded-xl shadow-xl animate-fade-up">
          <CheckCircle2 className="w-4 h-4 text-[#C5A880]" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-playfair text-3xl font-semibold text-white">{pageTitle}</h1>
          <p className="text-white/40 text-sm mt-1">{pageDesc} · {filtered.length} shown ({properties.length} total)</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/8 text-white/70 hover:text-white rounded-lg text-sm font-medium border border-white/10 hover:border-white/20 transition-all">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={openNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#C5A880] text-[#11161E]
                       font-semibold text-sm rounded-lg hover:bg-[#A4855C] transition-all">
            <Plus className="w-4 h-4" /> Add Property
          </button>
        </div>
      </div>

      {/* Search & Tabs */}
      <div className="space-y-4">
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search properties by title or location..."
            className="w-full bg-[#11161E] border border-white/10 text-white pl-10 pr-4 py-3
                       rounded-xl text-sm placeholder:text-white/25 focus:outline-none
                       focus:border-[#C5A880] transition-colors" />
        </div>

        {/* Excel-style tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-white/5 pb-2 overflow-x-auto scrollbar-none">
          {[
            { label: 'All Properties', value: '' },
            { label: 'Pending Approval', value: 'pending' },
            { label: 'Featured', value: 'featured' },
            { label: 'Sold', value: 'sold' },
            { label: 'Rented', value: 'rented' },
            { label: 'Drafts', value: 'draft' },
            { label: 'Archived', value: 'archived' },
            { label: 'Trash', value: 'trash' },
          ].map(t => (
            <button key={t.value}
              onClick={() => {
                if (t.value === '') router.push(pathname)
                else router.push(`${pathname}?filter=${t.value}`)
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                (filter || '') === t.value
                  ? 'bg-[#C5A880] text-[#11161E] font-bold'
                  : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#11161E] rounded-xl border border-white/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8">
                {['Property','Location','Price','Status','Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-[0.68rem] font-bold uppercase tracking-widest text-white/35">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? [...Array(5)].map((_,i) => (
                <tr key={i}>
                  {[...Array(5)].map((_,j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 bg-white/6 rounded animate-pulse" style={{ width: `${[120,100,60,70,80][j]}px` }} />
                    </td>
                  ))}
                </tr>
              )) : filtered.map(prop => (
                <tr key={prop.id} className="hover:bg-white/3 transition-colors group">
                  <td className="px-5 py-4">
                    <p className="text-white text-sm font-medium">{prop.title}</p>
                    <p className="text-white/35 text-xs flex items-center gap-1 mt-0.5">
                      <Bed className="w-2.5 h-2.5" /> {prop.bedrooms} BHK · {prop.area_sqft.toLocaleString()} sqft
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-white/55 text-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#C5A880]" /> {prop.address}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-playfair text-[#C5A880] text-sm font-semibold">{prop.price_label}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[0.6rem] font-bold uppercase px-2.5 py-1 rounded-full ${statusColor[prop.status] ?? 'bg-white/10 text-white/50'}`}>
                      {prop.status.replace('_',' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {prop.status === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(prop.id)}
                            className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/25 transition-all" title="Approve">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDecline(prop.id)}
                            className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center text-red-400 hover:bg-red-500/25 transition-all" title="Decline / Reject">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      <Link href={`/properties/${prop.slug}`} target="_blank"
                        className="w-8 h-8 rounded-lg bg-white/6 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/12 transition-all" title="View">
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button onClick={() => openEdit(prop)}
                        className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-400 hover:bg-blue-500/25 transition-all" title="Edit">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(prop.id, prop.title)}
                        disabled={deleting === prop.id}
                        className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center text-red-400 hover:bg-red-500/25 transition-all disabled:opacity-40" title="Delete">
                        {deleting === prop.id
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <div className="px-6 py-14 text-center">
              <Building2 className="w-10 h-10 text-white/15 mx-auto mb-3" />
              <p className="text-white/30 text-sm">No properties found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <PropertyForm
          initial={editProp ? {
            id: editProp.id, title: editProp.title, slug: editProp.slug,
            type: editProp.type, locality: editProp.locality, address: editProp.address,
            price: editProp.price, price_label: editProp.price_label,
            bedrooms: editProp.bedrooms, bathrooms: editProp.bathrooms,
            area_sqft: editProp.area_sqft, status: editProp.status,
            agent_name: editProp.agent_name, description: editProp.description,
            featured: editProp.featured, amenities: editProp.amenities ?? [],
            interest_pct: editProp.interest_pct, ready_date: editProp.ready_date ?? '',
          } : undefined}
          onSave={() => { closeForm(); load(); showToast(editProp ? 'Property updated!' : 'Property added!') }}
          onClose={closeForm}
        />
      )}
    </div>
  )
}
