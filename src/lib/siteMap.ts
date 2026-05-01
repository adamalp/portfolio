export interface StoryChapter {
  slug: string;
  title: string;
  subtitle: string;
  year: string;
}

export interface ProjectFact {
  num: string;
  unit: string;
  label: string;
}

export interface SectionImage {
  src: string;
  alt: string;
  caption?: string;
  /** 'phone' for tall mobile-screen frame, 'wide' for landscape, 'square' for 1:1. Default 'wide'. */
  shape?: "phone" | "wide" | "square";
}

export interface ProjectSection {
  title: string;
  body: string[];
  images?: SectionImage[];
}

export interface ProjectFeature {
  /** short monospace label shown above the feature (e.g. "01 · ROUTING") */
  tag?: string;
  title: string;
  description: string;
}

export interface ProjectGallery {
  /** optional intro heading shown above the strip */
  heading?: string;
  /** optional kicker line above the heading */
  kicker?: string;
  /** optional intro paragraph */
  intro?: string;
  /** image shape — controls the aspect ratio of each frame. Default 'phone'. */
  shape?: "phone" | "wide" | "square";
  items: SectionImage[];
}

export interface BuildProject {
  slug: string;
  title: string;
  /** italicized suffix appended to the title (e.g. ".app", " Communities") */
  ital?: string;
  role: string;
  /** short blurb shown on cards */
  description: string;
  /** longer lede shown on detail page */
  lede?: string;
  /** display year/range (e.g. "2017 — Now") */
  year?: string;
  type: "company" | "tool";
  status: "active" | "completed" | "paused";
  /** image path under /public */
  image?: string;
  link?: string;
  tags?: string[];
  facts?: ProjectFact[];
  sections?: ProjectSection[];
  /** Features grid rendered between the facts strip and the hero image. */
  features?: ProjectFeature[];
  /** Optional eyebrow shown above the features grid (default "What's inside"). */
  featuresHeading?: string;
  /** Optional image showcase rendered after the deep-dive sections. */
  gallery?: ProjectGallery;
  /** Optional list of additional galleries — each renders as its own block. */
  galleries?: ProjectGallery[];
}

export interface Adventure {
  slug: string;
  title: string;
  subtitle: string;
  year: string;
}

export interface TimelineEntry {
  year: string;
  title: string;
  category: "story" | "build" | "adventure";
  link: string;
}

export interface WritingPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  tags: string[];
}

export const storyChapters: StoryChapter[] = [
  { slug: "upbringing",   title: "Upbringing",                    subtitle: "Early creativity, family, first experiments",      year: "1995–2013" },
  { slug: "brown",        title: "Brown University",              subtitle: "History, NOLS Alaska, first version of Pangea",     year: "2013–2017" },
  { slug: "rhode-island", title: "Rhode Island & Early Pangea",   subtitle: "Turning a student project into a company",          year: "2017–2020" },
  { slug: "yc",           title: "Y Combinator",                  subtitle: "W21 batch, compressing years of learning",          year: "2021" },
  { slug: "new-york",     title: "New York & Scaling Pangea",     subtitle: "Building the team, scaling the marketplace",        year: "2021–2024" },
  { slug: "mit",          title: "MIT Sloan & Cambridge",         subtitle: "MBA, Media Lab, founder communities",               year: "2025–" },
];

