"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export interface WritingListItem {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // YYYY-MM-DD
  readingTime: string;
  tags: string[];
}

function formatRowDate(dateString: string): string {
  return dateString.replace(/-/g, "·");
}

export function WritingList({ posts }: { posts: WritingListItem[] }) {
  const [selectedTag, setSelectedTag] = useState<string>("All");

  const allTags = useMemo(
    () => ["All", ...Array.from(new Set(posts.flatMap((p) => p.tags))).sort()],
    [posts]
  );

  const filtered = useMemo(
    () => (selectedTag === "All" ? posts : posts.filter((p) => p.tags.includes(selectedTag))),
    [posts, selectedTag]
  );

  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
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
          <p className="mono" style={{ color: "var(--mute)", marginBottom: 16 }}>
            No posts found with that tag.
          </p>
          <button
            onClick={() => setSelectedTag("All")}
            style={{ color: "var(--ember)", fontFamily: "var(--font-mono)", fontSize: 13 }}
          >
            Clear filter
          </button>
        </div>
      )}
    </>
  );
}
