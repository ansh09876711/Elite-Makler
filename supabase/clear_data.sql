-- ============================================================
-- DELETE ALL SEED DATA — Only real data will remain
-- Supabase SQL Editor mein paste karke Run karo
-- https://supabase.com/dashboard/project/odrisbaabgeyhzaauqtl/sql/new
-- ============================================================

-- Images pehle delete karo (foreign key constraint)
DELETE FROM property_images;

-- Properties delete karo
DELETE FROM properties;

-- Agents delete karo
DELETE FROM agents;

-- Enquiries delete karo (optional — agar test enquiries hain)
DELETE FROM enquiries;

-- Verify
SELECT 
  (SELECT COUNT(*) FROM properties)      AS properties,
  (SELECT COUNT(*) FROM property_images) AS images,
  (SELECT COUNT(*) FROM agents)          AS agents,
  (SELECT COUNT(*) FROM enquiries)       AS enquiries;
