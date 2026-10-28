-- ============================================================
-- LuxeHaven Admin Setup
-- Supabase SQL Editor mein run karo
-- ============================================================

-- Admin emails table
CREATE TABLE IF NOT EXISTS admin_users (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email      TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only admins can read admin_users (service role bypass)
CREATE POLICY "Admins only" ON admin_users FOR SELECT USING (
  auth.email() IN (SELECT email FROM admin_users)
);

-- Insert admin emails
INSERT INTO admin_users (email) VALUES
  ('vaishnoshreeconstruction@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE email = auth.email()
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Enquiries: only admins can read all enquiries
CREATE POLICY "Admin read enquiries"
  ON enquiries FOR SELECT
  USING (is_admin());

SELECT 'Admin setup complete!' as status;
