-- ============================================================
-- Drop check constraints to allow custom/new values
-- Supabase Dashboard → SQL Editor mein run karo
-- URL: https://supabase.com/dashboard/project/odrisbaabgeyhzaauqtl/sql/new
-- ============================================================

-- 1. Drop old locality check constraint (taaki custom colonies accept ho sakein)
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_locality_check;

-- 2. Drop old type constraint and replace with updated types
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_type_check;
ALTER TABLE properties ADD CONSTRAINT properties_type_check
  CHECK (type IN ('villa','penthouse','mansion','apartment','house','plot','commercial'));

-- 3. Drop old status constraint and replace with updated statuses
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_status_check;
ALTER TABLE properties ADD CONSTRAINT properties_status_check
  CHECK (status IN ('for_sale','for_rent','new_listing','coming_soon','preview','sold'));

SELECT 'Database constraints updated successfully!' as status;
