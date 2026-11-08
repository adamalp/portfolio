/**
 * adam-alpert.com MCP server.
 *
 * Streamable-HTTP endpoint at /api/mcp. Agents (Muse, Dots, Claude, …) connect with a bearer
 * token and read/write the site's content: posts, site blocks, agent skills, inbound messages.
 * Writes revalidate the affected pages, so changes go live without a deploy.
 *
 * Auth: `Authorization: Bearer <token>`. AGENT_TOKEN (env) is the owner token; per-agent tokens
 * live in agent_tokens with scopes read | write | admin.
 */
import { createMcpHandler, withMcpAuth } from "mcp-handler";
import type { AuthInfo } from "@modelcontextprotocol/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { hasScope, sha256, verifyAgentToken, type Scope } from "@/lib/agentAuth";
import { readingTimeFor } from "@/lib/content";

type Ctx = { http?: { authInfo?: AuthInfo } };

function text(data: unknown) {
  return { content: [{ type: "text" as const, text: typeof data === "string" ? data : JSON.stringify(data, null, 2) }] };
}
function fail(message: string) {
  return { isError: true, content: [{ type: "text" as const, text: message }] };
}
function need(ctx: Ctx, scope: Scope): string | null {
  return hasScope(ctx.http?.authInfo, scope) ? null : `This token lacks the "${scope}" scope.`;
}
function actor(ctx: Ctx): string {
  return ctx.http?.authInfo?.clientId ?? "unknown";
}
async function log(ctx: Ctx, action: string, target: string, detail: Record<string, unknown> = {}) {
  await db().from("content_log").insert({ actor: actor(ctx), action, target, detail });
}
function revalidatePost(slug: string) {
  revalidatePath("/");
  revalidatePath("/writing");
  revalidatePath(`/writing/${slug}`);
}

const INSTRUCTIONS = `You are connected to Adam Alpert's personal site (adam-alpert.com).
Before writing or editing any content, call get_skill("voice") and get_skill("publishing") and follow them.
Posts: list_posts / get_post / upsert_post. New posts default to status "draft"; set status "published" only when Adam has approved the piece.
Site blocks: small editable pieces of the homepage (hero_status, now_cards). Read list_blocks to see what exists and the expected shape before set_block.
Skills: the voice and publishing guides are editable with upsert_skill when Adam asks to change how things are written.
Messages: list_messages shows notes visitors and their agents left via POST /api/messages.`;

