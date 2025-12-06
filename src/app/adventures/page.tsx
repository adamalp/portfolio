import Link from "next/link";
import { SectionHeader } from "@/components/ui";
import { adventures } from "@/lib/siteMap";

export default function AdventuresPage() {
  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeader subtitle="Expeditions and personal challenges">
          Adventures
        </SectionHeader>

        {/* Intro */}
        <div className="mb-12 p-6 bg-surface border border-border rounded-lg max-w-3xl">
          <p className="text-muted leading-relaxed">
            I believe the best builders push themselves outside of work too. Mountains,
            expeditions, and physical challenges have taught me as much about leadership,
            risk, and resilience as any startup experience.
          </p>
        </div>

        {/* Adventures grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {adventures.map((adventure) => (
            <Link
              key={adventure.slug}
              href={`/adventures/${adventure.slug}`}
              className="group relative overflow-hidden rounded-lg border border-border hover:border-primary/50 transition-all"
            >
              {/* Placeholder image area */}
              <div className="aspect-[4/3] bg-surface flex items-center justify-center">
                <span className="font-mono text-4xl text-border">
                  {adventure.title.charAt(0)}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="font-mono text-xs text-primary mb-2">{adventure.year}</div>
                <h3 className="font-mono text-xl text-text group-hover:text-primary transition-colors mb-2">
                  {adventure.title}
                </h3>
                <p className="text-sm text-muted">{adventure.subtitle}</p>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
