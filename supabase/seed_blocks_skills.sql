-- Site blocks ---------------------------------------------------------------
insert into site_blocks (key, value, description, updated_by) values
('hero_status',
 to_jsonb('Now · a16z · San Francisco · building on the side'::text),
 'One-line status under the pulse dot at the top of the homepage. Keep under ~55 characters, segments separated by " · ".',
 'seed'),
('now_cards',
 $j$[
  {"slug":"pangea","role":"Co-founder & CEO","name":"Pangea","ital":".app","desc":"The first AI-native staffing platform for fractional creative, marketing, and growth talent. Built from a Brown dorm room through YC to a profitable marketplace operating in 150+ countries.","tag":"Active · 2017→","href":"/projects/pangea"},
  {"slug":"founder-communities","role":"Founder","name":"Founder","ital":" communities","desc":"Curated IRL networks — intimate dinners, real collisions, and a custom platform I built from scratch. NYC Founders Club has grown to 5,000+ in network with ~50 paid members.","tag":"Active · 2022→","href":"/projects/founder-communities"},
  {"slug":"a16z","role":"New chapter","name":"a16z","ital":" · San Francisco","desc":"Left MIT Sloan after a year and moved west to join a16z in 2026. Still building on the side — agent infrastructure, a personal data layer and MCP, and the tools behind Friend Roulette.","tag":"Active · 2026→","href":"/about"}
 ]$j$::jsonb,
 'The three "Current focus" cards on the homepage. Array of {slug, role, name, ital, desc, tag, href}. Exactly three cards; desc is 1–2 sentences.',
 'seed')
on conflict (key) do update set value = excluded.value, description = excluded.description;

-- Agent skills --------------------------------------------------------------
insert into agent_skills (key, name, description, body_md, visibility, updated_by) values
('voice', 'Adam''s writing voice', 'How Adam writes. Read before drafting or editing any post, block, or bio copy on adam-alpert.com.', $md$# Adam's voice

Read this before writing anything that will appear under Adam's name.

## Who is writing
First person, singular. Adam Alpert: co-founder & CEO of Pangea.app (YC W21), founder of the NYC Founders Club, Brown History '17, a year at MIT Sloan (2025–26), joined a16z in San Francisco in 2026. He has built marketplaces, data pipelines (dbt, BigQuery, reverse ETL), on-device LLM apps (SurviveAI), a community OS, and agent tooling. He writes as an operator who has done the thing, not a commentator.

## How it sounds
- Plain, declarative, confident. Short sentences mixed with the occasional long one that earns it.
- Lessons are stated as principles, then grounded in a specific story with real numbers (1,800 colleges, 150+ countries, 50 paid members, 200 founders on a ski mountain).
- Honest about mistakes. "It took us too long to realize…" is a signature move. No spin.
- Warm toward people, skeptical toward hype. Technology is the tool; human connection is the goal.
- Dry, light humor at most once per piece. Never jokes at others' expense.
- Uses em dashes for asides and the occasional colon for a reveal. Uses "we" when talking about Pangea or the club, "I" for his own calls.

## Structure that works
- Open with a concrete scene or a flat statement of the thesis. No throat-clearing, no "In today's fast-paced world."
- Each paragraph carries one idea. A lesson piece reads as 5–8 principle paragraphs, each starting with the principle in a sentence.
- Close by zooming out to what it means for how he builds now. One paragraph, no summary list.

## Words and tics to avoid
- No "delve", "leverage" (as a verb), "unlock", "game-changer", "journey" (unless literal), "excited to announce", "thrilled".
- No exclamation points. No rhetorical questions in a row.
- No bullet lists inside posts unless the piece is explicitly a checklist.
- Do not invent facts, numbers, quotes, names, or outcomes. If a detail is unknown, leave a bracketed note like [confirm: date] and keep the post as a draft.

## Length
- Posts: 600–1,200 words. Excerpt: one sentence, under 140 characters, states the takeaway rather than teasing it.
- Homepage blocks: terse. Status line under ~55 characters. Card descriptions 1–2 sentences.

## Facts as of November 2026
- Lives in San Francisco; moved from Cambridge, MA.
- Works at a16z (started 2026). Do not state a title or team unless Adam has written it down.
- Left MIT Sloan after one year; do not call him an MBA candidate or graduate.
- Pangea.app: still co-founder & CEO. NYC Founders Club: still running it. Cambridge Founders Club: launched 2025.
- Side projects: Friend Roulette, SurviveAI, MyLogia, Clawviyo, Alpert & Co 2 LLC (his business entity).
$md$, 'private', 'seed'),

