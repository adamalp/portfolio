import { notFound } from "next/navigation";
import Link from "next/link";
import { adventures } from "@/lib/siteMap";

interface AdventurePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return adventures.map((adventure) => ({
    slug: adventure.slug,
  }));
}

const adventureContent: Record<string, {
  sections: { title: string; content: string }[];
}> = {
  "nols-alaska": {
    sections: [
      { title: "40 days in Alaska", content: "The expedition overview and what we set out to do." },
      { title: "Leadership & risk under real constraints", content: "What leading in the wilderness taught me." },
      { title: "How it changed how I operate", content: "The lasting impact on my approach to building." },
      { title: "Photos & route map", content: "Visual documentation of the journey." },
    ],
  },
  cotopaxi: {
    sections: [
      { title: "Why Cotopaxi", content: "The draw of Ecuador's highest volcano." },
      { title: "Preparation & training", content: "Getting ready for high altitude." },
      { title: "Summit attempt", content: "The climb itself." },
      { title: "Lessons about pacing, teams, and risk", content: "What I took away from the experience." },
    ],
  },
  "ski-and-outdoor": {
    sections: [
      { title: "Skiing & mountains as a recurring theme", content: "Why I keep going back." },
      { title: "Notable trips", content: "Courchevel, backcountry adventures, and more." },
      { title: "Ice Coast Films", content: "The ski film festival and creative projects." },
      { title: "Why I keep going back to the mountains", content: "The deeper draw." },
    ],
  },
};

export default async function AdventurePage({ params }: AdventurePageProps) {
  const { slug } = await params;
  const adventure = adventures.find((a) => a.slug === slug);

  if (!adventure) {
    notFound();
  }

  const content = adventureContent[slug];

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/adventures"
          className="inline-flex items-center gap-2 font-mono text-sm text-muted hover:text-primary transition-colors mb-8"
        >
          ← Back to adventures
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="font-mono text-sm text-primary mb-2">{adventure.year}</div>
          <h1 className="text-3xl md:text-4xl font-mono font-bold text-text mb-4">
            {adventure.title}
          </h1>
          <p className="text-xl text-muted">{adventure.subtitle}</p>
        </header>

        {/* Hero image placeholder */}
        <div className="aspect-video bg-surface border border-border rounded-lg mb-12 flex items-center justify-center">
          <span className="font-mono text-muted">// Photo to be added</span>
        </div>

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

        {/* Back navigation */}
        <nav className="mt-16 pt-8 border-t border-border">
          <Link
            href="/adventures"
            className="font-mono text-sm text-muted hover:text-primary transition-colors"
          >
            ← Back to all adventures
          </Link>
        </nav>
      </div>
    </div>
  );
}
