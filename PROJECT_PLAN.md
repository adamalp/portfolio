# AdamAlpert.com - Project Plan

## Overview

Personal portfolio for Adam Alpert — founder, builder, and operator. The site showcases products, companies, communities, and personal adventures with a founder-operator lens.

**Hero line:** "I build products, communities, and companies."
**Tone:** Founder-operator, technical, thoughtful, approachable.
**Stack:** Next.js 16 + TypeScript + Tailwind CSS + MDX
**Hosting:** Vercel
**Status:** Restructuring

---

## Site Architecture

```
/                           → Home (hero + what I'm doing now + principles)
/story                      → Story overview (narrative + chapter links)
  /story/upbringing         → Origin story
  /story/brown              → Brown University + NOLS
  /story/rhode-island       → Post-grad + early Pangea
  /story/yc                 → Y Combinator W21
  /story/new-york           → NYC + scaling Pangea
  /story/mit                → MIT Sloan + Cambridge
/build                      → Build overview (Companies + Tools grid)
  /build/pangea             → Pangea case study
  /build/founder-communities → NYC + Cambridge Founders Clubs
  /build/reprally           → Head of Product role
  /build/surviveai          → Personal AI project
/adventures                 → Adventures overview
  /adventures/nols-alaska   → 40-day NOLS expedition
  /adventures/cotopaxi      → Cotopaxi summit
  /adventures/ski-and-outdoor → Skiing + mountains
/writing                    → Essays/notes hub
  /writing/[slug]           → Individual posts (MDX)
/timeline                   → Chronological life/work view
/contact                    → Work with me / get in touch
```

---

## Design System

### Color Palette (adjusted for founder aesthetic)
| Name       | Hex       | Usage                        |
|------------|-----------|------------------------------|
| Background | `#05070A` | Page backgrounds (darker)    |
| Surface    | `#0d1117` | Cards, elevated elements     |
| Border     | `#1a1a1a` | Subtle borders, grid lines   |
| Grid       | `#2a2a2a` | Blueprint grid overlay       |
| Text       | `#e0e0e0` | Primary text                 |
| Muted      | `#666666` | Secondary text, annotations  |
| Primary    | `#00ffcc` | Highlights, links, accents   |
| Secondary  | `#00ff88` | Terminal green, success      |
| Accent     | `#ff3366` | Warnings, important callouts |

### Typography
- **Headings:** JetBrains Mono (monospace)
- **Body:** Inter (sans-serif)
- **Code:** JetBrains Mono

---

## Navigation

### Top Nav
- Home
- Story
- Build
- Adventures
- Writing
- Timeline
- Contact

### Persistent CTA
- "Work with me" or "Say hi" button (top-right)

### Footer
- Short bio + email + LinkedIn + GitHub

---

## Page Specifications

### Home (`/`)

**Hero Section:**
- H1: "I build products, communities, and companies."
- Subheadline: "I'm Adam Alpert — a founder and builder focused on marketplaces, AI-powered products, and high-trust founder communities."
- CTAs: "View what I build" → `/build`, "Read my story" → `/story`

**What I'm Doing Now (3 cards):**
1. **Pangea.app** - Co-founder & CEO
   - Scaling a global marketplace for marketing/design talent
   - Link: `/build/pangea`
2. **Founder Communities** - NYC & Cambridge Founders Clubs
   - Curating high-signal founder communities
   - Link: `/build/founder-communities`
3. **MIT Sloan** - MBA Candidate, Class of 2027
   - AI, marketplaces, organizational design
   - Link: `/story/mit`

**How I Build (principles list):**
- Ship fast, then systematize
- Start from distribution, not just product
- Automate what you repeat
- Stay human: relationships > transactions

**Featured Sections (card links):**
- `/build` – "Things I've built"
- `/story` – "How I got here"
- `/adventures` – "Outside the office"
- `/writing` – "Essays & notes"

---

### Story Overview (`/story`)

**Hero:**
- Title: "My story"
- Intro paragraph about the journey from kid filmmaker to founder

**Chapters (vertical timeline):**
1. Upbringing → `/story/upbringing`
2. Brown University → `/story/brown`
3. Rhode Island & Early Pangea → `/story/rhode-island`
4. Y Combinator → `/story/yc`
5. New York & Scaling Pangea → `/story/new-york`
6. MIT Sloan & Cambridge → `/story/mit`

---

### Build Overview (`/build`)

**Layout:** Grid of project cards under two headings

**Companies & Platforms:**
- Pangea → `/build/pangea`
- Founder Communities → `/build/founder-communities`
- Reprally → `/build/reprally`

**Tools & Experiments:**
- SurviveAI → `/build/surviveai`
- (Future projects)

---

### Adventures Overview (`/adventures`)

**Intro:** Why pushing yourself outside work matters

**Cards:**
- NOLS Alaska → `/adventures/nols-alaska`
- Cotopaxi → `/adventures/cotopaxi`
- Ski & Outdoor → `/adventures/ski-and-outdoor`

---

