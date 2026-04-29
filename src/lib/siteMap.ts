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

export interface ProjectSection {
  title: string;
  body: string[];
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
        title: "What we built",
        body: [
          "Pangea is now the first AI-native staffing and recruiting platform. We've built an entire native experience from top of funnel through matching and payment. Our agentic matching system connects companies with high-quality talent, and we facilitate contracts and payments through the platform.",
          "We're building our own series of internal AI agents to manage operations as we scale — automating the coordination layer so we can focus on what matters: the quality of the match.",
        ],
      },
      {
        title: "Scaling the system",
        body: [
          "I built out our entire data engineering architecture personally — dbt transformations, BigQuery warehousing, and reverse ETL pipelines that activate our data for marketing workflows. On top of that, hundreds of automations keep the marketplace running.",
          "Now, with my technical abilities continuing to grow, I'm pushing new code and features directly to production. It's a different kind of CEO role — talking to customers and managing service issues in the morning, shipping code in the afternoon.",
        ],
      },
      {
        title: "What I actually did",
        body: [
          "Everything. I own the P&L, led fundraising, and set the strategic direction. But what makes my role unusual is how hands-on it's stayed. I've built the data infrastructure, managed customer relationships directly, developed the automation layer, and now I'm shipping production code alongside the engineering team.",
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
    lede: "Curated IRL founder communities in NYC and Cambridge — intimate dinners, meaningful collisions, and a custom-built platform I developed from scratch.",
    year: "2022 — Now",
    type: "company",
    status: "active",
    image: "/images/nycfc_ramp.JPG",
    tags: ["Community", "Events", "Next.js", "Supabase", "Resend"],
    facts: [
      { num: "5,000", unit: "+", label: "Network" },
      { num: "50",    unit: "",  label: "Paid members" },
      { num: "200",   unit: "",  label: "Annual ski day" },
      { num: "2",     unit: "",  label: "Cities" },
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
      },
      {
        title: "Cambridge Founders Club",
        body: [
          "When I moved to Cambridge for MIT, I took the same model and applied it with a lighter touch. The community focuses on connecting builders across MIT and Harvard — hosting dinners and creating spaces where people can genuinely get to know each other.",
        ],
      },
      {
        title: "The community OS",
        body: [
          "I custom-built our entire community platform from scratch — a full-stack Next.js + Supabase application where I've been the sole engineer. It handles applications, interview funnels, membership, and events. It integrates with Beehiiv for newsletters, Luma for events, and uses Resend and Inngest for transactional emails.",
          "Building it replaced a patchwork of Zapier, Tally, and Framer with something purpose-built and cohesive.",
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
      "Inter-agent collaboration middleware. A discovery, routing, and orchestration layer that lets autonomous agents from different vendors find and work with each other.",
    lede: "Inter-agent collaboration middleware — a discovery, routing, and orchestration layer that lets autonomous agents from different vendors find and work with each other.",
    year: "2025 — Now",
    type: "tool",
    status: "active",
    link: "https://clawviyo.com",
    tags: ["Agents", "Middleware", "MCP", "Orchestration", "TypeScript"],
    facts: [
      { num: "N", unit: "→N", label: "Agent topology" },
      { num: "0", unit: "",   label: "Vendor lock-in" },
      { num: "1", unit: "",   label: "Discovery surface" },
      { num: "MCP", unit: "", label: "Native protocol" },
    ],
    sections: [
      {
        title: "Why this exists",
        body: [
          "We are about to live in a world with thousands of useful agents — some inside companies, some run by vendors, some that you and I will spin up for an afternoon's work. The problem is that today every agent ecosystem is a walled garden. Your CRM agent doesn't know your support agent exists. Your design agent can't ask your data agent a question. The web's defining trick — discovery — hasn't happened yet for agents.",
          "Clawviyo is the layer that makes that trick possible. It's not another agent. It's the connective tissue between them.",
        ],
      },
      {
        title: "What it does",
        body: [
          "Three things. First, discovery: a registry where agents publish what they're good at and what tools they expose. Second, routing: when an agent has a sub-task it doesn't know how to do, Clawviyo helps it find the right counterparty and hand the work off. Third, orchestration: structured handshakes, capability negotiation, and accounting so multi-agent workflows actually finish — and you can see what happened.",
          "The protocol layer is MCP-native, so anything that already speaks MCP plugs in without a rewrite.",
        ],
      },
      {
        title: "The bigger thesis",
        body: [
          "Single-agent demos are a local maximum. The interesting work happens when many specialized agents collaborate, and that requires a piece of infrastructure that nobody currently sells you, because the major model vendors have an incentive to keep you inside their walled garden. That's the gap Clawviyo fills.",
          "If we get this right, the analogy is closer to DNS or HTTP than to a SaaS product — quietly load-bearing, universally useful, and most powerful when it's invisible.",
        ],
      },
      {
        title: "Where it sits in my stack",
        body: [
          "Clawviyo is the most infrastructural of my current side projects — narrower than Pangea, more ambitious in scope. I'm building it because the agent products I want to build for Pangea, MyLogia, and the founder community OS all need this layer to exist. So I'm building the layer.",
        ],
      },
    ],
  },
  {
    slug: "mylogia",
    title: "MyLogia",
    role: "Creator",
    description:
      "Voice-first AI thought partner with portable, version-controlled memory you actually own. Designed to be the place where your thinking lives — and stays yours.",
    lede: "Voice-first AI thought partner with portable, version-controlled memory you actually own — designed to be the place where your thinking lives, and stays yours.",
    year: "2025 — Now",
    type: "tool",
    status: "active",
    link: "https://www.mylogia.com",
    tags: ["Voice", "AI", "Memory", "Portable", "iOS"],
    facts: [
      { num: "1", unit: "tap",  label: "To start thinking" },
      { num: "100", unit: "%",  label: "User-owned memory" },
      { num: "v",   unit: "",   label: "Versioned" },
      { num: "0",   unit: "",   label: "Lock-in" },
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
        title: "Memory you actually own",
        body: [
          "The big architectural bet is portable, version-controlled memory. Everything MyLogia knows about you is stored in an open, exportable format that you can take with you, fork, snapshot, diff, and run through other tools. No proprietary lock-in. No vendor death-of-product taking your second brain with it.",
          "I think of memory as the most important agentic primitive of the next decade, and I don't trust any single vendor to own mine. Neither should you.",
        ],
      },
      {
        title: "Why I'm building it",
        body: [
          "The same instinct that built Pangea and the founder communities — give people better tools for the parts of their lives that matter most. For ambitious people, the parts that matter most are usually thinking and relationships. MyLogia is my bet on the thinking side.",
          "It's also a deliberate counterweight to AI products that turn your data into someone else's business model. The whole product is shaped around the idea that your inner life is yours.",
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
    lede: "Offline survival assistant powered by on-device LLMs — a full agentic loop running on your phone with zero connectivity required.",
    year: "2025",
    type: "tool",
    status: "active",
    image: "/images/alaska_mammoth_husk.PNG",
    tags: ["React Native", "On-device LLM", "Qwen 1.7B", "Vision", "Speech"],
    facts: [
      { num: "1.7", unit: "B",  label: "Params on-device" },
      { num: "0",   unit: "",   label: "Cloud calls" },
      { num: "3",   unit: "",   label: "Input modalities" },
      { num: "100", unit: "%",  label: "Offline" },
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
          "A React Native app running Qwen 1.7B on-device with tool calling to a local knowledge base, speech-to-text for hands-free interaction, and vision input so you can point your camera at something and ask about it. The entire system works offline — no cloud, no API calls, no signal needed.",
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
      },
      {
        title: "Privacy as the architecture",
        body: [
          "Everything lives on your phone. No servers, no accounts, no analytics, no third-party trackers. The Contacts permission is read-only and used entirely on-device. Notifications are local-only — no push tokens to leak, no backend to compromise.",
          "Apple's privacy label for the app reads, truthfully, \"This app does not collect any data.\" That constraint is the whole product. A relationship-CRM that uploaded your address book would defeat its own purpose.",
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
