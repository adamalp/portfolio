import type { Metadata } from "next";
import { getPublishedPosts, postDate } from "@/lib/content";
import { WritingList } from "./WritingList";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Notes on marketplaces, founder communities, AI products, and how teams actually work.",
  alternates: { canonical: "/writing" },
};

export default async function WritingPage() {
  const posts = await getPublishedPosts();
  const items = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: postDate(p),
    readingTime: p.reading_time,
    tags: p.tags,
  }));

  return (
    <div className="page" data-page="writing">
      <section style={{ paddingTop: 64, paddingBottom: 32 }}>
        <div className="shell">
          <div className="kicker" style={{ marginBottom: 24 }}>
            Writing
          </div>
          <h1 className="h-display" style={{ maxWidth: "14ch", marginBottom: 32 }}>
            Notes from the <em className="warm">workshop</em>.
          </h1>
          <p className="lede" style={{ maxWidth: "64ch" }}>
            I write to clarify my own thinking about marketplaces, founder
            communities, AI products, and how teams actually work in practice.
          </p>
        </div>
      </section>

      <section style={{ paddingTop: 0, paddingBottom: 140 }}>
        <div className="shell">
          <WritingList posts={items} />
        </div>
      </section>
    </div>
  );
}