export const buildProjects: BuildProject[] = [
  {
    slug: "pangea",
    title: "Pangea",
    ital: ".app",
    role: "Co-founder & CEO",
    description:
      "The first AI-native staffing platform for fractional creative, marketing, and growth talent. Built from a Brown dorm room through YC to a profitable global marketplace.",
    lede: "The first AI-native staffing and recruiting platform, focused on fractional creative, marketing, and growth talent. Built from a Brown dorm room through Y Combinator to profitability.",
    year: "2017 — Now",
    type: "company",
    status: "active",
    image: "/images/early_pangea.JPG",
    link: "https://pangea.app",
    tags: ["Marketplace", "Next.js", "PostgreSQL", "BigQuery", "n8n", "Agentic"],
    facts: [
      { num: "150", unit: "+", label: "Countries" },
      { num: "$5", unit: "M GMV", label: "Annualized volume" },
      { num: "$3.3", unit: "M", label: "Total raised" },
      { num: "75", unit: "K+", label: "Talent network" },
    ],
    galleries: [
      {
        kicker: "Selected work · 2026",
        heading: "The agent-managed marketplace, from the operator's seat",
        intro:
          "Pangea's admin tooling for an AI-run talent marketplace — where a fleet of long-running agents proposes picks, drafts client emails, and advances jobs through every stage. Operators stay in the loop only when it matters.",
        shape: "wide",
        items: [
          {
            src: "/images/projects/pangea/admin-jobs-mission-control.png",
            alt: "Jobs Mission Control — admin queue surfacing every job that needs operator attention, with a recent-actions rail on the right",
            caption: "01 / Jobs · Mission Control — the queue is the product",
          },
          {
            src: "/images/projects/pangea/admin-pending-proposal.png",
            alt: "Pending proposal close-up — approve, reject, or let the timer run",
            caption: "02 / Pending Proposal — approve, reject, or let the timer run",
          },
          {
            src: "/images/projects/pangea/admin-job-cockpit.png",
            alt: "Job cockpit — pipeline + pending proposal + narrative activity timeline",
            caption: "03 / Job · Cockpit — everything the agent did, will do, and is waiting on",
          },
          {
            src: "/images/projects/pangea/admin-agent-trace.png",
            alt: "Agent run trace — step-by-step transparency on every tool call, token, and reasoning step",
            caption: "04 / Agent Run · Trace — every tool call, every token, every reasoning step",
          },
          {
            src: "/images/projects/pangea/admin-autonomy.png",
            alt: "Autonomy controls — Manual / Approval / Semi-auto / Full-auto with a live auto-execute countdown row",
            caption: "05 / Autonomy controls — manual to full-auto, with a yank cord on the way down",
          },
        ],
      },
    ],
    featuresHeading: "What we built — admin panel & agent features",
    features: [
      {
        tag: "01 · AGENTIC MATCHING",
        title: "AI-native matching engine",
        description:
          "The core of the platform: an agentic system that takes a job brief and surfaces the right talent across the network — accounting for skills, time zone, rate, history, and the soft signals that don't fit on a resume.",
      },
      {
        tag: "02 · INTERNAL AI AGENTS",
        title: "Ops agents in production",
        description:
          "A growing series of internal agents that run the unsexy work — sourcing, screening, follow-ups, contract drafting, payment reconciliation — so humans focus on the few decisions that actually move the marketplace.",
      },
      {
        tag: "03 · ADMIN OPERATIONS",
        title: "Operator console for the marketplace",
        description:
          "Internal admin surface for triaging jobs, intervening on matches, monitoring contracts and disputes, and watching the funnel in real time. The control room behind the marketplace.",
      },
      {
        tag: "04 · DATA INFRA",
        title: "dbt · BigQuery · reverse ETL",
        description:
          "I built the entire data engineering stack personally — dbt transformations, BigQuery as the warehouse, and reverse ETL pipelines that push activated data back into the tools that run growth and ops.",
      },
      {
        tag: "05 · AUTOMATION LAYER",
        title: "Hundreds of n8n flows",
        description:
          "The marketplace runs on a deep n8n automation layer — every repeatable operator task, every notification, every cross-system handoff. If we did it twice, we automated it the third time.",
      },
      {
        tag: "06 · CONTRACTS & PAYMENTS",
        title: "Native contracting + payouts",
        description:
          "Contracts and payments live inside the platform — start to scope to invoice to payout. Cross-border by default; 150+ countries served.",
      },
      {
        tag: "07 · TALENT NETWORK",
        title: "75K+ vetted creatives",
        description:
          "A global network of fractional creative, marketing, and growth talent — built over seven years from a college dorm to a profitable global marketplace.",
      },
      {
        tag: "08 · SHIPPING TO PROD",
        title: "CEO + engineer hybrid",
        description:
          "It's a different kind of CEO role: customer calls and service issues in the morning, code review and shipping new features in the afternoon, alongside the engineering team.",
      },
    ],
    sections: [
      {
        title: "The problem",
        body: [
          "Hiring is still very broken. But one thing that makes humans unique as a species is our ability to form teams, collaborate, and work together — it goes back to our foundational evolution. I wanted to make it easier to create opportunities for people to work together, particularly in creative, marketing, and growth fields.",
          "The old model — join a company, stay for 20 or 30 or 40 years — has gone away for most people. Right now, I personally run three different projects with nine active work streams across them. People can get a lot more done in a lot less time, and that's why fractional work is rising. Great teams build great products. If we can help assemble great teams, we can enable more great products to exist in the world.",
        ],
      },
      {
        title: "The journey",
        body: [
          "Pangea's evolution mirrors my own — learning to hire well, learning to build, and ultimately wanting to work on multiple things at once. We went from a college-focused mobile app to a professional fractional marketplace, and from handing out rubber ducks on campuses to working with companies hiring experienced AI-native talent across 150+ countries.",
          "Each phase forced us to rethink what we were building. The constant through all of it was the same conviction: the way people find and form teams is changing, and there should be a platform designed for how work actually happens now.",
        ],
      },
      {
        title: "The agentic matching system",
        body: [
          "The piece I'm proudest of is the matching engine — an AI-native system that takes a job brief from a company and runs it against the network with both a structured and a semantic pass. It's not a search box dressed up as AI; it's a real agentic loop that reasons about who in the network actually fits, surfaces a small short-list with rationale, and learns from the human-in-the-loop accept/reject signal.",
          "The reason it works is that we built it on top of seven years of marketplace data. The matching agent sees not just a profile, but a history — what someone has shipped, who they've worked with, how they showed up, how they got rated. The next generation of staffing is going to be built on signals like these, and very few companies have them.",
        ],
        images: [
          {
            src: "/images/projects/pangea/admin-pending-proposal.png",
            alt: "Pending proposal close-up — agent has selected 4 candidates and is awaiting human approval before sending picks to the client",
            caption: "Pending proposal · 4 picks awaiting approval, with rationale, fit scores, and per-candidate rates",
            shape: "wide",
          },
        ],
      },
      {
        title: "Internal AI agents for operations",
        body: [
          "Around the matching engine sits a series of internal agents that run the operations layer of the marketplace — sourcing, screening, contract drafting, payment reconciliation, follow-ups, dispute triage. Each one is a small, focused system that automates a previously human-shaped workflow and reports back to the operator console.",
          "Every run is fully traced: each tool call, each token, each reasoning step is captured against a parent_run_id so an operator can audit exactly what an agent did, why, and how much it cost. Autonomy is per-job and graduated — Manual → Approval → Semi-auto → Full-auto — with a yank cord on the way down for jobs that drift.",
          "The thesis is straightforward: the next decade of staffing platforms will be defined by how much of the coordination work the platform can absorb without losing trust. We're building toward a marketplace that runs itself for the high-volume cases and surfaces only the calls that genuinely need a human.",
        ],
        images: [
          {
            src: "/images/projects/pangea/admin-agent-trace.png",
            alt: "Agent run trace — each tool call (load_context, flag_risk, rematch_with_gambit, pick_talent, propose_action…) shown step-by-step with status, reasoning, tokens, and ms",
            caption: "Run trace · every tool call, every token, every reasoning step",
            shape: "wide",
          },
          {
            src: "/images/projects/pangea/admin-autonomy.png",
            alt: "Autonomy controls — four modes (Manual / Approval / Semi-auto / Full-auto) plus a live per-job auto-execute countdown",
            caption: "Autonomy controls · four modes with a yank cord on full-auto",
            shape: "wide",
          },
        ],
      },
      {
        title: "The admin panel",
        body: [
          "Behind the consumer-facing marketplace is an internal admin surface that lets the operations team intervene on any part of the funnel — re-route matches, override agent decisions, monitor active contracts and payments, watch funnel health in real time, and run targeted campaigns against the talent network.",
          "The hero of the admin is Mission Control: a single queue surfacing every job that needs you (proposals filed, escalations, things the agent flagged) alongside a live rail of recent agent actions. The cockpit page for any one job collapses everything an agent did, will do, and is waiting on into a single scroll — pipeline at the top, decisions in the middle, narrative activity at the bottom.",
          "It's the control room. Most of the marketplace runs without it — but when something breaks, when a customer needs intervention, when an experiment needs to be cut over, this is where it happens.",
        ],
        images: [
          {
            src: "/images/projects/pangea/admin-jobs-mission-control.png",
            alt: "Jobs Mission Control — full admin queue of active jobs with the agent's recent actions in a right-side rail",
            caption: "Mission Control · the queue is the product",
            shape: "wide",
          },
          {
            src: "/images/projects/pangea/admin-job-cockpit.png",
            alt: "Job cockpit — pipeline strip across the top, pending agent proposal in the middle, narrative activity timeline below",
            caption: "Job cockpit · everything the agent did, will do, and is waiting on",
            shape: "wide",
          },
        ],
      },
      {
        title: "Data infrastructure",
        body: [
          "I built out our entire data engineering architecture personally — dbt transformations, BigQuery warehousing, and reverse ETL pipelines that activate our data for marketing workflows. On top of that, hundreds of n8n automations keep the marketplace running.",
          "Now, with my technical abilities continuing to grow, I'm pushing new code and features directly to production. It's a different kind of CEO role — talking to customers and managing service issues in the morning, shipping code in the afternoon.",
        ],
      },
      {
        title: "What I actually did",
        body: [
          "Everything. I own the P&L, led fundraising, and set the strategic direction. But what makes my role unusual is how hands-on it's stayed. I've built the data infrastructure, managed customer relationships directly, developed the automation layer, designed the agent systems, and now I'm shipping production code alongside the engineering team.",
        ],
      },
    ],
  },
  {
    slug: "founder-communities",
    title: "Founder",
    ital: " Communities",
    role: "Founder",
    description:
      "Curated IRL networks in NYC and Cambridge — intimate dinners, real collisions, and a custom-built community OS I developed from scratch.",
    lede: "Curated IRL founder communities in NYC and Cambridge — intimate dinners, meaningful collisions, and a custom-built community OS (marketing site, member portal, admin CRM, and a dozen integrations) that I designed and ship as the sole engineer.",
    year: "2022 — Now",
    type: "company",
    status: "active",
    image: "/images/nycfc_ramp.JPG",
    tags: ["Community", "Events", "Next.js 16", "Supabase", "Stripe", "Luma", "Beehiiv", "Resend", "Inngest"],
    facts: [
      { num: "5,000", unit: "+", label: "Network" },
      { num: "50",    unit: "",  label: "Paid members" },
      { num: "200",   unit: "",  label: "Annual ski day" },
      { num: "2",     unit: "",  label: "Cities" },
    ],
    featuresHeading: "What I built into the platform",
    features: [
      {
        tag: "01 · MARKETING",
        title: "Public site & blog",
        description:
          "Next.js 16 marketing site with the public landing, an apply funnel, and event microsites (NYSki, NYSea). Blog posts come from Beehiiv's Posts API with cache-tag revalidation so a post.sent webhook updates the site instantly.",
      },
      {
        tag: "02 · MEMBER PORTAL",
        title: "Members-only dashboard",
        description:
          "Authenticated portal for paid members — home dashboard, member directory, journal, billing, and event history. Wrapped in a custom PortalShell with QueryProvider + AuthProvider.",
      },
      {
        tag: "03 · ADMIN CRM",
        title: "Operator dashboard",
        description:
          "An entire internal CRM at /overview · /events · /contacts · /applications · /payments · /memberships · /emails · /campaigns · /observability. Replaces the Notion + Airtable + Zapier sprawl I lived in for years.",
      },
      {
        tag: "04 · APPLICATIONS",
        title: "Application & interview funnel",
        description:
          "Full applicant pipeline — submit, schedule via Cal.com, interview recording + transcript, dinner invite, reminder, rejection, or membership initiation. Each stage is a single API endpoint that fans out the right emails and Stripe links.",
      },
      {
        tag: "05 · EVENTS",
        title: "Luma-synced event ops",
        description:
          "Luma is the source of truth for events and guest registrations. A full-sync script + real-time webhooks pull every event/guest into Supabase; guest approvals write back to Luma via a /api/guest-status proxy.",
      },
      {
        tag: "06 · EMAIL ENGINE",
        title: "Templated transactional + campaign email",
        description:
          "Resend for delivery; in-app template editor with previews and test-send; every send logged to email_sends so the admin can audit deliveries from inside the dashboard rather than chasing Resend's UI.",
      },
      {
        tag: "07 · BILLING",
        title: "Stripe checkout & memberships",
        description:
          "Stripe Checkout sessions for dinner tickets and memberships. Webhook handler reconciles customers, subscriptions, and payments back into Supabase; a backfill script imports existing Stripe history.",
      },
      {
        tag: "08 · BIDIRECTIONAL SYNC",
        title: "Luma ↔ Beehiiv ↔ Stripe ↔ Notion",
        description:
          "Every system that already had data got a bidirectional sync. Backfill scripts for each (Beehiiv subscribers, Stripe customers, Cal.com bookings, Resend history, Notion contacts), and webhooks for forward sync.",
      },
      {
        tag: "09 · BACKGROUND JOBS",
        title: "Inngest for everything async",
        description:
          "Inngest handles the work that doesn't belong on a request — sync jobs, retries, scheduled reminders, idempotent backfills. Local dev runs against the Inngest dev server.",
      },
    ],
    gallery: {
      kicker: "The IRL surface",
      heading: "The product is the room",
      intro:
        "The platform exists so the room can exist. Members-only dinners, larger gatherings, NYSki, NYSea, and the Cambridge Founders Club — the software's only job is to get the right people into the right room.",
      shape: "wide",
      items: [
        {
          src: "/images/projects/nycfc/event-pair.jpg",
          alt: "Two members at an NYC Founders Club event with sponsor signage in the background",
          caption: "Event night · members-only with sponsors in the wings",
        },
        {
          src: "/images/projects/nycfc/event-conversation.jpg",
          alt: "Member laughing in conversation at an NYCFC dinner",
          caption: "Dinner · the format that does the work",
        },
        {
          src: "/images/projects/nycfc/event-room.jpg",
          alt: "NYC Founders Club event room",
          caption: "Room shot · scale that still feels intimate",
        },
        {
          src: "/images/projects/nycfc/event-toast.jpg",
          alt: "Member raising a glass at an NYCFC gathering",
          caption: "Toasts · the ritual we keep",
        },
        {
          src: "/images/projects/nycfc/event-detail.jpg",
          alt: "Detail shot from an NYCFC event",
          caption: "Production · run by the same admin panel",
        },
        {
          src: "/images/projects/nycfc/event-listening.jpg",
          alt: "Members listening at an NYCFC event",
          caption: "Listening · the part the software can't do",
        },
      ],
    },
    galleries: [
      {
        kicker: "Marketing site · landing-v3",
        heading: "The brand on the public surface",
        intro:
          "Cream paper, cadmium-red Italic accents, sticker badges with hand-tape feel, and a calendar that doubles as the editorial backbone. Built as a self-contained HTML prototype before being ported into the production Next.js app.",
        shape: "wide",
        items: [
          {
            src: "/images/projects/nycfc/landing-hero.png",
            alt: "NYCFC landing hero — Real friends, one table, every Tuesday",
            caption: "Hero · the headline that does the work",
          },
          {
            src: "/images/projects/nycfc/landing-calendar.png",
            alt: "Public calendar listing the next NYCFC events",
            caption: "Live calendar · seats, status, and dates as the editorial spine",
          },
          {
            src: "/images/projects/nycfc/landing-bento.png",
            alt: "Bento grid: Founders dinners, Warm intros, Demo nights, Traditions, Private channels with a giant TUE serif watermark",
            caption: "Bento grid · giant TUE watermark over the membership pillars",
          },
          {
            src: "/images/projects/nycfc/landing-members.png",
            alt: "Member index strip: Founders you've already heard of, with rotated overlapping member cards",
            caption: "Member index · partial list, rotated cards, MEM-#### IDs",
          },
          {
            src: "/images/projects/nycfc/landing-quote.png",
            alt: "Big italic quote on a dark panel: 'You can be exactly who you are…'",
            caption: "Quote panel · the founding sentence, in Instrument Serif italic",
          },
        ],
      },
      {
        kicker: "Admin panel · operator console",
        heading: "Where the marketplace runs",
        intro:
          "Two of the densest screens in the admin: the applications pipeline (queue + selected-row detail panel) and event-night ops (guests + drag-to-seat chart). Both built on a shared design system — cadmium-on-cream, Instrument Serif italics for page titles, Inter Tight for tables.",
        shape: "wide",
        items: [
          {
            src: "/images/projects/nycfc/admin-applications.png",
            alt: "Admin applications screen: stage strip across the top, applicants table, right-side detail panel with pipeline visualization",
            caption: "Applications · stage strip, table, and right-side detail panel",
          },
          {
            src: "/images/projects/nycfc/admin-events.png",
            alt: "Admin event detail: guest table on the left, 2x2 seating chart on the right",
            caption: "Event night · guest table + drag-to-seat chart",
          },
        ],
      },
      {
        kicker: "Members portal",
        heading: "The member-facing surface",
        intro:
          "Calmer, more editorial. Paper background, minimal top nav, serif headlines with italic punch words. Three foundational screens: home (your next dinner), the directory (142 founders, 4 cohorts), and onboarding (the 60-second intro that lands on your nametag).",
        shape: "wide",
        items: [
          {
            src: "/images/projects/nycfc/portal-home.png",
            alt: "Member portal home: Welcome back, Adam — Founders Dinner №14 card, membership card, weekly feed",
            caption: "Home · 'Welcome back, Adam.' + your next dinner",
          },
          {
            src: "/images/projects/nycfc/portal-directory.png",
            alt: "Member directory: 142 founders / 4 cohorts, filter chips, 3-column member card grid",
            caption: "Directory · 142 founders, 4 cohorts, sector filters",
          },
          {
            src: "/images/projects/nycfc/portal-onboarding.png",
            alt: "Onboarding step 3: Tell the club what you're working on — company, role, stage, bio textarea, help-with tag cloud",
            caption: "Onboarding · the intro that shows up on your nametag",
          },
        ],
      },
    ],
    sections: [
      {
        title: "Why founder communities",
        body: [
          "I really value the people I spend time with. There's something important about finding people at a similar stage — a stage ahead, a stage behind — who share your values: ambition, creativity, confidence, willingness to make mistakes, and integrity. We wanted to create spaces where a small group of high-quality individuals could actually get to know each other over time.",
          "There's also a bigger thesis. In an AI-first world where we're spending more time inside our computers and AI systems, there will be increased value placed on coming together in real, physical spaces with other humans. The future isn't another feed. It's curated, intentional, in-person communities.",
        ],
      },
      {
        title: "NYC Founders Club",
        body: [
          "The wider network has grown to 5,000–6,000 individuals, with a core group of around 50 paid members. We host members-only dinners weekly, larger membership-wide gatherings, and 'founders and friends' events — including our annual tradition of buying out a ski mountain every February for 200 founders.",
          "We occasionally work with sponsors like JP Morgan, Rho, and Brex, but the community always comes first.",
        ],
        images: [
          {
            src: "/images/projects/nycfc/event-conversation.jpg",
            alt: "Member at an NYCFC event",
            caption: "Members at a recent dinner",
            shape: "wide",
          },
          {
            src: "/images/projects/nycfc/event-pair.jpg",
            alt: "Members at an NYCFC sponsored event",
            caption: "Sponsored membership event",
            shape: "wide",
          },
        ],
      },
      {
        title: "Cambridge Founders Club",
        body: [
          "When I moved to Cambridge for MIT, I took the same model and applied it with a lighter touch. The community focuses on connecting builders across MIT and Harvard — hosting dinners and creating spaces where people can genuinely get to know each other.",
        ],
      },
      {
        title: "The community OS — frontend",
        body: [
          "Next.js 16 App Router with route groups. (marketing) is the public site, the apply funnel, and event microsites. (portal) is the authenticated members surface — dashboard, directory, journal, billing — wrapped in PortalShell with QueryProvider + AuthProvider. (admin) is the operator CRM, gated by middleware that requires both auth and admin_users membership; non-admins get redirected to /dashboard.",
          "Public blog at /blog is powered by Beehiiv's Posts API with Next cache tags + ISR. A beehiiv-blog webhook calls revalidateTag() on post.sent and post.updated so newly-published posts go live without a redeploy. HTML is sanitized via sanitize-html and rendered through @tailwindcss/typography.",
        ],
        images: [
          {
            src: "/images/projects/nycfc/landing-hero.png",
            alt: "Marketing landing — Real friends, one table, every Tuesday",
            caption: "Marketing site · the public landing",
            shape: "wide",
          },
          {
            src: "/images/projects/nycfc/portal-home.png",
            alt: "Member portal home — Welcome back, Adam",
            caption: "Member portal · home dashboard",
            shape: "wide",
          },
        ],
      },
      {
        title: "The admin panel",
        body: [
          "The admin CRM is where the marketplace gets run. The applications screen is a stage strip across the top (one cell per ApplicationStage enum value, with live counts), a filterable table of applicants, and a right-side detail panel that slides in when a row is selected — pipeline visualization, interview notes, and the action stack (send dinner invite, send reminder, mark not a fit).",
          "Event night is its own surface: a guest table on the left (with inline approve/decline for pending guests) and a 2x2 seating chart on the right that you can drag guests into. Every admin action fires a Convex mutation that fans out to the right Stripe / Resend / Luma side effects.",
        ],
        images: [
          {
            src: "/images/projects/nycfc/admin-applications.png",
            alt: "Admin applications screen — stage strip, applicant table, right-side detail panel",
            caption: "Applications · pipeline, table, detail panel",
            shape: "wide",
          },
          {
            src: "/images/projects/nycfc/admin-events.png",
            alt: "Admin event detail with seating chart",
            caption: "Event night · guests + seating chart",
            shape: "wide",
          },
        ],
      },
      {
        title: "The community OS — backend & integrations",
        body: [
          "Supabase is the database. Every external system that already had data got a sync: Luma (events + guests), Beehiiv (subscribers + posts), Stripe (customers, subscriptions, payments), Cal.com (interview bookings), Resend (sent emails), Notion (legacy contact + application import).",
          "Forward sync is webhooks; backfills are idempotent scripts in /scripts. Inngest handles the work that doesn't belong on a request — sync jobs, retries, scheduled reminders. The application funnel is its own subsystem: each stage (invite-interview, send-dinner-invite, send-reminder, send-rejection, initiate-membership, recording-url, transcript) is a single endpoint that fans out the right side-effects.",
          "I've been the sole engineer through the entire build. Replacing the prior Zapier + Tally + Framer + Notion + Airtable patchwork with one cohesive system is what made the community model actually scalable.",
        ],
      },
    ],
  },
  {
    slug: "reprally",
    title: "Reprally",
    role: "Head of Product",
    description:
      "Product lead for a 3-sided CPG marketplace connecting brands, reps, and retail stores. Shipped SLA enforcement, self-service portals, and an AI-native cultural shift.",
    lede: "Led product for a three-sided CPG marketplace connecting emerging brands with independent sales reps and brick-and-mortar stores.",
    year: "2024 — 2025",
    type: "company",
    status: "completed",
    image: "/images/early_pangea_team.jpg",
    tags: ["Product", "Marketplace", "CPG", "n8n", "AI"],
    facts: [
      { num: "3",    unit: "-sided", label: "Marketplace" },
      { num: "2025", unit: "",       label: "Tenure" },
      { num: "1",    unit: "",       label: "Hackathon led" },
      { num: "AI",   unit: "",       label: "Native shift" },
    ],
    sections: [
      {
        title: "Context",
        body: [
          "Through my founder community work, I connected with a friend building a three-sided marketplace and scaling rapidly. They were looking for someone with experience in both marketplaces and startups. I joined as an AI consultant, and the role quickly expanded — I ended up managing their technical and design teams directly as Head of Product.",
        ],
      },
      {
        title: "What Reprally is",
        body: [
          "Reprally is a three-sided CPG marketplace connecting emerging brands with a network of independent sales reps who get those brands placed and distributed into brick-and-mortar and independently owned retail stores. It sits at the intersection of brand discovery, field sales, and retail distribution.",
        ],
      },
      {
        title: "Key product work",
        body: [
          "The biggest was overhauling SLA enforcement — new policies, tracking mechanisms, and data architecture to reduce SLA violations from brands. I also built out self-service portals so brands, reps, and stores could manage more of their own accounts. And I worked through a path toward a more managed marketplace model on the rep side.",
        ],
      },
      {
        title: "AI & automation",
        body: [
          "One of the things I'm most proud of was helping transform the organization's relationship with AI. I organized an internal hackathon focused on AI development and pushed to get all teams involved — operations, sales, support, not just engineers. The goal was to shift the culture toward being AI-native across the entire organization.",
        ],
      },
    ],
  },
  {
    slug: "clawviyo",
    title: "Clawviyo",
    role: "Creator",
    description:
      "The merchant control plane for inbound agent traffic. Trust pages, an MCP gateway, and a triage inbox so businesses can be reached — and qualified — by autonomous agents.",
    lede: "The merchant control plane for inbound agent traffic. Businesses get a public trust page, an MCP gateway, and a qualified-inquiry inbox — so the next generation of agents can find them, talk to them, and be filtered before a human is paged.",
    year: "2025 — Now",
    type: "tool",
    status: "active",
    link: "https://clawviyo.com",
    image: "/images/projects/clawviyo/hero.png",
    tags: ["Agents", "MCP", "Next.js", "Supabase", "TypeScript", "MIT AI Studio"],
    facts: [
      { num: "MCP", unit: "",  label: "Native gateway" },
      { num: "T0",  unit: "→T3", label: "Tiered auth" },
      { num: "1",   unit: "",  label: "Embed snippet" },
      { num: "0",   unit: "",  label: "Vendor lock-in" },
    ],
    featuresHeading: "What's in the platform",
    features: [
      {
        tag: "01 · TRUST PAGE",
        title: "Public trust page per merchant",
        description:
          "A public surface at clawviyo.com/c/<slug> that explains who the merchant is, what an agent can do here, and what the rules are. It's also where the .well-known endpoints (mcp.json, agent-card, llms.txt) live.",
      },
      {
        tag: "02 · MCP GATEWAY",
        title: "JSON-RPC MCP endpoint per merchant",
        description:
          "Each merchant gets a per-company MCP route. Initialize, tools/list, tools/call, tasks/get, notifications — protocol-version negotiated, batches supported, instructions injected on handshake.",
      },
      {
        tag: "03 · TIERED AUTH",
        title: "T0 → T3 credential gates",
        description:
          "Different tools demand different levels of trust from the calling agent — anonymous browse, identified agent, verified human-behind-the-agent, paying contract. Each tool declares the tier it needs.",
      },
      {
        tag: "04 · QUALIFICATION",
        title: "Per-tool schema scoring",
        description:
          "Inbound inquiries are scored against per-tool qualification schemas the merchant defines. Honeypots, disposable email, low-reputation requestors get filtered first; qualified ones are flagged and (when trust is high) fast-pathed.",
      },
      {
        tag: "05 · REPUTATION",
        title: "Per-(agent, merchant) reputation",
        description:
          "Every interaction updates a reputation score and writes an append-only signal row. Repeat agents earn trust on a per-merchant basis — no global blocklist, no global karma.",
      },
      {
        tag: "06 · EMBED BADGE",
        title: "One-line install snippet",
        description:
          "A <script> tag that drops a Clawviyo pill onto a merchant's site so agents (and humans) know there's an MCP entrypoint. The verify-install button confirms detection and surfaces an \"Integration live on {domain}\" pill on the trust page.",
      },
      {
        tag: "07 · ELICITATION",
        title: "Magic-link human verification",
        description:
          "When a tool needs a real human in the loop, the platform issues a magic-link to the email behind the agent. Resend handles delivery; the link logs to stdout in dev mode.",
      },
      {
        tag: "08 · TRIAGE INBOX",
        title: "Merchant dashboard + inquiry inbox",
        description:
          "A two-step onboarding (paste a URL → Claude scrapes name, description, industry, logo), a setup stepper (claim · trust page · install badge · see it work), and an inbox for qualified inquiries with reply.",
      },
      {
        tag: "09 · DISCOVERY",
        title: "Standard well-known endpoints",
        description:
          "Per-merchant .well-known/mcp.json, agent-card.json, agentfacts.json, oauth-protected-resource, sitemap.xml, llms.txt and llms-full.txt — so any agent crawler can find the merchant the same way.",
      },
    ],
    galleries: [
      {
        kicker: "Marketing landing",
        heading: "The public pitch",
        intro:
          "The marketing site does the explaining: why agents are the new search, the four-minute setup, the two pages (one for humans, one for agents) that share a single source of truth, and a deliberately calm pricing page that prices around inquiries — not seats.",
        shape: "wide",
        items: [
          {
            src: "/images/projects/clawviyo/landing-hero.png",
            alt: "Clawviyo landing hero — Get found by agents. Manage the leads they send.",
            caption: "Hero · 'Get found by agents. Manage the leads they send.'",
          },
          {
            src: "/images/projects/clawviyo/landing-seo.png",
            alt: "SEO is out section — your website was built for the last internet",
            caption: "Frame · the next reader doesn't read HTML",
          },
          {
            src: "/images/projects/clawviyo/landing-steps.png",
            alt: "Three steps — claim your slug, verify and describe, open your inbox",
            caption: "How · four minutes, three steps, one slug",
          },
          {
            src: "/images/projects/clawviyo/landing-twopages.png",
            alt: "Two pages, two audiences, one source of truth",
            caption: "Surface · human page and agent page in lockstep",
          },
          {
            src: "/images/projects/clawviyo/landing-trustfeat.png",
            alt: "Feature 01 — A trust page agents can actually parse, with code mock",
            caption: "Feature 01 · trust page agents can parse",
          },
          {
            src: "/images/projects/clawviyo/landing-inbox.png",
            alt: "Feature 02 — Inbound leads, pre-qualified, with inbox mock",
            caption: "Feature 02 · pre-qualified inbox",
          },
          {
            src: "/images/projects/clawviyo/landing-pricing.png",
            alt: "Pricing — Hatchling free, Shell $49/mo recommended, Reef $199/mo",
            caption: "Pricing · Hatchling · Shell · Reef",
          },
        ],
      },
      {
        kicker: "Trust page · clawviyo.com/c/[slug]",
        heading: "What an agent actually sees",
        intro:
          "The public trust page per merchant — verified business identity, callable tools with auth tier badges, recent fetch log, and the attestations Clawviyo has on file. Agents can fetch a parseable view at /.well-known/mcp.json; humans see the same data dressed up.",
        shape: "wide",
        items: [
          {
            src: "/images/projects/clawviyo/trust-hero.png",
            alt: "Trust page hero — Acme Plumbing & Heating, verified T2 merchant card",
            caption: "Hero · verified merchant card with provenance metadata",
          },
          {
            src: "/images/projects/clawviyo/trust-business.png",
            alt: "Trust page about-this-business + claim panel + attestations sidebar",
            caption: "About + claim panel + attestations",
          },
          {
            src: "/images/projects/clawviyo/trust-tools.png",
            alt: "Trust page callable tools list with auth tiers and recent fetches",
            caption: "Callable tools · with auth-tier badges and live fetch log",
          },
          {
            src: "/images/projects/clawviyo/trust-example.png",
            alt: "Trust page T2-verified post_inquiry + book_consultation + an example POST request body",
            caption: "Verified write tools + an example MCP request",
          },
        ],
      },
      {
        kicker: "Merchant dashboard & embed",
        heading: "How a merchant sets up",
        intro:
          "Behind the trust page is the merchant dashboard — a four-step setup (claim · trust page · install badge · see it work), a live preview of how agents will see you, and a tools-config surface for enabling per-merchant MCP tools. Plus the embed badge — the one-line snippet a merchant drops into their site so agents (and humans) know there's an MCP entrypoint.",
        shape: "wide",
        items: [
          {
            src: "/images/projects/clawviyo/dashboard.png",
            alt: "Merchant dashboard setup home — Nice work, Jamie. Two more steps and agents can find you.",
            caption: "Setup home · the four-card stepper",
          },
          {
            src: "/images/projects/clawviyo/dashboard-form.png",
            alt: "Write your trust page form with a live preview of the agent-facing card on the right",
            caption: "Step 03 · write your trust page, live agent preview",
          },
          {
            src: "/images/projects/clawviyo/dashboard-tools.png",
            alt: "Tools agents can call — toggleable list with T0/T1/T2 tier badges",
            caption: "Step 04 · enable the tools agents can call",
          },
          {
            src: "/images/projects/clawviyo/dashboard-proof.png",
            alt: "Attestations panel — what agents see as proof, with signed/verified rows",
            caption: "Attestations · the receipts agents check",
          },
          {
            src: "/images/projects/clawviyo/widget.png",
            alt: "Embed widget — the badge sites wear to say agents welcome here, light and dark variants",
            caption: "Embed widget · 'agents welcome here' on light & dark",
          },
        ],
      },
      {
        kicker: "Brand & mascot",
        heading: "Bilbo, the lobster mascot",
        intro:
          "Clawviyo's positioning is \"Cloudflare + HubSpot for agents\" — infrastructural, but soft enough that a small business will actually install it. The mascot does a lot of that warmth work.",
        shape: "wide",
        items: [
          {
            src: "/images/projects/clawviyo/hero.png",
            alt: "Clawviyo brand hero — pastel mountain landscape with the lobster mascot floating above a tiny figure",
            caption: "Brand hero · the mascot in the wild",
            shape: "wide",
          },
          {
            src: "/images/projects/clawviyo/mascot.png",
            alt: "Bilbo, the Clawviyo lobster mascot",
            caption: "Bilbo · soft front door for hard infrastructure",
            shape: "square",
          },
        ],
      },
    ],
    sections: [
      {
        title: "Why this exists",
        body: [
          "We are about to live in a world with thousands of useful agents — some inside companies, some run by vendors, some that you and I will spin up for an afternoon's work. The problem is that today every agent ecosystem is a walled garden. Your CRM agent doesn't know your support agent exists. Your design agent can't ask your data agent a question. The web's defining trick — discovery — hasn't happened yet for agents.",
          "Clawviyo started as the connective tissue between agents. As we built, we realized the load-bearing problem was on the merchant side: there was no clean way for a business to be reachable by agents at all. That's the layer we shipped first.",
        ],
        images: [
          {
            src: "/images/projects/clawviyo/landing-seo.png",
            alt: "SEO is out — your website was built for the last internet",
            caption: "The frame · the next reader doesn't read HTML",
            shape: "wide",
          },
        ],
      },
      {
        title: "What it does today",
        body: [
          "Three things. First, a public trust page per merchant — with all the well-known endpoints an agent crawler expects. Second, an MCP gateway: JSON-RPC 2.0 per company, with built-in tools (request_access, check_status, post_inquiry) plus per-merchant custom tools. Third, a triage pipeline that runs on every inquiry — tiered auth, honeypot and disposable-email filters, per-tool qualification scoring against a merchant-defined schema, reputation updates, and email notification.",
          "The merchant dashboard wraps it all: paste a URL, let Claude scrape your profile, walk through a four-step setup (claim → trust page → install badge → see it work), then sit in the inbox while agents start arriving. Embed snippet is a single <script> tag.",
        ],
        images: [
          {
            src: "/images/projects/clawviyo/landing-trustfeat.png",
            alt: "Trust page agents can actually parse",
            caption: "Trust page surface · what agents fetch via MCP",
            shape: "wide",
          },
          {
            src: "/images/projects/clawviyo/landing-inbox.png",
            alt: "Inbound leads, pre-qualified — inbox mock",
            caption: "Inquiry inbox · pre-qualified, tier-tagged",
            shape: "wide",
          },
        ],
      },
      {
        title: "The architecture",
        body: [
          "Next.js 16 App Router on Vercel; Supabase for Postgres, Auth, and storage. Two Supabase clients: a service-role client for every API route (RLS-bypassing, service-key-only) and an auth client (anon key + cookies) for dashboard pages.",
          "The MCP route is a thin wrapper that parses the JSON-RPC envelope, extracts agent headers, and delegates to a server module that handles dispatch and protocol negotiation. The runPostInquiry pipeline is the heart of the system: tiered-auth → filters → qualification → reputation → notification, with email failure deliberately non-blocking so the agent always gets a response.",
          "Discovery surfaces are static-ish — well-known endpoints generated per-merchant from shared builders in lib/discovery (llms-txt, skill-file). Onboarding scrape uses Claude Haiku 4.5 with forced tool-use to return a structured {name, description, industry, logo_url}, with an OG-meta-only fallback when the API key is unset.",
        ],
        images: [
          {
            src: "/images/projects/clawviyo/trust-tools.png",
            alt: "Trust page callable tools — auth tier badges, recent fetches, for-developers panel",
            caption: "Callable tools · auth tiers, fetch log, /.well-known/mcp.json link",
            shape: "wide",
          },
          {
            src: "/images/projects/clawviyo/dashboard-tools.png",
            alt: "Dashboard tool-config — toggleable per-merchant tools with tier badges",
            caption: "Dashboard · per-merchant tool config",
            shape: "wide",
          },
        ],
      },
      {
        title: "The merchant onboarding",
        body: [
          "Merchant onboarding is a deliberate four-step setup surface. Step 1 — claim a slug. Step 2 — verify and describe (Claude Haiku 4.5 scrapes the merchant's website to pre-fill name, description, industry, and logo). Step 3 — write the trust page (with a live preview of the agent-facing card to the right). Step 4 — see it work, where the dashboard polls for the first inbound inquiry from Claude or ChatGPT.",
          "Most merchants get from \"paste URL\" to \"agent can find me\" in under four minutes — which is also the marketing headline.",
        ],
        images: [
          {
            src: "/images/projects/clawviyo/dashboard.png",
            alt: "Merchant dashboard setup home — four-card stepper",
            caption: "Setup home · the four-card stepper",
            shape: "wide",
          },
          {
            src: "/images/projects/clawviyo/dashboard-form.png",
            alt: "Write your trust page form with live preview",
            caption: "Step 03 · with the live agent preview on the right",
            shape: "wide",
          },
        ],
      },
      {
        title: "The bigger thesis",
        body: [
          "Single-agent demos are a local maximum. The interesting work happens when many specialized agents collaborate — and that requires a piece of infrastructure that nobody currently sells you, because the major model vendors have an incentive to keep you inside their walled garden.",
          "If we get this right, the analogy is closer to DNS or Cloudflare than to a SaaS product — quietly load-bearing, universally useful, and most powerful when it's invisible.",
        ],
        images: [
          {
            src: "/images/projects/clawviyo/mascot.png",
            alt: "Bilbo the Clawviyo mascot",
            caption: "Bilbo · soft front door for hard infrastructure",
            shape: "square",
          },
        ],
      },
      {
        title: "Where it sits in my stack",
        body: [
          "Clawviyo is the most infrastructural of my current projects — narrower than Pangea, more ambitious in scope. I'm building it with Sophia out of MIT AI Studio. The agent products I want to build for Pangea, MyLogia, and the founder community OS all need a layer like this to exist, so we're building the layer.",
        ],
      },
    ],
  },
  {
    slug: "mylogia",
    title: "MyLogia",
    role: "Creator",
    description:
      "Voice-first AI thought partner with portable, git-backed memory you actually own. Designed to be the place where your thinking lives — and stays yours.",
    lede: "Voice-first AI thought partner with portable, git-backed memory you actually own — designed to be the place where your thinking lives, and stays yours. Tap once, talk, and the model thinks alongside you while everything writes itself into a versioned store you can fork, diff, and walk away with.",
    year: "2025 — Now",
    type: "tool",
    status: "active",
    link: "https://www.mylogia.com",
    tags: ["Voice", "iOS", "Hono", "Git-backed memory", "MCP", "Whisper"],
    facts: [
      { num: "1",   unit: "tap", label: "To start thinking" },
      { num: "100", unit: "%",   label: "User-owned memory" },
      { num: "git", unit: "",    label: "Versioned" },
      { num: "0",   unit: "",    label: "Lock-in" },
    ],
    featuresHeading: "What's inside",
    features: [
      {
        tag: "01 · VOICE-FIRST",
        title: "Tap to think",
        description:
          "One button. Talk. Listen. The model picks up the thread mid-sentence and asks the next useful question. Designed for walks, drives, and the 90 seconds between meetings.",
      },
      {
        tag: "02 · MEMORY · REMEMBER",
        title: "/remember endpoint",
        description:
          "Anything worth holding onto is committed to a per-agent memory repo, sorted into a category file (notes · interactions · preferences) with a timestamp.",
      },
      {
        tag: "03 · MEMORY · RECALL",
        title: "/recall endpoint",
        description:
          "Search across every memory file the agent has ever written. Returns matched lines with the file they came from — small, debuggable, and fast.",
      },
      {
        tag: "04 · MEMORY · REFLECT",
        title: "/reflect endpoint",
        description:
          "Aggregates the memory state — file count, line counts, recent git commits — so the model can reason about what it remembers, not just look up facts.",
      },
      {
        tag: "05 · GIT-BACKED",
        title: "Every write is a commit",
        description:
          "Memory is stored as Markdown files inside a git repo per agent. simple-git handles the writes; every remember() is a real commit you can diff, blame, revert, or push to your own remote.",
      },
      {
        tag: "06 · PORTABLE",
        title: "Open Markdown, exportable forever",
        description:
          "The format is plain text. The repo is yours. Export, fork, run through Claude or any other model — there's no proprietary index to leave behind. If MyLogia disappears, your second brain doesn't.",
      },
      {
        tag: "07 · MULTI-AGENT",
        title: "Per-agent registry & API keys",
        description:
          "Each agent registers, gets an API key (hashed at rest), and gets its own memory directory. Voice agents, planner agents, and downstream MCP clients can each carry their own slice of context.",
      },
      {
        tag: "08 · SAFE BY DESIGN",
        title: "Path-traversal-proof storage",
        description:
          "Agent IDs are sanitized before they touch the filesystem; auth middleware injects a verified agent ID so routes never trust user-supplied identity. Boring, deliberate, and the right level of paranoid for the data this stores.",
      },
    ],
    sections: [
      {
        title: "Where it came from",
        body: [
          "I have a lot of half-formed ideas. Some of them turn into companies. Most of them don't get to that stage because the friction between 'I had a thought' and 'I'm in a tool that can help me build on it' is too high. Notes apps don't push back. Chat apps don't remember. Journaling apps don't help you connect things.",
          "MyLogia is what I wished existed: a voice-first thought partner that listens, asks the right next question, and writes everything down in a memory store you actually own.",
        ],
      },
      {
        title: "Voice as the input",
        body: [
          "Typing collapses ideas — you self-edit before you've even finished a thought. Voice keeps you out of your own way. MyLogia is built around the idea that the highest-value 90 seconds of the day are usually a walk, a drive, a shower, or a moment between meetings, and the bar to capture and develop a thought in those moments needs to be effectively zero.",
          "Tap once. Talk. Listen. The model thinks alongside you, asks the question that pushes the idea forward, and the transcript becomes the source of truth.",
        ],
      },
      {
        title: "The memory architecture",
        body: [
          "Under the hood, MyLogia is a Hono service exposing four endpoints — /register, /remember, /recall, /reflect — backed by a per-agent git repo on disk. Every memory write is a real commit; every recall is a search across the agent's Markdown files; every reflection summarizes the corpus by counting files, lines, and the most recent commits.",
          "Three default category files seed each new agent — notes.md (general facts), interactions.md (notable events), preferences.md (patterns and habits). The model can write into any of them, or create new ones; categories are just filenames.",
          "Auth uses hashed API keys per agent and a middleware that injects a verified agentId so the route handlers never trust the body. Agent IDs are aggressively sanitized before they touch the filesystem — paranoia you don't notice until you need it.",
        ],
      },
      {
        title: "Why git, why Markdown",
        body: [
          "Two reasons. The first is technical: git gives you free version control, branching, diffing, and a built-in audit trail for an AI's read-write access to your private context. If a model writes something wrong, you can see exactly when, what was there before, and revert. That's an enormous safety property to get for free.",
          "The second is human: plain Markdown means the artifact survives the product. If MyLogia goes away tomorrow, you have a folder of files that any other tool — or any other person, including future-you — can pick up immediately. Memory portability is the architectural commitment underneath \"your inner life is yours.\"",
        ],
      },
      {
        title: "Why I'm building it",
        body: [
          "The same instinct that built Pangea and the founder communities — give people better tools for the parts of their lives that matter most. For ambitious people, the parts that matter most are usually thinking and relationships. MyLogia is my bet on the thinking side.",
          "It's also a deliberate counterweight to AI products that turn your data into someone else's business model. The whole product is shaped around the idea that your inner life is yours, and the architecture (git + Markdown + per-agent repos) is what makes that claim load-bearing instead of marketing.",
        ],
      },
    ],
  },
  {
    slug: "surviveai",
    title: "Survive",
    ital: "AI",
    role: "Creator",
    description:
      "Offline survival assistant. On-device LLM, vision, and speech-to-text. Zero connectivity required.",
    lede: "Offline survival assistant powered by on-device LLMs — a full agentic loop running on your phone with zero connectivity required. Voice in, voice and markdown out, with a real compass, GPS, and SOS-pattern flashlight built into the app.",
    year: "2025",
    type: "tool",
    status: "active",
    image: "/images/alaska_mammoth_husk.PNG",
    tags: ["React Native", "Expo", "Cactus SDK", "On-device LLM", "Whisper", "Zustand"],
    facts: [
      { num: "1.7", unit: "B",  label: "Params on-device" },
      { num: "0",   unit: "",   label: "Cloud calls" },
      { num: "3",   unit: "",   label: "Input modalities" },
      { num: "100", unit: "%",  label: "Offline" },
    ],
    featuresHeading: "What's in the app",
    features: [
      {
        tag: "01 · ASSISTANT",
        title: "On-device survival Q&A",
        description:
          "Natural-language survival questions answered by a local LLM (Qwen 1.7B via the Cactus SDK). Streams tokens, renders markdown, shows tokens-per-second so you trust what's happening.",
      },
      {
        tag: "02 · VOICE",
        title: "Hands-free speech-to-text",
        description:
          "Whisper running on-device for voice input — for the moments your hands are full, cold, or bloody. Mic button on the chat surface, no network round-trip.",
      },
      {
        tag: "03 · KNOWLEDGE TOOLS",
        title: "Grounded in FM 21-76",
        description:
          "The model can call into a local knowledge base via tool-use: first aid, water, shelter, fire, food, navigation, signaling, psychology — all derived from the US Army Survival Manual.",
      },
      {
        tag: "04 · CONTEXT",
        title: "Knows where it is",
        description:
          "Every prompt gets device context injected — GPS coordinates, elevation, battery, time of day. The model's answers are scoped to what's actually possible from where you stand.",
      },
      {
        tag: "05 · EMERGENCY FLOWS",
        title: "I'm Lost · I'm Injured · Wildlife",
        description:
          "Three pre-built flows for the moments you can't think. S.T.O.P. protocol when lost, triage when injured, animal-specific guidance for bears, cougars, and snakes.",
      },
      {
        tag: "06 · TOOLS",
        title: "Compass · GPS · SOS flashlight",
        description:
          "Real magnetometer compass, precise coordinates in multiple formats, and a flashlight with an actual SOS morse pattern. The tools you'd reach for first, in one place.",
      },
      {
        tag: "07 · CHECKLISTS",
        title: "Pre-built + custom checklists",
        description:
          "Common scenarios shipped as starter checklists; users can build their own. Progress persists locally so a dropped phone doesn't lose the loadout you built last week.",
      },
      {
        tag: "08 · OFFLINE FIRST",
        title: "No cloud, no signal needed",
        description:
          "Every model call, every search, every flashlight signal happens on-device. AsyncStorage for state. Zero network traffic by design — the whole app works in airplane mode at 12,000 feet.",
      },
    ],
    sections: [
      {
        title: "The idea",
        body: [
          "I've spent significant time in the wilderness and in regions with zero cellular connectivity. Sometimes you have questions out there — about health, cooking, plant identification, basic survival — that would be helpful to answer in the moment. With everything LLMs have compressed into their weights, it felt obvious that you should be able to access that knowledge without a cell tower.",
        ],
      },
      {
        title: "What I built",
        body: [
          "A React Native + Expo app running Qwen 1.7B on-device through the Cactus SDK, with tool-calling into a local knowledge base derived from the US Army Survival Manual (FM 21-76). The chat surface streams tokens, renders markdown, and shows live performance metrics. Whisper runs locally for hands-free speech input.",
          "Around the AI sits a hardware layer — a real magnetometer compass, GPS coordinates in multiple formats, a flashlight with an SOS morse pattern — plus three emergency flows (Lost, Injured, Wildlife) for the moments where free-text isn't the right interaction. State is held in Zustand, persisted with AsyncStorage. The whole thing works in airplane mode.",
        ],
      },
      {
        title: "Why it matters",
        body: [
          "This points to where the world is heading. As small language models become more powerful, there's a growing case for keeping compute on-device — for privacy, for cost efficiency, and for reliability. If you architect these systems well with agentic tool calling, they can be surprisingly capable even at small parameter counts.",
          "Beyond the wilderness use case, there's a broader infrastructure argument: systems that depend entirely on cloud connectivity are a single point of failure.",
        ],
      },
      {
        title: "What I learned",
        body: [
          "Building SurviveAI taught me a lot about the current capabilities and limitations of smaller parameter models, how to construct effective agentic tool-calling patterns at the edge, and how to design UX for high-stress situations where simplicity is everything. It was also a nice full-circle connection to those 40 days in Alaska where I had nothing but a topographical map and my own judgment.",
        ],
      },
    ],
  },
  {
    slug: "friend-roulette",
    title: "Friend",
    ital: " Roulette",
    role: "Creator",
    description:
      "A tiny iOS app that nudges you to reach out to the people you actually mean to keep up with. Pick contacts, set a cadence, roll the dice — everything stays on your phone.",
    lede: "A tiny iOS app that nudges you to reach out to the people you actually mean to keep up with — pick contacts, set a cadence, roll the dice. Everything stays on your phone.",
    year: "2025 — Now",
    type: "tool",
    status: "active",
    image: "/images/friend_roulette_icon.png",
    tags: ["iOS", "Expo / RN", "TypeScript", "SQLite", "On-device"],
    facts: [
      { num: "0",  unit: "",    label: "Servers" },
      { num: "1",  unit: "/day", label: "Local nudge" },
      { num: "100",unit: "%",   label: "On-device data" },
      { num: "4",  unit: "",    label: "Default cadences" },
    ],
    featuresHeading: "What's inside the app",
    features: [
      {
        tag: "01 · DAILY ROLL",
        title: "One friend a day",
        description:
          "A weighted-random draw surfaces one person from your circle each morning. The more overdue a contact, the heavier their card — but the roll keeps it feeling like a moment, not a chore list.",
      },
      {
        tag: "02 · CADENCE",
        title: "Weekly → yearly",
        description:
          "Assign each person a rhythm that matches the relationship. Cadence is stored in days under the hood, so \"every six weeks\" is simply 42.",
      },
      {
        tag: "03 · TAP TO REACH OUT",
        title: "Native handoff",
        description:
          "Send a text or place a call straight from the card. The app opens Messages or the phone dialer — no in-app inbox, no synthetic chat surface.",
      },
      {
        tag: "04 · LOCAL NUDGE",
        title: "9am notification",
        description:
          "A single local notification fires when someone is overdue. No push tokens, no backend, no engagement loop — just the prompt.",
      },
      {
        tag: "05 · SHAKE TO REROLL",
        title: "Not feeling it? Reroll.",
        description:
          "Shake the phone to draw a different friend. The card you skipped goes back into the deck weighted for tomorrow.",
      },
      {
        tag: "06 · ON-DEVICE ONLY",
        title: "Zero data collection",
        description:
          "No accounts, no servers, no analytics, no trackers. Apple's privacy label reads \"This app does not collect any data.\" That constraint is the whole product.",
      },
    ],
    gallery: {
      kicker: "App Store screens",
      heading: "Six screens, one idea",
      intro:
        "The marketing screens that ship to the App Store — each one is also the answer to a real question someone asked me about the app.",
      shape: "phone",
      items: [
        {
          src: "/images/projects/friend-roulette/01-hero.png",
          alt: "Today's roll: a card revealing the friend you're nudged to reach out to",
          caption: "01 · Today's roll",
        },
        {
          src: "/images/projects/friend-roulette/02-pick-people.png",
          alt: "Pick which contacts from your address book belong in the deck",
          caption: "02 · Pick the people",
        },
        {
          src: "/images/projects/friend-roulette/03-cadence.png",
          alt: "Choose a cadence — weekly, monthly, quarterly, yearly — per contact",
          caption: "03 · Set the cadence",
        },
        {
          src: "/images/projects/friend-roulette/04-tap-to-call.png",
          alt: "Tap to text or call hands off to the native Messages or phone app",
          caption: "04 · Native handoff",
        },
        {
          src: "/images/projects/friend-roulette/05-history.png",
          alt: "Per-friend history of past check-ins and notes",
          caption: "05 · A quiet record",
        },
        {
          src: "/images/projects/friend-roulette/06-private.png",
          alt: "Privacy-first: nothing leaves the device",
          caption: "06 · Private by design",
        },
      ],
    },
    sections: [
      {
        title: "The problem",
        body: [
          "We mean to call back. We mean to check in. We mean to send the text. But the people who don't live in front of us drift away — not because we don't care, but because nothing prompts us. Your existing apps are optimized for engagement with strangers, not for the slow work of staying close to people you already love.",
          "Friend Roulette is the prompt. Nothing more.",
        ],
      },
      {
        title: "How it works",
        body: [
          "You pick contacts from your phone book and assign each one a cadence — weekly, monthly, quarterly, or yearly. Every day, the app rolls the dice and surfaces one person from your circle who's due. Tap to text or call; it opens your normal Messages or phone app. Log the conversation with an optional note when you're done. A 9am local notification nudges you on days when someone's overdue, and shaking the phone rerolls.",
          "The picker is a weighted-random draw, not a queue: weight = overdueRatio², where overdueRatio = days since last contact ÷ frequency in days. People who are very overdue float to the top, but it's still a roll — so the app never feels like a chore list.",
        ],
        images: [
          {
            src: "/images/projects/friend-roulette/01-hero.png",
            alt: "Today's roll surfacing one friend from the deck",
            caption: "Today's roll · weighted draw, not a queue",
            shape: "phone",
          },
          {
            src: "/images/projects/friend-roulette/03-cadence.png",
            alt: "Per-contact cadence picker",
            caption: "Cadence picker · weekly through yearly",
            shape: "phone",
          },
        ],
      },
      {
        title: "Privacy as the architecture",
        body: [
          "Everything lives on your phone. No servers, no accounts, no analytics, no third-party trackers. The Contacts permission is read-only and used entirely on-device. Notifications are local-only — no push tokens to leak, no backend to compromise.",
          "Apple's privacy label for the app reads, truthfully, \"This app does not collect any data.\" That constraint is the whole product. A relationship-CRM that uploaded your address book would defeat its own purpose.",
        ],
        images: [
          {
            src: "/images/projects/friend-roulette/06-private.png",
            alt: "Privacy by design: data stays on the phone",
            caption: "Privacy is the product, not a feature",
            shape: "phone",
          },
        ],
      },
      {
        title: "The stack",
        body: [
          "Built on Expo SDK 54 with React Native and TypeScript. expo-sqlite for the local database (two tables: contacts and interactions, with cadence stored as days so \"every 6 weeks\" is just 42). expo-contacts for the address-book import. expo-notifications for the daily nudge. expo-sensors for shake-to-reroll. React Navigation for the native stack. EAS for TestFlight builds.",
          "Roughly a thousand lines of product code. The whole thing is a deliberate exercise in shipping the smallest viable version of an idea I've wanted to exist for years.",
        ],
      },
      {
        title: "Why it matters to me",
        body: [
          "I spend a lot of professional time thinking about how AI and software can manufacture connection. Friend Roulette is the personal version of that thesis. The most important relationships in my life aren't ones that any feed will surface or any agent will manage — they're with specific people who deserve a real check-in on a real cadence.",
          "If founder communities are the IRL bet on high-trust gatherings, Friend Roulette is the daily, ambient counterpart: a quiet local prompt that helps you stay close to the people you've already chosen.",
        ],
      },
    ],
  },
];

