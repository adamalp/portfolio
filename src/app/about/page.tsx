import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { adventures, storyChapters, timelineEntries } from "@/lib/siteMap";

export const metadata: Metadata = {
  title: "About",
  description:
    "Adam Alpert — founder, builder, operator. Six chapters of life and work, a chronological timeline, and the adventures in between.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About · Adam Alpert",
    description:
      "Six chapters of life and work — Brown, NOLS Alaska, Pangea, Y Combinator, NYC, MIT Sloan — plus a timeline and adventures.",
    url: "/about",
    type: "profile",
  },
};

const storyLedes: Record<string, string> = {
  upbringing:
    "Early creativity, family, and the first instinct that I could just make things and put them out into the world.",
  brown:
    "History at Brown, NOLS Alaska, and the first version of what would become Pangea.",
  "rhode-island":
    "Post-grad in Providence, turning a student project into a real company.",
  yc: "W21, $125K, and three months that compressed years of learning into a season.",
  "new-york":
    "Moving to NYC, building a remote-first team, and scaling the marketplace through pivots.",
  mit: "Going back to school. Media Lab, the $100K, and Cambridge Founders Club on top of the ecosystem.",
};

const adventureImages: Record<string, string> = {
  "nols-alaska": "/images/alaska_mammoth_husk.PNG",
  cotopaxi: "/images/cotopaxi_summit.JPG",
  "ski-and-outdoor": "/images/backcountry_ski.JPG",
};

export default function AboutPage() {
  return (
    <div className="page" data-page="about">
      {/* Intro */}
      <section style={{ paddingTop: 64 }}>
        <div className="shell">
          <div className="kicker" style={{ marginBottom: 24 }}>
            About
          </div>
          <h1
            className="h-display"
            style={{ maxWidth: "16ch", marginBottom: 56 }}
          >
            Founder, builder, <em className="warm">operator</em>.
          </h1>

          <div className="about-hero">
            <div>
              <p className="lede" style={{ marginBottom: 24 }}>
                I&rsquo;ve been building things since I was a{" "}
                <Link href="/story/upbringing" className="inline-link">
                  kid filming videos
                </Link>{" "}
                with a cheap HD camera and posting them online. That instinct —
                to take an idea, make it real, and share it with people — has
                shaped almost everything since.
              </p>
              <p
                style={{
                  color: "var(--mute)",
                  fontFamily: "var(--font-sans)",
                  fontSize: 17,
                  lineHeight: 1.6,
                }}
              >
                Started <em>Pangea</em> out of my{" "}
                <Link href="/story/brown" className="inline-link">
                  Brown dorm room
                </Link>
                . Took it through{" "}
                <Link href="/story/rhode-island" className="inline-link">
                  early-stage Rhode Island
                </Link>{" "}
                and{" "}
                <Link href="/story/yc" className="inline-link">
                  Y Combinator W21
                </Link>
                . Built founder communities in{" "}
                <Link href="/story/new-york" className="inline-link">
                  New York
                </Link>{" "}
                and Cambridge. Now digging deeper into systems, AI, and
                strategy at{" "}
                <Link href="/story/mit" className="inline-link">
                  MIT Sloan
                </Link>
                .
              </p>
            </div>
            <div className="about-portrait">
              <Image
                src="/images/adam_professional.JPG"
                alt="Adam Alpert"
                fill
                sizes="(min-width: 800px) 30vw, 90vw"
                className="object-cover"
                priority
              />
              <span className="badge">Cambridge · 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Story chapter index */}
      <section style={{ paddingTop: 96 }}>
        <div className="shell">
          <div className="sec-head">
            <div className="sec-num">
              <span className="slash">/</span> THE LONG VERSION
            </div>
            <h2 className="sec-title">Six chapters, in order.</h2>
          </div>
          <div className="story-grid">
            {storyChapters.map((s, i) => (
              <Link
                key={s.slug}
                href={`/story/${s.slug}`}
                className="story-card"
              >
                <div className="story-num">0{i + 1}</div>
                <div className="story-meta">
                  <div className="story-years">{s.year}</div>
                  <h3 className="story-title">{s.title}</h3>
                  <p className="story-lede">
                    {storyLedes[s.slug] ?? s.subtitle}
                  </p>
                </div>
                <div className="story-arr">→</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Photo strip */}
      <section style={{ paddingTop: 96 }}>
        <div className="shell">
          <div className="strip">
            <div className="strip-item">
              <Image
                src="/images/cotopaxi_summit.JPG"
                alt="Cotopaxi"
                fill
                sizes="(min-width: 720px) 50vw, 100vw"
                className="object-cover"
              />
              <span className="label">Cotopaxi · 2026</span>
            </div>
            <div className="strip-item">
              <Image
                src="/images/nyski_mountin_bouyout.JPG"
                alt="NY Founders Club ski day"
                fill
                sizes="(min-width: 720px) 25vw, 100vw"
                className="object-cover"
              />
              <span className="label">NYFC · ski mountain</span>
            </div>
            <div className="strip-item">
              <Image
                src="/images/tedx.jpg"
                alt="TEDx"
                fill
                sizes="(min-width: 720px) 25vw, 100vw"
                className="object-cover"
              />
              <span className="label">TEDx</span>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: "clamp(64px, 10vh, 140px) 0" }}>
        <div className="shell">
          <div className="sec-head">
            <div className="sec-num">
              <span className="slash">/</span> TIMELINE
            </div>
            <h2 className="sec-title">A roughly chronological pass.</h2>
          </div>

          <div
            style={{
              display: "flex",
              gap: 18,
              marginBottom: 32,
              flexWrap: "wrap",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.06em",
              color: "var(--mute)",
              textTransform: "uppercase",
            }}
          >
            <span>
              <span
                style={{
                  display: "inline-block",
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: "var(--paper)",
                  marginRight: 8,
                  verticalAlign: 1,
                }}
              />
              Story
            </span>
            <span>
              <span
                style={{
                  display: "inline-block",
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: "var(--ember)",
                  marginRight: 8,
                  verticalAlign: 1,
                }}
              />
              Build
            </span>
            <span>
              <span
                style={{
                  display: "inline-block",
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: "var(--signal)",
                  marginRight: 8,
                  verticalAlign: 1,
                }}
              />
              Adventure
            </span>
          </div>

          <div className="tl">
            {timelineEntries.map((t, i) => (
              <Link
                key={`${t.year}-${i}`}
                href={t.link}
                className={`tl-item ${t.category}`}
              >
                <div className="tl-year">{t.year}</div>
                <div className="tl-body">
                  <span className="tl-dot" />
                  <span className="tl-title">{t.title}</span>
                  <span className="tl-cat">{t.category}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Adventures */}
      <section style={{ paddingBottom: 140 }}>
        <div className="shell">
          <div className="sec-head">
            <div className="sec-num">
              <span className="slash">/</span> OUTSIDE
            </div>
            <h2 className="sec-title">Why I keep returning to the mountains.</h2>
          </div>
          <div className="proj-grid">
            {adventures.map((adv) => (
              <Link
                key={adv.slug}
                href={`/adventures/${adv.slug}`}
                className="proj-card"
              >
                <div className="proj-thumb">
                  {adventureImages[adv.slug] && (
                    <Image
                      src={adventureImages[adv.slug]}
                      alt={adv.title}
                      fill
                      sizes="(min-width: 720px) 50vw, 100vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="proj-body">
                  <div className="proj-meta">
                    <span>{adv.title}</span>
                    <span>{adv.year}</span>
                  </div>
                  <h3 className="proj-name">{adv.subtitle}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
