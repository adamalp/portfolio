"use client";

import { useState } from "react";
import Link from "next/link";
import { SectionHeader, TechTag } from "@/components/ui";
import { writingPosts } from "@/lib/siteMap";

const allTags = Array.from(new Set(writingPosts.flatMap((p) => p.tags))).sort();

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function WritingPage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredPosts = selectedTag
    ? writingPosts.filter((p) => p.tags.includes(selectedTag))
    : writingPosts;

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeader subtitle="Thoughts, essays, and frameworks">
          Writing
        </SectionHeader>

        {/* Intro */}
        <div className="mb-12 p-6 bg-surface border border-border rounded-lg">
          <p className="text-muted leading-relaxed">
            I write to clarify my own thinking about marketplaces, founder communities,
            and how teams actually work in practice. A few selected pieces below.
          </p>
        </div>

        {/* Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1.5 text-xs font-mono border rounded transition-colors ${
                selectedTag === null
                  ? "border-primary text-primary bg-primary/10"
                  : "border-border text-muted hover:border-muted"
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 text-xs font-mono border rounded transition-colors ${
                  selectedTag === tag
                    ? "border-primary text-primary bg-primary/10"
                    : "border-border text-muted hover:border-muted"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/writing/${post.slug}`}
              className="group block p-6 bg-surface border border-border rounded-lg hover:border-primary/50 transition-all"
            >
              <div className="flex items-center gap-4 font-mono text-xs text-muted mb-3">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span className="text-border">|</span>
                <span>{post.readingTime}</span>
              </div>

              <h2 className="font-mono text-xl text-text group-hover:text-primary transition-colors mb-2">
                {post.title}
              </h2>

              <p className="text-muted mb-4">{post.excerpt}</p>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <TechTag key={tag} variant="muted">{tag}</TechTag>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="font-mono text-muted">No posts found with that tag.</p>
            <button
              onClick={() => setSelectedTag(null)}
              className="mt-4 text-primary hover:text-secondary font-mono text-sm"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