const mcp = createMcpHandler(
  (server) => {
    // ------------------------------------------------------------------ posts
    server.registerTool(
      "list_posts",
      {
        title: "List posts",
        description: "List writing posts with metadata (no bodies). Filter by status: draft | published | archived | all.",
        inputSchema: z.object({ status: z.enum(["draft", "published", "archived", "all"]).default("all") }),
      },
      async ({ status }, ctx) => {
        const err = need(ctx as Ctx, "read");
        if (err) return fail(err);
        let q = db()
          .from("posts")
          .select("slug,title,excerpt,tags,reading_time,status,published_at,author,updated_at")
          .order("published_at", { ascending: false, nullsFirst: true })
          .order("updated_at", { ascending: false });
        if (status !== "all") q = q.eq("status", status);
        const { data, error } = await q;
        if (error) return fail(error.message);
        return text(data);
      }
    );

    server.registerTool(
      "get_post",
      {
        title: "Get post",
        description: "Fetch one post by slug, including its markdown body.",
        inputSchema: z.object({ slug: z.string() }),
      },
      async ({ slug }, ctx) => {
        const err = need(ctx as Ctx, "read");
        if (err) return fail(err);
        const { data, error } = await db().from("posts").select("*").eq("slug", slug).maybeSingle();
        if (error) return fail(error.message);
        if (!data) return fail(`No post with slug "${slug}".`);
        return text(data);
      }
    );

    server.registerTool(
      "upsert_post",
      {
        title: "Create or update post",
        description:
          "Create a post or update an existing one by slug. Only the fields you pass are changed. body_md is markdown; paragraphs are separated by blank lines. New posts default to status=draft. Setting status=published sets published_at if empty. Read get_skill('voice') first.",
        inputSchema: z.object({
          slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "kebab-case slug"),
          title: z.string().min(1).optional(),
          excerpt: z.string().optional(),
          body_md: z.string().optional(),
          tags: z.array(z.string()).optional(),
          status: z.enum(["draft", "published", "archived"]).optional(),
          published_at: z.string().datetime().optional(),
          author: z.string().optional(),
          notes: z.string().optional(),
        }),
      },
      async (input, ctx) => {
        const err = need(ctx as Ctx, "write");
        if (err) return fail(err);
        const { slug, ...fields } = input;
        const { data: existing } = await db().from("posts").select("id,status,published_at").eq("slug", slug).maybeSingle();
        const patch: Record<string, unknown> = { ...fields };
        if (fields.body_md !== undefined) patch.reading_time = readingTimeFor(fields.body_md);
        if (!existing) {
          if (!fields.title) return fail("title is required when creating a post.");
          patch.author = fields.author ?? actor(ctx as Ctx);
        }
        if (fields.status === "published" && !fields.published_at && !existing?.published_at) {
          patch.published_at = new Date().toISOString();
        }
        const { data, error } = await db()
          .from("posts")
          .upsert({ slug, ...patch }, { onConflict: "slug" })
          .select("slug,title,status,published_at,reading_time,updated_at")
          .single();
        if (error) return fail(error.message);
        await log(ctx as Ctx, existing ? "update_post" : "create_post", slug, { fields: Object.keys(fields) });
        revalidatePost(slug);
        return text({ ok: true, post: data, url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://adam-alpert.com"}/writing/${slug}` });
      }
    );

    server.registerTool(
      "delete_post",
      {
        title: "Delete post",
        description: "Permanently delete a post. Prefer status=archived via upsert_post. Requires admin scope.",
        inputSchema: z.object({ slug: z.string() }),
      },
      async ({ slug }, ctx) => {
        const err = need(ctx as Ctx, "admin");
        if (err) return fail(err);
        const { error, count } = await db().from("posts").delete({ count: "exact" }).eq("slug", slug);
        if (error) return fail(error.message);
        await log(ctx as Ctx, "delete_post", slug);
        revalidatePost(slug);
        return text({ ok: true, deleted: count ?? 0 });
      }
    );

    // ------------------------------------------------------------ site blocks
    server.registerTool(
      "list_blocks",
      {
        title: "List site blocks",
        description: "List editable site blocks (key, description, current value, last update).",
        inputSchema: z.object({}),
      },
      async (_input, ctx) => {
        const err = need(ctx as Ctx, "read");
        if (err) return fail(err);
        const { data, error } = await db().from("site_blocks").select("*").order("key");
        if (error) return fail(error.message);
        return text(data);
      }
    );

    server.registerTool(
      "set_block",
      {
        title: "Set site block",
        description:
          "Create or replace a site block's value. Keep the same shape as the existing value (string for text blocks, array/object for structured ones). Known keys: hero_status (string), now_cards (array of {slug, role, name, ital, desc, tag, href}).",
        inputSchema: z.object({
          key: z.string().regex(/^[a-z0-9_]+$/),
          value: z.unknown(),
          description: z.string().optional(),
        }),
      },
      async ({ key, value, description }, ctx) => {
        const err = need(ctx as Ctx, "write");
        if (err) return fail(err);
        const row: Record<string, unknown> = { key, value, updated_by: actor(ctx as Ctx) };
        if (description !== undefined) row.description = description;
        const { error } = await db().from("site_blocks").upsert(row, { onConflict: "key" });
        if (error) return fail(error.message);
        await log(ctx as Ctx, "set_block", key);
        revalidatePath("/");
        return text({ ok: true, key });
      }
    );

    // ------------------------------------------------------------------ skills
    server.registerTool(
      "list_skills",
      {
        title: "List agent skills",
        description: "List the skills (voice guide, publishing rules, public skill) that govern how content is written here.",
        inputSchema: z.object({}),
      },
      async (_input, ctx) => {
        const err = need(ctx as Ctx, "read");
        if (err) return fail(err);
        const { data, error } = await db().from("agent_skills").select("key,name,description,visibility,updated_by,updated_at").order("key");
        if (error) return fail(error.message);
        return text(data);
      }
    );

    server.registerTool(
      "get_skill",
      {
        title: "Get agent skill",
        description: "Read a skill's full markdown. Call get_skill('voice') before writing anything in Adam's voice.",
        inputSchema: z.object({ key: z.string() }),
      },
      async ({ key }, ctx) => {
        const err = need(ctx as Ctx, "read");
        if (err) return fail(err);
        const { data, error } = await db().from("agent_skills").select("*").eq("key", key).maybeSingle();
        if (error) return fail(error.message);
        if (!data) return fail(`No skill "${key}".`);
        return text(data.body_md);
      }
    );

    server.registerTool(
      "upsert_skill",
      {
        title: "Create or update agent skill",
        description: "Create or edit a skill. Use when Adam asks to change voice rules, publishing rules, or the public skill served at /SKILL.md.",
        inputSchema: z.object({
          key: z.string().regex(/^[a-z0-9-]+$/),
          name: z.string().optional(),
          description: z.string().optional(),
          body_md: z.string().optional(),
          visibility: z.enum(["public", "private"]).optional(),
        }),
      },
      async (input, ctx) => {
        const err = need(ctx as Ctx, "write");
        if (err) return fail(err);
        const { key, ...fields } = input;
        const { data: existing } = await db().from("agent_skills").select("key").eq("key", key).maybeSingle();
        if (!existing && !(fields.name && fields.description && fields.body_md)) {
          return fail("name, description and body_md are required when creating a skill.");
        }
        const { error } = await db()
          .from("agent_skills")
          .upsert({ key, ...fields, updated_by: actor(ctx as Ctx) }, { onConflict: "key" });
        if (error) return fail(error.message);
        await log(ctx as Ctx, existing ? "update_skill" : "create_skill", key, { fields: Object.keys(fields) });
        revalidatePath("/SKILL.md");
        return text({ ok: true, key });
      }
    );

    // ---------------------------------------------------------------- messages
    server.registerTool(
      "list_messages",
      {
        title: "List inbound messages",
        description: "Messages visitors (or their agents) left via POST /api/messages. Filter by status: new | read | replied | archived | all.",
        inputSchema: z.object({
          status: z.enum(["new", "read", "replied", "archived", "all"]).default("new"),
          limit: z.number().int().min(1).max(200).default(50),
        }),
      },
      async ({ status, limit }, ctx) => {
        const err = need(ctx as Ctx, "read");
        if (err) return fail(err);
        let q = db().from("agent_messages").select("*").order("created_at", { ascending: false }).limit(limit);
        if (status !== "all") q = q.eq("status", status);
        const { data, error } = await q;
        if (error) return fail(error.message);
        return text(data);
      }
    );

    server.registerTool(
      "set_message_status",
      {
        title: "Set message status",
        description: "Mark an inbound message read | replied | archived.",
        inputSchema: z.object({ id: z.string().uuid(), status: z.enum(["new", "read", "replied", "archived"]) }),
      },
      async ({ id, status }, ctx) => {
        const err = need(ctx as Ctx, "write");
        if (err) return fail(err);
        const { error } = await db().from("agent_messages").update({ status }).eq("id", id);
        if (error) return fail(error.message);
        return text({ ok: true, id, status });
      }
    );

    // ------------------------------------------------------------------ tokens
    server.registerTool(
      "create_agent_token",
      {
        title: "Create agent token",
        description: "Mint a bearer token for another agent (e.g. Muse, Dots) with the given scopes. The token is shown once. Requires admin scope.",
        inputSchema: z.object({
          name: z.string().min(1),
          scopes: z.array(z.enum(["read", "write", "admin"])).default(["read", "write"]),
        }),
      },
      async ({ name, scopes }, ctx) => {
        const err = need(ctx as Ctx, "admin");
        if (err) return fail(err);
        const token = `aa_${crypto.randomUUID().replace(/-/g, "")}${crypto.randomUUID().replace(/-/g, "")}`;
        const { error } = await db().from("agent_tokens").insert({ name, scopes, token_hash: sha256(token) });
        if (error) return fail(error.message);
        await log(ctx as Ctx, "create_token", name, { scopes });
        return text({ ok: true, name, scopes, token, note: "Store this now; it is not retrievable later." });
      }
    );

    server.registerTool(
      "list_agent_tokens",
      {
        title: "List agent tokens",
        description: "List issued agent tokens (names, scopes, last use). Requires admin scope.",
        inputSchema: z.object({}),
      },
      async (_input, ctx) => {
        const err = need(ctx as Ctx, "admin");
        if (err) return fail(err);
        const { data, error } = await db().from("agent_tokens").select("id,name,scopes,created_at,last_used_at,revoked_at").order("created_at");
        if (error) return fail(error.message);
        return text(data);
      }
    );

    server.registerTool(
      "revoke_agent_token",
      {
        title: "Revoke agent token",
        description: "Revoke a token by id. Requires admin scope.",
        inputSchema: z.object({ id: z.string().uuid() }),
      },
      async ({ id }, ctx) => {
        const err = need(ctx as Ctx, "admin");
        if (err) return fail(err);
        const { error } = await db().from("agent_tokens").update({ revoked_at: new Date().toISOString() }).eq("id", id);
        if (error) return fail(error.message);
        await log(ctx as Ctx, "revoke_token", id);
        return text({ ok: true, id });
      }
    );
  },
  {
    serverInfo: { name: "adam-alpert", version: "0.1.0" },
    instructions: INSTRUCTIONS,
  }
);

const handler = withMcpAuth(mcp, verifyAgentToken, { required: true });

export { handler as GET, handler as POST, handler as DELETE };
