import { createHash } from "crypto";
import type { AuthInfo } from "@modelcontextprotocol/server";
import { db, hasDb } from "@/lib/db";

export type Scope = "read" | "write" | "admin";

export function sha256(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

/**
 * Resolve a bearer token to AuthInfo.
 * - AGENT_TOKEN (env) is the owner token: all scopes.
 * - Otherwise look up sha256(token) in agent_tokens (per-agent tokens with scopes).
 */
export async function verifyAgentToken(_req: Request, bearer?: string): Promise<AuthInfo | undefined> {
  if (!bearer) return undefined;
  // Trim both sides: values pasted into dashboards often pick up a trailing newline or space.
  const owner = process.env.AGENT_TOKEN?.trim();
  bearer = bearer.trim();
  if (owner && bearer.length === owner.length && timingSafeEqual(bearer, owner)) {
    return { token: bearer, clientId: "owner", scopes: ["read", "write", "admin"] };
  }
  if (!hasDb()) return undefined;
  const hash = sha256(bearer);
  const { data } = await db()
    .from("agent_tokens")
    .select("id,name,scopes,revoked_at")
    .eq("token_hash", hash)
    .maybeSingle();
  if (!data || data.revoked_at) return undefined;
  void db().from("agent_tokens").update({ last_used_at: new Date().toISOString() }).eq("id", data.id);
  return { token: bearer, clientId: data.name as string, scopes: data.scopes as string[] };
}

function timingSafeEqual(a: string, b: string): boolean {
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export function hasScope(auth: AuthInfo | undefined, scope: Scope): boolean {
  if (!auth) return false;
  if (auth.scopes.includes("admin")) return true;
  if (scope === "read") return auth.scopes.includes("read") || auth.scopes.includes("write");
  return auth.scopes.includes(scope);
}
