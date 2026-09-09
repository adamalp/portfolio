"use client";
import { useState } from "react";

export const AGENT_PROMPT = "Read https://sale.adam-alpert.com/SKILL.md and use it to help me shop Adam's moving sale. Show me what's available with photos and current bids, help me pick what fits, and give me a link with my cart ready to send.";

/** A copy-paste prompt for buyers who want their own Claude or ChatGPT to shop the sale. */
export default function CopyPrompt({ compact = false }: { compact?: boolean }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(AGENT_PROMPT); setDone(true); setTimeout(() => setDone(false), 1500); } catch {}
  }
  return (
    <div className={`copyprompt ${compact ? "compact" : ""}`}>
      <div className="cp-label">Using your own Claude or ChatGPT? Copy and paste this:</div>
      <div className="cp-row">
        <pre className="cp-text">{AGENT_PROMPT}</pre>
        <button type="button" className="btn ghost small" onClick={copy}>{done ? "Copied ✓" : "Copy prompt"}</button>
      </div>
    </div>
  );
}
