-- The "crm" agent skill: how agents should use Adam's personal CRM through the MCP.
insert into agent_skills (key, name, description, body_md, visibility, updated_by) values (
  'crm',
  'Personal CRM',
  'How to maintain Adam''s relationships through the MCP: people, interactions, follow-ups, and the touch queue.',
  $md$
# Adam's personal CRM

This is Adam's own relationship store. It is private, it lives in his database, and it exists so he can
talk to you ("had coffee with Priya, she's raising a seed, intro her to Dan next week") and have the
record kept without touching a UI. Treat it like a trusted assistant's notebook: accurate, terse,
never embellished.

## Objects

- **people** – one row per human. Key fields: full_name, company, title, location, how_met, tags,
  circle, cadence_days, last_contact_at, notes.
- **interactions** – one row per touchpoint, linked to one or more people. kind: meeting | call |
  message | email | intro | event | note | other. `note` is a note *about* someone and does not count
  as contact.
- **follow_ups** – things Adam promised or wants to do for a person, with a due date.

## Circles and cadence

circle describes closeness; cadence_days is how often Adam wants to be in touch. New people get a
default cadence from their circle unless you pass one:

| circle | default cadence | meaning |
|---|---|---|
| inner | 14 days | family, closest friends, co-founders |
| close | 30 days | good friends, key collaborators, mentors |
| active | 90 days | people Adam is currently working or trading notes with |
| acquaintance | 180 days | met once or twice, worth keeping warm |
| dormant | none | no cadence; keep the record, no nudges |

overdue_ratio = days since last contact ÷ cadence. ≥ 1 means due. `touch_queue` sorts by it;
`roll` draws at random weighted by its square (the Friend Roulette rule).

## Rules

1. **Search before you create.** Call find_people with a partial name first. upsert_person already
   matches by email and exact name, but check for nicknames and spelling variants yourself.
2. **Log every touchpoint Adam mentions.** "Grabbed dinner with X and Y" → one log_interaction with
   both people, kind=meeting. Mentions in passing ("X texted me") → kind=message. Use occurred_at
   from context ("last night", "Tuesday") converted to an ISO date; default is now.
3. **Summaries are one factual line.** What they are working on, what they asked for, what Adam
   offered. Put detail in body. Never invent facts Adam did not say.
4. **Promises become follow_ups.** If Adam says he will send, intro, or follow up, create a
   follow_up with a realistic due date (default a week). Mark them done when he says it happened.
5. **Enrich records as you learn.** Company, title, location, how_met, tags (e.g. "founder",
   "investor", "nyc", "sf", "skiing", "a16z", "yc", "nyfc"). Use append_note for dated
   observations; do not overwrite notes.
6. **Only store what Adam shares.** Do not infer or record sensitive attributes (health, finances,
   politics, relationships) unless Adam states them and wants them kept.
7. **Inbound site messages** (list_messages) from people worth tracking: link_message_to_person,
   then set_message_status.
8. **When Adam asks "who should I reach out to"**: touch_queue (or roll for one name), then suggest
   a concrete opener from the last interaction summary.

## Circle changes

Promote or demote circles only when Adam says so or the pattern is obvious (several meetings in a
month → active; a year of silence → dormant). Say what you changed.
$md$,
  'private',
  'seed'
)
on conflict (key) do update set
  name = excluded.name,
  description = excluded.description,
  body_md = excluded.body_md,
  visibility = excluded.visibility,
  updated_by = excluded.updated_by;
