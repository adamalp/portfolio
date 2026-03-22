"use client";

import Link from "next/link";
import { TypewriterText, GlitchText } from "@/components/effects";
import { Button, SectionHeader } from "@/components/ui";

const currentFocus = [
  {
    title: "Pangea.app",
    role: "Co-founder & CEO",
    description:
      "Scaling a global marketplace connecting top marketing and design talent with high-impact freelance and contract work. Built from a Brown dorm room through YC to profitability.",
    link: "/projects/pangea",
  },
  {
    title: "Founder Communities",
    role: "NYC & Cambridge Founders Clubs",
    description:
      "Curating high-signal founder communities in New York and Cambridge — intimate dinners, meaningful collisions, and a product layer to keep people connected.",
    link: "/projects/founder-communities",
  },
  {
    title: "MIT Sloan",
    role: "MBA Candidate, Class of 2027",
    description:
      "Exploring the intersection of AI, marketplaces, and organizational design as part of the MIT Sloan and Media Lab ecosystems.",
    link: "/story/mit",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 lg:py-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-mono font-bold mb-6 leading-tight">
            <TypewriterText
              text="I build products, communities, and companies."
              speed={40}
              className="text-text"
            />
          </h1>

          <p className="text-xl md:text-2xl text-muted max-w-3xl mb-8">
            I'm <GlitchText className="text-primary">Adam Alpert</GlitchText> — a founder and builder focused on marketplaces, AI-powered products, and high-trust founder communities.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button href="/projects" variant="primary" size="lg">
              See my work
            </Button>
            <Button href="/about" variant="secondary" size="lg">
              About me
            </Button>
          </div>
        </div>
      </section>

      {/* What I'm Doing Now */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader subtitle="Where my time and energy goes">
            What I'm doing now
          </SectionHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentFocus.map((item) => (
              <Link
                key={item.title}
                href={item.link}
                className="group p-6 bg-surface border border-border rounded-lg hover:border-primary/50 transition-all"
              >
                <div className="text-xs font-mono text-primary mb-2">{item.role}</div>
                <h3 className="text-xl font-mono text-text group-hover:text-primary transition-colors mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-muted">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Writing */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader subtitle="Thoughts on marketplaces, communities, and building">
            Writing
          </SectionHeader>

          <div className="space-y-4 mb-8">
            {[
              { href: "/writing/marketplace-lessons", title: "What I Learned Building a Marketplace", tag: "Marketplaces" },
              { href: "/writing/founder-communities", title: "Why I Build Founder Communities", tag: "Community Building" },
              { href: "/writing/ship-fast-systematize", title: "Ship Fast, Then Systematize", tag: "AI & Product" },
            ].map((post) => (
              <Link
                key={post.href}
                href={post.href}
                className="group flex items-center justify-between p-4 bg-surface border border-border rounded-lg hover:border-primary/50 transition-all"
              >
                <span className="font-mono text-text group-hover:text-primary transition-colors">
                  {post.title}
                </span>
                <span className="text-xs font-mono text-muted hidden sm:block">{post.tag}</span>
              </Link>
            ))}
          </div>

          <Link
            href="/writing"
            className="font-mono text-sm text-primary hover:text-secondary transition-colors"
          >
            All writing →
          </Link>
        </div>
      </section>
    </div>
  );
}
