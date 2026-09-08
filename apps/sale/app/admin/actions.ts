"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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
  redirect("/admin?tab=offers");
}

export async function updateItem(form: FormData) {
  if (!isAdmin()) redirect("/admin");
  const id = Number(form.get("id"));
  const num = (k: string) => { const v = String(form.get(k) ?? "").trim(); return v === "" ? null : Number(v); };
  await db().from("items").update({
    asking_price: num("asking_price"),
    status: String(form.get("status")),
    sold_price: num("sold_price"),
    sold_to: String(form.get("sold_to") ?? "").trim() || null,
  }).eq("id", id);
  revalidatePath("/"); revalidatePath("/admin");
  redirect("/admin?tab=items");
}
