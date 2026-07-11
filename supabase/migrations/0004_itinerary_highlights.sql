-- Japan Trip Companion — day "featured" highlights.
-- A highlight is an itinerary item shown as a coral banner between a day's date
-- and its plan (e.g. "🎂 Today is Luciana's birthday!"). Reuses itinerary_items
-- so it inherits the same CRUD, ordering, and RLS. `highlight` flags the row;
-- `icon` holds a leading emoji. Run after 0002_itinerary.sql.

alter table itinerary_items
  add column if not exists highlight boolean not null default false,
  add column if not exists icon text check (icon is null or char_length(icon) <= 16);
