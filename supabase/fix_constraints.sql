-- ============================================================
-- FIX: Schema constraints jo frontend se match nahi karte
-- 
-- Supabase Dashboard → SQL Editor mein ye poora script paste
-- karke "Run" dabao:
-- https://supabase.com/dashboard/project/odrisbaabgeyhzaauqtl/sql/new
-- ============================================================

-- ── 1. TYPE constraint fix ──────────────────────────────────
-- Old: villa, penthouse, mansion, plot, commercial
-- New: + apartment, house bhi add karo

ALTER TABLE properties
  DROP CONSTRAINT IF EXISTS properties_type_check;

ALTER TABLE properties
  ADD CONSTRAINT properties_type_check
  CHECK (type IN ('villa','penthouse','mansion','apartment','house','plot','commercial'));

-- ── 2. STATUS constraint fix ────────────────────────────────
-- Old: for_sale, new_listing, coming_soon, preview, sold
-- New: + for_rent, pending, draft, archived, trash bhi add karo

ALTER TABLE properties
  DROP CONSTRAINT IF EXISTS properties_status_check;

ALTER TABLE properties
  ADD CONSTRAINT properties_status_check
  CHECK (status IN ('for_sale','for_rent','new_listing','coming_soon','preview','sold','pending','draft','archived','trash'));

-- ── 3. LOCALITY constraint fix ──────────────────────────────
-- Old: sirf 5 values (vijay_nagar, bypass_road, palasia_saket, nipania, off_market)
-- New: All 80+ Indore colonies allow karo

ALTER TABLE properties
  DROP CONSTRAINT IF EXISTS properties_locality_check;

-- No constraint — locality any text value ho sakti hai
-- (admin combobox already handles validation on frontend)

-- ── 4. Verify ───────────────────────────────────────────────
SELECT
  conname                          AS constraint_name,
  pg_get_constraintdef(oid)        AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'properties'::regclass
  AND contype = 'c'
ORDER BY conname;
