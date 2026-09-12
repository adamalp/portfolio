import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Machine-readable summary for Claude / scripts.
 * GET /api/admin?key=<ADMIN_PASSCODE>  -> { items: [...with offers], open_offers, sold_total }
 * POST /api/admin?key=...  body: { item_id, patch: {status, asking_price, ...} } | { offer_id, decision }
 */
function authorized(req: Request) {
  const key = new URL(req.url).searchParams.get("key") ?? req.headers.get("x-admin-key");
  return !!key && key === process.env.ADMIN_PASSCODE;
}

export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const s = db();
  const [{ data: items }, { data: offers }] = await Promise.all([
    s.from("items").select("*").order("id"),
    s.from("offers").select("*").order("created_at", { ascending: false }),
  ]);
  const byItem = new Map<number, any[]>();
  for (const o of offers ?? []) byItem.set(o.item_id, [...(byItem.get(o.item_id) ?? []), o]);
  const out = (items ?? []).map((i) => ({ ...i, offers: byItem.get(i.id) ?? [] }));
  return NextResponse.json({
    items: out,
    open_offers: (offers ?? []).filter((o) => o.status === "open").length,
    sold_total: (items ?? []).filter((i) => i.status === "Sold").reduce((a, i) => a + (i.sold_price ?? 0), 0),
  });
}

export async function POST(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = await req.json();
  const s = db();
  if (b.add && b.add.name) {
    // Insert a new item with the next id, e.g. late additions from a phone photo dump.
    const { data: last } = await s.from("items").select("id,sort_order").order("id", { ascending: false }).limit(1);
    const row = { id: (last?.[0]?.id ?? 0) + 1, sort_order: (last?.[0]?.sort_order ?? 0) + 1, status: "Available", ...b.add };
    const { error } = await s.from("items").insert(row);
    return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json({ ok: true, id: row.id });
  }
  if (b.item_id && b.patch) {
    const { error } = await s.from("items").update(b.patch).eq("id", b.item_id);
    return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json({ ok: true });
  }
  if (b.offer_id && b.decision) {
    const { data: o } = await s.from("offers").select("*").eq("id", b.offer_id).single();
    if (!o) return NextResponse.json({ error: "no such offer" }, { status: 404 });
    await s.from("offers").update({ status: b.decision, decided_at: new Date().toISOString() }).eq("id", b.offer_id);
    if (b.decision === "accepted") {
      await s.from("items").update({ status: "Sold", sold_price: o.amount, sold_to: `${o.buyer_name} (${o.buyer_contact})` }).eq("id", o.item_id);
      await s.from("offers").update({ status: "declined", decided_at: new Date().toISOString() }).eq("item_id", o.item_id).eq("status", "open");
    }
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "bad request" }, { status: 400 });
}
