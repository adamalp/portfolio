import { notFound } from "next/navigation";
import Link from "next/link";
import { storyChapters } from "@/lib/siteMap";

interface StoryChapterPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return storyChapters.map((chapter) => ({
    slug: chapter.slug,
  }));
}

// Placeholder content for each chapter
const chapterContent: Record<string, { sections: { title: string; content: string }[] }> = {
  upbringing: {
    sections: [
      { title: "Where I grew up", content: "Content about early years and family background." },
      { title: "Early signs of building", content: "First projects and experiments." },
      { title: "Finding my voice", content: "Creative projects, videos, and early internet presence." },
      { title: "The through-line to today", content: "How these early experiences shaped my path." },
    ],
  },
  brown: {
    sections: [
      { title: "Why Brown / Why History", content: "Curiosity about systems, narratives, and change." },
      { title: "NOLS & Alaska", content: "40-day expedition and lessons about leadership and resilience." },
      { title: "The first version of Pangea", content: "Seeds of the idea and early tests." },
      { title: "Key lessons", content: "Principles that still guide me." },
    ],
  },
  "rhode-island": {
    sections: [
      { title: "Staying in Providence", content: "The decision to stay after graduation." },
      { title: "Turning a student project into a company", content: "The early days of real company building." },
      { title: "Early customers, early mistakes", content: "Learning through doing." },
      { title: "Going all-in on Pangea", content: "The moment of commitment." },
    ],
  },
  yc: {
    sections: [
      { title: "Getting into YC (W21)", content: "2% acceptance, $125K, and what it meant." },
      { title: "What changed during the batch", content: "Intensity, focus, and talking to users." },
      { title: "How YC shaped Pangea", content: "The lasting impact on how we build." },
      { title: "Principles I kept, advice I ignored", content: "Finding my own way." },
    ],
  },
  "new-york": {
    sections: [
      { title: "Moving to New York", content: "Why NYC and what it meant for Pangea." },
      { title: "Building the team", content: "Remote-first culture and hiring." },
      { title: "From campus to global", content: "The evolution of the marketplace." },
      { title: "Starting founder communities", content: "The origin of NYC Founders Club." },
    ],
  },
  mit: {
    sections: [
      { title: "Why business school (and why MIT)", content: "The decision to go back to school." },
      { title: "Core threads", content: "AI + marketplaces, organizational design, founder ecosystems." },
      { title: "MIT roles", content: "Media Lab, $100K leadership, Dean's Fellowship." },
      { title: "How Sloan fits the bigger arc", content: "Where this leads next." },
    ],
  },
};

export default async function StoryChapterPage({ params }: StoryChapterPageProps) {
  const { slug } = await params;
  const chapter = storyChapters.find((c) => c.slug === slug);
  const currentIndex = storyChapters.findIndex((c) => c.slug === slug);

  if (!chapter) {
    notFound();
  }

  const content = chapterContent[slug];
  const prevChapter = currentIndex > 0 ? storyChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < storyChapters.length - 1 ? storyChapters[currentIndex + 1] : null;

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/story"
          className="inline-flex items-center gap-2 font-mono text-sm text-muted hover:text-primary transition-colors mb-8"
        >
          ← Back to story
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="font-mono text-sm text-primary mb-2">{chapter.year}</div>
          <h1 className="text-3xl md:text-4xl font-mono font-bold text-text mb-4">
            {chapter.title}
          </h1>
          <p className="text-xl text-muted">{chapter.subtitle}</p>
        </header>

        {/* Content sections */}
        <div className="space-y-12">
          {content?.sections.map((section, index) => (
            <section key={index}>
              <h2 className="font-mono text-xl text-text mb-4">{section.title}</h2>
              <div className="p-6 bg-surface border border-border rounded-lg">
                <p className="text-muted">{section.content}</p>
                <p className="text-xs text-muted/50 mt-4 font-mono">
                  // Content to be added
                </p>
              </div>
            </section>
          ))}
        </div>

        {/* Chapter navigation */}
        <nav className="mt-16 pt-8 border-t border-border">
          <div className="flex justify-between">
            {prevChapter ? (
              <Link
                href={`/story/${prevChapter.slug}`}
                className="group flex flex-col"
              >
                <span className="text-xs font-mono text-muted mb-1">← Previous</span>
                <span className="font-mono text-text group-hover:text-primary transition-colors">
                  {prevChapter.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {nextChapter && (
              <Link
                href={`/story/${nextChapter.slug}`}
                className="group flex flex-col text-right"
              >
                <span className="text-xs font-mono text-muted mb-1">Next →</span>
                <span className="font-mono text-text group-hover:text-primary transition-colors">
                  {nextChapter.title}
                </span>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
