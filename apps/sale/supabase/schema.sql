-- Moving sale schema. Run once in the Supabase SQL editor.
-- The app talks to the DB only from the server with the service-role key,
-- so RLS is enabled with NO anon policies: nothing is readable from the browser directly.

create extension if not exists pgcrypto;

create table if not exists items (
  id            integer primary key,
  category      text not null,
  name          text not null,
  description   text not null default '',
  dimensions    text not null default '',
  qty           integer not null default 1,
  asking_price  numeric,
  status        text not null default 'Available'
                check (status in ('Available','Pending','Sold','Tentative','Hidden')),
  sold_price    numeric,
  sold_to       text,
  notes         text not null default '',
  sort_order    integer not null default 0,
  image_url     text,
  updated_at    timestamptz not null default now()
);

create table if not exists offers (
  id            uuid primary key default gen_random_uuid(),
  item_id       integer not null references items(id) on delete cascade,
  buyer_name    text not null,
  buyer_contact text not null,
  amount        numeric not null check (amount >= 0),
  note          text not null default '',
  status        text not null default 'open'
                check (status in ('open','accepted','declined','withdrawn')),
  submission_id uuid not null,                -- groups the offers from one form submission
  created_at    timestamptz not null default now(),
  decided_at    timestamptz
);
create index if not exists offers_item_idx on offers(item_id, status);
create index if not exists offers_created_idx on offers(created_at desc);

alter table items  enable row level security;
alter table offers enable row level security;

-- Public read model: best open/accepted offer per item, without buyer identity.
create or replace view item_best_offer as
select i.id as item_id,
       max(o.amount) filter (where o.status in ('open','accepted')) as best_offer,
       count(o.id)   filter (where o.status = 'open')              as open_offers
from items i left join offers o on o.item_id = i.id
group by i.id;

create or replace function touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists items_touch on items;
create trigger items_touch before update on items for each row execute function touch_updated_at();
