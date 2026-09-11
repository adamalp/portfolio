"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { normalizeContact, parseSoldTo, soldToString } from "@/lib/receipt";
import { db } from "@/lib/db";
import { adminCookie, checkPasscode, isAdmin } from "@/lib/admin";

export async function login(form: FormData) {
  const p = String(form.get("passcode") ?? "");
  if (!checkPasscode(p)) redirect("/admin?err=1");
  cookies().set(adminCookie());
  redirect("/admin");
}

export async function logout() {
  cookies().delete("sale_admin");
  redirect("/admin");
}

/** Accept: marks the offer accepted, the item Sold (with price + buyer), and declines the item's other open offers. */
export async function decideOffer(form: FormData) {
  if (!isAdmin()) redirect("/admin");
  const id = String(form.get("id"));
  const decision = String(form.get("decision")) as "accepted" | "declined";
  const s = db();
  const { data: o } = await s.from("offers").select("*").eq("id", id).single();
  if (!o) redirect("/admin");
  await s.from("offers").update({ status: decision, decided_at: new Date().toISOString() }).eq("id", id);
  if (decision === "accepted") {
    await s.from("items").update({ status: "Sold", sold_price: o.amount, sold_to: `${o.buyer_name} (${o.buyer_contact})` }).eq("id", o.item_id);
    await s.from("offers").update({ status: "declined", decided_at: new Date().toISOString() }).eq("item_id", o.item_id).eq("status", "open");
  }
  revalidatePath("/"); revalidatePath("/admin");
  redirect(`/admin?tab=${form.get("back") === "winners" ? "winners" : "offers"}`);
}

export async function updateItem(form: FormData) {
  if (!isAdmin()) redirect("/admin");
  const id = Number(form.get("id"));
  const num = (k: string) => { const v = String(form.get(k) ?? "").trim(); return v === "" ? null : Number(v); };
  const status = String(form.get("status"));
  const s = db();
  await s.from("items").update({
    asking_price: num("asking_price"),
    status,
    sold_price: num("sold_price"),
    sold_to: String(form.get("sold_to") ?? "").trim() || null,
  }).eq("id", id);
  // A hand-marked sale closes the item's bidding too, so nobody stays "leading" on something that is gone.
  if (status === "Sold") await s.from("offers").update({ status: "declined", decided_at: new Date().toISOString() }).eq("item_id", id).eq("status", "open");
  // Un-selling (buyer backed out, or bid by mistake) releases the accepted bid so the public card stops showing it as the best offer.
  else await s.from("offers").update({ status: "withdrawn", decided_at: new Date().toISOString() }).eq("item_id", id).eq("status", "accepted");
  revalidatePath("/"); revalidatePath("/admin");
  redirect("/admin?tab=items");
}

/** Add an item that was never on the list, e.g. something sold on the spot. Optionally already sold to someone. */
export async function addItem(form: FormData) {
  if (!isAdmin()) redirect("/admin");
  const name = String(form.get("name") ?? "").trim();
  if (!name) redirect("/admin?tab=items");
  const num = (k: string) => { const v = String(form.get(k) ?? "").trim(); return v === "" ? null : Number(v); };
  const soldName = String(form.get("sold_name") ?? "").trim(), soldContact = String(form.get("sold_contact") ?? "").trim();
  const s = db();
  const { data: last } = await s.from("items").select("id,sort_order").order("id", { ascending: false }).limit(1);
  const id = (last?.[0]?.id ?? 0) + 1;
  await s.from("items").insert({
    id, name, category: String(form.get("category") ?? "Off-list").trim() || "Off-list", description: String(form.get("description") ?? "").trim(),
    asking_price: num("asking_price") ?? num("sold_price"), sort_order: (last?.[0]?.sort_order ?? 0) + 1,
    status: soldName ? "Sold" : "Available", sold_price: soldName ? num("sold_price") : null,
    sold_to: soldName ? soldToString(soldName, soldContact, "due") : null,
  });
  revalidatePath("/"); revalidatePath("/admin");
  redirect(soldName ? "/admin?tab=winners" : "/admin?tab=items");
}

