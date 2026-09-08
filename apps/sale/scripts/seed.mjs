// Seeds items (and any pre-existing offers) into Supabase. Idempotent for items (upsert by id).
// Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"); process.exit(1); }
const s = createClient(url, key, { auth: { persistSession: false } });

const items = JSON.parse(readFileSync(new URL("../supabase/items.json", import.meta.url)));
const { error } = await s.from("items").upsert(items, { onConflict: "id" });
if (error) { console.error(error); process.exit(1); }
console.log(`upserted ${items.length} items`);

const offers = JSON.parse(readFileSync(new URL("../supabase/offers.json", import.meta.url)));
if (offers.length) {
  const { count } = await s.from("offers").select("*", { count: "exact", head: true });
  if (count === 0) {
    const sid = randomUUID();
    const { error: e2 } = await s.from("offers").insert(offers.map((o) => ({ ...o, submission_id: sid })));
    if (e2) { console.error(e2); process.exit(1); }
    console.log(`inserted ${offers.length} pre-existing offer(s)`);
  } else console.log("offers table not empty — skipped seeding offers");
}
