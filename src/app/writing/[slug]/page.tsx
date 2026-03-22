import { notFound } from "next/navigation";
import Link from "next/link";
import { writingPosts } from "@/lib/siteMap";
import { TechTag } from "@/components/ui";

interface WritingPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return writingPosts.map((post) => ({
    slug: post.slug,
  }));
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const postContent: Record<string, string[]> = {
  "marketplace-lessons": [
    "Seven years ago, my co-founder John and I walked onto college campuses in Rhode Island handing out rubber ducks and two-dollar bills to get people to download an app. Today, Pangea is an AI-native staffing platform connecting companies with fractional creative and marketing talent across 150+ countries. Here's what I learned along the way.",
    "Your first idea is almost certainly too narrow. We started with college students hiring college students. Both sides of the marketplace were the same demographic, with the same limited budgets and the same limited problems. It took us too long to realize that we'd boxed ourselves into a market where nobody was willing to pay enough to build a real business. The instinct to start small is right. The mistake is staying small because you're anchored to your original assumptions.",
    "Listen more than you sell. In the early days, we were very opinionated about what we thought the world wanted. We kept trying to sell our vision instead of listening to what the market was telling us. Two ears and one mouth, as the saying goes. The companies that wanted to hire through us had very different needs than what we'd imagined, and it took us too long to hear that. Every hour spent talking to users is worth ten hours of building in isolation.",
    "The supply side is not the hard side — until it is. When the pandemic hit, our supply side exploded. We went from a handful of Rhode Island schools to over 1,800 colleges across the US. But supply without demand is just a database. We had to put our own talent to work acquiring companies as clients before we had a real marketplace. The lesson: liquidity problems are never solved on just one side.",
    "Product-led vs. sales-led is not a permanent decision. YC encouraged us to think big and build for scale, which pushed us toward a product-led, self-serve model. But in a marketplace where trust and quality matter, being more sales-led, consultative, and curated would have served us better in those early years. The right go-to-market strategy depends on where you are, not where you want to be. Sometimes the fastest path to something huge is building a viable business first and scaling from a position of strength.",
    "You have to evolve the product as you evolve the market. Moving from campus to professional talent wasn't just a market shift — it was a product shift. The matching algorithms, the onboarding flows, the pricing model, the way we thought about quality — everything had to change. The companies hiring AI-native marketing talent have completely different expectations than college students looking for a logo design. Every time the market evolves, the product has to follow.",
    "Build the data infrastructure early. One of the best decisions I made was building out our data engineering architecture myself — dbt transformations, BigQuery, reverse ETL pipelines that activate data for marketing and operations. Having clean, reliable data lets you make decisions with confidence and automate the things that would otherwise eat your team alive. Most early-stage founders underinvest in this.",
    "Great teams build great products. This is the whole thesis. If you can help assemble great teams, you can enable more great products to exist in the world. The old model of working at one company for decades is gone. People want flexibility, they want to work on interesting problems, and they want to progress. The organizations of the future might cap out at 100 or 200 people instead of 10,000 — but they'll still need to find and assemble great people. That's the problem worth solving, and it's the one I keep coming back to.",
  ],
  "founder-communities": [
    "In an AI-first world where we're spending more and more time inside our computers, I think the most valuable thing you can invest in is the people you spend time with in person.",
    "I started the NYC Founders Club in 2022 with two friends from my YC batch — Akash and Mike. We weren't trying to build a business. We were trying to solve a problem we had ourselves: New York has an incredible density of founders, but that density actually works against you. The community gets diluted. There are thousands of people at the very early stages of building something, and finding the ones who've raised venture funding, gone through serious programs, have real customers and revenue — that takes effort.",
    "So we built something curated. A dues-based social club, not an events platform. Members-only dinners weekly. Larger membership-wide events. And our annual tradition of buying out a ski mountain every February for 200 founders. The wider network has grown to over 5,000 people, but the core membership stays small — around 50 paid members — because that's what makes it work.",
    "The formula is simple: frequency and time. Relationships are built through repeated, meaningful interactions. Not one-off networking events where you collect business cards. Not Slack channels where messages disappear into noise. Actual time spent together, consistently, over months and years. That's what compounds.",
    "Curation is the product. The value of the community is entirely a function of who's in it. We look for founders who share certain values: ambition, creativity, confidence, a willingness to make mistakes, and a high level of integrity and honesty with each other. If you get that filter right, everything else — the events, the introductions, the serendipity — takes care of itself.",
    "IRL is the future, not the past. This might sound counterintuitive from someone who builds AI-powered platforms, but I believe the future isn't another feed or another social network. It's curated, intentional, in-person communities. The more time we spend in our AI systems and behind our screens, the more valuable it becomes to come together in physical spaces with other humans. Finding community and spending meaningful time with people is a panacea to a lot of society's challenges — our polarization, our isolation, our tendency to retreat into technology.",
    "When I moved to Cambridge for MIT, I started the Cambridge Founders Club with the same thesis: curate a group of ambitious people, create space for real connection, and see what compounds. Same model, new city. I built a full-stack application to support both communities — tracking applications, managing membership funnels, coordinating events — because even IRL communities benefit from great software behind the scenes.",
    "The irony isn't lost on me: a distributed team building tools to facilitate in-person connection. But that's exactly the balance I think the world needs more of. Technology as the tool, human connection as the goal.",
  ],
  "ship-fast-systematize": [
    "One of the biggest mistakes I made in the early days of Pangea was trying to build the perfect product before we had users who cared. We were opinionated about what the world wanted, and we invested heavily in custom software when we could have shipped something faster and simpler. That instinct — to build it right the first time — cost us years.",
    "The lesson I eventually learned, and the principle I operate by now, is this: ship fast, then systematize. Get something into the world, see if anyone cares, and only then invest in building the systems to scale it.",
    "Speed is a feature. Y Combinator hammered this home. The entire batch is structured around one question: what can you accomplish between now and Demo Day? Pick a KPI, grow it week over week. That forcing function compressed our decision-making and cut through the noise. But the insight isn't just about startups in an accelerator — it's about how you should approach any new project. The default mode for most builders is to over-engineer before they have signal. Resist that.",
    "But speed without systems creates chaos. Here's the tension: if all you do is move fast, you accumulate technical debt, operational debt, and organizational debt that eventually buries you. The companies that scale are the ones that know when to shift from exploration to systematization. You ship the scrappy version to prove the concept. Then you build the dbt transformations, the automation workflows, the dashboards, the proper architecture. The order matters.",
    "AI has changed the equation. This principle has taken on a completely new dimension with AI coding tools. Right now, I run three different projects with nine active work streams. I'm reinventing Pangea's entire tech stack — front end to back end — using AI coding agents to move faster than a traditional engineering team could. I'm building in Claude Code, shipping production features, and iterating at a speed that would have been impossible even a year ago.",
    "What this means is that the \"ship fast\" part has gotten dramatically faster. You can go from idea to working prototype in hours, not weeks. But the \"systematize\" part is just as important as ever. AI lets you generate code quickly — it doesn't automatically give you clean architecture, reliable data pipelines, or thoughtful product decisions. You still need the judgment layer.",
    "The framework I use now: Start with the smallest thing that could possibly work. No feature flags, no configurability, no abstraction layers. Just make it work. Talk to users immediately — not after launch, during development. The best product decisions come from watching someone use what you built and listening to what they say. Once you have signal, systematize ruthlessly. Build the data infrastructure, write the automations, create the dashboards. If you do something twice, automate it the third time. And keep your hands in the product. I still talk directly to customers and push code to production in the same day. That's not a phase — that's the model.",
    "The future of building belongs to people who can move between creation and systematization fluidly — who know when to be scrappy and when to be rigorous. AI makes the fast part faster. But knowing what to build, and when to build it properly, is still the hard part.",
  ],
};

export default async function WritingPostPage({ params }: WritingPostPageProps) {
  const { slug } = await params;
  const post = writingPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const paragraphs = postContent[slug] || [];

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/writing"
          className="inline-flex items-center gap-2 font-mono text-sm text-muted hover:text-primary transition-colors mb-8"
        >
          ← Back to writing
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-4 font-mono text-xs text-muted mb-4">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="text-border">|</span>
            <span>{post.readingTime}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-mono font-bold text-text mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <TechTag key={tag}>{tag}</TechTag>
            ))}
          </div>
        </header>

        {/* Article content */}
        <article className="space-y-6">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-muted leading-relaxed">
              {paragraph}
            </p>
          ))}
        </article>

        {/* Back navigation */}
        <nav className="mt-16 pt-8 border-t border-border">
          <Link
            href="/writing"
            className="font-mono text-sm text-muted hover:text-primary transition-colors"
          >
            ← Back to all posts
          </Link>
        </nav>
      </div>
    </div>
  );
}
