import type { Metadata } from "next";
import Link from "next/link";

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
                  OPEN · CONVERSATIONS &amp; SUMMER 2026 OPPORTUNITIES · REPLIES IN 24–48 HOURS
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

function ContactForm() {
  return (
    <form
      className="contact-form"
      action="mailto:aalpert421@gmail.com"
      method="post"
      encType="text/plain"
    >
      <div className="kicker" style={{ marginBottom: 20 }}>
        Or send a note
      </div>
      <div className="field">
        <label htmlFor="contact-name">Name</label>
        <input id="contact-name" name="name" type="text" placeholder="Your name" />
      </div>
      <div className="field">
        <label htmlFor="contact-email">Email</label>
        <input id="contact-email" name="email" type="email" placeholder="you@domain.com" />
      </div>
      <div className="field">
        <label htmlFor="contact-context">Context</label>
        <textarea
          id="contact-context"
          name="context"
          placeholder="What are you building? What kind of conversation are you hoping to have?"
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: "100%", justifyContent: "center" }}
      >
        Send <span className="arr">→</span>
      </button>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--mute)",
          fontSize: 10,
          letterSpacing: "0.06em",
          marginTop: 16,
        }}
      >
        Replies typically within 48 hours.
      </p>
    </form>
  );
}
