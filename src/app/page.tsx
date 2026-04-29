import Link from "next/link";
import {
  affiliations,
  buildProjects,
  homeBeliefs,
  homeStats,
  writingPosts,
} from "@/lib/siteMap";
import { TopoShader } from "@/components/effects";

const currentFocus = [
  {
    slug: "pangea",
    role: "Co-founder & CEO",
    name: "Pangea",
    ital: ".app",
    desc: "The first AI-native staffing platform for fractional creative, marketing, and growth talent. Built from a Brown dorm room through YC to a profitable marketplace operating in 150+ countries.",
    tag: "Active · 2017→",
    href: "/projects/pangea",
  },
  {
    slug: "founder-communities",
    role: "Founder",
    name: "Founder",
    ital: " communities",
    desc: "Curated IRL networks in NYC and Cambridge — intimate dinners, real collisions, and a custom platform I built from scratch. NYC has grown to 5,000+ in network with ~50 paid members.",
    tag: "Active · 2022→",
    href: "/projects/founder-communities",
  },
  {
    slug: "mit",
    role: "MBA Candidate, '27",
    name: "MIT",
    ital: " Sloan",
    desc: "Deep in agentic AI — building experimental platforms around agentic CRMs, memory systems, and agent-to-agent interactions. On the MIT $100K leadership team and bridging Sloan with the Media Lab.",
    tag: "Active · 2025→",
    href: "/story/mit",
  },
];

const sideRibbon = buildProjects.filter((p) => p.type === "tool").slice(0, 4);

