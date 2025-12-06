import { notFound } from "next/navigation";
import Link from "next/link";
import { writingPosts } from "@/lib/siteMap";
import { TechTag } from "@/components/ui";

interface WritingPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return writingPosts.map((post) => ({
    slug: post.slug,
  }));
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function WritingPostPage({ params }: WritingPostPageProps) {
  const { slug } = await params;
  const post = writingPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/writing"
          className="inline-flex items-center gap-2 font-mono text-sm text-muted hover:text-primary transition-colors mb-8"
        >
          ← Back to writing
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-4 font-mono text-xs text-muted mb-4">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="text-border">|</span>
            <span>{post.readingTime}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-mono font-bold text-text mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <TechTag key={tag}>{tag}</TechTag>
            ))}
          </div>
        </header>

        {/* Content placeholder */}
        <article className="prose prose-invert max-w-none">
          <div className="p-8 bg-surface border border-border rounded-lg">
            <p className="text-muted mb-6">{post.excerpt}</p>
            <div className="border-t border-border pt-6">
              <p className="font-mono text-sm text-muted">
                // Full article content to be added via MDX
              </p>
              <p className="font-mono text-xs text-muted/50 mt-2">
                This post will be rendered from an MDX file with full formatting,
                code blocks, and custom components.
              </p>
            </div>
          </div>
        </article>

        {/* Back navigation */}
        <nav className="mt-16 pt-8 border-t border-border">
          <Link
            href="/writing"
            className="font-mono text-sm text-muted hover:text-primary transition-colors"
          >
            ← Back to all posts
          </Link>
        </nav>
      </div>
    </div>
  );
}