export const adventures: Adventure[] = [
  { slug: "nols-alaska",     title: "NOLS Alaska",     subtitle: "40 days in the Alaskan wilderness",         year: "2015" },
  { slug: "cotopaxi",        title: "Cotopaxi",        subtitle: "Summit attempt on Ecuador's highest volcano", year: "2026" },
  { slug: "ski-and-outdoor", title: "Ski & Outdoor",   subtitle: "Mountains as a recurring theme",            year: "Ongoing" },
];

export const timelineEntries: TimelineEntry[] = [
  { year: "1995", title: "Upbringing — kid filmmaker, first experiments", category: "story",     link: "/story/upbringing" },
  { year: "2013", title: "Start at Brown University",                     category: "story",     link: "/story/brown" },
  { year: "2015", title: "NOLS Alaska expedition",                        category: "adventure", link: "/adventures/nols-alaska" },
  { year: "2017", title: "Graduate Brown, go full-time on Pangea",        category: "story",     link: "/story/rhode-island" },
  { year: "2020", title: "Accepted into Y Combinator (W21)",              category: "story",     link: "/story/yc" },
  { year: "2021", title: "Move to NYC, scale Pangea",                     category: "story",     link: "/story/new-york" },
  { year: "2022", title: "Launch NYC Founders Club",                      category: "build",     link: "/projects/founder-communities" },
  { year: "2024", title: "NYC Founders Club paid membership",             category: "build",     link: "/projects/founder-communities" },
  { year: "2025", title: "Head of Product at Reprally",                   category: "build",     link: "/projects/reprally" },
  { year: "2025", title: "Start MIT Sloan",                               category: "story",     link: "/story/mit" },
  { year: "2025", title: "Launch SurviveAI",                              category: "build",     link: "/projects/surviveai" },
  { year: "2025", title: "Launch Clawviyo",                               category: "build",     link: "/projects/clawviyo" },
  { year: "2025", title: "Launch MyLogia",                                category: "build",     link: "/projects/mylogia" },
  { year: "2025", title: "Cambridge Founders Club",                       category: "build",     link: "/projects/founder-communities" },
  { year: "2025", title: "Launch Friend Roulette",                        category: "build",     link: "/projects/friend-roulette" },
  { year: "2026", title: "Cotopaxi summit",                               category: "adventure", link: "/adventures/cotopaxi" },
];