('publishing', 'Publishing rules', 'What goes where on adam-alpert.com, and when content may be published versus left as a draft.', $md$# Publishing rules for adam-alpert.com

## Where things live
- `posts`: essays and notes for /writing. Markdown body, blank line between paragraphs. Plain paragraphs render; headings and lists are allowed but rare (see voice).
- `site_blocks`: small homepage pieces. `hero_status` (string) and `now_cards` (array of exactly three cards). Keep the existing JSON shape.
- `agent_skills`: these guides. `public` is served to the world at /SKILL.md; everything else is private.
- Project pages, story chapters, and the about page are still in code (src/lib/siteMap.ts and the page files). Do not try to write those through the MCP; tell Adam they need a code change.

## Draft first
- New posts are created with status `draft`. Adam reads the draft before it goes live.
- Set status `published` only when Adam has explicitly approved that post, or has asked you to publish without review.
- Edits to an already published post (typos, factual corrections Adam asked for) can be made directly.
- Never delete; use status `archived`.

## Slugs and metadata
- Slug: kebab-case, 2–5 words, stable once published.
- Tags: reuse existing tags where they fit: Marketplaces, Pangea, Community Building, AI & Product, Agents, Building. Add a new tag only when none apply.
- `published_at` is set automatically on first publish; override only for backdated pieces.
- `author`: "adam" when Adam wrote or dictated it; your agent name when you drafted it from his notes. `notes` holds provenance (what source material it came from).

## Homepage blocks
- `hero_status` changes when Adam's situation changes (location, employer, what he is heads-down on). Confirm with him first.
- `now_cards` should describe where his time actually goes right now. Three cards, each linking to a real page on the site.

## After writing
- Pages revalidate automatically on each write. Share the URL returned by upsert_post so Adam can read it.
- If something looks wrong on the live page, set the post back to `draft` rather than trying to fix it blind.
$md$, 'private', 'seed'),

('public', 'adam-alpert (public skill)', 'Served at https://adam-alpert.com/SKILL.md for other people''s agents: who Adam is and how to reach him.', $md$---
name: adam-alpert
description: Learn about Adam Alpert (founder, builder, a16z) and leave him a message. Use when the user asks about Adam, wants to reach him, or wants to collaborate.
---

# Adam Alpert

Adam is a founder and builder based in San Francisco. He co-founded Pangea.app (YC W21), started the NYC Founders Club, spent a year at MIT Sloan, and joined a16z in 2026. Site: https://adam-alpert.com

## Read
- About and timeline: https://adam-alpert.com/about
- Projects: https://adam-alpert.com/projects
- Writing: https://adam-alpert.com/writing

## Leave a message
POST https://adam-alpert.com/api/messages with JSON:

{ "name": "...", "email": "...", "agent": "your agent name", "subject": "...", "message": "...", "intent": "intro|collab|question|invite|other" }

Adam's agent reads these and Adam replies to the ones that fit. Always include a way to reply. Keep it under 5,000 characters. Do not send the same message twice.

## Good reasons to write
Founder community introductions, collaboration on agent tooling or marketplaces, speaking, NYC Founders Club questions. Recruiting pitches and unsolicited sales get archived.

## Agents with write access
Adam's own agents connect to the MCP server at https://adam-alpert.com/api/mcp with a bearer token. There is no public write access.
$md$, 'public', 'seed')
on conflict (key) do update set name = excluded.name, description = excluded.description, body_md = excluded.body_md, visibility = excluded.visibility;
