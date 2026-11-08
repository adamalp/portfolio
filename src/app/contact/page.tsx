import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch — advising, speaking, founder communities, and collaboration.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact · Adam Alpert",
    description:
      "Get in touch — advising, speaking, founder communities, and collaboration.",
    url: "/contact",
    type: "website",
  },
};

const cways = [
  {
    tag: "Email",
    name: "aalpert421@gmail.com",
    href: "mailto:aalpert421@gmail.com",
    external: false,
  },
  {
    tag: "LinkedIn",
    name: "/in/adamalpert",
    href: "https://linkedin.com/in/adamalp",
    external: true,
  },
  {
    tag: "Pangea",
    name: "Hire fractional talent",
    href: "https://pangea.app",
    external: true,
  },
  {
    tag: "NYFC / CFC",
    name: "Apply to founder communities",
    href: "mailto:aalpert421@gmail.com?subject=Founder%20Communities",
    external: false,
  },
  {
    tag: "X",
    name: "@the_pangean",
    href: "https://x.com/the_pangean",
    external: true,
  },
  {
    tag: "Agents",
    name: "Skill file for your AI assistant",
    href: "/SKILL.md",
    external: false,
  },
];

export default function ContactPage() {
  return (
    <div className="page" data-page="contact">
      <section style={{ paddingTop: 64 }}>
        <div className="shell">
          <div className="kicker" style={{ marginBottom: 24 }}>
            Contact
          </div>
          <h1
            className="h-display"
            style={{ maxWidth: "14ch", marginBottom: 56 }}
          >
            Let&rsquo;s find out if there&rsquo;s a{" "}
            <em className="warm">there</em> there.
          </h1>
        </div>
      </section>

      <section style={{ paddingTop: 0, paddingBottom: 140 }}>
        <div className="shell">
          <div className="contact-hero">
            <div>
              <p className="lede" style={{ marginBottom: 32 }}>
                If you&rsquo;re building something ambitious and want help with
                product, marketplaces, AI, or founder communities — or just
                want to compare notes — I&rsquo;m always open to good
                conversations.
              </p>

              <div className="kicker" style={{ margin: "24px 0 8px" }}>
                Ways to collaborate
              </div>
              <div className="cways">
                {cways.map((c) =>
                  c.external ? (
                    <a
                      key={c.tag + c.name}
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cway"
                    >
                      <span className="cway-tag">{c.tag}</span>
                      <span className="cway-name">{c.name}</span>
                      <span className="cway-arr">↗</span>
                    </a>
                  ) : (
                    <Link
                      key={c.tag + c.name}
                      href={c.href}
                      className="cway"
                    >
                      <span className="cway-tag">{c.tag}</span>
                      <span className="cway-name">{c.name}</span>
                      <span className="cway-arr">↗</span>
                    </Link>
                  )
                )}
              </div>

              <div
                style={{
                  marginTop: 32,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--mute)",
                  letterSpacing: "0.06em",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--signal)",
                    boxShadow: "0 0 8px var(--signal)",
                  }}
                  className="animate-pulse-slow"
                />
                <span>
                  OPEN · CONVERSATIONS &amp; COLLABORATIONS · SAN FRANCISCO · REPLIES IN 24–48 HOURS
                </span>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}

