"use client";

import { useState } from "react";
import Link from "next/link";
import { SectionHeader } from "@/components/ui";
import { timelineEntries } from "@/lib/siteMap";

const categories = ["all", "story", "build", "adventure"] as const;
type Category = (typeof categories)[number];

const categoryColors = {
  story: "bg-primary",
  build: "bg-secondary",
  adventure: "bg-accent",
};

const categoryLabels = {
  story: "Story",
  build: "Build",
  adventure: "Adventure",
};

export default function TimelinePage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");

  const filteredEntries =
    selectedCategory === "all"
      ? timelineEntries
      : timelineEntries.filter((e) => e.category === selectedCategory);

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeader subtitle="A chronological view of life and work">
          Timeline
        </SectionHeader>

        {/* Filter */}
        <div className="mb-12 flex flex-wrap gap-2">
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
        <div className="mb-8 flex flex-wrap gap-4 text-xs font-mono text-muted">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <span>Story</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-secondary" />
            <span>Build</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-accent" />
            <span>Adventure</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

          {/* Entries */}
          <div className="space-y-0">
            {filteredEntries.map((entry, index) => (
              <Link
                key={`${entry.year}-${entry.title}`}
                href={entry.link}
                className="group block relative pl-12 py-6 hover:bg-surface/30 transition-colors rounded-lg"
              >
                {/* Dot */}
                <div
                  className={`absolute left-2.5 top-8 w-3 h-3 rounded-full ${
                    categoryColors[entry.category]
                  } ring-4 ring-background`}
                />

                {/* Content */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="font-mono text-sm text-primary min-w-[60px]">
                    {entry.year}
                  </span>
                  <span className="font-mono text-text group-hover:text-primary transition-colors">
                    {entry.title}
                  </span>
                  <span className="text-xs font-mono text-muted sm:ml-auto">
                    {categoryLabels[entry.category]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {filteredEntries.length === 0 && (
          <div className="text-center py-16">
            <p className="font-mono text-muted">No entries found for that category.</p>
            <button
              onClick={() => setSelectedCategory("all")}
              className="mt-4 text-primary hover:text-secondary font-mono text-sm"
            >
              Show all
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
