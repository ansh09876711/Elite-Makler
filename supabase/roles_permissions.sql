-- ============================================================
-- Elite Makler – Roles & Permissions Table
-- Run this in Supabase → SQL Editor
-- ============================================================

create table if not exists roles_permissions (
  id              uuid primary key default gen_random_uuid(),
  role_name       text not null unique,
  description     text,
  permissions     jsonb not null default '{}',
  assigned_users  integer default 0,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Auto-update updated_at on change
create or replace function update_updated_at_column()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_roles_updated_at on roles_permissions;
create trigger set_roles_updated_at
  before update on roles_permissions
  for each row execute function update_updated_at_column();

-- Enable Row Level Security
alter table roles_permissions enable row level security;

-- Policy: allow all operations for authenticated users
-- (tighten this based on your auth setup)
drop policy if exists "Allow all for authenticated" on roles_permissions;
create policy "Allow all for authenticated"
  on roles_permissions
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Enable real-time so the UI gets live updates
alter publication supabase_realtime add table roles_permissions;

-- ─── Seed default roles ───────────────────────────────────────
insert into roles_permissions (role_name, description, permissions) values

('Super Admin', 'Full unrestricted access to all modules', '{
  "dashboard":     {"view":true,"add":true,"edit":true,"delete":true,"export":true},
  "properties":    {"view":true,"add":true,"edit":true,"delete":true,"export":true},
  "users":         {"view":true,"add":true,"edit":true,"delete":true,"export":true},
  "partners":      {"view":true,"add":true,"edit":true,"delete":true,"export":true},
  "agents":        {"view":true,"add":true,"edit":true,"delete":true,"export":true},
  "enquiries":     {"view":true,"add":true,"edit":true,"delete":true,"export":true},
  "finance":       {"view":true,"add":true,"edit":true,"delete":true,"export":true},
  "reviews":       {"view":true,"add":true,"edit":true,"delete":true,"export":true},
  "reports":       {"view":true,"add":true,"edit":true,"delete":true,"export":true},
  "support":       {"view":true,"add":true,"edit":true,"delete":true,"export":true},
  "notifications": {"view":true,"add":true,"edit":true,"delete":true,"export":true},
  "settings":      {"view":true,"add":true,"edit":true,"delete":true,"export":true},
  "security":      {"view":true,"add":true,"edit":true,"delete":true,"export":true}
}'),

('Company Admin', 'Senior admin – full access except security and settings', '{
  "dashboard":     {"view":true,"add":true,"edit":true,"delete":true,"export":true},
  "properties":    {"view":true,"add":true,"edit":true,"delete":true,"export":true},
  "users":         {"view":true,"add":true,"edit":true,"delete":false,"export":true},
  "partners":      {"view":true,"add":true,"edit":true,"delete":false,"export":true},
  "agents":        {"view":true,"add":true,"edit":true,"delete":false,"export":true},
  "enquiries":     {"view":true,"add":true,"edit":true,"delete":false,"export":true},
  "finance":       {"view":true,"add":true,"edit":true,"delete":false,"export":true},
  "reviews":       {"view":true,"add":true,"edit":true,"delete":true,"export":true},
  "reports":       {"view":true,"add":false,"edit":false,"delete":false,"export":true},
  "support":       {"view":true,"add":true,"edit":true,"delete":false,"export":false},
  "notifications": {"view":true,"add":true,"edit":true,"delete":false,"export":false},
  "settings":      {"view":false,"add":false,"edit":false,"delete":false,"export":false},
  "security":      {"view":false,"add":false,"edit":false,"delete":false,"export":false}
}'),

('Manager', 'Manages properties, enquiries, and agents – no finance/security', '{
  "dashboard":     {"view":true,"add":false,"edit":false,"delete":false,"export":false},
  "properties":    {"view":true,"add":true,"edit":true,"delete":false,"export":true},
  "users":         {"view":true,"add":false,"edit":false,"delete":false,"export":false},
  "partners":      {"view":true,"add":false,"edit":false,"delete":false,"export":false},
  "agents":        {"view":true,"add":true,"edit":true,"delete":false,"export":false},
  "enquiries":     {"view":true,"add":true,"edit":true,"delete":false,"export":true},
  "finance":       {"view":false,"add":false,"edit":false,"delete":false,"export":false},
  "reviews":       {"view":true,"add":false,"edit":true,"delete":false,"export":false},
  "reports":       {"view":true,"add":false,"edit":false,"delete":false,"export":true},
  "support":       {"view":true,"add":false,"edit":true,"delete":false,"export":false},
  "notifications": {"view":false,"add":false,"edit":false,"delete":false,"export":false},
  "settings":      {"view":false,"add":false,"edit":false,"delete":false,"export":false},
  "security":      {"view":false,"add":false,"edit":false,"delete":false,"export":false}
}'),

('Agent', 'Can view and add properties, manage own enquiries only', '{
  "dashboard":     {"view":true,"add":false,"edit":false,"delete":false,"export":false},
  "properties":    {"view":true,"add":true,"edit":true,"delete":false,"export":false},
  "users":         {"view":false,"add":false,"edit":false,"delete":false,"export":false},
  "partners":      {"view":false,"add":false,"edit":false,"delete":false,"export":false},
  "agents":        {"view":false,"add":false,"edit":false,"delete":false,"export":false},
  "enquiries":     {"view":true,"add":false,"edit":true,"delete":false,"export":false},
  "finance":       {"view":false,"add":false,"edit":false,"delete":false,"export":false},
  "reviews":       {"view":true,"add":false,"edit":false,"delete":false,"export":false},
  "reports":       {"view":false,"add":false,"edit":false,"delete":false,"export":false},
  "support":       {"view":true,"add":true,"edit":false,"delete":false,"export":false},
  "notifications": {"view":false,"add":false,"edit":false,"delete":false,"export":false},
  "settings":      {"view":false,"add":false,"edit":false,"delete":false,"export":false},
  "security":      {"view":false,"add":false,"edit":false,"delete":false,"export":false}
}'),

('Sales Executive', 'Can view listings and manage leads and appointments only', '{
  "dashboard":     {"view":true,"add":false,"edit":false,"delete":false,"export":false},
  "properties":    {"view":true,"add":false,"edit":false,"delete":false,"export":false},
  "users":         {"view":false,"add":false,"edit":false,"delete":false,"export":false},
  "partners":      {"view":false,"add":false,"edit":false,"delete":false,"export":false},
  "agents":        {"view":false,"add":false,"edit":false,"delete":false,"export":false},
  "enquiries":     {"view":true,"add":true,"edit":true,"delete":false,"export":false},
  "finance":       {"view":false,"add":false,"edit":false,"delete":false,"export":false},
  "reviews":       {"view":false,"add":false,"edit":false,"delete":false,"export":false},
  "reports":       {"view":false,"add":false,"edit":false,"delete":false,"export":false},
  "support":       {"view":false,"add":false,"edit":false,"delete":false,"export":false},
  "notifications": {"view":false,"add":false,"edit":false,"delete":false,"export":false},
  "settings":      {"view":false,"add":false,"edit":false,"delete":false,"export":false},
  "security":      {"view":false,"add":false,"edit":false,"delete":false,"export":false}
}')

on conflict (role_name) do nothing;
