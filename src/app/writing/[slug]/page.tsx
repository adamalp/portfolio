import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost, getPublishedPosts, paragraphsOf, postDate } from "@/lib/content";

export const revalidate = 300;
export const dynamicParams = true;

interface WritingPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: WritingPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const path = `/writing/${slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: path },
    openGraph: {
      title: `${post.title} · Adam Alpert`,
      description: post.excerpt,
      url: path,
      type: "article",
      publishedTime: postDate(post),
      authors: ["Adam Alpert"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} · Adam Alpert`,
      description: post.excerpt,
    },
  };
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function WritingPostPage({ params }: WritingPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const date = postDate(post);
  const paragraphs = paragraphsOf(post.body_md);

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
            <time dateTime={date}>{formatDate(date)}</time>
            <span className="dim">·</span>
            <span>{post.reading_time}</span>
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
