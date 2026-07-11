-- Japan Trip Companion — initial schema.
-- Run in the Supabase SQL editor (or `supabase db push`) once, when activating
-- the Supabase backend (Phase 8). Mirrors specs/001-japan-trip-app/data-model.md.
--
-- Note: primary keys are TEXT (not uuid) so the human-readable seed ids from
-- server/src/data/placeholder-data.json (e.g. "zone-tokyo") load as-is; rows
-- created in the app use crypto.randomUUID() values, which are also valid text.
-- Row Level Security is enabled with NO policies on every table: anon and
-- authenticated roles are denied entirely, and only the backend's service-role
-- key (which bypasses RLS) can read/write. The browser never touches the DB.

-- updated_at maintenance -----------------------------------------------------
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- trips ----------------------------------------------------------------------
create table if not exists trips (
  id          text primary key,
  name        text not null check (char_length(name) between 1 and 120),
  start_date  date not null,
  end_date    date not null check (end_date >= start_date),
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- zones ----------------------------------------------------------------------
create table if not exists zones (
  id         text primary key,
  name       text not null check (char_length(name) between 1 and 80),
  name_ja    text,
  summary    text,
  image_url  text,
  lat        double precision,
  lng        double precision,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- journey_steps --------------------------------------------------------------
create table if not exists journey_steps (
  id         text primary key,
  trip_id    text not null references trips(id) on delete cascade,
  zone_id    text not null references zones(id) on delete restrict,
  position   int not null,
  start_date date not null,
  end_date   date not null check (end_date >= start_date),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (trip_id, position)
);

-- places ---------------------------------------------------------------------
create table if not exists places (
  id          text primary key,
  zone_id     text not null references zones(id) on delete cascade,
  category    text not null check (category in ('hotel','attraction','food','shopping','other')),
  name        text not null check (char_length(name) between 1 and 120),
  name_ja     text,
  description text,
  address     text,
  links       jsonb not null default '[]'::jsonb,
  image_url   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists places_zone_category_idx on places (zone_id, category);

-- tips (exactly one parent: zone or place) -----------------------------------
create table if not exists tips (
  id         text primary key,
  zone_id    text references zones(id) on delete cascade,
  place_id   text references places(id) on delete cascade,
  body       text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (num_nonnulls(zone_id, place_id) = 1)
);

-- files (metadata; blobs live in the `trip-files` storage bucket) ------------
create table if not exists files (
  id           text primary key,
  trip_id      text references trips(id) on delete cascade,
  zone_id      text references zones(id) on delete cascade,
  place_id     text references places(id) on delete set null,
  display_name text not null check (char_length(display_name) between 1 and 120),
  storage_path text not null unique,
  mime_type    text not null,
  size_bytes   bigint not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  check (num_nonnulls(trip_id, zone_id, place_id) = 1)
);

-- updated_at triggers --------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['trips','zones','journey_steps','places','tips','files'] loop
    execute format('drop trigger if exists set_updated_at on %I', t);
    execute format('create trigger set_updated_at before update on %I for each row execute function set_updated_at()', t);
  end loop;
end $$;

-- Row Level Security: deny all except the service-role key -------------------
alter table trips          enable row level security;
alter table zones          enable row level security;
alter table journey_steps  enable row level security;
alter table places         enable row level security;
alter table tips           enable row level security;
alter table files          enable row level security;
