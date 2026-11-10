/**
 * Personal CRM tools for the MCP server: people, interactions, follow-ups.
 * Model borrowed from Friend Roulette: each person may carry a cadence (days); overdue ratio =
 * days since last contact / cadence; `roll` draws weighted by overdue².
 */
import type { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { db } from "@/lib/db";
import { type Ctx, actor, fail, log, need, parseWhen, text } from "@/lib/mcpTools";

type Server = Parameters<Parameters<typeof createMcpHandler>[0]>[0];

const CIRCLES = ["inner", "close", "active", "acquaintance", "dormant"] as const;
const KINDS = ["meeting", "call", "message", "email", "intro", "event", "note", "other"] as const;
const DEFAULT_CADENCE: Record<(typeof CIRCLES)[number], number | null> = {
  inner: 14,
  close: 30,
  active: 90,
  acquaintance: 180,
  dormant: null,
};

const PERSON_COLS =
  "id,full_name,nickname,emails,phones,linkedin,x_handle,website,company,title,location,how_met,tags,circle,cadence_days,last_contact_at,notes,metadata,status,source,created_at,updated_at";
const PERSON_BRIEF = "id,full_name,nickname,company,title,location,circle,tags,cadence_days,last_contact_at,emails,status";

interface Person {
  id: string;
  full_name: string;
  nickname: string | null;
  emails: string[];
  phones: string[];
  tags: string[];
  company: string | null;
  circle: (typeof CIRCLES)[number];
  cadence_days: number | null;
  last_contact_at: string | null;
  notes: string | null;
  status: "active" | "archived";
  [k: string]: unknown;
}

const RefSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
});
type Ref = z.infer<typeof RefSchema>;

function cleanEmails(list?: string[]) {
  return (list ?? []).map((e) => e.trim().toLowerCase()).filter(Boolean);
}
function union(a: string[] | null | undefined, b: string[] | undefined) {
  return Array.from(new Set([...(a ?? []), ...(b ?? [])]));
}
function daysSince(iso: string | null): number | null {
  return iso ? Math.round(((Date.now() - new Date(iso).getTime()) / 864e5) * 10) / 10 : null;
}
function overdue(p: Pick<Person, "cadence_days" | "last_contact_at">) {
  const days = daysSince(p.last_contact_at);
  const ratio = !p.cadence_days ? null : days === null ? 99 : Math.min(99, days / p.cadence_days);
  return { days_since_contact: days, overdue_ratio: ratio === null ? null : Math.round(ratio * 100) / 100 };
}
function brief(p: Person) {
  return { ...p, ...overdue(p) };
}
function safeLike(q: string) {
  return q.replace(/[,()%]/g, " ").trim();
}

/**
 * Resolve a reference to exactly one person. Order: id → email → exact name (case-insensitive,
 * active people first). Creates the person when `createMissing` and only a name was given.
 */
async function resolvePerson(
  ref: Ref,
  opts: { createMissing?: boolean; source?: string } = {}
): Promise<{ person?: Person; created?: boolean; error?: string }> {
  if (ref.id) {
    const { data, error } = await db().from("people").select(PERSON_COLS).eq("id", ref.id).maybeSingle();
    if (error) return { error: error.message };
    if (!data) return { error: `No person with id ${ref.id}.` };
    return { person: data as Person };
  }
  if (ref.email) {
    const { data, error } = await db()
      .from("people")
      .select(PERSON_COLS)
      .contains("emails", [ref.email.toLowerCase()])
      .order("status")
      .limit(2);
    if (error) return { error: error.message };
    if (data?.length) return { person: data[0] as Person };
  }
  if (ref.name) {
    const name = ref.name.trim();
    const { data, error } = await db()
      .from("people")
      .select(PERSON_COLS)
      .or(`full_name.ilike.${safeLike(name)},nickname.ilike.${safeLike(name)}`)
      .order("status")
      .limit(5);
    if (error) return { error: error.message };
    const active = (data ?? []).filter((p) => p.status === "active");
    const pool = active.length ? active : (data ?? []);
    if (pool.length === 1) return { person: pool[0] as Person };
    if (pool.length > 1) {
      return {
        error: `"${name}" matches ${pool.length} people; pass an id instead: ${pool
          .map((p) => `${p.full_name} (${p.company ?? "—"}, ${p.id})`)
          .join("; ")}`,
      };
    }
    if (opts.createMissing) {
      const { data: created, error: cErr } = await db()
        .from("people")
        .insert({ full_name: name, emails: ref.email ? [ref.email.toLowerCase()] : [], source: opts.source ?? null })
        .select(PERSON_COLS)
        .single();
      if (cErr) return { error: cErr.message };
      return { person: created as Person, created: true };
    }
    return { error: `No person named "${name}". Use find_people to search, or upsert_person to create them.` };
  }
  return { error: "Pass an id, name, or email." };
}

