import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Friend Roulette · Support",
  description:
    "Help and FAQs for Friend Roulette. Email aalpert421@gmail.com for anything not covered here.",
};

const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: "How do I add more contacts?",
    a: (
      <p>
        Tap <strong>Manage</strong> at the top right, then{" "}
        <strong>Add contact</strong>. If you only granted access to specific
        contacts when you first installed Friend Roulette, you&rsquo;ll see a
        banner offering to add more without leaving the app, or to grant full
        access in Settings.
      </p>
    ),
  },
  {
    q: "How do I change how often I see someone?",
    a: (
      <p>
        Tap their name on the <strong>My contacts</strong> screen, then tap a
        different cadence chip — Weekly, Monthly, Quarterly, or Yearly. To
        change several at once, long-press a contact to enter select mode, pick
        more, and tap <strong>Change frequency</strong>.
      </p>
    ),
  },
  {
    q: "Why is the same person coming up twice?",
    a: (
      <p>
        Friend Roulette uses weighted random selection — people who are due to
        hear from you are more likely to come up, but it&rsquo;s still a roll
        of the dice. If someone keeps appearing, tap <strong>Roll again</strong>{" "}
        or swipe the card away to draw the next contact.
      </p>
    ),
  },
  {
    q: "How do I record that I've reached out to someone?",
    a: (
      <p>
        After you text or call from the roulette, tap{" "}
        <strong>Log connection</strong> and add a quick note (or skip the note
        — it&rsquo;s optional). This updates your &ldquo;last contacted&rdquo;
        date so they won&rsquo;t immediately show up again.
      </p>
    ),
  },
  {
    q: "Can I edit when I last contacted someone?",
    a: (
      <p>
        Yes. Open their contact detail page and tap{" "}
        <strong>Last contacted</strong> — you can pick any past date or mark
        them as never contacted.
      </p>
    ),
  },
  {
    q: "Where is my data stored?",
    a: (
      <p>
        Everything stays on your phone. Friend Roulette does not have a server
        and does not collect any of your information. See the{" "}
        <Link href="/friend-roulette/privacy" className="inline-link">
          privacy policy
        </Link>{" "}
        for details.
      </p>
    ),
  },
  {
    q: "How do I delete a contact?",
    a: (
      <p>
        Long-press them on the <strong>My contacts</strong> list, or open their
        detail page and tap <strong>Remove from roulette</strong>. Their
        interaction history is removed too.
      </p>
    ),
  },
  {
    q: "Will my data move to a new phone?",
    a: (
      <p>
        Currently no. Because everything is stored locally, switching to a new
        phone means starting fresh. Cloud sync is on the roadmap as a future
        paid feature.
      </p>
    ),
  },
  {
    q: "Notifications aren't appearing.",
    a: (
      <p>
        Open iOS <strong>Settings → Notifications → Friend Roulette</strong> and
        make sure notifications are allowed. The app schedules one local daily
        reminder at 9 AM. If you&rsquo;ve recently changed time zones or the
        system date, force-close and reopen the app to reschedule.
      </p>
    ),
  },
  {
    q: "How do I uninstall?",
    a: (
      <p>
        Long-press the app icon on your home screen →{" "}
        <strong>Remove app</strong> → <strong>Delete app</strong>. All Friend
        Roulette data is permanently deleted with it.
      </p>
    ),
  },
];

export default function FriendRouletteSupport() {
  return (
    <div className="page" data-page="friend-roulette-support">
      <section style={{ paddingTop: 64, paddingBottom: 32 }}>
        <div className="shell" style={{ maxWidth: 760 }}>
          <Link href="/projects/friend-roulette" className="detail-back">
            ← Friend Roulette
          </Link>
          <div className="detail-eyebrow">
            <span className="role">Friend Roulette</span>
            <span className="dim">·</span>
            <span>Support</span>
          </div>
          <h1 className="h-1" style={{ marginBottom: 28 }}>
            Support
          </h1>
          <p className="lede" style={{ marginBottom: 40 }}>
            Need help? Email{" "}
            <a href="mailto:aalpert421@gmail.com" className="inline-link">
              aalpert421@gmail.com
            </a>{" "}
            and I&rsquo;ll get back to you. A few common questions are answered
            below.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderTop: "1px solid var(--line)",
            }}
          >
            {faqs.map((f, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr)",
                  gap: 12,
                  padding: "28px 0",
                  borderBottom: "1px solid var(--line)",
                }}
              >
                <h2
                  className="h-3"
                  style={{ margin: 0, color: "var(--paper)" }}
                >
                  {f.q}
                </h2>
                <div
                  className="dsec-body"
                  style={{ color: "var(--paper-dim)" }}
                >
                  {f.a}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 48,
              padding: "32px",
              border: "1px solid var(--line)",
              background: "var(--ink-2)",
            }}
          >
            <div className="kicker" style={{ marginBottom: 16 }}>
              Still stuck?
            </div>
            <p
              className="serif"
              style={{
                fontSize: 19,
                lineHeight: 1.5,
                color: "var(--paper-dim)",
                marginBottom: 20,
              }}
            >
              Email me at{" "}
              <a href="mailto:aalpert421@gmail.com" className="inline-link">
                aalpert421@gmail.com
              </a>{" "}
              with a description of what&rsquo;s happening and a screenshot if
              you have one. I&rsquo;ll respond within a couple of days.
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--mute)",
                letterSpacing: "0.06em",
              }}
            >
              — ADAM ALPERT
            </p>
          </div>

          <nav
            style={{
              marginTop: 48,
              paddingTop: 32,
              borderTop: "1px solid var(--line)",
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              fontFamily: "var(--font-mono)",
              fontSize: 13,
            }}
          >
            <Link
              href="/friend-roulette/privacy"
              style={{ color: "var(--mute)" }}
              className="hover:text-[var(--ember)] transition-colors"
            >
              Privacy policy →
            </Link>
            <Link
              href="/projects/friend-roulette"
              style={{ color: "var(--mute)" }}
              className="hover:text-[var(--ember)] transition-colors"
            >
              ← Back to Friend Roulette
            </Link>
          </nav>
        </div>
      </section>
    </div>
  );
}
