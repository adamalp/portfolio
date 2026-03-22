export interface StoryChapter {
  slug: string;
  title: string;
  subtitle: string;
  year: string;
}

export interface BuildProject {
  slug: string;
  title: string;
  role: string;
  description: string;
  type: "company" | "tool";
  status: "active" | "completed" | "paused";
  link?: string;
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
  {
    slug: "upbringing",
    title: "Upbringing",
    subtitle: "Early creativity, family, first experiments",
    year: "1995–2013",
  },
  {
    slug: "brown",
    title: "Brown University",
    subtitle: "History, NOLS Alaska, first version of Pangea",
    year: "2013–2017",
  },
  {
    slug: "rhode-island",
    title: "Rhode Island & Early Pangea",
    subtitle: "Turning a student project into a company",
    year: "2017–2020",
  },
  {
    slug: "yc",
    title: "Y Combinator",
    subtitle: "W21 batch, compressing years of learning",
    year: "2021",
  },
  {
    slug: "new-york",
    title: "New York & Scaling Pangea",
    subtitle: "Building the team, scaling the marketplace",
    year: "2021–2024",
  },
  {
    slug: "mit",
    title: "MIT Sloan & Cambridge",
    subtitle: "MBA, Media Lab, founder communities",
    year: "2025–",
  },
];

export const buildProjects: BuildProject[] = [
  {
    slug: "pangea",
    title: "Pangea",
    role: "Co-founder & CEO",
    description:
      "Scaling a global marketplace connecting top marketing and design talent with high-impact freelance and contract work. Built from a Brown dorm room through YC to profitability.",
    type: "company",
    status: "active",
    link: "https://pangea.app",
  },
  {
    slug: "founder-communities",
    title: "Founder Communities",
    role: "NYC & Cambridge Founders Clubs",
    description:
      "Curating high-signal founder communities in New York and Cambridge — intimate dinners, meaningful collisions, and a product layer to keep people connected.",
    type: "company",
    status: "active",
  },
  {
    slug: "reprally",
    title: "Reprally",
    role: "Head of Product",
    description:
      "Led product for a 3-sided CPG marketplace connecting brands, reps, and stores. Shipped SLA changes, self-service portal, and managed marketplace transition.",
    type: "company",
    status: "completed",
  },
  {
    slug: "surviveai",
    title: "SurviveAI",
    role: "Creator",
    description:
      "Offline survival assistant powered by on-device LLMs. React Native app with Qwen 1.7B, tool calling, speech-to-text, and vision input.",
    type: "tool",
    status: "active",
  },
];

export const adventures: Adventure[] = [
  {
    slug: "nols-alaska",
    title: "NOLS Alaska",
    subtitle: "40 days in the Alaskan wilderness",
    year: "2015",
  },
  {
    slug: "cotopaxi",
    title: "Cotopaxi",
    subtitle: "Summit attempt on Ecuador's highest volcano",
    year: "2026",
  },
  {
    slug: "ski-and-outdoor",
    title: "Ski & Outdoor",
    subtitle: "Mountains as a recurring theme",
    year: "Ongoing",
  },
];

export const timelineEntries: TimelineEntry[] = [
  { year: "1995", title: "Upbringing — kid filmmaker, first experiments", category: "story", link: "/story/upbringing" },
  { year: "2013", title: "Start at Brown University", category: "story", link: "/story/brown" },
  { year: "2015", title: "NOLS Alaska expedition", category: "adventure", link: "/adventures/nols-alaska" },
  { year: "2017", title: "Graduate Brown, go full-time on Pangea", category: "story", link: "/story/rhode-island" },
  { year: "2020", title: "Accepted into Y Combinator (W21)", category: "story", link: "/story/yc" },
  { year: "2021", title: "Move to NYC, scale Pangea", category: "story", link: "/story/new-york" },
  { year: "2022", title: "Launch NYC Founders Club", category: "build", link: "/projects/founder-communities" },
  { year: "2024", title: "NYC Founders Club paid membership", category: "build", link: "/projects/founder-communities" },
  { year: "2025", title: "Head of Product at Reprally", category: "build", link: "/projects/reprally" },
  { year: "2025", title: "Start MIT Sloan", category: "story", link: "/story/mit" },
  { year: "2025", title: "Launch SurviveAI", category: "build", link: "/projects/surviveai" },
  { year: "2025", title: "Cambridge Founders Club", category: "build", link: "/projects/founder-communities" },
  { year: "2026", title: "Cotopaxi summit", category: "adventure", link: "/adventures/cotopaxi" },
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
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/writing", label: "Writing" },
  { href: "/contact", label: "Contact" },
];

export const principles = [
  {
    title: "Ship fast, then systematize",
    description: "Get to market quickly, then build the systems to scale.",
  },
  {
    title: "Start from distribution, not just product",
    description: "The best product loses to better distribution.",
  },
  {
    title: "Automate what you repeat",
    description: "If you do it twice, automate it the third time.",
  },
  {
    title: "Stay human: relationships > transactions",
    description: "Real relationships compound; transactions don't.",
  },
];
