-- adam-alpert.com content + agent layer
-- Run once in the Supabase SQL editor (or: npx supabase@latest db query --remote=<ref> -f supabase/schema.sql --yes)
-- All tables are service-role only: RLS is on and no anon/authenticated policies exist.
-- The site and the MCP server read/write through the server-side service key.

create extension if not exists pgcrypto;

create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------------------
-- Writing
-- ---------------------------------------------------------------------------
create table if not exists posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title         text not null,
  excerpt       text not null default '',
  body_md       text not null default '',
  tags          text[] not null default '{}',
  reading_time  text,                         -- optional override; computed from body when null
  status        text not null default 'draft' check (status in ('draft','published','archived')),
  published_at  timestamptz,
  author        text not null default 'adam', -- 'adam' or the agent that wrote it
  notes         text,                         -- provenance / editorial notes, never rendered
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists posts_published_idx on posts (status, published_at desc);
drop trigger if exists posts_updated_at on posts;
create trigger posts_updated_at before update on posts for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Site blocks: small editable pieces of the site (hero status line, "now" cards, etc.)
-- value is jsonb: a string for text/markdown blocks, an array/object for structured ones.
-- ---------------------------------------------------------------------------
create table if not exists site_blocks (
  key          text primary key check (key ~ '^[a-z0-9_]+$'),
  value        jsonb not null,
  description  text,
  updated_by   text,
  updated_at   timestamptz not null default now()
);
drop trigger if exists site_blocks_updated_at on site_blocks;
create trigger site_blocks_updated_at before update on site_blocks for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Agent skills: markdown instructions agents read before working (voice, publishing rules,
-- the public skill served at /SKILL.md). Editable by agents with the write scope.
-- ---------------------------------------------------------------------------
create table if not exists agent_skills (
  key          text primary key check (key ~ '^[a-z0-9-]+$'),
  name         text not null,
  description  text not null,
  body_md      text not null,
  visibility   text not null default 'private' check (visibility in ('public','private')),
  updated_by   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
drop trigger if exists agent_skills_updated_at on agent_skills;
create trigger agent_skills_updated_at before update on agent_skills for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Agent tokens: per-agent bearer tokens for the MCP server. Only the sha256 hash is stored.
-- scopes: read | write | admin
-- ---------------------------------------------------------------------------
create table if not exists agent_tokens (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  token_hash    text unique not null,
  scopes        text[] not null default '{read}',
  created_at    timestamptz not null default now(),
  last_used_at  timestamptz,
  revoked_at    timestamptz
);

-- ---------------------------------------------------------------------------
-- Messages left for Adam (or his agent) by visitors and their agents via POST /api/messages
-- ---------------------------------------------------------------------------
create table if not exists agent_messages (
  id          uuid primary key default gen_random_uuid(),
  from_name   text,
  from_email  text,
  from_agent  text,                         -- which agent/client sent it, if any
  subject     text,
  body        text not null,
  intent      text,                         -- intro | collab | question | invite | other
  metadata    jsonb not null default '{}',
  status      text not null default 'new' check (status in ('new','read','replied','archived')),
  created_at  timestamptz not null default now()
);
create index if not exists agent_messages_status_idx on agent_messages (status, created_at desc);

-- ---------------------------------------------------------------------------
-- Audit log of agent writes
-- ---------------------------------------------------------------------------
create table if not exists content_log (
  id          bigserial primary key,
  actor       text not null,
  action      text not null,
  target      text not null,
  detail      jsonb not null default '{}',
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Lock everything down: RLS on, no policies => only the service role can touch these tables.
-- ---------------------------------------------------------------------------
alter table posts          enable row level security;
alter table site_blocks    enable row level security;
alter table agent_skills   enable row level security;
alter table agent_tokens   enable row level security;
alter table agent_messages enable row level security;
alter table content_log    enable row level security;