export function registerCrmTools(server: Server) {
  // ------------------------------------------------------------------ people
  server.registerTool(
    "find_people",
    {
      title: "Find people",
      description:
        "Search Adam's CRM. `query` matches names, nicknames, company, title, location, how_met, tags and notes (partial names work). Filter by tags, circle, company. Returns brief records with days_since_contact and overdue_ratio (days since contact ÷ cadence; >1 means overdue).",
      inputSchema: z.object({
        query: z.string().optional(),
        tags: z.array(z.string()).optional(),
        circle: z.enum(CIRCLES).optional(),
        company: z.string().optional(),
        status: z.enum(["active", "archived", "all"]).default("active"),
        limit: z.number().int().min(1).max(100).default(25),
      }),
    },
    async ({ query, tags, circle, company, status, limit }, ctx) => {
      const err = need(ctx as Ctx, "read");
      if (err) return fail(err);
      const base = () => {
        let q = db().from("people").select(PERSON_BRIEF).limit(limit);
        if (status !== "all") q = q.eq("status", status);
        if (circle) q = q.eq("circle", circle);
        if (company) q = q.ilike("company", `%${safeLike(company)}%`);
        if (tags?.length) q = q.overlaps("tags", tags);
        return q;
      };
      const seen = new Map<string, Person>();
      if (query?.trim()) {
        const q = safeLike(query);
        const [a, b] = await Promise.all([
          base().or(`full_name.ilike.%${q}%,nickname.ilike.%${q}%,company.ilike.%${q}%`).order("full_name"),
          base().textSearch("search", q, { type: "websearch", config: "simple" }),
        ]);
        if (a.error) return fail(a.error.message);
        if (b.error) return fail(b.error.message);
        for (const p of [...(a.data ?? []), ...(b.data ?? [])] as unknown as Person[]) seen.set(p.id, p);
      } else {
        const { data, error } = await base().order("last_contact_at", { ascending: false, nullsFirst: false });
        if (error) return fail(error.message);
        for (const p of (data ?? []) as unknown as Person[]) seen.set(p.id, p);
      }
      return text(Array.from(seen.values()).slice(0, limit).map(brief));
    }
  );

  server.registerTool(
    "get_person",
    {
      title: "Get person",
      description: "Full record for one person (by id, exact name, or email) with their recent interactions and open follow-ups.",
      inputSchema: RefSchema,
    },
    async (ref, ctx) => {
      const err = need(ctx as Ctx, "read");
      if (err) return fail(err);
      const r = await resolvePerson(ref);
      if (!r.person) return fail(r.error ?? "Not found.");
      const p = r.person;
      const { data: links } = await db().from("interaction_people").select("interaction_id").eq("person_id", p.id);
      const ids = (links ?? []).map((l) => l.interaction_id);
      const [inter, fus] = await Promise.all([
        ids.length
          ? db().from("interactions").select("*").in("id", ids).order("occurred_at", { ascending: false }).limit(15)
          : Promise.resolve({ data: [] as unknown[] }),
        db().from("follow_ups").select("*").eq("person_id", p.id).eq("status", "open").order("due_at"),
      ]);
      return text({ ...brief(p), interactions: inter.data ?? [], open_follow_ups: fus.data ?? [] });
    }
  );

  server.registerTool(
    "upsert_person",
    {
      title: "Create or update person",
      description:
        "Create a person or update one. Matches by id, else by any email, else by exact full_name among active people (so re-adding someone updates them instead of duplicating). Arrays (emails, phones, tags) are merged; scalars are replaced only when passed; append_note adds a dated line to notes. New people get a default cadence from their circle (inner 14d, close 30d, active 90d, acquaintance 180d, dormant none). Set allow_duplicate=true to force a new record when a same-name person exists.",
      inputSchema: z.object({
        id: z.string().uuid().optional(),
        full_name: z.string().min(1).optional(),
        nickname: z.string().optional(),
        emails: z.array(z.string().email()).optional(),
        phones: z.array(z.string()).optional(),
        linkedin: z.string().optional(),
        x_handle: z.string().optional(),
        website: z.string().optional(),
        company: z.string().optional(),
        title: z.string().optional(),
        location: z.string().optional(),
        how_met: z.string().optional(),
        tags: z.array(z.string()).optional(),
        circle: z.enum(CIRCLES).optional(),
        cadence_days: z.number().int().positive().nullable().optional(),
        notes: z.string().optional(),
        append_note: z.string().optional(),
        metadata: z.record(z.string(), z.unknown()).optional(),
        status: z.enum(["active", "archived"]).optional(),
        allow_duplicate: z.boolean().default(false),
      }),
    },
    async (input, ctx) => {
      const err = need(ctx as Ctx, "write");
      if (err) return fail(err);
      const { id, allow_duplicate, append_note, ...fields } = input;
      const emails = cleanEmails(fields.emails);
      let existing: Person | undefined;
      let matchedByName = false;
      if (id) {
        const r = await resolvePerson({ id });
        if (!r.person) return fail(r.error ?? "Not found.");
        existing = r.person;
      } else if (!allow_duplicate) {
        if (emails.length) {
          const { data } = await db().from("people").select(PERSON_COLS).overlaps("emails", emails).limit(2);
          if (data && data.length > 1) return fail(`Those emails belong to ${data.length} people; pass an id.`);
          if (data?.length) existing = data[0] as Person;
        }
        if (!existing && fields.full_name) {
          const r = await resolvePerson({ name: fields.full_name });
          if (r.error && r.error.includes("matches")) return fail(r.error);
          existing = r.person;
          matchedByName = !!existing;
        }
      }
      const patch: Record<string, unknown> = { ...fields };
      // Matched by name: a case-only difference is a match, not a rename (renames go through id).
      if (matchedByName && fields.full_name && fields.full_name !== existing!.full_name) {
        delete patch.full_name;
      }
      if (fields.emails) patch.emails = union(existing?.emails, emails);
      if (fields.phones) patch.phones = union(existing?.phones, fields.phones);
      if (fields.tags) patch.tags = union(existing?.tags, fields.tags);
      if (append_note) {
        const stamp = new Date().toISOString().slice(0, 10);
        const prev = (fields.notes ?? existing?.notes ?? "").trimEnd();
        patch.notes = `${prev ? prev + "\n\n" : ""}- ${stamp}: ${append_note.trim()}`;
      }
      if (existing) {
        if (!Object.keys(patch).length) return text({ ok: true, created: false, person: brief(existing) });
        const { data, error } = await db().from("people").update(patch).eq("id", existing.id).select(PERSON_COLS).single();
        if (error) return fail(error.message);
        await log(ctx as Ctx, "update_person", existing.id, { fields: Object.keys(input) });
        return text({ ok: true, created: false, person: brief(data as Person) });
      }
      if (!fields.full_name) return fail("full_name is required to create a person.");
      if (patch.cadence_days === undefined) patch.cadence_days = DEFAULT_CADENCE[fields.circle ?? "active"];
      patch.source = actor(ctx as Ctx);
      const { data, error } = await db().from("people").insert(patch).select(PERSON_COLS).single();
      if (error) return fail(error.message);
      await log(ctx as Ctx, "create_person", data.id, { full_name: fields.full_name });
      return text({ ok: true, created: true, person: brief(data as Person) });
    }
  );

  server.registerTool(
    "delete_person",
    {
      title: "Delete person",
      description: "Permanently delete a person and their interactions/follow-ups. Prefer upsert_person with status=archived. Requires admin scope.",
      inputSchema: z.object({ id: z.string().uuid() }),
    },
    async ({ id }, ctx) => {
      const err = need(ctx as Ctx, "admin");
      if (err) return fail(err);
      const { error, count } = await db().from("people").delete({ count: "exact" }).eq("id", id);
      if (error) return fail(error.message);
      await log(ctx as Ctx, "delete_person", id);
      return text({ ok: true, deleted: count ?? 0 });
    }
  );

  // ------------------------------------------------------------ interactions
  server.registerTool(
    "log_interaction",
    {
      title: "Log interaction",
      description:
        "Record a touchpoint with one or more people (a group dinner is one interaction with many people). Each person may be given by id, name, or email; unknown names are created unless create_missing=false. Updates last_contact_at for everyone involved (kind='note' does not count as contact). Optional follow_up creates a reminder attached to the first person. occurred_at accepts ISO dates like 2026-11-08 or 2026-11-08T19:00:00-08:00 and defaults to now.",
      inputSchema: z.object({
        people: z.array(RefSchema).min(1),
        kind: z.enum(KINDS).default("other"),
        occurred_at: z.string().optional(),
        summary: z.string().min(1),
        body: z.string().optional(),
        location: z.string().optional(),
        metadata: z.record(z.string(), z.unknown()).optional(),
        create_missing: z.boolean().default(true),
        follow_up: z
          .object({ note: z.string().min(1), due_at: z.string().optional(), due_in_days: z.number().int().positive().optional() })
          .optional(),
      }),
    },
    async (input, ctx) => {
      const err = need(ctx as Ctx, "write");
      if (err) return fail(err);
      const when = parseWhen(input.occurred_at);
      if (!when) return fail(`Could not parse occurred_at "${input.occurred_at}".`);
      const resolved = await Promise.all(
        input.people.map((r) => resolvePerson(r, { createMissing: input.create_missing, source: actor(ctx as Ctx) }))
      );
      const errors = resolved.filter((r) => !r.person).map((r) => r.error);
      if (errors.length) return fail(`Could not resolve everyone, nothing was logged:\n- ${errors.join("\n- ")}`);
      const people = resolved.map((r) => r.person!);
      const { data: inter, error } = await db()
        .from("interactions")
        .insert({
          kind: input.kind,
          occurred_at: when.toISOString(),
          summary: input.summary,
          body: input.body ?? null,
          location: input.location ?? null,
          metadata: input.metadata ?? {},
          source: actor(ctx as Ctx),
        })
        .select("*")
        .single();
      if (error) return fail(error.message);
      const { error: linkErr } = await db()
        .from("interaction_people")
        .insert(people.map((p) => ({ interaction_id: inter.id, person_id: p.id })));
      if (linkErr) return fail(linkErr.message);
      let follow_up: unknown = null;
      if (input.follow_up) {
        const due = input.follow_up.due_at
          ? parseWhen(input.follow_up.due_at)
          : new Date(Date.now() + (input.follow_up.due_in_days ?? 7) * 864e5);
        if (!due) return fail(`Interaction logged, but follow_up.due_at "${input.follow_up.due_at}" could not be parsed.`);
        const { data: fu } = await db()
          .from("follow_ups")
          .insert({ person_id: people[0].id, note: input.follow_up.note, due_at: due.toISOString(), created_by: actor(ctx as Ctx) })
          .select("*")
          .single();
        follow_up = fu;
      }
      await log(ctx as Ctx, "log_interaction", inter.id, { kind: input.kind, people: people.map((p) => p.id) });
      return text({
        ok: true,
        interaction: inter,
        people: resolved.map((r) => ({ id: r.person!.id, full_name: r.person!.full_name, created: !!r.created })),
        follow_up,
      });
    }
  );

  server.registerTool(
    "list_interactions",
    {
      title: "List interactions",
      description: "Recent interactions, newest first, with the people involved. Optionally filter to one person, a kind, or since a date.",
      inputSchema: z.object({
        person: RefSchema.optional(),
        kind: z.enum(KINDS).optional(),
        since: z.string().optional(),
        limit: z.number().int().min(1).max(200).default(50),
      }),
    },
    async ({ person, kind, since, limit }, ctx) => {
      const err = need(ctx as Ctx, "read");
      if (err) return fail(err);
      let q = db().from("interactions").select("*").order("occurred_at", { ascending: false }).limit(limit);
      if (person) {
        const r = await resolvePerson(person);
        if (!r.person) return fail(r.error ?? "Not found.");
        const { data: links } = await db().from("interaction_people").select("interaction_id").eq("person_id", r.person.id);
        const ids = (links ?? []).map((l) => l.interaction_id);
        if (!ids.length) return text([]);
        q = q.in("id", ids);
      }
      if (kind) q = q.eq("kind", kind);
      if (since) {
        const d = parseWhen(since);
        if (!d) return fail(`Could not parse since "${since}".`);
        q = q.gte("occurred_at", d.toISOString());
      }
      const { data, error } = await q;
      if (error) return fail(error.message);
      const ids = (data ?? []).map((i) => i.id);
      const { data: links } = ids.length
        ? await db().from("interaction_people").select("interaction_id, people(id, full_name)").in("interaction_id", ids)
        : { data: [] };
      const byId = new Map<string, { id: string; full_name: string }[]>();
      for (const l of (links ?? []) as unknown as { interaction_id: string; people: { id: string; full_name: string } }[]) {
        byId.set(l.interaction_id, [...(byId.get(l.interaction_id) ?? []), l.people]);
      }
      return text((data ?? []).map((i) => ({ ...i, people: byId.get(i.id) ?? [] })));
    }
  );

  // -------------------------------------------------------------- follow-ups
  server.registerTool(
    "add_follow_up",
    {
      title: "Add follow-up",
      description: "Create a reminder for a person: something Adam promised or wants to do. Give due_at (ISO) or due_in_days (default 7).",
      inputSchema: z.object({
        person: RefSchema,
        note: z.string().min(1),
        due_at: z.string().optional(),
        due_in_days: z.number().int().positive().optional(),
      }),
    },
    async ({ person, note, due_at, due_in_days }, ctx) => {
      const err = need(ctx as Ctx, "write");
      if (err) return fail(err);
      const r = await resolvePerson(person);
      if (!r.person) return fail(r.error ?? "Not found.");
      const due = due_at ? parseWhen(due_at) : new Date(Date.now() + (due_in_days ?? 7) * 864e5);
      if (!due) return fail(`Could not parse due_at "${due_at}".`);
      const { data, error } = await db()
        .from("follow_ups")
        .insert({ person_id: r.person.id, note, due_at: due.toISOString(), created_by: actor(ctx as Ctx) })
        .select("*")
        .single();
      if (error) return fail(error.message);
      return text({ ok: true, follow_up: { ...data, person: r.person.full_name } });
    }
  );

  server.registerTool(
    "list_follow_ups",
    {
      title: "List follow-ups",
      description: "Follow-ups by status (default open), soonest due first. due_before narrows to those due by a date; person narrows to one person.",
      inputSchema: z.object({
        status: z.enum(["open", "done", "skipped", "all"]).default("open"),
        due_before: z.string().optional(),
        person: RefSchema.optional(),
        limit: z.number().int().min(1).max(200).default(50),
      }),
    },
    async ({ status, due_before, person, limit }, ctx) => {
      const err = need(ctx as Ctx, "read");
      if (err) return fail(err);
      let q = db().from("follow_ups").select("*, people(id, full_name, company)").order("due_at").limit(limit);
      if (status !== "all") q = q.eq("status", status);
      if (due_before) {
        const d = parseWhen(due_before);
        if (!d) return fail(`Could not parse due_before "${due_before}".`);
        q = q.lte("due_at", d.toISOString());
      }
      if (person) {
        const r = await resolvePerson(person);
        if (!r.person) return fail(r.error ?? "Not found.");
        q = q.eq("person_id", r.person.id);
      }
      const { data, error } = await q;
      if (error) return fail(error.message);
      return text(data);
    }
  );

  server.registerTool(
    "set_follow_up_status",
    {
      title: "Set follow-up status",
      description: "Mark a follow-up done, skipped, or reopen it.",
      inputSchema: z.object({ id: z.string().uuid(), status: z.enum(["open", "done", "skipped"]) }),
    },
    async ({ id, status }, ctx) => {
      const err = need(ctx as Ctx, "write");
      if (err) return fail(err);
      const { error } = await db()
        .from("follow_ups")
        .update({ status, done_at: status === "open" ? null : new Date().toISOString() })
        .eq("id", id);
      if (error) return fail(error.message);
      return text({ ok: true, id, status });
    }
  );

  // ------------------------------------------------------------------- queue
  async function queue(circle?: (typeof CIRCLES)[number]) {
    let q = db().from("people").select(PERSON_BRIEF).eq("status", "active").not("cadence_days", "is", null);
    if (circle) q = q.eq("circle", circle);
    const { data, error } = await q;
    if (error) return { error: error.message };
    const rows = ((data ?? []) as unknown as Person[]).map(brief).sort((a, b) => (b.overdue_ratio ?? 0) - (a.overdue_ratio ?? 0));
    return { rows };
  }

  server.registerTool(
    "touch_queue",
    {
      title: "Who to reach out to",
      description:
        "People most overdue for contact, by overdue_ratio (days since contact ÷ cadence). Ratio ≥ 1 is overdue; never-contacted people with a cadence sort first. Use this to suggest who Adam should message this week.",
      inputSchema: z.object({
        limit: z.number().int().min(1).max(100).default(10),
        circle: z.enum(CIRCLES).optional(),
        only_overdue: z.boolean().default(true),
      }),
    },
    async ({ limit, circle, only_overdue }, ctx) => {
      const err = need(ctx as Ctx, "read");
      if (err) return fail(err);
      const r = await queue(circle);
      if (r.error) return fail(r.error);
      const rows = only_overdue ? r.rows!.filter((p) => (p.overdue_ratio ?? 0) >= 1) : r.rows!;
      return text(rows.slice(0, limit));
    }
  );

  server.registerTool(
    "roll",
    {
      title: "Roll the dice",
      description:
        "Friend Roulette: draw one person at random, weighted by overdue_ratio² so the long-neglected float up but it is still a roll. Returns the person and why they came up.",
      inputSchema: z.object({ circle: z.enum(CIRCLES).optional() }),
    },
    async ({ circle }, ctx) => {
      const err = need(ctx as Ctx, "read");
      if (err) return fail(err);
      const r = await queue(circle);
      if (r.error) return fail(r.error);
      const pool = r.rows!.filter((p) => (p.overdue_ratio ?? 0) > 0);
      if (!pool.length) return text({ person: null, note: "Nobody with a cadence is due. Add people or set cadences." });
      const weights = pool.map((p) => Math.pow(p.overdue_ratio ?? 0, 2));
      let roll = Math.random() * weights.reduce((a, b) => a + b, 0);
      let pick = pool[pool.length - 1];
      for (let i = 0; i < pool.length; i++) {
        roll -= weights[i];
        if (roll <= 0) {
          pick = pool[i];
          break;
        }
      }
      return text({
        person: pick,
        why: pick.days_since_contact === null
          ? `Never contacted since being added; cadence is ${pick.cadence_days} days.`
          : `${pick.days_since_contact} days since last contact against a ${pick.cadence_days}-day cadence (${pick.overdue_ratio}× overdue).`,
        pool_size: pool.length,
      });
    }
  );

  // ---------------------------------------------------------------- messages
  server.registerTool(
    "link_message_to_person",
    {
      title: "Link inbound message to person",
      description:
        "Attach a site message (from list_messages) to a CRM person and log it as a 'message' interaction. Without `person`, matches by the sender's email, then name, creating the person if needed.",
      inputSchema: z.object({ message_id: z.string().uuid(), person: RefSchema.optional(), create_missing: z.boolean().default(true) }),
    },
    async ({ message_id, person, create_missing }, ctx) => {
      const err = need(ctx as Ctx, "write");
      if (err) return fail(err);
      const { data: msg, error } = await db().from("agent_messages").select("*").eq("id", message_id).maybeSingle();
      if (error) return fail(error.message);
      if (!msg) return fail(`No message ${message_id}.`);
      const ref: Ref = person ?? { email: msg.from_email ?? undefined, name: msg.from_name ?? undefined };
      if (!ref.id && !ref.email && !ref.name) return fail("Message has no sender name or email; pass `person`.");
      const r = await resolvePerson(ref, { createMissing: create_missing, source: "contact-form" });
      if (!r.person) return fail(r.error ?? "Not found.");
      if (ref.email && !r.person.emails.includes(ref.email.toLowerCase())) {
        await db().from("people").update({ emails: union(r.person.emails, [ref.email.toLowerCase()]) }).eq("id", r.person.id);
      }
      await db().from("agent_messages").update({ person_id: r.person.id }).eq("id", message_id);
      const { data: inter } = await db()
        .from("interactions")
        .insert({
          kind: "message",
          occurred_at: msg.created_at,
          summary: `Site message${msg.subject ? `: ${msg.subject}` : ""}${msg.intent ? ` (${msg.intent})` : ""}`,
          body: msg.body,
          source: actor(ctx as Ctx),
          metadata: { message_id },
        })
        .select("id")
        .single();
      if (inter) await db().from("interaction_people").insert({ interaction_id: inter.id, person_id: r.person.id });
      await log(ctx as Ctx, "link_message", message_id, { person_id: r.person.id, created: !!r.created });
      return text({ ok: true, person: { id: r.person.id, full_name: r.person.full_name, created: !!r.created }, interaction_id: inter?.id });
    }
  );
}
