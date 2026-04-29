"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { writingPosts } from "@/lib/siteMap";

function formatRowDate(dateString: string): string {
  return dateString.replace(/-/g, "·");
}

export default function WritingPage() {
  const [selectedTag, setSelectedTag] = useState<string>("All");

  const allTags = useMemo(
    () => ["All", ...Array.from(new Set(writingPosts.flatMap((p) => p.tags))).sort()],
    []
  );

  const filtered = useMemo(
    () =>
      selectedTag === "All"
        ? writingPosts
        : writingPosts.filter((p) => p.tags.includes(selectedTag)),
    [selectedTag]
  );

  return (
    <div className="page" data-page="writing">
      <section style={{ paddingTop: 64, paddingBottom: 32 }}>
        <div className="shell">
          <div className="kicker" style={{ marginBottom: 24 }}>
            Writing
          </div>
          <h1
            className="h-display"
            style={{ maxWidth: "14ch", marginBottom: 32 }}
          >
            Notes from the <em className="warm">workshop</em>.
          </h1>
          <p className="lede" style={{ maxWidth: "64ch" }}>
            I write to clarify my own thinking about marketplaces, founder
            communities, AI products, and how teams actually work in practice.
            A few selected pieces below.
          </p>
        </div>
      </section>

      <section style={{ paddingTop: 0, paddingBottom: 140 }}>
        <div className="shell">
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 24,
              flexWrap: "wrap",
            }}
          >
            {allTags.map((t) => {
              const active = selectedTag === t;
              return (
                <button
                  key={t}
                  className="tag"
                  onClick={() => setSelectedTag(t)}
                  style={{
                    cursor: "pointer",
                    background: active ? "var(--paper)" : "transparent",
                    color: active ? "var(--ink)" : "var(--paper-dim)",
                    borderColor: active ? "var(--paper)" : "var(--line-2)",
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>

          <div className="list-rows">
            {filtered.map((w) => (
              <Link key={w.slug} href={`/writing/${w.slug}`} className="write-row">
                <span className="write-date">{formatRowDate(w.date)}</span>
                <div className="write-title-block">
                  <div className="write-title">{w.title}</div>
                  <div className="write-excerpt">{w.excerpt}</div>
                </div>
                <span className="tag-pill">{w.tags[0]}</span>
                <span className="write-arr">{w.readingTime} ↗</span>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "64px 0" }}>
              <p
                className="mono"
                style={{ color: "var(--mute)", marginBottom: 16 }}
              >
                No posts found with that tag.
              </p>
              <button
                onClick={() => setSelectedTag("All")}
                style={{
                  color: "var(--ember)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                }}
              >
                Clear filter
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
