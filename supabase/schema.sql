-- ============================================================
-- LuxeHaven — Supabase Schema + Seed Data
-- 
-- STEP: Supabase Dashboard → SQL Editor → New query
-- URL:  https://supabase.com/dashboard/project/odrisbaabgeyhzaauqtl/sql/new
-- Ye poora file paste karke "Run" button dabao
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: properties
-- ============================================================
CREATE TABLE IF NOT EXISTS properties (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug         TEXT UNIQUE NOT NULL,
  title        TEXT NOT NULL,
  type         TEXT NOT NULL CHECK (type IN ('villa','penthouse','mansion','plot','commercial')),
  locality     TEXT NOT NULL CHECK (locality IN ('vijay_nagar','bypass_road','palasia_saket','nipania','off_market')),
  address      TEXT NOT NULL,
  price        NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_label  TEXT NOT NULL DEFAULT '',
  bedrooms     INTEGER NOT NULL DEFAULT 0,
  bathrooms    NUMERIC(4,1) NOT NULL DEFAULT 0,
  area_sqft    INTEGER NOT NULL DEFAULT 0,
  status       TEXT NOT NULL DEFAULT 'for_sale'
               CHECK (status IN ('for_sale','new_listing','coming_soon','preview','sold')),
  agent_name   TEXT NOT NULL DEFAULT '',
  description  TEXT NOT NULL DEFAULT '',
  amenities    TEXT[] DEFAULT '{}',
  interest_pct INTEGER CHECK (interest_pct BETWEEN 0 AND 100),
  ready_date   TEXT,
  featured     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: property_images  (Cloudinary URLs store honge)
-- ============================================================
CREATE TABLE IF NOT EXISTS property_images (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id  UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url          TEXT NOT NULL,
  public_id    TEXT NOT NULL DEFAULT '',
  alt          TEXT NOT NULL DEFAULT '',
  is_primary   BOOLEAN NOT NULL DEFAULT FALSE,
  order_index  INTEGER NOT NULL DEFAULT 0
);

-- ============================================================
-- TABLE: agents
-- ============================================================
CREATE TABLE IF NOT EXISTS agents (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  role         TEXT NOT NULL,
  speciality   TEXT NOT NULL,
  deals_closed INTEGER NOT NULL DEFAULT 0,
  txn_value    TEXT NOT NULL DEFAULT '',
  badge        TEXT NOT NULL DEFAULT '',
  photo_url    TEXT
);

-- ============================================================
-- TABLE: enquiries  (contact form submissions)
-- ============================================================
CREATE TABLE IF NOT EXISTS enquiries (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  email        TEXT,
  phone        TEXT NOT NULL,
  intent       TEXT NOT NULL CHECK (intent IN ('buy','sell','rent','invest')),
  message      TEXT,
  property_id  UUID REFERENCES properties(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE properties      ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents          ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries       ENABLE ROW LEVEL SECURITY;

-- Public read: properties, images, agents
CREATE POLICY "Public read properties"
  ON properties FOR SELECT USING (TRUE);

CREATE POLICY "Public read images"
  ON property_images FOR SELECT USING (TRUE);

CREATE POLICY "Public read agents"
  ON agents FOR SELECT USING (TRUE);

-- Anyone can submit enquiry
CREATE POLICY "Public insert enquiry"
  ON enquiries FOR INSERT WITH CHECK (TRUE);

-- ============================================================
-- SEED DATA — Agents
-- ============================================================
INSERT INTO agents (name, role, speciality, deals_closed, txn_value, badge) VALUES
  ('Rajesh Singhal',      'Senior Estate Advisor',    'Bypass Road villas aur off-market farmhouse deals', 42, '₹180 Cr+', 'Top Agent 2025'),
  ('Amitesh Shrivastava', 'Luxury Penthouse Advisor', 'Ultra-premium vertical living',                     29, '₹240 Cr+', 'HNI Specialist'),
  ('Divya Sharma',        'Heritage Property Expert', 'Palasia & Saket heritage mansions',                 35, '₹310 Cr+', 'Elite Closer'),
  ('Vikram Malhotra',     'Commercial Advisor',       'Office spaces aur retail plots',                    51, '₹420 Cr+', 'Investment Expert');

-- ============================================================
-- SEED DATA — Properties
-- ============================================================
INSERT INTO properties
  (slug, title, type, locality, address, price, price_label,
   bedrooms, bathrooms, area_sqft, status, agent_name,
   description, amenities, interest_pct, ready_date, featured)
VALUES
(
  'bypass-forest-retreat',
  'The Bypass Forest Retreat',
  'villa', 'bypass_road', 'Bypass Road, Indore',
  4.85, '₹4.85 Cr', 5, 6, 6200, 'for_sale', 'Rajesh Singhal',
  'A breathtaking bespoke villa nestled in the green belt of Bypass Road. Designed by award-winning architects, this 6,200 sqft estate offers unmatched privacy with a private forest-facing lawn, infinity pool, and a dedicated home theatre.',
  ARRAY['Private Pool','Home Theatre','Forest View','Smart Home','6-Car Garage','Servants Quarters'],
  NULL, NULL, TRUE
),
(
  'nipania-sky-penthouse',
  'The Nipania Sky Penthouse',
  'penthouse', 'nipania', 'Nipania Heights, Indore',
  7.20, '₹7.20 Cr', 4, 4.5, 5100, 'for_sale', 'Amitesh Shrivastava',
  'Perched atop Nipania Heights, this sky penthouse offers 360-degree panoramic views of Indore. 5,100 sqft of curated luxury with floor-to-ceiling glass, a private terrace with plunge pool, and a chef kitchen imported from Italy.',
  ARRAY['360° City View','Plunge Pool','Italian Kitchen','Private Elevator','Wine Cellar','Concierge'],
  NULL, NULL, TRUE
),
(
  'palasia-legacy-mansion',
  'The Palasia Legacy Mansion',
  'mansion', 'palasia_saket', 'Old Palasia, Indore',
  9.40, '₹9.40 Cr', 6, 7, 8900, 'new_listing', 'Divya Sharma',
  'A grand heritage-inspired mansion in the most coveted address in Indore — Old Palasia. Built on 8,900 sqft featuring hand-carved marble interiors, a grand ballroom, private cinema, and a lush courtyard garden.',
  ARRAY['Ballroom','Private Cinema','Marble Interiors','Courtyard Garden','Heritage Architecture','CCTV 24x7'],
  NULL, NULL, TRUE
),
(
  'stone-glass-residence',
  'The Stone & Glass Residence',
  'villa', 'vijay_nagar', 'Vijay Nagar, Indore',
  6.75, '₹6.75 Cr', 5, 5, 5800, 'new_listing', 'Rajesh Singhal',
  'Ultra-modern stone and glass villa in the prestigious Vijay Nagar corridor. An architectural statement with double-height living spaces, a climate-controlled wine room, and a 50-metre private driveway.',
  ARRAY['Wine Room','50m Driveway','Double Height Ceiling','Smart Security','Rooftop Garden','EV Charging'],
  72, 'Dec 2025', TRUE
),
(
  'ocean-breeze-penthouse',
  'The Ocean Breeze Penthouse',
  'penthouse', 'nipania', 'Nipania Heights, Indore',
  11.20, '₹11.20 Cr', 4, 4, 7100, 'coming_soon', 'Amitesh Shrivastava',
  'The most anticipated launch of 2026 — a 7,100 sqft sky residence inspired by ocean-front architecture. Features an indoor waterfall, a 25-metre infinity lap pool at 32nd floor, and a private helipad.',
  ARRAY['Infinity Lap Pool','Indoor Waterfall','Helipad Access','Sky Lounge','Temperature-Controlled Pool','Butler Service'],
  45, 'Mar 2026', FALSE
),
(
  'forest-canopy-mansion',
  'The Forest Canopy Mansion',
  'mansion', 'bypass_road', 'Bypass Road, Indore',
  0, 'On Request', 7, 8, 11500, 'preview', 'Vikram Malhotra',
  'An unprecedented estate — 11,500 sqft of architectural excellence set in 2 acres of private forest land on Bypass Road. Available by preview only to pre-qualified HNI clients.',
  ARRAY['2-Acre Private Land','Forest Views','12-Car Underground Garage','Private Staff Wing','Meditation Garden','Helipad'],
  28, 'Q1 2026', FALSE
);

-- ============================================================
-- SEED DATA — Property Images
-- ============================================================
INSERT INTO property_images (property_id, url, is_primary, order_index)
SELECT id, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80', TRUE, 0 FROM properties WHERE slug = 'bypass-forest-retreat';
INSERT INTO property_images (property_id, url, is_primary, order_index)
SELECT id, 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80', FALSE, 1 FROM properties WHERE slug = 'bypass-forest-retreat';

INSERT INTO property_images (property_id, url, is_primary, order_index)
SELECT id, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', TRUE, 0 FROM properties WHERE slug = 'nipania-sky-penthouse';
INSERT INTO property_images (property_id, url, is_primary, order_index)
SELECT id, 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80', FALSE, 1 FROM properties WHERE slug = 'nipania-sky-penthouse';

INSERT INTO property_images (property_id, url, is_primary, order_index)
SELECT id, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', TRUE, 0 FROM properties WHERE slug = 'palasia-legacy-mansion';
INSERT INTO property_images (property_id, url, is_primary, order_index)
SELECT id, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', FALSE, 1 FROM properties WHERE slug = 'palasia-legacy-mansion';

INSERT INTO property_images (property_id, url, is_primary, order_index)
SELECT id, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', TRUE, 0 FROM properties WHERE slug = 'stone-glass-residence';
INSERT INTO property_images (property_id, url, is_primary, order_index)
SELECT id, 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80', FALSE, 1 FROM properties WHERE slug = 'stone-glass-residence';

INSERT INTO property_images (property_id, url, is_primary, order_index)
SELECT id, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', TRUE, 0 FROM properties WHERE slug = 'ocean-breeze-penthouse';
INSERT INTO property_images (property_id, url, is_primary, order_index)
SELECT id, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80', FALSE, 1 FROM properties WHERE slug = 'ocean-breeze-penthouse';

INSERT INTO property_images (property_id, url, is_primary, order_index)
SELECT id, 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80', TRUE, 0 FROM properties WHERE slug = 'forest-canopy-mansion';
INSERT INTO property_images (property_id, url, is_primary, order_index)
SELECT id, 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80', FALSE, 1 FROM properties WHERE slug = 'forest-canopy-mansion';

-- ============================================================
-- VERIFY
-- ============================================================
SELECT
  (SELECT COUNT(*) FROM properties) AS total_properties,
  (SELECT COUNT(*) FROM property_images) AS total_images,
  (SELECT COUNT(*) FROM agents)     AS total_agents;
