-- Personal CRM / PRM: people, interactions, follow-ups.
-- Apply after schema.sql: npx supabase@latest db query --remote=eitadkuaqhxrpgpjyyou -f supabase/crm.sql --yes
-- Service-role only (RLS on, no policies). Written to by agents through the MCP at /api/mcp.
--
-- Model (borrowed from Friend Roulette): every person can carry a cadence in days. The MCP computes
-- overdue = days since last_contact_at / cadence_days, and "roll" draws weighted by overdue².

-- array_to_string is only STABLE; generated columns need IMMUTABLE expressions.
create or replace function arr_text(text[]) returns text
language sql immutable as $$ select array_to_string($1, ' ') $$;

-- ---------------------------------------------------------------------------
-- People
-- ---------------------------------------------------------------------------
create table if not exists people (
  id               uuid primary key default gen_random_uuid(),
  full_name        text not null,
  nickname         text,
  emails           text[] not null default '{}',
  phones           text[] not null default '{}',
  linkedin         text,
  x_handle         text,
  website          text,
  company          text,
  title            text,
  location         text,
  how_met          text,
  tags             text[] not null default '{}',
  circle           text not null default 'active'
                   check (circle in ('inner','close','active','acquaintance','dormant')),
  cadence_days     int check (cadence_days is null or cadence_days > 0),
  last_contact_at  timestamptz,
  notes            text,                       -- running markdown notes, appended by agents
  metadata         jsonb not null default '{}',
  status           text not null default 'active' check (status in ('active','archived')),
  source           text,                       -- who created the record (owner, muse, contact-form, …)
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  search           tsvector generated always as (
                     to_tsvector('simple',
                       coalesce(full_name,'') || ' ' || coalesce(nickname,'') || ' ' ||
                       coalesce(company,'')   || ' ' || coalesce(title,'')    || ' ' ||
                       coalesce(location,'')  || ' ' || coalesce(how_met,'')  || ' ' ||
                       arr_text(tags) || ' ' || coalesce(notes,'')
                     )
                   ) stored
);
create index if not exists people_search_idx    on people using gin (search);
create index if not exists people_emails_idx    on people using gin (emails);
create index if not exists people_tags_idx      on people using gin (tags);
create index if not exists people_name_idx      on people (lower(full_name));
create index if not exists people_queue_idx     on people (status, circle, last_contact_at);
drop trigger if exists people_updated_at on people;
create trigger people_updated_at before update on people for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Interactions: one row per touchpoint, linked to one or more people
-- ---------------------------------------------------------------------------
create table if not exists interactions (
  id           uuid primary key default gen_random_uuid(),
  kind         text not null default 'other'
               check (kind in ('meeting','call','message','email','intro','event','note','other')),
  occurred_at  timestamptz not null default now(),
  summary      text not null,                   -- one line: what happened / what matters
  body         text,                            -- longer notes, markdown
  location     text,
  source       text,                            -- actor that logged it
  metadata     jsonb not null default '{}',
  created_at   timestamptz not null default now()
);
create index if not exists interactions_occurred_idx on interactions (occurred_at desc);

create table if not exists interaction_people (
  interaction_id uuid not null references interactions(id) on delete cascade,
  person_id      uuid not null references people(id) on delete cascade,
  primary key (interaction_id, person_id)
);
create index if not exists interaction_people_person_idx on interaction_people (person_id);

-- Keep people.last_contact_at in sync. 'note' is a note about someone, not contact with them.
create or replace function bump_last_contact() returns trigger
language plpgsql as $$
declare
  i interactions%rowtype;
begin
  select * into i from interactions where id = new.interaction_id;
  if i.kind <> 'note' then
    update people
       set last_contact_at = greatest(coalesce(last_contact_at, i.occurred_at), i.occurred_at)
     where id = new.person_id;
  end if;
  return new;
end $$;
drop trigger if exists interaction_people_bump on interaction_people;
create trigger interaction_people_bump after insert on interaction_people
  for each row execute function bump_last_contact();

-- An interaction with nobody left on it (its people were deleted) is noise: remove it.
create or replace function drop_orphan_interaction() returns trigger
language plpgsql as $$
begin
  if not exists (select 1 from interaction_people where interaction_id = old.interaction_id) then
    delete from interactions where id = old.interaction_id;
  end if;
  return old;
end $$;
drop trigger if exists interaction_people_orphan on interaction_people;
create trigger interaction_people_orphan after delete on interaction_people
  for each row execute function drop_orphan_interaction();

-- ---------------------------------------------------------------------------
-- Follow-ups: things Adam promised or wants to do for a person
-- ---------------------------------------------------------------------------
create table if not exists follow_ups (
  id          uuid primary key default gen_random_uuid(),
  person_id   uuid not null references people(id) on delete cascade,
  note        text not null,
  due_at      timestamptz not null,
  status      text not null default 'open' check (status in ('open','done','skipped')),
  created_by  text,
  created_at  timestamptz not null default now(),
  done_at     timestamptz
);
create index if not exists follow_ups_open_idx on follow_ups (status, due_at);

-- Inbound site messages can be attached to a person
alter table agent_messages add column if not exists person_id uuid references people(id) on delete set null;

alter table people             enable row level security;
alter table interactions       enable row level security;
alter table interaction_people enable row level security;
alter table follow_ups         enable row level security;