/**
 * Sell an item to a named person at a named price, e.g. a deal struck by text that never went through the site.
 * If that person has an open bid on the item it is bumped to the price and accepted (so receipts date correctly);
 * every other open bid on the item is declined.
 */
export async function sellTo(form: FormData) {
  if (!isAdmin()) redirect("/admin");
  const item_id = Number(form.get("item_id"));
  const price = Number(form.get("price"));
  let name = String(form.get("name") ?? "").trim();
  let contact = String(form.get("contact") ?? "").trim();
  const bidder = String(form.get("bidder") ?? ""); // "name|contact" from the select, or "" for the typed fields
  if (bidder.includes("|")) [name, contact] = bidder.split("|");
  if (!item_id || !name || !contact || !(price >= 0)) redirect("/admin?tab=winners");
  const s = db();
  const now = new Date().toISOString();
  const { data: open } = await s.from("offers").select("id,buyer_contact").eq("item_id", item_id).eq("status", "open");
  const mine = (open ?? []).find((o) => normalizeContact(o.buyer_contact) === normalizeContact(contact));
  if (mine) await s.from("offers").update({ amount: price, status: "accepted", decided_at: now }).eq("id", mine.id);
  await s.from("offers").update({ status: "declined", decided_at: now }).eq("item_id", item_id).eq("status", "open");
  await s.from("items").update({ status: "Sold", sold_price: price, sold_to: soldToString(name, contact, "due") }).eq("id", item_id);
  revalidatePath("/"); revalidatePath("/admin");
  redirect("/admin?tab=winners");
}

/** Accept every leading bid that is at or above the item's start price. Under-start leaders are left for a decision by hand. */
export async function closeSale() {
  if (!isAdmin()) redirect("/admin");
  const s = db();
  const [{ data: items }, { data: offers }] = await Promise.all([
    s.from("items").select("id,asking_price,status").neq("status", "Sold").neq("status", "Hidden"),
    s.from("offers").select("*").eq("status", "open"),
  ]);
  const now = new Date().toISOString();
  for (const it of items ?? []) {
    const open = (offers ?? []).filter((o) => o.item_id === it.id);
    if (!open.length) continue;
    const top = open.reduce((m, o) => (Number(o.amount) > Number(m.amount) ? o : m));
    if (!(Number(top.amount) > 0 && Number(top.amount) >= Number(it.asking_price ?? 0))) continue;
    await s.from("offers").update({ status: "accepted", decided_at: now }).eq("id", top.id);
    await s.from("items").update({ status: "Sold", sold_price: top.amount, sold_to: soldToString(top.buyer_name, top.buyer_contact, "due") }).eq("id", it.id);
    await s.from("offers").update({ status: "declined", decided_at: now }).eq("item_id", it.id).eq("status", "open");
  }
  revalidatePath("/"); revalidatePath("/admin");
  redirect("/admin?tab=winners");
}

/** Flip every item sold to one buyer between paid and unpaid (stored as a " [paid]" suffix on sold_to). */
export async function setPaid(form: FormData) {
  if (!isAdmin()) return;
  const contact = String(form.get("contact") ?? ""), paid = form.get("paid") === "1";
  const s = db();
  const { data } = await s.from("items").select("id,sold_to").eq("status", "Sold");
  for (const it of data ?? []) {
    const who = parseSoldTo(it.sold_to);
    if (who && normalizeContact(who.contact) === normalizeContact(contact) && (who.settle === "paid") !== paid)
      await s.from("items").update({ sold_to: soldToString(who.name, who.contact, paid ? "paid" : "due") }).eq("id", it.id);
  }
  revalidatePath("/admin");
}
