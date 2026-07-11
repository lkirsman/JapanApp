-- Japan Trip Companion — cached exchange rates.
-- Stores the most recently fetched JPY→USD/ILS rate so the money calculator can
-- fall back to the last known value when the live rate provider is unreachable.
-- One row per base currency (upserted). Run after 0002 in the Supabase SQL editor.

create table if not exists exchange_rates (
  base       text primary key,
  date       date not null,
  usd        double precision not null,
  ils        double precision not null,
  fetched_at timestamptz not null default now()
);

-- Row Level Security: deny all except the service-role key -------------------
alter table exchange_rates enable row level security;
