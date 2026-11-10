/** Shared helpers for MCP tool handlers (route.ts and crm.ts). */
import type { AuthInfo } from "@modelcontextprotocol/server";
import { db } from "@/lib/db";
import { hasScope, type Scope } from "@/lib/agentAuth";

export type Ctx = { http?: { authInfo?: AuthInfo } };

export function text(data: unknown) {
  return { content: [{ type: "text" as const, text: typeof data === "string" ? data : JSON.stringify(data, null, 2) }] };
}
export function fail(message: string) {
  return { isError: true, content: [{ type: "text" as const, text: message }] };
}
export function need(ctx: Ctx, scope: Scope): string | null {
  return hasScope(ctx.http?.authInfo, scope) ? null : `This token lacks the "${scope}" scope.`;
}
export function actor(ctx: Ctx): string {
  return ctx.http?.authInfo?.clientId ?? "unknown";
}
export async function log(ctx: Ctx, action: string, target: string, detail: Record<string, unknown> = {}) {
  await db().from("content_log").insert({ actor: actor(ctx), action, target, detail });
}

/** Parse a date the agent passed ("2026-11-08", "2026-11-08T19:00:00Z", "yesterday" is NOT supported). */
export function parseWhen(s: string | undefined, fallback: Date = new Date()): Date | null {
  if (!s) return fallback;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}
