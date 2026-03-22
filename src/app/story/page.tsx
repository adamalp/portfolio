import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeader } from "@/components/ui";
import { storyChapters } from "@/lib/siteMap";

export const metadata: Metadata = {
  title: "Story",
  description: "From kid filmmaker in suburban New York to founder, YC alum, and MIT Sloan — the journey in six chapters.",
};

export default function StoryPage() {
  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeader subtitle="The journey from kid filmmaker to founder">
          My story
        </SectionHeader>

        {/* Intro */}
        <div className="mb-12 p-6 bg-surface border border-border rounded-lg">
          <p className="text-muted leading-relaxed">
            I've been building things since I was a kid filming videos with a cheap HD camera
            and posting them online. That instinct — to take an idea, make it real, and share
            it with people — has shaped almost everything I've done since: starting Pangea out
            of my Brown dorm room, going through Y Combinator, building founder communities in
            New York and Cambridge, and now digging deeper into systems and strategy at MIT Sloan.
          </p>
        </div>

        {/* Chapters Timeline */}
        <div className="space-y-0">
          {storyChapters.map((chapter, index) => (
            <Link
              key={chapter.slug}
              href={`/story/${chapter.slug}`}
              className="group block relative pl-8 pb-12 last:pb-0"
            >
              {/* Timeline line */}
              {index < storyChapters.length - 1 && (
                <div className="absolute left-[11px] top-6 bottom-0 w-px bg-border group-hover:bg-primary/30 transition-colors" />
              )}

              {/* Timeline dot */}
              <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 border-border bg-background group-hover:border-primary transition-colors flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Content */}
              <div className="p-4 rounded-lg hover:bg-surface/50 transition-colors">
                <div className="font-mono text-xs text-primary mb-1">{chapter.year}</div>
                <h3 className="font-mono text-xl text-text group-hover:text-primary transition-colors mb-1">
                  {chapter.title}
                </h3>
                <p className="text-sm text-muted">{chapter.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
