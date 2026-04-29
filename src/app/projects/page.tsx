import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buildProjects, type BuildProject } from "@/lib/siteMap";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Companies, platforms, and tools — Pangea, Founder Communities, Reprally, SurviveAI, Clawviyo, MyLogia, Friend Roulette.",
};

function ProjectCard({ p }: { p: BuildProject }) {
  return (
    <Link href={`/projects/${p.slug}`} className="proj-card">
      <div className="proj-thumb">
        {p.image ? (
          <Image
            src={p.image}
            alt={p.title}
            fill
            sizes="(min-width: 720px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "clamp(48px, 8vw, 96px)",
              color: "var(--mute-2)",
              background:
                "radial-gradient(ellipse at 30% 30%, rgba(255,122,69,0.06), transparent 60%), var(--ink-3)",
            }}
          >
            {p.title.charAt(0)}
            {p.ital ? p.ital.trim().charAt(0) : ""}
          </div>
        )}
        <span className="corner">
          {p.status === "active" && <span className="live" />}
          {p.status === "active"
            ? "Active"
            : p.status === "completed"
            ? "Completed"
            : "Paused"}
        </span>
      </div>
      <div className="proj-body">
        <div className="proj-meta">
          <span>{p.role}</span>
          <span>{p.year ?? ""}</span>
        </div>
        <h3 className="proj-name">
          {p.title}
          {p.ital && <span className="ital">{p.ital}</span>}
        </h3>
        <p className="proj-blurb">{p.description}</p>
        <div className="proj-foot">
          <span>{(p.tags ?? []).slice(0, 3).join(" · ")}</span>
          <span className="arr">↗</span>
        </div>
      </div>
    </Link>
  );
}

export default function ProjectsPage() {
  const companies = buildProjects.filter((p) => p.type === "company");
  const tools = buildProjects.filter((p) => p.type === "tool");

  return (
    <div className="page" data-page="projects">
      <section style={{ paddingTop: 64, paddingBottom: 32 }}>
        <div className="shell">
          <div className="kicker" style={{ marginBottom: 24 }}>
            Projects
          </div>
          <h1 className="h-display" style={{ maxWidth: "16ch", marginBottom: 32 }}>
            Things I&rsquo;ve <em className="warm">built</em>, shipped, and learned from.
          </h1>
          <p className="lede" style={{ maxWidth: "64ch" }}>
            Companies, platforms, and experiments — from a dorm-room marketplace through YC to a custom community OS, on-device LLMs, inter-agent middleware, and a few smaller bets.
          </p>
        </div>
      </section>

      <section style={{ paddingTop: 0, paddingBottom: 32 }}>
        <div className="shell">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 24,
            }}
          >
            <div className="kicker">Companies &amp; platforms</div>
            <div
              className="mono"
              style={{
                color: "var(--mute)",
                fontSize: 11,
                letterSpacing: ".06em",
              }}
            >
              {companies.length} entries
            </div>
          </div>
          <div className="proj-grid">
            {companies.map((p) => (
              <ProjectCard key={p.slug} p={p} />
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              margin: "56px 0 24px",
            }}
          >
            <div className="kicker">Tools &amp; experiments</div>
            <div
              className="mono"
              style={{
                color: "var(--mute)",
                fontSize: 11,
                letterSpacing: ".06em",
              }}
            >
              {tools.length} entries
            </div>
          </div>
          <div className="proj-grid">
            {tools.map((p) => (
              <ProjectCard key={p.slug} p={p} />
            ))}
            <Link
              href="/contact"
              className="proj-card"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 280,
                textAlign: "center",
              }}
            >
              <div style={{ padding: 40 }}>
                <div className="kicker" style={{ justifyContent: "center", marginBottom: 16 }}>
                  More cooking
                </div>
                <div className="title-3" style={{ marginBottom: 12 }}>
                  Got an idea worth shipping?
                </div>
                <div style={{ color: "var(--mute)", fontSize: 14 }}>
                  I&rsquo;m always interested in the right collaboration. Send a note <span className="warm">↗</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
