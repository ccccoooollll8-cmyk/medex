-- ============================================================
-- MedX Platform — Supabase Schema
-- Run this once in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

create table if not exists products (
  id                  text primary key,
  name                text not null,
  sku                 text not null,
  batch_number        text not null,
  category            text not null,
  quantity            integer not null default 0,
  unit                text not null,
  expiry_date         text not null,
  manufacturing_date  text not null,
  supplier_id         text not null,
  supplier_name       text not null,
  description         text,
  price               numeric(10,2) not null default 0,
  status              text not null default 'active',
  qr_code             text,
  verified            boolean not null default false,
  blockchain_tx_hash  text,
  blockchain_block    integer,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table if not exists shipments (
  id                  text primary key,
  shipment_number     text not null,
  from_id             text not null,
  from_name           text not null,
  from_role           text not null,
  to_id               text not null,
  to_name             text not null,
  to_role             text not null,
  products            jsonb not null default '[]'::jsonb,
  status              text not null,
  dispatch_date       timestamptz not null,
  estimated_arrival   timestamptz not null,
  actual_arrival      timestamptz,
  tracking_number     text not null,
  notes               text,
  temperature         numeric(5,2),
  verified            boolean not null default false,
  blockchain_tx_hash  text,
  blockchain_block    integer,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table if not exists traceability_events (
  id            text primary key,
  product_id    text not null,
  product_name  text not null,
  event_type    text not null,
  from_entity   text,
  to_entity     text,
  location      text,
  timestamp     timestamptz not null,
  user_id       text not null,
  user_name     text not null,
  user_role     text not null,
  shipment_id   text,
  notes         text,
  verified      boolean not null default false,
  blockchain_hash text
);

create table if not exists inventory (
  id            bigint generated always as identity primary key,
  user_id       text not null,
  product_id    text not null,
  product_name  text not null,
  sku           text not null,
  batch_number  text not null,
  quantity      integer not null default 0,
  updated_at    timestamptz not null default now(),
  constraint inventory_unique unique (user_id, product_id, batch_number)
);

-- Allow anon key to read/write all tables (demo — no auth required)
alter table products           disable row level security;
alter table shipments          disable row level security;
alter table traceability_events disable row level security;
alter table inventory          disable row level security;
