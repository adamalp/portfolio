import type { Metadata } from "next";
import { SITE, skillText } from "@/lib/skillText";
import CopyButton from "./CopyButton";

export const metadata: Metadata = { title: "Adam's Moving Sale · for AI assistants", description: "Let your AI assistant browse the sale and build your bids." };

export default function SkillPage() {
  const prompt = `Read ${SITE}/SKILL.md and follow it. Then show me what's for sale that fits: `;
  return (
    <div className="wrap skillpage">
      <a className="back" href="/">← Back to the sale</a>
      <header className="hero">
        <div className="eyebrow">For AI assistants</div>
        <h1>Let your assistant shop the sale</h1>
        <p className="lede">Using Claude, ChatGPT, or another assistant? Give it this skill and it can read the live catalog with photos, prices and current bids, help you decide, and hand you a link with your cart ready to send.</p>
      </header>

      <section className="how">
        <h2>Fastest way</h2>
        <p>Paste this into any assistant that can read the web:</p>
        <pre className="code">{prompt}<em>a studio, mostly need a bed setup and kitchen basics, budget $300</em></pre>
        <CopyButton text={prompt} label="Copy the prompt" />
      </section>

      <section className="how">
        <h2>Or install it as a skill</h2>
        <p>Save the text below as <code>SKILL.md</code> in a Claude project, a ChatGPT custom GPT, or your agent&apos;s skills folder. It&apos;s also served raw at <a href="/SKILL.md">{SITE}/SKILL.md</a>.</p>
        <pre className="code small">{skillText}</pre>
        <CopyButton text={skillText} label="Copy SKILL.md" />
      </section>

      <section className="how">
        <h2>What&apos;s under the hood</h2>
        <ul>
          <li><a href="/api/items">{SITE}/api/items</a>: live JSON of every item, no auth, CORS open.</li>
          <li><code>{SITE}/?cart=2:300,22:20</code>: opens the site with those bids in the cart. Your assistant builds this; you tap it and send.</li>
          <li><code>{SITE}/?item=18</code>: jumps to one item.</li>
        </ul>
        <p className="muted">Assistants can&apos;t place bids for you. Every bid still goes through the cart with your name and phone number, so nothing is sent without you.</p>
      </section>
    </div>
  );
}
