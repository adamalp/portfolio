/**
 * POST /api/messages — leave a message for Adam (or his agent).
 * Public, no auth. Used by humans via the contact page and by visitors' agents via /SKILL.md.
 */
import { z } from "zod";
import { db, hasDb } from "@/lib/db";

const Body = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  email: z.string().trim().email().max(200).optional(),
  agent: z.string().trim().max(120).optional(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(1).max(5000),
  intent: z.enum(["intro", "collab", "question", "invite", "other"]).default("other"),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: cors });
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Body must be JSON." }, { status: 400, headers: cors });
  }
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return Response.json({ ok: false, error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") }, { status: 400, headers: cors });
  }
  if (!hasDb()) {
    return Response.json({ ok: false, error: "Message store is offline. Email aalpert421@gmail.com instead." }, { status: 503, headers: cors });
  }
  const b = parsed.data;
  const { data, error } = await db()
    .from("agent_messages")
    .insert({
      from_name: b.name ?? null,
      from_email: b.email ?? null,
      from_agent: b.agent ?? req.headers.get("user-agent"),
      subject: b.subject ?? null,
      body: b.message,
      intent: b.intent,
      metadata: b.metadata ?? {},
    })
    .select("id,created_at")
    .single();
  if (error) return Response.json({ ok: false, error: error.message }, { status: 500, headers: cors });
  return Response.json({ ok: true, id: data.id, received_at: data.created_at }, { status: 201, headers: cors });
}
