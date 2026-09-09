import { createHmac } from "node:crypto";
import { db, type Item } from "@/lib/db";

export type Receipt = { token: string; name: string; contact: string; items: Item[]; total: number; date: string };

/** Receipt links are derived from the buyer's contact, so no table is needed. Rotating the secret invalidates old links. */
const secret = () => process.env.RECEIPT_SECRET || process.env.ADMIN_PASSCODE || "";
export function normalizeContact(c: string): string {
  const digits = c.replace(/\D/g, "");
  return digits.length >= 7 ? digits : c.trim().toLowerCase();
}
export function receiptToken(contact: string): string {
  return createHmac("sha256", secret()).update(normalizeContact(contact)).digest("base64url").slice(0, 10);
}
/** items.sold_to is stored as "Name (contact)". */
export function parseSoldTo(s: string | null | undefined): { name: string; contact: string } | null {
  const m = (s ?? "").match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  return m ? { name: m[1].trim(), contact: m[2].trim() } : null;
}

/** One receipt per buyer with at least one sold item. */
export async function receipts(): Promise<Receipt[]> {
  const s = db();
  const [{ data: items, error }, { data: offers }] = await Promise.all([
    s.from("items").select("*").eq("status", "Sold").order("sold_price", { ascending: false }).order("id"),
    s.from("offers").select("buyer_contact,decided_at").eq("status", "accepted"),
  ]);
  if (error) throw error;
  const paidAt = new Map<string, string>();
  for (const o of offers ?? []) {
    const k = normalizeContact(o.buyer_contact);
    if (o.decided_at && (!paidAt.has(k) || o.decided_at > paidAt.get(k)!)) paidAt.set(k, o.decided_at);
  }
  const by = new Map<string, Receipt>();
  for (const it of (items ?? []) as Item[]) {
    const who = parseSoldTo(it.sold_to);
    if (!who) continue;
    const k = normalizeContact(who.contact);
    const r = by.get(k) ?? { token: receiptToken(who.contact), name: who.name, contact: who.contact, items: [], total: 0, date: paidAt.get(k) ?? new Date().toISOString() };
    r.items.push(it);
    r.total += it.sold_price ?? 0;
    by.set(k, r);
  }
  return [...by.values()].sort((a, b) => b.total - a.total);
}

export async function receiptByToken(token: string): Promise<Receipt | null> {
  return (await receipts()).find((r) => r.token === token) ?? null;
}
