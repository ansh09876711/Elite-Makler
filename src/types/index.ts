export type PropertyStatus = 'for_sale' | 'for_rent' | 'new_listing' | 'coming_soon' | 'preview' | 'sold' | 'pending' | 'draft' | 'archived' | 'trash'
export type PropertyType   = 'villa' | 'penthouse' | 'mansion' | 'plot' | 'commercial'
export type Locality       = 'vijay_nagar' | 'bypass_road' | 'palasia_saket' | 'nipania' | 'off_market'

export interface Property {
  id:           string
  slug:         string
  title:        string
  type:         PropertyType
  locality:     Locality
  address:      string
  price:        number          // crores mein, e.g. 4.85
  price_label:  string          // e.g. "₹4.85 Cr" ya "On Request"
  bedrooms:     number
  bathrooms:    number
  area_sqft:    number
  status:       PropertyStatus
  agent_name:   string
  description:  string
  amenities:    string[]
  images:       PropertyImage[]
  interest_pct: number | null   // for launches — 0-100
  ready_date:   string | null   // "Dec 2025"
  created_at:   string
  featured:     boolean
}

export interface PropertyImage {
  id:         string
  property_id: string
  url:        string            // Cloudinary URL
  public_id:  string           // Cloudinary public_id
  alt:        string
  is_primary: boolean
  order_index: number
}

export interface Enquiry {
  id:         string
  name:       string
  email:      string | null
  phone:      string
  intent:     'buy' | 'sell' | 'rent' | 'invest'
  message:    string | null
  property_id: string | null
  created_at: string
}

export interface Agent {
  id:           string
  name:         string
  role:         string
  speciality:   string
  deals_closed: number
  txn_value:    string          // e.g. "₹180 Cr+"
  badge:        string
  photo_url:    string | null
}
