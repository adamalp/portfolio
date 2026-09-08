import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/** Server-only Supabase client using the service-role key. Never import from client components. */
export function db(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  client = createClient(url, key, {
    auth: { persistSession: false },
    // Next.js caches fetch() in server components by default; offers must always be live.
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
  return client;
}

export type Item = {
  id: number;
  category: string;
  name: string;
  description: string;
  dimensions: string;
  qty: number;
  asking_price: number | null;
  status: "Available" | "Pending" | "Sold" | "Tentative" | "Hidden";
  sold_price: number | null;
  sold_to: string | null;
  notes: string;
  sort_order: number;
  image_url: string | null;
};

export type Offer = {
  id: string;
  item_id: number;
  buyer_name: string;
  buyer_contact: string;
  amount: number;
  note: string;
  status: "open" | "accepted" | "declined" | "withdrawn";
  submission_id: string;
  created_at: string;
  decided_at: string | null;
};

export type PublicItem = Item & { best_offer: number | null; open_offers: number };

export async function publicItems(): Promise<PublicItem[]> {
  if (process.env.MOCK_DB === "1") {
    // Local preview without Supabase: `MOCK_DB=1 npm run dev` renders the seed items (offers won't submit).
    const seed = (await import("../supabase/items.json")).default as Partial<Item>[];
    return seed.map((i) => ({ sold_price: null, sold_to: null, image_url: null, ...i, best_offer: i.id === 1 ? 250 : null, open_offers: i.id === 1 ? 1 : 0 } as PublicItem));
  }
  const s = db();
  const [{ data: items, error: e1 }, { data: best, error: e2 }] = await Promise.all([
    s.from("items").select("*").neq("status", "Hidden").order("sort_order").order("id"),
    s.from("item_best_offer").select("*"),
  ]);
  if (e1) throw e1;
  if (e2) throw e2;
  const map = new Map((best ?? []).map((b: any) => [b.item_id, b]));
  return (items as Item[]).map((i) => ({
    ...i,
    best_offer: map.get(i.id)?.best_offer ?? null,
    open_offers: map.get(i.id)?.open_offers ?? 0,
  }));
}

export type RecentBid = { id: string; item_id: number; item: string; first_name: string; amount: number; created_at: string; leading: boolean };

/** Latest bids for the public ticker. First names only, no contact info. */
export async function recentBids(limit = 8): Promise<RecentBid[]> {
  if (process.env.MOCK_DB === "1") return [];
  const s = db();
  const { data, error } = await s
    .from("offers")
    .select("id,item_id,amount,buyer_name,created_at,items(name)")
    .in("status", ["open", "accepted"])
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  const { data: best } = await s.from("item_best_offer").select("item_id,best_offer");
  const bestMap = new Map((best ?? []).map((b: any) => [b.item_id, Number(b.best_offer)]));
  return (data ?? []).map((o: any) => ({
    id: o.id,
    item_id: o.item_id,
    item: o.items?.name ?? "an item",
    first_name: firstName(o.buyer_name),
    amount: Number(o.amount),
    created_at: o.created_at,
    leading: bestMap.get(o.item_id) === Number(o.amount),
  }));
}

function firstName(full: string): string {
  const t = (full || "").trim();
  if (!t || t.startsWith("(")) return "Someone";
  return t.split(/\s+/)[0].replace(/[^\p{L}\p{N}'’-]/gu, "") || "Someone";
}
