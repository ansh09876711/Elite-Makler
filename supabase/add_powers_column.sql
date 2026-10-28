-- ============================================================
-- Add 'powers' JSONB column to partners and agents tables
-- Run this in Supabase → SQL Editor
-- ============================================================

-- Partners: add powers column
alter table partners
  add column if not exists powers jsonb default '{}';

-- Agents: add powers column  
alter table agents
  add column if not exists powers jsonb default '{}';
