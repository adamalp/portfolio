import { NextResponse } from "next/server";
import { biddingOpen, BIDS_CLOSE_LABEL } from "@/lib/pickup";
import { FREE_MIN_SPEND, freeEligible, minBid, rewardEligible, rewardTier } from "@/lib/deals";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Public: a buyer submits one or more offers in a single go. */
export async function POST(req: Request) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad request" }, { status: 400 }); }
  const name = String(body.name ?? "").trim().slice(0, 120);
  const contact = String(body.contact ?? "").trim().slice(0, 200);
  const note = String(body.note ?? "").trim().slice(0, 2000);
  const offers = Array.isArray(body.offers) ? body.offers : [];
  if (!biddingOpen()) return NextResponse.json({ error: `Bidding closed ${BIDS_CLOSE_LABEL}.` }, { status: 403 });
  if (!name || !contact) return NextResponse.json({ error: "Name and contact are required." }, { status: 400 });
  if (!offers.length || offers.length > 60) return NextResponse.json({ error: "Pick at least one item." }, { status: 400 });

  const ids = offers.map((o: any) => Number(o.item_id));
  const { data: items, error } = await db().from("items").select("id,name,status,asking_price").in("id", ids);
  if (error) return NextResponse.json({ error: "Database error" }, { status: 500 });

  // Minimum increment: a paid bid must beat the current best by MIN_INCREMENT, unless that best is the same buyer's.
  const { data: openBids } = await db().from("offers").select("item_id,amount,buyer_contact").in("item_id", ids).eq("status", "open");
  const lead = new Map<number, { amount: number; contact: string }>();
  for (const b of openBids ?? []) if (!lead.has(b.item_id) || Number(b.amount) > lead.get(b.item_id)!.amount) lead.set(b.item_id, { amount: Number(b.amount), contact: b.buyer_contact });
  const digits = (c: string) => c.replace(/\D/g, "");
  const short = offers.flatMap((o: any) => {
    const id = Number(o.item_id), amt = Number(o.amount), l = lead.get(id), it = (items ?? []).find((i: any) => i.id === id);
    if (!it || !l || !(amt > 0) || digits(l.contact) === digits(contact)) return [];
    const floor = minBid(l.amount)!;
    return amt < floor ? [`${it.name} (at least $${floor})`] : [];
  });
  if (short.length) return NextResponse.json({ error: `Bids have to beat the current best by $${minBid(0)}: ${short.join(", ")}.` }, { status: 409 });
  const ok = new Set((items ?? []).filter((i) => i.status !== "Sold" && i.status !== "Hidden").map((i) => i.id));

  const submission_id = randomUUID();
  const byId = new Map((items ?? []).map((i: any) => [i.id, i]));
  const paid = offers.reduce((s: number, o: any) => {
    const it = byId.get(Number(o.item_id));
    return it && !freeEligible(it) ? s + (Number(o.amount) || 0) : s;
  }, 0);
  const freeOk = paid >= FREE_MIN_SPEND;
  // One free reward pick: an item with no open bids, priced within the tier the paid subtotal unlocks.
  const tier = rewardTier(paid);
  let rewardId: number | null = null;
  if (tier) {
    const zeroIds = offers.filter((o: any) => Number(o.amount) === 0).map((o: any) => Number(o.item_id));
    if (zeroIds.length) {
      const { data: best } = await db().from("item_best_offer").select("item_id,open_offers").in("item_id", zeroIds);
      const openMap = new Map((best ?? []).map((b: any) => [b.item_id, Number(b.open_offers)]));
      for (const id of zeroIds) {
        const it = byId.get(id);
        if (it && !freeEligible(it) && rewardEligible({ ...it, open_offers: openMap.get(id) ?? 0 }) && Number(it.asking_price) <= tier.cap) { rewardId = id; break; }
      }
    }
  }
  const rows = offers
    .filter((o: any) => ok.has(Number(o.item_id)) && Number.isFinite(Number(o.amount)) && (Number(o.amount) > 0 || (Number(o.amount) === 0 && ((freeOk && freeEligible(byId.get(Number(o.item_id)))) || Number(o.item_id) === rewardId))))
    .map((o: any) => ({ item_id: Number(o.item_id), amount: Math.round(Number(o.amount)), buyer_name: name, buyer_contact: contact, note, submission_id }));
  if (!rows.length) return NextResponse.json({ error: "Those items aren't available anymore." }, { status: 409 });

  const { error: e2 } = await db().from("offers").insert(rows);
  if (e2) return NextResponse.json({ error: "Could not save offers" }, { status: 500 });
  return NextResponse.json({ ok: true, count: rows.length, submission_id });
}
