import Link from "next/link";
import { buildProjects } from "@/lib/siteMap";

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--line)",
        padding: "60px 0 40px",
        background: "var(--ink)",
      }}
    >
      <div className="shell">
        <div
          className="grid gap-10"
          style={{ gridTemplateColumns: "1fr" }}
        >
          <div className="md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:gap-10 grid grid-cols-1 gap-10">
            <div>
              <div className="kicker" style={{ marginBottom: 18 }}>
                Adam Alpert · Portfolio
              </div>
              <p
                className="serif"
                style={{
                  maxWidth: "38ch",
                  fontSize: 19,
                  lineHeight: 1.4,
                  color: "var(--paper-dim)",
                }}
              >
                Founder, builder, operator. Currently at <em>MIT Sloan</em>,
                scaling <em>Pangea</em>, running founder communities in NYC &amp;
                Cambridge.
              </p>
            </div>

            <FooterCol
              heading="Pages"
              items={[
                { label: "Home", href: "/" },
                { label: "Projects", href: "/projects" },
                { label: "About", href: "/about" },
                { label: "Writing", href: "/writing" },
              ]}
            />

            <FooterCol
              heading="Projects"
              items={buildProjects.map((p) => ({
                label: p.title,
                href: `/projects/${p.slug}`,
              }))}
            />

            <FooterCol
              heading="Elsewhere"
              items={[
                { label: "Email →", href: "mailto:aalpert421@gmail.com" },
                { label: "LinkedIn ↗", href: "https://linkedin.com/in/adamalp", external: true },
                { label: "GitHub ↗", href: "https://github.com/adamalp", external: true },
                { label: "X ↗", href: "https://x.com/the_pangean", external: true },
              ]}
            />
          </div>

          <div
            className="flex flex-wrap items-center justify-between"
            style={{
              marginTop: 60,
              paddingTop: 24,
              borderTop: "1px solid var(--line)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--mute)",
              letterSpacing: "0.06em",
              gap: 12,
            }}
          >
            <span>© {new Date().getFullYear()} ADAM ALPERT · CAMBRIDGE, MA</span>
            <span>BUILT WITH NEXT.JS · DEPLOYED ON VERCEL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  heading,
  items,
}: {
  heading: string;
  items: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div>
      <h4
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--mute)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 16,
        }}
      >
        {heading}
      </h4>
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, padding: 0 }}>
        {items.map((item) => (
          <li key={item.label}>
            {item.external ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 14,
                  color: "var(--paper-dim)",
                }}
                className="hover:text-[var(--ember)] transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <Link
                href={item.href}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 14,
                  color: "var(--paper-dim)",
                }}
                className="hover:text-[var(--ember)] transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
