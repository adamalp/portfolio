"use client";
import { useState } from "react";

/** Small "Copy" button for a prepared message; falls back to a prompt on browsers without clipboard access. */
export default function CopyText({ text, label = "Copy text" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="btn ghost small"
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); }
        catch { window.prompt("Copy this message:", text); }
      }}
    >
      {done ? "Copied ✓" : label}
    </button>
  );
}
