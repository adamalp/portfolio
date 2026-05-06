import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Friend Roulette · Privacy",
  description:
    "Friend Roulette does not collect, transmit, or store your personal data on our servers. Everything stays on your device.",
};

export default function FriendRoulettePrivacy() {
  return (
    <div className="page" data-page="friend-roulette-privacy">
      <section style={{ paddingTop: 64, paddingBottom: 32 }}>
        <div className="shell" style={{ maxWidth: 760 }}>
          <Link href="/projects/friend-roulette" className="detail-back">
            ← Friend Roulette
          </Link>
          <div className="detail-eyebrow">
            <span className="role">Friend Roulette</span>
            <span className="dim">·</span>
            <span>Privacy Policy</span>
            <span className="dim">·</span>
            <span>Last updated May 6, 2026</span>
          </div>
          <h1 className="title-1" style={{ marginBottom: 28 }}>
            Privacy Policy
          </h1>
          <p className="lede" style={{ marginBottom: 40 }}>
            Friend Roulette is built to help you stay in touch with the people
            who matter to you. We treat your privacy with the seriousness that
            subject deserves.
          </p>

          <Prose>
            <h2>The short version</h2>
            <p>
              <strong>
                Friend Roulette does not collect, transmit, or store your
                personal data on our servers.
              </strong>{" "}
              The contacts you choose, the notes you write, and the connections
              you log all live only on your device.
            </p>
            <p>
              The one exception is anonymous crash and error reports, which we
              use solely to find and fix bugs. These reports never include your
              contacts, notes, or any personal content — see{" "}
              <strong>Crash reports</strong> below for details.
            </p>

            <h2>What stays on your device</h2>
            <p>
              When you use Friend Roulette, the following information is stored
              locally in your phone&rsquo;s app sandbox:
            </p>
            <ul>
              <li>The contacts you&rsquo;ve chosen to include in your roulette (name, phone number)</li>
              <li>The frequency you&rsquo;ve assigned to each contact</li>
              <li>The interactions you&rsquo;ve logged (date, type, notes you&rsquo;ve written)</li>
            </ul>
            <p>
              This data is never sent off your device. If you delete the app,
              this information is permanently deleted with it.
            </p>

            <h2>Permissions we request</h2>
            <p>
              Friend Roulette only asks for permissions it uses locally on your
              device:
            </p>
            <ul>
              <li>
                <strong>Contacts.</strong> We read your contacts so you can
                pick people to include in your roulette. Friend Roulette never
                uploads, shares, or transmits your contacts. You may grant
                access to all contacts or only specific ones — both work fully.
              </li>
              <li>
                <strong>Notifications.</strong> We schedule a daily local
                reminder so you can be nudged to reach out. The notification is
                generated and delivered entirely on your device. We do not use
                push notifications and do not have any server-side notification
                infrastructure.
              </li>
              <li>
                <strong>Microphone & speech recognition.</strong> When you
                choose to dictate a note, your voice is transcribed on-device.
                The audio is not recorded, stored, or sent off your device.
              </li>
              <li>
                <strong>Background app refresh.</strong> Friend Roulette uses
                the system background-refresh capability to update your daily
                roulette pick so notifications can name the friend you&rsquo;re
                being reminded about. No network requests are made — this is a
                fully on-device operation.
              </li>
            </ul>

            <h2>Crash reports</h2>
            <p>
              To find and fix bugs, Friend Roulette sends anonymous crash and
              error reports to <strong>Sentry</strong>, an industry-standard
              diagnostics service. These reports are limited to technical
              information about the crash itself — the type of error, the line
              of code that failed, your device model, and the app version.
            </p>
            <p>
              We have configured Sentry to{" "}
              <strong>strip any potentially personal fields</strong> (such as
              contact names, phone numbers, and note text) before reports are
              sent. We do not send your IP address as identifying data, and we
              do not link reports to a user account (we do not have user
              accounts).
            </p>
            <p>
              If you would prefer not to send crash reports, you can disable
              network access for Friend Roulette in your device settings; the
              app remains fully functional without it.
            </p>

            <h2>What we don&rsquo;t do</h2>
            <ul>
              <li>We do not have user accounts.</li>
              <li>
                We do not collect product analytics or usage data (no Google
                Analytics, Firebase, Amplitude, Mixpanel, etc.).
              </li>
              <li>We do not advertise.</li>
              <li>We do not sell, share, or rent any information.</li>
            </ul>

            <h2>Children</h2>
            <p>
              Friend Roulette is not directed to children under 13. We do not
              knowingly collect any data from anyone, including children.
            </p>

            <h2>Changes</h2>
            <p>
              If this policy ever changes — for example, if a future version of
              Friend Roulette adds optional cloud sync — we&rsquo;ll update this
              page and bump the &ldquo;Last updated&rdquo; date. Material
              changes that affect data collection will be highlighted in the
              app on first launch after the change.
            </p>

            <h2>Contact</h2>
            <p>
              Questions, concerns, or requests? Email{" "}
              <a href="mailto:aalpert421@gmail.com" className="inline-link">
                aalpert421@gmail.com
              </a>
              .
            </p>
            <p style={{ color: "var(--mute)" }}>— Adam Alpert</p>
          </Prose>

          <FooterNav />
        </div>
      </section>
    </div>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <article className="dsec-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {children}
    </article>
  );
}

function FooterNav() {
  return (
    <nav
      style={{
        marginTop: 64,
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
        href="/friend-roulette/support"
        style={{ color: "var(--mute)" }}
        className="hover:text-[var(--ember)] transition-colors"
      >
        Support →
      </Link>
      <Link
        href="/projects/friend-roulette"
        style={{ color: "var(--mute)" }}
        className="hover:text-[var(--ember)] transition-colors"
      >
        ← Back to Friend Roulette
      </Link>
    </nav>
  );
}
