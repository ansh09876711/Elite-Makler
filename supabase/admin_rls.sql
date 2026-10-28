-- ============================================================
-- LuxeHaven — Admin RLS Policies
-- Supabase Dashboard → SQL Editor mein run karo
-- URL: https://supabase.com/dashboard/project/odrisbaabgeyhzaauqtl/sql/new
-- ============================================================
-- NOTE: App already service_role key se kaam karti hai,
--       yeh SQL optional backup approach hai.
-- ============================================================

-- Admin ke liye properties INSERT policy
CREATE POLICY "Admin insert properties"
  ON properties FOR INSERT
  WITH CHECK (is_admin());

-- Admin ke liye properties UPDATE policy
CREATE POLICY "Admin update properties"
  ON properties FOR UPDATE
  USING (is_admin());

-- Admin ke liye properties DELETE policy
CREATE POLICY "Admin delete properties"
  ON properties FOR DELETE
  USING (is_admin());

-- Admin ke liye property_images INSERT policy
CREATE POLICY "Admin insert images"
  ON property_images FOR INSERT
  WITH CHECK (is_admin());

-- Admin ke liye property_images UPDATE policy
CREATE POLICY "Admin update images"
  ON property_images FOR UPDATE
  USING (is_admin());

-- Admin ke liye property_images DELETE policy
CREATE POLICY "Admin delete images"
  ON property_images FOR DELETE
  USING (is_admin());

-- Admin ke liye agents INSERT/UPDATE/DELETE policies
CREATE POLICY "Admin insert agents"
  ON agents FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admin update agents"
  ON agents FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admin delete agents"
  ON agents FOR DELETE
  USING (is_admin());

-- Admin read enquiries (already exists in admin.sql, skip if error)
-- CREATE POLICY "Admin read enquiries" ON enquiries FOR SELECT USING (is_admin());

SELECT 'Admin RLS policies added successfully!' as status;