### Writing (`/writing`)

**Intro:** "I write to clarify my own thinking about marketplaces, founder communities, and how teams actually work in practice."

**Layout:** List of posts with filters/tags:
- Marketplaces
- Community building
- AI & product
- Personal reflections

---

### Timeline (`/timeline`)

**Layout:** Interactive vertical timeline with:
- Year
- Title
- Category (story / build / adventure)
- Link to relevant page

**Key entries:**
- 2013 – Start at Brown University
- 2015 – NOLS Alaska expedition
- 2017 – Graduate Brown, go full-time on Pangea
- 2020 – Accepted into Y Combinator (W21)
- 2021-2024 – Scaling Pangea, NYC community building
- 2024 – Launch NYC Founders Club as paid membership
- 2025 – Head of Product at Reprally
- 2025 – Start MIT Sloan
- 2025 – Launch SurviveAI

---

### Contact (`/contact`)

**Intro:** Open to conversations about product, marketplaces, founder communities

**Ways to collaborate:**
- Advising / consulting on product & marketplaces
- Speaking or panels
- Joining or partnering with founder communities

**Contact methods:**
- Email (primary)
- LinkedIn
- Optional simple form

---

## Implementation Phases

### Phase 1: Restructure Routes ⏳
- [ ] Remove old routes (`/projects`, `/about`, `/blog`)
- [ ] Create new route structure with layouts
- [ ] Create `content/siteMap.ts` for central navigation config
- [ ] Update Navigation component with new links
- [ ] Update Footer component

### Phase 2: Home Page Redesign ⏳
- [ ] New hero with updated copy
- [ ] "What I'm doing now" 3-card section
- [ ] "How I build" principles section
- [ ] Featured sections cards
- [ ] Adjust background color to `#05070A`

### Phase 3: Story Section ⏳
- [ ] Story overview page with chapter timeline
- [ ] Story layout component
- [ ] Individual chapter pages (6 pages)
- [ ] Chapter navigation (prev/next)

### Phase 4: Build Section ⏳
- [ ] Build overview page with grid
- [ ] Build layout component
- [ ] Pangea case study page
- [ ] Founder Communities page
- [ ] Reprally page
- [ ] SurviveAI page

### Phase 5: Adventures Section ⏳
- [ ] Adventures overview page
- [ ] Adventures layout component
- [ ] NOLS Alaska page
- [ ] Cotopaxi page
- [ ] Ski & Outdoor page

### Phase 6: Writing Section ⏳
- [ ] Writing overview page with filters
- [ ] MDX blog post rendering
- [ ] Sample posts with real content

### Phase 7: Timeline ⏳
- [ ] Timeline page with interactive component
- [ ] Timeline data from siteMap config
- [ ] Category filtering/highlighting

### Phase 8: Contact ⏳
- [ ] Contact page layout
- [ ] Contact form (optional)
- [ ] Email/LinkedIn links

### Phase 9: Polish ⏳
- [ ] Responsive testing
- [ ] Page transitions
- [ ] Loading states
- [ ] SEO metadata per page
- [ ] OG images

### Phase 10: Content ⏳
- [ ] Write real content for all pages
- [ ] Add photos/images
- [ ] Proofread and refine

---

## Data Architecture

### `content/siteMap.ts`
Central config for all pages:
```typescript
export const siteMap = {
  story: [
    { slug: "upbringing", title: "Upbringing", year: "1995-2013" },
    { slug: "brown", title: "Brown University", year: "2013-2017" },
    // ...
  ],
  build: [
    { slug: "pangea", title: "Pangea", type: "company", status: "active" },
    // ...
  ],
  adventures: [...],
  timeline: [...],
}
```

### Content Files
- `/content/story/*.mdx` – Story chapter content
- `/content/build/*.mdx` – Project case studies
- `/content/adventures/*.mdx` – Adventure stories
- `/content/writing/*.mdx` – Blog posts

---

## Components to Build/Update

### New Components
- [ ] `<ChapterNav />` – Prev/next navigation for story chapters
- [ ] `<ProjectCard />` – Updated for build section (company vs tool)
- [ ] `<TimelineView />` – Interactive timeline component
- [ ] `<PrinciplesList />` – "How I build" principles
- [ ] `<ContactForm />` – Simple contact form
- [ ] `<CategoryFilter />` – Filter for writing/timeline

### Update Existing
- [ ] `<Navigation />` – New routes
- [ ] `<Footer />` – New bio + links
- [ ] `<SectionHeader />` – Works with new sections
- [ ] Home page – Complete redesign

---

## Notes

### 2025-12-06 - Initial Build
- Set up Next.js 16 with TypeScript and Tailwind CSS v4
- Created base components and design system
- Built generic portfolio structure

### 2025-12-06 - Revised Plan
- Received comprehensive site spec from Adam
- Restructuring from generic developer portfolio to founder-focused personal site
- New routes: /story, /build, /adventures, /writing, /timeline, /contact
- More personal, narrative-driven content structure

---

**Last Updated:** 2025-12-06
