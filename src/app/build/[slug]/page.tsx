import { notFound } from "next/navigation";
import Link from "next/link";
import { buildProjects } from "@/lib/siteMap";
import { Button, TechTag } from "@/components/ui";

interface BuildProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return buildProjects.map((project) => ({
    slug: project.slug,
  }));
}

// Detailed content for each project
const projectDetails: Record<string, {
  longDescription: string;
  sections: { title: string; content: string }[];
  tags: string[];
  links?: { label: string; href: string }[];
}> = {
  pangea: {
    longDescription: "Pangea is a global marketplace connecting top marketing and design talent with high-impact freelance and contract work.",
    tags: ["Marketplace", "Next.js", "PostgreSQL", "BigQuery", "n8n"],
    links: [{ label: "Visit Pangea", href: "https://pangea.app" }],
    sections: [
      { title: "The problem", content: "Fragmented hiring for creative/marketing talent, misalignment of incentives." },
      { title: "The journey", content: "Dorm room → campus explosion → pandemic remote work → pivot to mid-career talent." },
      { title: "What we built", content: "Marketplace mechanics, product surface, matching, payments." },
      { title: "Scaling the system", content: "Data stack (BigQuery, dbt), BI dashboards, hundreds of automations." },
      { title: "Business outcomes", content: "Transaction volume growth, margin improvement from 8% to 22%, profitability." },
      { title: "What I actually did", content: "P&L ownership, fundraising, hiring, strategy, and large chunks of the data/automation work personally." },
    ],
  },
  "founder-communities": {
    longDescription: "High-signal founder communities in NYC and Cambridge — intimate dinners, meaningful collisions, and systems to keep people connected.",
    tags: ["Community", "Events", "Next.js", "Supabase"],
    sections: [
      { title: "Why founder communities", content: "Density, trust, and real relationships as leverage." },
      { title: "NYC Founders Club", content: "Paid membership, 5,000+ in network, sponsors include JP Morgan, Ramp, Stripe." },
      { title: "Cambridge Founders Club", content: "MIT/Harvard/YC bridging, intimate events and meaningful connections." },
      { title: "My role", content: "Curating, hosting, building systems to keep serendipity high but noise low." },
      { title: "The community OS", content: "How I structure membership, events, and follow-through." },
    ],
  },
  reprally: {
    longDescription: "Led product for a 3-sided CPG marketplace connecting brands, field reps, and retail stores.",
    tags: ["Product", "Marketplace", "CPG", "n8n"],
    sections: [
      { title: "Context", content: "Joined as AI consultant, quickly moved into Head of Product role." },
      { title: "What Reprally is", content: "3-sided CPG marketplace connecting brands, reps, and stores." },
      { title: "Key product work", content: "SLA changes, self-service brand portal, managed marketplace transition, store portal." },
      { title: "Impact", content: "Improved ship times, contact rates, and retention." },
      { title: "AI & automation", content: "Hackathon, n8n workflows, process automation initiatives." },
      { title: "Why I left", content: "Left to attend MIT Sloan, hired replacement Head of Product." },
    ],
  },
  surviveai: {
    longDescription: "Offline survival assistant powered by on-device LLMs — reliability when there's no signal.",
    tags: ["React Native", "LLM", "On-device AI", "Qwen"],
    sections: [
      { title: "The idea", content: "Offline survival assistant powered by on-device LLMs." },
      { title: "What I built", content: "React Native app, Qwen 1.7B on-device, tool calling to KB, speech-to-text, vision input." },
      { title: "Why it matters", content: "Reliability when there's no signal, edge computing, resilience." },
      { title: "What I learned", content: "On-device constraints, UX for high-stress situations, prompt/tool design." },
    ],
  },
};

export default async function BuildProjectPage({ params }: BuildProjectPageProps) {
  const { slug } = await params;
  const project = buildProjects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const details = projectDetails[slug];

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/build"
          className="inline-flex items-center gap-2 font-mono text-sm text-muted hover:text-primary transition-colors mb-8"
        >
          ← Back to build
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-mono text-primary">{project.role}</span>
            {project.status === "active" && (
              <span className="flex items-center gap-1 text-xs font-mono text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                Active
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-mono font-bold text-text mb-4">
            {project.title}
          </h1>
          <p className="text-xl text-muted mb-6">{details?.longDescription || project.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {details?.tags.map((tag) => (
              <TechTag key={tag}>{tag}</TechTag>
            ))}
          </div>

          {/* Links */}
          {details?.links && (
            <div className="flex gap-4">
              {details.links.map((link) => (
                <Button key={link.href} href={link.href} variant="primary" external>
                  {link.label} →
                </Button>
              ))}
            </div>
          )}
        </header>

        {/* Content sections */}
        <div className="space-y-12">
          {details?.sections.map((section, index) => (
            <section key={index}>
              <h2 className="font-mono text-xl text-text mb-4">{section.title}</h2>
              <div className="p-6 bg-surface border border-border rounded-lg">
                <p className="text-muted">{section.content}</p>
                <p className="text-xs text-muted/50 mt-4 font-mono">
                  // Detailed content to be added
                </p>
              </div>
            </section>
          ))}
        </div>

        {/* Back to build */}
        <nav className="mt-16 pt-8 border-t border-border">
          <Link
            href="/build"
            className="font-mono text-sm text-muted hover:text-primary transition-colors"
          >
            ← Back to all projects
          </Link>
        </nav>
      </div>
    </div>
  );
}
