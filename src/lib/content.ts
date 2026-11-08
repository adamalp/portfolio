/**
 * Content layer: the site's editable content lives in Supabase (posts, site_blocks,
 * agent_skills) so agents can add and edit it through the MCP server at /api/mcp.
 * Every reader here degrades to the in-code fallback when the database is unreachable,
 * so a paused project or missing env never takes the site down.
 */
import { db, hasDb } from "@/lib/db";
import { writingPosts as fallbackPostMeta } from "@/lib/siteMap";
import { fallbackPostBodies } from "@/lib/fallbackPosts";

export type PostStatus = "draft" | "published" | "archived";

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  body_md: string;
  tags: string[];
  reading_time: string;
  status: PostStatus;
  published_at: string | null;
  author: string;
  updated_at?: string;
}

export interface SiteBlock<T = unknown> {
  key: string;
  value: T;
  description: string | null;
  updated_by: string | null;
  updated_at: string;
}

export interface AgentSkill {
  key: string;
  name: string;
  description: string;
  body_md: string;
  visibility: "public" | "private";
  updated_by: string | null;
  updated_at: string;
}

export function readingTimeFor(body: string): string {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min`;
}

/** Post date as YYYY-MM-DD for display and metadata. */
export function postDate(p: Post): string {
  return (p.published_at ?? p.updated_at ?? new Date().toISOString()).slice(0, 10);
}

/** Split markdown-ish body into paragraphs; the post page renders simple paragraphs. */
export function paragraphsOf(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

type PostRow = Omit<Post, "reading_time"> & { reading_time: string | null };

function rowToPost(r: PostRow): Post {
  return { ...r, reading_time: r.reading_time ?? readingTimeFor(r.body_md) };
}

function fallbackPosts(): Post[] {
  return fallbackPostMeta.map((m) => ({
    slug: m.slug,
    title: m.title,
    excerpt: m.excerpt,
    body_md: (fallbackPostBodies[m.slug] ?? [m.excerpt]).join("\n\n"),
    tags: m.tags,
    reading_time: m.readingTime,
    status: "published" as const,
    published_at: `${m.date}T12:00:00.000Z`,
    author: "adam",
  }));
}

export async function getPublishedPosts(): Promise<Post[]> {
  if (!hasDb()) return fallbackPosts();
  try {
    const { data, error } = await db()
      .from("posts")
      .select("slug,title,excerpt,body_md,tags,reading_time,status,published_at,author,updated_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (error) throw error;
    if (!data || data.length === 0) return fallbackPosts();
    return (data as PostRow[]).map(rowToPost);
  } catch (e) {
    console.error("[content] getPublishedPosts fell back:", (e as Error).message);
    return fallbackPosts();
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  if (!hasDb()) return fallbackPosts().find((p) => p.slug === slug) ?? null;
  try {
    const { data, error } = await db()
      .from("posts")
      .select("slug,title,excerpt,body_md,tags,reading_time,status,published_at,author,updated_at")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw error;
    if (data) return rowToPost(data as PostRow);
    return fallbackPosts().find((p) => p.slug === slug) ?? null;
  } catch (e) {
    console.error("[content] getPost fell back:", (e as Error).message);
    return fallbackPosts().find((p) => p.slug === slug) ?? null;
  }
}

/** Read a site block, returning `fallback` when missing or unreachable. */
export async function getBlock<T>(key: string, fallback: T): Promise<T> {
  if (!hasDb()) return fallback;
  try {
    const { data, error } = await db().from("site_blocks").select("value").eq("key", key).maybeSingle();
    if (error) throw error;
    return data ? (data.value as T) : fallback;
  } catch (e) {
    console.error(`[content] getBlock(${key}) fell back:`, (e as Error).message);
    return fallback;
  }
}

export async function getPublicSkill(key = "public"): Promise<AgentSkill | null> {
  if (!hasDb()) return null;
  try {
    const { data, error } = await db()
      .from("agent_skills")
      .select("*")
      .eq("key", key)
      .eq("visibility", "public")
      .maybeSingle();
    if (error) throw error;
    return (data as AgentSkill | null) ?? null;
  } catch (e) {
    console.error("[content] getPublicSkill fell back:", (e as Error).message);
    return null;
  }
}
