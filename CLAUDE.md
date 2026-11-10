# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Adam Alpert — founder, builder, and community creator. Tech-industrial aesthetic (dark/monochrome, blueprint/schematic, retro-tech).

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Hosting:** Vercel

## Commands

```bash
# Development
npm run dev          # Start dev server at localhost:3000

# Build & Production
npm run build        # Build for production
npm run start        # Run production build locally
npm run lint         # Run ESLint
```

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home (hero, current focus, writing preview)
│   ├── about/             # Consolidated bio, timeline, adventures
│   ├── projects/          # Projects listing and [slug] detail
│   ├── writing/           # Writing listing and [slug] posts
│   ├── contact/           # Contact/work-with-me page
│   ├── story/[slug]/      # Story chapter detail pages (6 chapters)
│   └── adventures/[slug]/ # Adventure detail pages
├── components/
│   ├── layout/            # Navigation, Footer, PageTransition
│   ├── ui/                # Design system (Button, TechTag, SectionHeader)
│   └── effects/           # Visual effects (GlitchText, TypewriterText, ScanlineOverlay, GridBackground)
├── lib/
│   └── siteMap.ts         # All site data: nav items, story chapters, projects, adventures, timeline, writing posts
└── public/
    └── images/            # All site photos (JPG/PNG)
```

## Navigation

Four nav items: **About | Projects | Writing | Contact**

- No separate CTA button — Contact is a regular nav item
- Old routes (`/build`, `/story`, `/timeline`, `/adventures`) redirect to new locations
- Active state uses `usePathname()` with cyan highlight

## Site Data

Structural data lives in `src/lib/siteMap.ts`; editable content (writing posts, homepage status line and "now" cards, agent skills) lives in Supabase and is read through `src/lib/content.ts` with in-code fallbacks. See "Content database & MCP" below. `siteMap.ts` holds:
- `navItems` — navigation links
- `storyChapters` — 6 life chapters with slugs, titles, years
- `buildProjects` — projects with roles, descriptions, status
- `adventures` — adventure entries
- `timelineEntries` — chronological events (link to story/project/adventure pages)
- `writingPosts` — fallback post metadata only (live posts come from the `posts` table)

Detail page content (long descriptions, sections) is stored inline in each `[slug]/page.tsx` file.

## Image Handling

- Images stored in `public/images/`
- Hero images mapped per slug in detail page files (e.g., `chapterImages`, `projectImages`, `adventureImages`)
- Inline images mapped by section title (e.g., `chapterInlineImages[slug][sectionTitle]`)
- Uses Next.js `Image` component with `fill` + `object-cover` in aspect-ratio containers
- HEIC files must be converted to JPG for browser compatibility (use `sips` on macOS)

## Design System

**Colors (defined in Tailwind config):**
- Background: `#0a0a0a`, Surface: `#111111`
- Primary: `#00ffcc` (cyan), Secondary: `#00ff88` (green), Accent: `#ff3366` (red)
- Text: `#e0e0e0`, Muted: `#666666`

**Fonts:**
- Headings/Code: JetBrains Mono
- Body: Inter

## Key Patterns

- All pages use the App Router (`app/` directory)
- Effect components (glitch, scanlines, typewriter) wrap content and add CSS animations
- Framer Motion used for page transitions and component animations
- Detail pages have prev/next navigation (story chapters, projects, adventures)
- About page structure: Bio with photo → Mountain panorama → Interactive timeline → Adventure image cards

## Moving Sale App (`apps/sale/`)

Standalone Next.js 14 + Supabase app for **sale.adam-alpert.com** (buyers browse apartment items and submit per-item offers; Adam accepts/declines in `/admin`). It has its own `package.json`, `node_modules`, and toolchain, and is excluded from the root site's tsconfig and ESLint.

- Deployed as a **separate Vercel project** with Root Directory = `apps/sale` (same GitHub repo).
- Env vars: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSCODE` (see `apps/sale/.env.example`).
- Setup, seeding, and API details: `apps/sale/README.md`. Local preview without a database: `MOCK_DB=1 npm run dev` inside `apps/sale`.
- Item data of record once live is the Supabase DB; `apps/sale/supabase/items.json` is the seed (mirrors the `Apartment_Sale_Inventory` Google Sheet).

## Content database & MCP (root site)

Editable content is in the personal Supabase project `adam-alpert` (ref `eitadkuaqhxrpgpjyyou`, same project as the sale app). Tables: `posts`, `site_blocks`, `agent_skills`, `agent_tokens`, `agent_messages`, `content_log`. All have RLS on with no anon policies; the server reads/writes with the service-role key only.

- Schema: `supabase/schema.sql`. Seed: `supabase/seed_posts.sql`, `supabase/seed_blocks_skills.sql`. Apply with the SQL editor or `npx supabase@latest db query --remote=eitadkuaqhxrpgpjyyou -f <file> --yes`.
- Env (root `.env.local` and Vercel): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `AGENT_TOKEN` (owner bearer token for the MCP), `NEXT_PUBLIC_SITE_URL`.
- Readers: `src/lib/content.ts` (`getPublishedPosts`, `getPost`, `getBlock`, `getPublicSkill`). Every reader falls back to in-code content when the DB is unreachable, so a paused project never breaks the build.
- MCP server: `src/app/api/mcp/route.ts` (mcp-handler, Streamable HTTP, bearer auth via `src/lib/agentAuth.ts`). Tools: list/get/upsert/delete posts, list/set blocks, list/get/upsert skills, list messages, token management. Writes call `revalidatePath`, so content goes live without a deploy. Pages use `revalidate = 300` as a backstop.
- Public surfaces: `GET /SKILL.md` (public skill from `agent_skills.public`) and `POST /api/messages` (visitors or their agents leave a message).
- Agent skills in the DB (`voice`, `publishing`, `public`, `crm`) are the source of truth for how agents write and keep records here; edit them through the MCP rather than in code.

### Personal CRM (same DB, same MCP)

Tables `people`, `interactions`, `interaction_people`, `follow_ups` (schema `supabase/crm.sql`, skill seed `supabase/seed_crm_skill.sql`). Tools live in `src/app/api/mcp/crm.ts`: `find_people`, `get_person`, `upsert_person`, `delete_person`, `log_interaction`, `list_interactions`, `add_follow_up`, `list_follow_ups`, `set_follow_up_status`, `touch_queue`, `roll`, `link_message_to_person`. Model follows Friend Roulette: each person has a `circle` (inner/close/active/acquaintance/dormant → default cadence 14/30/90/180/none days); `overdue_ratio = days since last_contact_at ÷ cadence_days`; `roll` draws weighted by overdue². `last_contact_at` is maintained by a DB trigger on `interaction_people` (kind `note` does not count). `upsert_person` dedupes by id → email → exact name. This data is private and never rendered on the site.