export const writingPosts: WritingPost[] = [
  {
    slug: "marketplace-lessons",
    title: "What I Learned Building a Marketplace",
    excerpt: "Seven years of lessons from Pangea on liquidity, trust, and scaling both sides.",
    date: "2026-03-22",
    readingTime: "8 min",
    tags: ["Marketplaces", "Pangea"],
  },
  {
    slug: "founder-communities",
    title: "Why I Build Founder Communities",
    excerpt: "Density, trust, and real relationships as leverage for ambitious people.",
    date: "2026-03-15",
    readingTime: "5 min",
    tags: ["Community Building"],
  },
  {
    slug: "ship-fast-systematize",
    title: "Ship Fast, Then Systematize",
    excerpt: "How to balance speed with sustainability when building products.",
    date: "2026-03-08",
    readingTime: "6 min",
    tags: ["AI & Product"],
  },
];

export const navItems = [
  { href: "/about",    label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/writing",  label: "Writing" },
  { href: "/contact",  label: "Contact" },
];

export const principles = [
  { title: "Ship fast, then systematize",                description: "Get to market quickly, then build the systems to scale." },
  { title: "Start from distribution, not just product",  description: "The best product loses to better distribution." },
  { title: "Automate what you repeat",                   description: "If you do it twice, automate it the third time." },
  { title: "Stay human: relationships > transactions",   description: "Real relationships compound; transactions don't." },
];

export interface HomeBelief {
  lead: string;
  ital?: string;
  detail: string;
}

export const homeBeliefs: HomeBelief[] = [
  {
    lead: "The future of work is",
    ital: "fractional.",
    detail:
      "AI makes small teams more powerful than large organizations. The best talent wants flexibility, autonomy, and the ability to work on multiple things at once.",
  },
  {
    lead: "Distribution beats",
    ital: "product.",
    detail:
      "The companies that win aren't the ones with the best features — they're the ones with the best networks and the deepest trust.",
  },
  {
    lead: "Real communities can't be built in",
    ital: "a feed.",
    detail:
      "Curated, in-person, high-trust networks are the antidote to algorithmic isolation — and they'll become more valuable, not less, in an AI-first world.",
  },
  {
    lead: "Ship fast, then",
    ital: "systematize.",
    detail:
      "Get to market, learn from actual customers, then build the systems to scale what works. Not the other way around.",
  },
];

export const homeStats = [
  { num: "150",   unit: "+",      label: "Countries served" },
  { num: "$3.3",  unit: "M",      label: "Capital raised" },
  { num: "5,000", unit: "+",      label: "Founders networked" },
  { num: "$5",    unit: "M GMV",  label: "Marketplace volume" },
];

export const affiliations = [
  { mark: "Y", name: "Y Combinator", meta: "W21" },
  { mark: "M", name: "MIT Sloan",    meta: "MBA '27" },
  { mark: "B", name: "Brown",        meta: "History '17" },
  { mark: "P", name: "Pangea.app",   meta: "Founder & CEO" },
];
