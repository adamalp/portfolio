# Moving sale — sale.adam-alpert.com

Small Next.js 14 app: public catalog where buyers tick items and enter an offer per item; passcode-protected `/admin` where Adam accepts/declines offers and manages inventory; JSON endpoint for Claude to summarize offers.

## Handoff notes for Claude Code (in the adam-alpert.com repo)

This folder is a self-contained Next.js app. Two ways to host it:

**A. Separate Vercel project (recommended, simplest).** Put this folder at e.g. `apps/sale/` (or its own repo), create a Vercel project with *Root Directory* = that folder, add the three env vars from `.env.example`, and add the domain `sale.adam-alpert.com` to that project (Vercel shows the CNAME to add at the DNS provider).

**B. Fold into the existing site.** Only worth it if the site is already Next.js app-router: copy `app/`, `components/`, `lib/` under a `/sale` route segment, adjust the `@/` imports, add the deps from `package.json`, and route `sale.adam-alpert.com` → `/sale` with a middleware rewrite on host. Otherwise use A.

## One-time setup

1. **Supabase**: new project → SQL editor → run `supabase/schema.sql`.
2. **Env**: copy `.env.example` → `.env.local` and fill `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (Settings → API → service_role), and pick an `ADMIN_PASSCODE`.
3. **Seed**: `npm install && npm run seed` — upserts the 55 items from `supabase/items.json` (exported from `Apartment_Sale_Inventory.xlsx`) and the one pre-existing $250 dining-table offer.
4. `npm run dev` → http://localhost:3000 and http://localhost:3000/admin.
5. Deploy to Vercel with the same three env vars.

## How it works

- `/` — server-rendered catalog (`lib/db.ts → publicItems()`), client `Catalog.tsx` handles selection, per-item offer inputs, and the sticky offer tray. Submits to `POST /api/offers` (validates, rejects Sold/Hidden items, groups the batch under one `submission_id`).
- `/admin` — cookie session (HMAC of the passcode). Tabs: offers by item (accept → item marked Sold with price + buyer, sibling open offers auto-declined), by buyer (one block per submission), items (edit asking/status/sold info inline).
- `GET /api/admin?key=ADMIN_PASSCODE` — every item with its offers, for scripts/Claude. `POST` with `{item_id, patch}` or `{offer_id, decision}` to change things programmatically.
- Public cards show **best open/accepted offer** (amount only, no buyer identity) via the `item_best_offer` view, so buyers know what to beat.
- Database is only touched server-side with the service-role key; RLS is on with no anon policies, so nothing is readable from the browser.

## Updating inventory later

Edit rows in `/admin?tab=items`, or regenerate `supabase/items.json` from the Excel and re-run `npm run seed` (upsert by id; does not delete rows). To add photos, set `image_url` on the item (schema has the column; the card doesn't render it yet — a 6-line addition in `Catalog.tsx`).
