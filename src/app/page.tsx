"use client";

import Link from "next/link";
import { TypewriterText, GlitchText } from "@/components/effects";
import { Button, SectionHeader } from "@/components/ui";
import { buildProjects, principles } from "@/lib/siteMap";

const currentFocus = [
  {
    title: "Pangea.app",
    role: "Co-founder & CEO",
    description:
      "Scaling a global marketplace connecting top marketing and design talent with high-impact freelance and contract work. Built from a Brown dorm room through YC to profitability.",
    link: "/build/pangea",
  },
  {
    title: "Founder Communities",
    role: "NYC & Cambridge Founders Clubs",
    description:
      "Curating high-signal founder communities in New York and Cambridge — intimate dinners, meaningful collisions, and a product layer to keep people connected.",
    link: "/build/founder-communities",
  },
  {
    title: "MIT Sloan",
    role: "MBA Candidate, Class of 2027",
    description:
      "Exploring the intersection of AI, marketplaces, and organizational design as part of the MIT Sloan and Media Lab ecosystems.",
    link: "/story/mit",
  },
];

const featuredSections = [
  { href: "/build", label: "Things I've built", icon: "→" },
  { href: "/story", label: "How I got here", icon: "→" },
  { href: "/adventures", label: "Outside the office", icon: "→" },
  { href: "/writing", label: "Essays & notes", icon: "→" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 lg:py-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-mono font-bold mb-6 leading-tight">
            <TypewriterText
              text="I build products, communities, and companies."
              speed={40}
              className="text-text"
            />
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted max-w-3xl mb-8">
            I'm <GlitchText className="text-primary">Adam Alpert</GlitchText> — a founder and builder focused on marketplaces, AI-powered products, and high-trust founder communities.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button href="/build" variant="primary" size="lg">
              View what I build
            </Button>
            <Button href="/story" variant="secondary" size="lg">
              Read my story
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

      {/* How I Build - Principles */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader subtitle="Principles that guide my work">
            How I build
          </SectionHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {principles.map((principle, index) => (
              <div
                key={principle.title}
                className="flex gap-4 p-6 bg-surface/50 border border-border rounded-lg"
              >
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center font-mono text-primary text-sm border border-primary/30 rounded">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-mono text-text mb-1">{principle.title}</h3>
                  <p className="text-sm text-muted">{principle.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader subtitle="Explore more">
            Dive deeper
          </SectionHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredSections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="group p-6 bg-surface border border-border rounded-lg hover:border-primary/50 hover:bg-surface/80 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-text group-hover:text-primary transition-colors">
                    {section.label}
                  </span>
                  <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    {section.icon}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
