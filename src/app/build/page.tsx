import Link from "next/link";
import { SectionHeader, TechTag } from "@/components/ui";
import { buildProjects } from "@/lib/siteMap";

export default function BuildPage() {
  const companies = buildProjects.filter((p) => p.type === "company");
  const tools = buildProjects.filter((p) => p.type === "tool");

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeader subtitle="Companies, products, and experiments I've shipped">
          What I build
        </SectionHeader>

        {/* Companies & Platforms */}
        <div className="mb-16">
          <h3 className="font-mono text-lg text-muted mb-6">
            <span className="text-primary">//</span> Companies & Platforms
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {companies.map((project) => (
              <Link
                key={project.slug}
                href={`/build/${project.slug}`}
                className="group p-6 bg-surface border border-border rounded-lg hover:border-primary/50 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-primary">{project.role}</span>
                  {project.status === "active" && (
                    <span className="flex items-center gap-1 text-xs font-mono text-secondary">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                      Active
                    </span>
                  )}
                </div>
                <h3 className="font-mono text-xl text-text group-hover:text-primary transition-colors mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-muted">{project.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Tools & Experiments */}
        <div>
          <h3 className="font-mono text-lg text-muted mb-6">
            <span className="text-primary">//</span> Tools & Experiments
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((project) => (
              <Link
                key={project.slug}
                href={`/build/${project.slug}`}
                className="group p-6 bg-surface border border-border rounded-lg hover:border-primary/50 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-primary">{project.role}</span>
                  {project.status === "active" && (
                    <span className="flex items-center gap-1 text-xs font-mono text-secondary">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                      Active
                    </span>
                  )}
                </div>
                <h3 className="font-mono text-xl text-text group-hover:text-primary transition-colors mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-muted">{project.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
