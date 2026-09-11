/** Helpers for texting buyers from /admin?tab=winners. Pure functions, safe to import anywhere. */
import { PICKUP_ADDRESS, PICKUP_DEADLINE_LABEL, MOVE_OUT_LABEL } from "@/lib/pickup";

export const SITE = "sale.adam-alpert.com";

/** "(650) 799-0501" -> "+16507990501"; "+55 11 97424-2998" -> "+5511974242998"; "015168911711" (German local) -> "+4915168911711". */
export function phoneE164(raw: string): string | null {
  const t = raw.trim();
  const digits = t.replace(/\D/g, "");
  if (digits.length < 7) return null;
  if (t.startsWith("+")) return "+" + digits;
  if (digits.length === 10) return "+1" + digits;
  if (digits.length === 11 && digits.startsWith("1")) return "+" + digits;
  if (digits.startsWith("0")) return "+49" + digits.slice(1); // only non-US local format we have seen
  return "+" + digits;
}

/** iOS and Android both open Messages with the body prefilled for `sms:<num>?&body=`. */
export function smsHref(contact: string, body: string): string | null {
  const n = phoneE164(contact);
  return n ? `sms:${n}?&body=${encodeURIComponent(body)}` : null;
}
export function waHref(contact: string, body: string): string | null {
  const n = phoneE164(contact);
  return n ? `https://wa.me/${n.slice(1)}?text=${encodeURIComponent(body)}` : null;
}

export function firstName(full: string): string {
  const t = (full || "").trim();
  return t.split(/\s+/)[0] || "there";
}

/** Split the notes a buyer wrote across their submissions into pickup preference, an alternate number, and the rest. */
export function parseNotes(notes: string[]): { pickup: string[]; whatsapp: string | null; text: string[] } {
  const pickup = new Set<string>(), text = new Set<string>();
  let whatsapp: string | null = null;
  for (const raw of notes) {
    for (const seg of raw.split(/\s*\/\s*|\n/)) {
      const s = seg.trim();
      if (!s) continue;
      const p = s.match(/^Pickup:\s*(.+)$/i);
      if (p) { pickup.add(p[1].trim()); continue; }
      if (/^Free pick:/i.test(s)) continue;
      const w = s.match(/whats?app[^+\d]*(\+?[\d\s()-]{7,})/i);
      if (w) whatsapp = w[1].trim();
      text.add(s);
    }
  }
  return { pickup: [...pickup], whatsapp, text: [...text] };
}

export type WonLine = { name: string; price: number };

/** The "you won" text. Short enough to read on a lock screen, with the receipt link last so it previews. */
export function winnerMessage(o: { name: string; items: WonLine[]; pending?: WonLine[]; total: number; token: string; pickup: string[]; venmo: string }): string {
  const lines = o.items.map((i) => `• ${i.name} — ${i.price > 0 ? "$" + i.price : "free"}`);
  const pend = (o.pending ?? []).map((i) => `• ${i.name} — your $${i.price} bid, still sorting this one out`);
  const pref = o.pickup.length ? ` You mentioned ${o.pickup.join(" or ")}.` : "";
  return [
    `Hi ${firstName(o.name)}! Adam here 👋 Bidding closed and you won at my moving sale:`,
    ...lines,
    ...pend,
    `Total $${o.total}. Pickup is at ${PICKUP_ADDRESS}, any time through ${PICKUP_DEADLINE_LABEL} (I move out ${MOVE_OUT_LABEL}).${pref} What day and time works for you?`,
    `Venmo or Zelle ${o.venmo} at pickup. Receipt: ${SITE}/receipt/${o.token}`,
  ].join("\n");
}

/** Counter-offer text for a leader who is under the start price. */
export function counterMessage(o: { name: string; item: string; bid: number; ask: number }): string {
  return `Hi ${firstName(o.name)}! Adam here. Bidding closed and you're the top bid on the ${o.item} at $${o.bid}. I was hoping for closer to $${o.ask}. Would you do $${o.ask}? If so it's yours, pickup at ${PICKUP_ADDRESS} through ${PICKUP_DEADLINE_LABEL}.`;
}

/** "Still available" text for people who bid and won nothing. */
export function leftoversMessage(o: { name: string; wanted: string[]; leftovers: WonLine[] }): string {
  const wanted = o.wanted.length ? ` You were outbid on the ${o.wanted.slice(0, 3).join(", ")}.` : "";
  const list = o.leftovers.map((i) => `• ${i.name} — $${i.price}`);
  return [
    `Hi ${firstName(o.name)}! Adam here.${wanted} A few things didn't sell and are first-come at these prices:`,
    ...list,
    `Reply with what you want and it's yours. Pickup at ${PICKUP_ADDRESS} through ${PICKUP_DEADLINE_LABEL}. Everything: ${SITE}`,
  ].join("\n");
}
