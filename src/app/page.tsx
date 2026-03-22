"use client";

import Link from "next/link";
import { TypewriterText, GlitchText } from "@/components/effects";
import { Button, SectionHeader, TerminalCard } from "@/components/ui";
import { homeBeliefs } from "@/lib/siteMap";

const currentFocus = [
  {
    title: "Pangea.app",
    role: "Co-founder & CEO",
    description:
      "The first AI-native staffing platform for fractional creative, marketing, and growth talent. Built from a Brown dorm room through YC to a profitable marketplace operating in 150+ countries. I do everything — strategy, data engineering, shipping code, talking to customers.",
    link: "/projects/pangea",
  },
  {
    title: "Founder Communities",
    role: "NYC & Cambridge Founders Clubs",
    description:
      "Curated IRL founder networks in New York and Cambridge — intimate dinners, meaningful collisions, and a custom-built platform I developed from scratch. The NYC network has grown to 5,000+ with ~50 paid members.",
    link: "/projects/founder-communities",
  },
  {
    title: "MIT Sloan",
    role: "MBA Candidate, Class of 2027",
    description:
      "Deep in agentic AI — building experimental platforms around agentic CRMs, memory systems, and agent-to-agent interactions. On the MIT $100K leadership team and bridging Sloan with the Media Lab.",
    link: "/story/mit",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Section 1: Hero */}
      <section className="relative py-24 md:py-32 lg:py-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-mono font-bold mb-6 leading-tight">
            <TypewriterText
              text="I build marketplaces, AI products, and founder communities."
              speed={40}
              className="text-text"
            />
          </h1>

          <p className="text-xl md:text-2xl text-muted max-w-3xl mb-8">
            I&apos;m{" "}
            <GlitchText className="text-primary">Adam Alpert</GlitchText> —
            founder, builder, and MIT Sloan MBA. I started a company in a dorm
            room, took it through Y Combinator, and I&apos;ve been building at
            the intersection of technology and human connection ever since.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button href="/projects" variant="primary" size="lg">
              See what I&apos;ve built
            </Button>
            <Button href="/about" variant="secondary" size="lg">
              About me
            </Button>
          </div>
        </div>
      </section>

      {/* Section 2: The Short Version */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <TerminalCard title="cat story.md">
            <p className="text-muted leading-relaxed text-base">
              I grew up{" "}
              <Link
                href="/story/upbringing"
                className="text-primary hover:text-secondary transition-colors"
              >
                making films and posting them online
              </Link>
              . Studied history at{" "}
              <Link
                href="/story/brown"
                className="text-primary hover:text-secondary transition-colors"
              >
                Brown
              </Link>
              , where I spent{" "}
              <Link
                href="/adventures/nols-alaska"
                className="text-primary hover:text-secondary transition-colors"
              >
                40 days in the Alaskan wilderness
              </Link>{" "}
              and built the first version of what would become Pangea. After
              graduation, I turned that{" "}
              <Link
                href="/story/rhode-island"
                className="text-primary hover:text-secondary transition-colors"
              >
                student project into a real company
              </Link>{" "}
              — taking it through{" "}
              <Link
                href="/story/yc"
                className="text-primary hover:text-secondary transition-colors"
              >
                Y Combinator&apos;s W21 batch
              </Link>
              , raising $3.3M, and growing it into an{" "}
              <Link
                href="/projects/pangea"
                className="text-primary hover:text-secondary transition-colors"
              >
                AI-native staffing platform
              </Link>{" "}
              operating in 150+ countries. Along the way, I started building{" "}
              <Link
                href="/projects/founder-communities"
                className="text-primary hover:text-secondary transition-colors"
              >
                founder communities
              </Link>{" "}
              in New York and Cambridge — curated groups of ambitious people who
              meet IRL. Now I&apos;m at{" "}
              <Link
                href="/story/mit"
                className="text-primary hover:text-secondary transition-colors"
              >
                MIT Sloan
              </Link>
              , going deep on agentic AI systems and figuring out what comes
              next.
            </p>
          </TerminalCard>
        </div>
      </section>

      {/* Section 3: What I Believe */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <TerminalCard title="cat thesis.md">
            <div className="space-y-6">
              {homeBeliefs.map((belief, i) => (
                <div key={i} className="flex gap-4">
                  <span className="font-mono text-primary text-sm shrink-0 pt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-muted leading-relaxed">
                    <span className="text-text font-semibold">
                      {belief.lead}
                    </span>{" "}
                    {belief.detail}
                  </p>
                </div>
              ))}
            </div>
          </TerminalCard>
        </div>
      </section>

      {/* Section 4: What I'm Working On */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader subtitle="Where my time and energy goes">
            What I&apos;m working on
          </SectionHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentFocus.map((item) => (
              <Link
                key={item.title}
                href={item.link}
                className="group p-6 bg-surface border border-border rounded-lg hover:border-primary/50 transition-all"
              >
                <div className="text-xs font-mono text-primary mb-2">
                  {item.role}
                </div>
                <h3 className="text-xl font-mono text-text group-hover:text-primary transition-colors mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-muted">{item.description}</p>
              </Link>
            ))}
          </div>

          <p className="text-sm text-muted font-mono mt-8">
            Also built:{" "}
            <Link
              href="/projects/reprally"
              className="text-primary hover:text-secondary transition-colors"
            >
              Reprally
            </Link>{" "}
            — Head of Product for a 3-sided CPG marketplace.{" "}
            <Link
              href="/projects/surviveai"
              className="text-primary hover:text-secondary transition-colors"
            >
              SurviveAI
            </Link>{" "}
            — offline survival app powered by on-device LLMs.
          </p>

          <div className="mt-4">
            <Link
              href="/projects"
              className="font-mono text-sm text-primary hover:text-secondary transition-colors"
            >
              See all projects →
            </Link>
          </div>
        </div>
      </section>

      {/* Section 5: Writing + CTA */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader subtitle="Thoughts on marketplaces, communities, and building">
            Writing
          </SectionHeader>

          <div className="space-y-4 mb-8">
            {[
              {
                href: "/writing/marketplace-lessons",
                title: "What I Learned Building a Marketplace",
                tag: "Marketplaces",
              },
              {
                href: "/writing/founder-communities",
                title: "Why I Build Founder Communities",
                tag: "Community Building",
              },
              {
                href: "/writing/ship-fast-systematize",
                title: "Ship Fast, Then Systematize",
                tag: "AI & Product",
              },
            ].map((post) => (
              <Link
                key={post.href}
                href={post.href}
                className="group flex items-center justify-between p-4 bg-surface border border-border rounded-lg hover:border-primary/50 transition-all"
              >
                <span className="font-mono text-text group-hover:text-primary transition-colors">
                  {post.title}
                </span>
                <span className="text-xs font-mono text-muted hidden sm:block">
                  {post.tag}
                </span>
              </Link>
            ))}
          </div>

          <Link
            href="/writing"
            className="font-mono text-sm text-primary hover:text-secondary transition-colors"
          >
            All writing →
          </Link>

          {/* Closing CTA */}
          <div className="mt-16 p-6 bg-surface border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
              <span className="font-mono text-text">
                Open to conversations about AI, marketplaces, and what&apos;s
                next.
              </span>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button href="/contact" variant="primary">
                Get in touch
              </Button>
              <Button href="/about" variant="secondary">
                Read my full story
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
