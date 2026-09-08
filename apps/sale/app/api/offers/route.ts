import { NextResponse } from "next/server";
import { biddingOpen, BIDS_CLOSE_LABEL } from "@/lib/pickup";
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
  const { data: items, error } = await db().from("items").select("id,status").in("id", ids);
  if (error) return NextResponse.json({ error: "Database error" }, { status: 500 });
  const ok = new Set((items ?? []).filter((i) => i.status !== "Sold" && i.status !== "Hidden").map((i) => i.id));

  const submission_id = randomUUID();
  const rows = offers
    .filter((o: any) => ok.has(Number(o.item_id)) && Number.isFinite(Number(o.amount)) && Number(o.amount) > 0)
    .map((o: any) => ({ item_id: Number(o.item_id), amount: Math.round(Number(o.amount)), buyer_name: name, buyer_contact: contact, note, submission_id }));
  if (!rows.length) return NextResponse.json({ error: "Those items aren't available anymore." }, { status: 409 });

  const { error: e2 } = await db().from("offers").insert(rows);
  if (e2) return NextResponse.json({ error: "Could not save offers" }, { status: 500 });
  return NextResponse.json({ ok: true, count: rows.length, submission_id });
}
