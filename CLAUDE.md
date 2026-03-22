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

All content data lives in `src/lib/siteMap.ts` — not in MDX files or separate content directories. This includes:
- `navItems` — navigation links
- `storyChapters` — 6 life chapters with slugs, titles, years
- `buildProjects` — projects with roles, descriptions, status
- `adventures` — adventure entries
- `timelineEntries` — chronological events (link to story/project/adventure pages)
- `writingPosts` — blog post metadata

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
