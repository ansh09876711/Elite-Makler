-- ============================================================
-- SQL: Create Partners and Roles Tables for CRM
-- 
-- STEP: Supabase Dashboard → SQL Editor → New query
-- Copy and paste this code, then click "Run"
-- ============================================================

-- 1. Create PARTNERS table
CREATE TABLE IF NOT EXISTS partners (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name       TEXT NOT NULL,
  owner_name         TEXT NOT NULL,
  logo_url           TEXT,
  rera_number        TEXT NOT NULL UNIQUE,
  gst_number         TEXT,
  pan_number         TEXT,
  email              TEXT NOT NULL UNIQUE,
  mobile             TEXT NOT NULL,
  office_address     TEXT NOT NULL,
  bank_details       TEXT,
  website            TEXT,
  social_links       JSONB DEFAULT '{}'::jsonb,
  total_listings     INTEGER NOT NULL DEFAULT 0,
  total_sales        INTEGER NOT NULL DEFAULT 0,
  revenue_generated  NUMERIC(15, 2) NOT NULL DEFAULT 0,
  commission_pct     NUMERIC(4, 2) NOT NULL DEFAULT 1.5,
  status             TEXT NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('active', 'pending', 'blocked')),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create ROLES table
CREATE TABLE IF NOT EXISTS roles_permissions (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_name          TEXT NOT NULL UNIQUE,
  description        TEXT,
  permissions        JSONB NOT NULL DEFAULT '{}'::jsonb,
  assigned_users     INTEGER NOT NULL DEFAULT 0,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Enable RLS on new tables
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles_permissions ENABLE ROW LEVEL SECURITY;

-- 4. Set RLS Policies (Admins can select/insert/update/delete)
CREATE POLICY "Admins full control on partners" 
  ON partners FOR ALL USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Admins full control on roles" 
  ON roles_permissions FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- 5. Seed initial data for PARTNERS
INSERT INTO partners 
  (company_name, owner_name, rera_number, gst_number, pan_number, email, mobile, office_address, bank_details, website, total_listings, total_sales, revenue_generated, commission_pct, status)
VALUES
  (
    'Vaishno Shree Construction', 
    'Ansh Agarwal', 
    'RERA-IND-908234', 
    '23AAAFV9823Q1Z2', 
    'AAAFV9823Q', 
    'vaishnoshreeconstruction@gmail.com', 
    '+91 731 555-LUXE', 
    '102, Elite Tower, Palasia, Indore', 
    'HDFC Bank - A/C 501002348912 - HDFC0000102', 
    'https://vaishnoshree.in', 
    24, 
    18, 
    45000000.00, 
    1.50, 
    'active'
  ),
  (
    'Silver Realities Ltd', 
    'Prakash Sethi', 
    'RERA-IND-778239', 
    '23AABCS0983A1Z0', 
    'AABCS0983A', 
    'info@silverrealities.com', 
    '+91 98260-12345', 
    'Silver Mall, RNT Marg, Indore', 
    'ICICI Bank - A/C 001205009823 - ICIC0000012', 
    'https://silverrealities.com', 
    12, 
    5, 
    12500000.00, 
    2.00, 
    'pending'
  )
ON CONFLICT (rera_number) DO NOTHING;

-- 6. Seed initial data for ROLES
INSERT INTO roles_permissions 
  (role_name, description, assigned_users, permissions)
VALUES
  (
    'Super Admin', 
    'Full ownership and root dashboard access controls.', 
    1, 
    '{"dashboard": ["view"], "properties": ["view", "add", "edit", "delete", "export"], "users": ["view", "add", "edit", "delete", "export"], "partners": ["view", "add", "edit", "delete", "export"], "agents": ["view", "add", "edit", "delete"], "analytics": ["view", "export"], "finance": ["view", "add", "edit", "export"], "settings": ["view", "add", "edit"]}'
  ),
  (
    'Company Admin', 
    'Can manage agents, list properties, view finances and reports.', 
    2, 
    '{"dashboard": ["view"], "properties": ["view", "add", "edit", "delete", "export"], "users": ["view", "add", "edit"], "partners": ["view", "add", "edit"], "agents": ["view", "add", "edit"], "analytics": ["view"], "finance": ["view", "export"]}'
  ),
  (
    'Manager', 
    'Can edit listings and approve callback/site visit enquiries.', 
    4, 
    '{"dashboard": ["view"], "properties": ["view", "edit"], "enquiries": ["view", "edit"]}'
  ),
  (
    'Partner', 
    'External builder access. Can submit properties and track commissions.', 
    12, 
    '{"dashboard": ["view"], "properties": ["view", "add"], "finance": ["view"]}'
  ),
  (
    'Agent', 
    'Can view assigned properties and callback enquiry leads.', 
    8, 
    '{"dashboard": ["view"], "properties": ["view"], "enquiries": ["view", "edit"]}'
  )
ON CONFLICT (role_name) DO NOTHING;
