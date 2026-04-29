import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { buildProjects } from "@/lib/siteMap";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return buildProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = buildProjects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title}${project.ital ?? ""}`,
    description: project.lede ?? project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = buildProjects.find((p) => p.slug === slug);
  if (!project) notFound();

  const idx = buildProjects.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? buildProjects[idx - 1] : null;
  const next = idx < buildProjects.length - 1 ? buildProjects[idx + 1] : null;

  const sections = project.sections ?? [
    { title: "Summary", body: [project.lede ?? project.description] },
  ];

  return (
    <div className="page" data-page="project">
      <section className="detail-hero">
        <div className="shell">
          <Link href="/projects" className="detail-back">← All projects</Link>

          <div className="detail-eyebrow">
            <span className="role">{project.role}</span>
            {project.year && (
              <>
                <span className="dim">·</span>
                <span>{project.year}</span>
              </>
            )}
            {project.status === "active" && (
              <>
                <span className="dim">·</span>
                <span className="live">Active</span>
              </>
            )}
            {project.link && (
              <>
                <span className="dim">·</span>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--paper)" }}
                  className="hover:text-[var(--ember)] transition-colors"
                >
                  Visit ↗
                </a>
              </>
            )}
          </div>

          <h1 className="detail-title">
            {project.title}
            {project.ital && <span className="ital">{project.ital}</span>}
          </h1>

          <p className="detail-lede">{project.lede ?? project.description}</p>

          {project.tags && project.tags.length > 0 && (
            <div className="tag-row">
              {project.tags.map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          )}

          {project.facts && project.facts.length > 0 && (
            <div className="facts">
              {project.facts.map((f, i) => (
                <div key={i} className="fact">
                  <div className="fact-num">
                    {f.num}
                    {f.unit && <span className="unit">{f.unit}</span>}
                  </div>
                  <div className="fact-label">{f.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {project.image && (
        <div className="shell">
          <div className="full-img">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(min-width: 1240px) 1240px, 100vw"
              className="object-cover"
              priority
            />
            <span className="cap">
              {project.title}
              {project.ital ?? ""} · {project.year ?? ""}
            </span>
          </div>
        </div>
      )}

      <section style={{ paddingTop: project.image ? 0 : 48, paddingBottom: 80 }}>
        <div className="shell">
          <div className="deep">
            {sections.map((s, i) => (
              <div key={i} className="dsec">
                <div className="dsec-label">
                  <span className="num">{String(i + 1).padStart(2, "0")}</span>· Section
                </div>
                <div>
                  <h2 className="dsec-title">{s.title}</h2>
                  <div className="dsec-body">
                    {s.body.map((par, j) => (
                      <p key={j}>{par}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pn">
            {prev ? (
              <Link href={`/projects/${prev.slug}`}>
                <span className="lab">← Previous</span>
                <span className="nm">
                  {prev.title}
                  {prev.ital ?? ""}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/projects/${next.slug}`} className="right">
                <span className="lab">Next →</span>
                <span className="nm">
                  {next.title}
                  {next.ital ?? ""}
                </span>
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
