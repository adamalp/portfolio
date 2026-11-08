"use client";

import { useState } from "react";

type State = "idle" | "sending" | "sent" | "error";

/** Posts to /api/messages (lands in agent_messages); falls back to email if the store is offline. */
export function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? "").trim() || undefined,
      email: String(fd.get("email") ?? "").trim() || undefined,
      message: String(fd.get("context") ?? "").trim(),
      intent: "other",
      agent: "contact-form",
    };
    if (!payload.message) {
      setError("Add a line about what you're building.");
      setState("error");
      return;
    }
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error ?? `Request failed (${res.status})`);
      }
      form.reset();
      setState("sent");
    } catch (err) {
      setError((err as Error).message);
      setState("error");
    }
  }

  return (
    <form className="contact-form" onSubmit={onSubmit}>
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
          required
          placeholder="What are you building? What kind of conversation are you hoping to have?"
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={state === "sending"}
        style={{ width: "100%", justifyContent: "center" }}
      >
        {state === "sending" ? "Sending…" : state === "sent" ? "Sent ✓" : "Send"}{" "}
        {state === "idle" && <span className="arr">→</span>}
      </button>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          color: state === "error" ? "var(--ember)" : "var(--mute)",
          fontSize: 10,
          letterSpacing: "0.06em",
          marginTop: 16,
        }}
      >
        {state === "sent" && "Got it. Replies typically within 48 hours."}
        {state === "error" && (
          <>
            {error} If this keeps failing, email{" "}
            <a href="mailto:aalpert421@gmail.com" style={{ textDecoration: "underline" }}>
              aalpert421@gmail.com
            </a>
            .
          </>
        )}
        {(state === "idle" || state === "sending") && "Replies typically within 48 hours."}
      </p>
    </form>
  );
}
