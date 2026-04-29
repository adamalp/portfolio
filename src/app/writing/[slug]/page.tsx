import { notFound } from "next/navigation";
import Link from "next/link";
import { writingPosts } from "@/lib/siteMap";

interface WritingPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return writingPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: WritingPostPageProps) {
  const { slug } = await params;
  const post = writingPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const postContent: Record<string, string[]> = {
  "marketplace-lessons": [
    "Seven years ago, my co-founder John and I walked onto college campuses in Rhode Island handing out rubber ducks and two-dollar bills to get people to download an app. Today, Pangea is an AI-native staffing platform connecting companies with fractional creative and marketing talent across 150+ countries. Here's what I learned along the way.",
    "Your first idea is almost certainly too narrow. We started with college students hiring college students. Both sides of the marketplace were the same demographic, with the same limited budgets and the same limited problems. It took us too long to realize that we'd boxed ourselves into a market where nobody was willing to pay enough to build a real business. The instinct to start small is right. The mistake is staying small because you're anchored to your original assumptions.",
    "Listen more than you sell. In the early days, we were very opinionated about what we thought the world wanted. We kept trying to sell our vision instead of listening to what the market was telling us. Two ears and one mouth, as the saying goes. The companies that wanted to hire through us had very different needs than what we'd imagined, and it took us too long to hear that.",
    "The supply side is not the hard side — until it is. When the pandemic hit, our supply side exploded. We went from a handful of Rhode Island schools to over 1,800 colleges across the US. But supply without demand is just a database. We had to put our own talent to work acquiring companies as clients before we had a real marketplace. The lesson: liquidity problems are never solved on just one side.",
    "Product-led vs. sales-led is not a permanent decision. YC encouraged us to think big and build for scale, which pushed us toward a product-led, self-serve model. But in a marketplace where trust and quality matter, being more sales-led, consultative, and curated would have served us better in those early years. Sometimes the fastest path to something huge is building a viable business first and scaling from a position of strength.",
    "Build the data infrastructure early. One of the best decisions I made was building out our data engineering architecture myself — dbt transformations, BigQuery, reverse ETL pipelines that activate data for marketing and operations. Having clean, reliable data lets you make decisions with confidence and automate the things that would otherwise eat your team alive.",
    "Great teams build great products. This is the whole thesis. If you can help assemble great teams, you can enable more great products to exist in the world. The old model of working at one company for decades is gone. People want flexibility, they want to work on interesting problems, and they want to progress.",
  ],
  "founder-communities": [
    "In an AI-first world where we're spending more and more time inside our computers, I think the most valuable thing you can invest in is the people you spend time with in person.",
    "I started the NYC Founders Club in 2022 with two friends from my YC batch — Akash and Mike. We weren't trying to build a business. We were trying to solve a problem we had ourselves: New York has an incredible density of founders, but that density actually works against you. The community gets diluted.",
    "So we built something curated. A dues-based social club, not an events platform. Members-only dinners weekly. Larger membership-wide events. And our annual tradition of buying out a ski mountain every February for 200 founders. The wider network has grown to over 5,000 people, but the core membership stays small — around 50 paid members — because that's what makes it work.",
    "The formula is simple: frequency and time. Relationships are built through repeated, meaningful interactions. Not one-off networking events where you collect business cards. Not Slack channels where messages disappear into noise. Actual time spent together, consistently, over months and years.",
    "Curation is the product. The value of the community is entirely a function of who's in it. We look for founders who share certain values: ambition, creativity, confidence, a willingness to make mistakes, and a high level of integrity and honesty with each other.",
    "IRL is the future, not the past. The more time we spend in our AI systems and behind our screens, the more valuable it becomes to come together in physical spaces with other humans. Finding community and spending meaningful time with people is a panacea to a lot of society's challenges — our polarization, our isolation, our tendency to retreat into technology.",
    "When I moved to Cambridge for MIT, I started the Cambridge Founders Club with the same thesis. The irony isn't lost on me: a distributed team building tools to facilitate in-person connection. But that's exactly the balance I think the world needs more of. Technology as the tool, human connection as the goal.",
  ],
  "ship-fast-systematize": [
    "One of the biggest mistakes I made in the early days of Pangea was trying to build the perfect product before we had users who cared. The instinct — to build it right the first time — cost us years.",
    "The lesson I eventually learned, and the principle I operate by now, is this: ship fast, then systematize. Get something into the world, see if anyone cares, and only then invest in building the systems to scale it.",
    "Speed is a feature. Y Combinator hammered this home. The entire batch is structured around one question: what can you accomplish between now and Demo Day? Pick a KPI, grow it week over week. That forcing function compressed our decision-making and cut through the noise.",
    "But speed without systems creates chaos. If all you do is move fast, you accumulate technical debt, operational debt, and organizational debt that eventually buries you. The companies that scale are the ones that know when to shift from exploration to systematization.",
    "AI has changed the equation. Right now, I run three different projects with nine active work streams. I'm reinventing Pangea's entire tech stack using AI coding agents to move faster than a traditional engineering team could. The \"ship fast\" part has gotten dramatically faster. You can go from idea to working prototype in hours, not weeks. But the \"systematize\" part is just as important as ever.",
    "Start with the smallest thing that could possibly work. No feature flags, no configurability, no abstraction layers. Just make it work. Talk to users immediately. Once you have signal, systematize ruthlessly. Build the data infrastructure, write the automations, create the dashboards. If you do something twice, automate it the third time.",
    "The future of building belongs to people who can move between creation and systematization fluidly — who know when to be scrappy and when to be rigorous. AI makes the fast part faster. But knowing what to build, and when to build it properly, is still the hard part.",
  ],
};

export default async function WritingPostPage({ params }: WritingPostPageProps) {
  const { slug } = await params;
  const post = writingPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const paragraphs = postContent[slug] ?? [post.excerpt];

  return (
    <div className="page" data-page="writing-detail">
      <section style={{ paddingTop: 64, paddingBottom: 32 }}>
        <div
          className="shell"
          style={{ maxWidth: 760 }}
        >
          <Link href="/writing" className="detail-back">
            ← All writing
          </Link>
          <div className="detail-eyebrow">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="dim">·</span>
            <span>{post.readingTime}</span>
            <span className="dim">·</span>
            <span>{post.tags.join(" · ")}</span>
          </div>
          <h1 className="title-1" style={{ marginBottom: 28 }}>
            {post.title}
          </h1>
          <p className="lede" style={{ marginBottom: 40 }}>
            {post.excerpt}
          </p>

          <article
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              fontFamily: "var(--font-serif)",
              fontSize: 20,
              lineHeight: 1.55,
              color: "var(--paper-dim)",
            }}
          >
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </article>

          <nav
            style={{
              marginTop: 64,
              paddingTop: 32,
              borderTop: "1px solid var(--line)",
            }}
          >
            <Link
              href="/writing"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                color: "var(--mute)",
              }}
              className="hover:text-[var(--ember)] transition-colors"
            >
              ← Back to all posts
            </Link>
          </nav>
        </div>
      </section>
    </div>
  );
}
