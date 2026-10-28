-- ============================================================
-- Elite Makler – Partners Table
-- Run this in Supabase → SQL Editor
-- ============================================================

create table if not exists partners (
  id                uuid primary key default gen_random_uuid(),
  company_name      text not null,
  owner_name        text not null,
  logo_url          text,
  rera_number       text not null,
  gst_number        text,
  pan_number        text,
  email             text not null,
  mobile            text not null,
  office_address    text not null,
  bank_details      text,
  website           text,
  social_links      jsonb default '{}',
  total_listings    integer default 0,
  total_sales       integer default 0,
  revenue_generated numeric(15,2) default 0,
  commission_pct    numeric(5,2) default 1.5,
  status            text default 'pending' check (status in ('active','pending','blocked')),
  powers            jsonb default '{}',
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- Auto-update updated_at
create or replace function update_updated_at_column()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_partners_updated_at on partners;
create trigger set_partners_updated_at
  before update on partners
  for each row execute function update_updated_at_column();

-- Row Level Security
alter table partners enable row level security;

drop policy if exists "Allow all for authenticated" on partners;
create policy "Allow all for authenticated"
  on partners for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Realtime
alter publication supabase_realtime add table partners;
