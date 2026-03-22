"use client";

import { useState } from "react";
import Link from "next/link";
import { SectionHeader } from "@/components/ui";
import { storyChapters, adventures, timelineEntries } from "@/lib/siteMap";

const categories = ["all", "story", "build", "adventure"] as const;
type Category = (typeof categories)[number];

const categoryColors = {
  story: "bg-primary",
  build: "bg-secondary",
  adventure: "bg-accent",
};

const categoryLabels = {
  story: "Life",
  build: "Work",
  adventure: "Adventure",
};

export default function AboutPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");

  const filteredEntries =
    selectedCategory === "all"
      ? timelineEntries
      : timelineEntries.filter((e) => e.category === selectedCategory);

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bio */}
        <section className="mb-16">
          <h1 className="text-3xl md:text-4xl font-mono font-bold text-text mb-6">
            About me
          </h1>
          <div className="space-y-4 text-muted leading-relaxed">
            <p>
              I&apos;m Adam Alpert — a founder, builder, and community creator based in Cambridge, MA.
              I&apos;m the co-founder and CEO of{" "}
              <Link href="/projects/pangea" className="text-primary hover:text-secondary transition-colors">
                Pangea
              </Link>
              , an AI-native staffing platform connecting companies with top fractional creative,
              marketing, and growth talent. We built it from a Brown dorm room through Y Combinator
              to profitability.
            </p>
            <p>
              I also curate{" "}
              <Link href="/projects/founder-communities" className="text-primary hover:text-secondary transition-colors">
                founder communities
              </Link>
              {" "}in New York and Cambridge — intimate dinners, meaningful collisions, and a
              product layer to keep ambitious people connected. And I&apos;m currently pursuing my MBA at{" "}
              <Link href="/story/mit" className="text-primary hover:text-secondary transition-colors">
                MIT Sloan
              </Link>
              , exploring the intersection of AI, marketplaces, and organizational design.
            </p>
            <p>
              I&apos;ve been building things since I was a kid filming videos with a cheap HD camera
              and posting them online. That instinct — to take an idea, make it real, and share
              it with people — has shaped almost everything I&apos;ve done since.
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-16">
          <SectionHeader subtitle="A chronological view of life and work">
            Timeline
          </SectionHeader>

          {/* Filter */}
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-sm font-mono border rounded transition-colors ${
                  selectedCategory === cat
                    ? "border-primary text-primary bg-primary/10"
                    : "border-border text-muted hover:border-muted"
                }`}
              >
                {cat === "all" ? "All" : categoryLabels[cat]}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="mb-6 flex flex-wrap gap-4 text-xs font-mono text-muted">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary" />
              <span>Life</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-secondary" />
              <span>Work</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-accent" />
              <span>Adventure</span>
            </div>
          </div>

          {/* Timeline entries */}
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-0">
              {filteredEntries.map((entry) => (
                <Link
                  key={`${entry.year}-${entry.title}`}
                  href={entry.link}
                  className="group block relative pl-12 py-4 hover:bg-surface/30 transition-colors rounded-lg"
                >
                  <div
                    className={`absolute left-2.5 top-6 w-3 h-3 rounded-full ${
                      categoryColors[entry.category]
                    } ring-4 ring-background`}
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span className="font-mono text-sm text-primary min-w-[60px]">
                      {entry.year}
                    </span>
                    <span className="font-mono text-text group-hover:text-primary transition-colors">
                      {entry.title}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Story chapters */}
        <section className="mb-16">
          <SectionHeader subtitle="The journey in six chapters">
            My story
          </SectionHeader>

          <div className="space-y-0">
            {storyChapters.map((chapter, index) => (
              <Link
                key={chapter.slug}
                href={`/story/${chapter.slug}`}
                className="group block relative pl-8 pb-8 last:pb-0"
              >
                {index < storyChapters.length - 1 && (
                  <div className="absolute left-[11px] top-6 bottom-0 w-px bg-border group-hover:bg-primary/30 transition-colors" />
                )}
                <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 border-border bg-background group-hover:border-primary transition-colors flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-4 rounded-lg hover:bg-surface/50 transition-colors">
                  <div className="font-mono text-xs text-primary mb-1">{chapter.year}</div>
                  <h3 className="font-mono text-lg text-text group-hover:text-primary transition-colors mb-1">
                    {chapter.title}
                  </h3>
                  <p className="text-sm text-muted">{chapter.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Adventures */}
        <section>
          <SectionHeader subtitle="Expeditions and personal challenges">
            Adventures
          </SectionHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {adventures.map((adventure) => (
              <Link
                key={adventure.slug}
                href={`/adventures/${adventure.slug}`}
                className="group p-6 bg-surface border border-border rounded-lg hover:border-primary/50 transition-all"
              >
                <div className="font-mono text-xs text-accent mb-2">{adventure.year}</div>
                <h3 className="font-mono text-lg text-text group-hover:text-primary transition-colors mb-2">
                  {adventure.title}
                </h3>
                <p className="text-sm text-muted">{adventure.subtitle}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
