# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website with a tech-industrial aesthetic (dark/monochrome, blueprint/schematic, retro-tech). See `PROJECT_PLAN.md` for detailed implementation phases and component checklists.

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Content:** MDX for blog posts
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
│   ├── page.tsx           # Home
│   ├── projects/          # Projects listing and [slug] detail
│   ├── about/             # About/bio page
│   └── blog/              # Blog listing and [slug] posts
├── components/
│   ├── layout/            # Navigation, Footer, PageTransition
│   ├── ui/                # Design system (Button, TechTag, TerminalCard)
│   └── effects/           # Visual effects (GlitchText, TypewriterText, ScanlineOverlay, GridBackground)
├── content/
│   ├── projects/          # Project MDX/JSON files
│   └── blog/              # Blog post MDX files
└── lib/                   # Utilities, content loaders, types
```

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
- Blog and project content stored as MDX files in `content/`
- Effect components (glitch, scanlines, typewriter) wrap content and add CSS animations
- Framer Motion used for page transitions and component animations