export default function Home() {
  return (
    <div className="page" data-page="home">
      {/* HERO */}
      <section className="hero">
        <TopoShader />
        <div className="hero-grid" />

        <div className="shell hero-inner">
          <div className="hero-text">
            <div className="hero-status">
              <span className="pulse" />
              <span>Now · MIT Sloan · scaling Pangea · Cambridge, MA</span>
            </div>
            <h1 className="hero-headline">
              I build <span className="ital">marketplaces,</span>
              <br />
              <span className="ember">AI products,</span> and
              <br />
              founder <span className="mark">communities.</span>
            </h1>
            <p className="hero-sub">
              I&rsquo;m <span className="name">Adam Alpert</span> — applied AI
              engineer, founder, and MIT Sloan MBA. I started a company in a
              dorm room, took it through Y&nbsp;Combinator, and I&rsquo;ve been
              building at the intersection of technology and human connection
              ever since.
            </p>
            <div className="hero-actions">
              <Link href="/projects" className="btn btn-primary">
                See what I&rsquo;ve built <span className="arr">→</span>
              </Link>
              <Link href="/about" className="btn btn-ghost">
                My story <span className="arr">↗</span>
              </Link>
            </div>
          </div>

          <aside className="hero-side">
            <div className="eyebrow">
              <span className="dot" />
              Working numbers
            </div>
            <div className="stat-stack">
              {homeStats.map((s) => (
                <div key={s.label} className="stat">
                  <div className="stat-num">
                    {s.num}
                    <span className="unit">{s.unit}</span>
                  </div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="hero-meta">
          <span>◉ SYS · live · {new Date().getFullYear()}</span>
          <span className="hidden md:inline">cursor ↔ topo field</span>
          <span className="scroll">
            Scroll
            <span className="scroll-bar" />
          </span>
        </div>
      </section>

      {/* AFFILIATIONS */}
      <div className="shell">
        <div className="affil">
          <span className="affil-label">Affiliations &amp; backers</span>
          {affiliations.map((a) => (
            <span key={a.name} className="affil-item">
              <span className="seal">{a.mark}</span>
              {a.name} <span className="dim">· {a.meta}</span>
            </span>
          ))}
        </div>
      </div>

      {/* CURRENT FOCUS */}
      <section style={{ padding: "clamp(64px, 10vh, 140px) 0" }}>
        <div className="shell">
          <div className="sec-head">
            <div className="sec-num">
              <span className="slash">/</span> 01 — CURRENT FOCUS
            </div>
            <h2 className="sec-title">Where my time and energy actually goes.</h2>
          </div>
          <div className="now-grid">
            {currentFocus.map((n) => (
              <Link key={n.slug} href={n.href} className="now-card">
                <div className="now-role">
                  <span className="live" />
                  {n.role}
                </div>
                <h3 className="now-name">
                  {n.name}
                  <span className="ital">{n.ital}</span>
                </h3>
                <p className="now-desc">{n.desc}</p>
                <div className="now-meta">
                  <span>{n.tag}</span>
                  <span className="arr">↗</span>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ marginTop: 56 }}>
            <div className="kicker" style={{ marginBottom: 20 }}>
              Also building
            </div>
            <div className="ribbon">
              {sideRibbon.map((s) => (
                <Link
                  key={s.slug}
                  href={`/projects/${s.slug}`}
                  className="ribbon-item"
                >
                  <div className="ribbon-name">
                    {s.title}
                    {s.ital ?? ""}
                  </div>
                  <div className="ribbon-tag">
                    {(s.tags ?? []).slice(0, 2).join(" · ") || s.role}
                  </div>
                </Link>
              ))}
            </div>
            <div style={{ marginTop: 28 }}>
              <Link href="/projects" className="btn btn-ghost">
                View all projects <span className="arr">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* THESIS / BELIEFS */}
      <section style={{ padding: "clamp(64px, 10vh, 140px) 0" }}>
        <div className="shell">
          <div className="sec-head">
            <div className="sec-num">
              <span className="slash">/</span> 02 — THESIS
            </div>
            <h2 className="sec-title">What I believe, mostly without flinching.</h2>
          </div>
          <div className="beliefs">
            {homeBeliefs.map((b, i) => (
              <div key={i} className="belief">
                <div className="belief-num">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="belief-body">
                  <div className="belief-lead">
                    {b.lead}{" "}
                    {b.ital && <span className="ital">{b.ital}</span>}
                  </div>
                  <div className="belief-detail">{b.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WRITING PREVIEW */}
      <section style={{ padding: "clamp(64px, 10vh, 140px) 0" }}>
        <div className="shell">
          <div className="sec-head">
            <div className="sec-num">
              <span className="slash">/</span> 03 — FIELD NOTES
            </div>
            <h2 className="sec-title">Writing on marketplaces, communities, and building.</h2>
          </div>
          <div className="list-rows">
            {writingPosts.slice(0, 3).map((w, i) => (
              <Link key={w.slug} href={`/writing/${w.slug}`} className="row">
                <span className="row-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="row-title">{w.title}</div>
                  <div
                    className="row-meta"
                    style={{ marginTop: 6, textTransform: "uppercase" }}
                  >
                    {(w.tags?.[0] ?? "")} · {w.readingTime}
                  </div>
                </div>
                <span className="arr mono">↗</span>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 32 }}>
            <Link href="/writing" className="btn btn-ghost">
              All writing <span className="arr">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "clamp(64px, 10vh, 140px) 0 140px" }}>
        <div className="shell">
          <div
            style={{
              border: "1px solid var(--line)",
              padding: "clamp(40px, 6vw, 80px)",
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 32,
              background: "linear-gradient(180deg, var(--ink-2), var(--ink))",
            }}
          >
            <div>
              <div className="kicker" style={{ marginBottom: 20 }}>
                Open for conversation
              </div>
              <h2 className="h-1" style={{ maxWidth: "18ch" }}>
                If you&rsquo;re building something{" "}
                <em className="warm">ambitious</em>, let&rsquo;s talk.
              </h2>
            </div>
            <p className="lede" style={{ maxWidth: "60ch" }}>
              Marketplaces, AI-native products, founder communities, hiring,
              fundraising. Or just to compare notes. I read every email.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/contact" className="btn btn-primary">
                Get in touch <span className="arr">→</span>
              </Link>
              <Link href="/about" className="btn btn-ghost">
                Read my full story
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
