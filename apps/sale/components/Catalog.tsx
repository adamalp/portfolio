"use client";
import { useMemo, useState } from "react";
import type { PublicItem } from "@/lib/db";

const fmt = (n: number | null | undefined) => (n == null ? null : "$" + Math.round(n).toLocaleString());

export default function Catalog({ items }: { items: PublicItem[] }) {
  const cats = useMemo(() => Array.from(new Set(items.map((i) => i.category))), [items]);
  const [cat, setCat] = useState("All");
  const [hideSold, setHideSold] = useState(false);
  const [offers, setOffers] = useState<Record<number, string>>({}); // item id -> amount text
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [note, setNote] = useState("");
  const [state, setState] = useState<{ kind: "idle" | "sending" | "done" | "error"; msg?: string }>({ kind: "idle" });

  const selected = items.filter((i) => offers[i.id] !== undefined);
  const total = selected.reduce((s, i) => s + (parseFloat(offers[i.id]) || 0), 0);

  function toggle(it: PublicItem) {
    setOffers((o) => {
      const n = { ...o };
      if (n[it.id] !== undefined) delete n[it.id];
      else n[it.id] = it.best_offer ? String(Math.round(it.best_offer * 1.1)) : it.asking_price ? String(it.asking_price) : "";
      return n;
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const bad = selected.filter((i) => !(parseFloat(offers[i.id]) > 0));
    if (bad.length) return setState({ kind: "error", msg: `Enter a price for: ${bad.map((b) => b.name).join(", ")}` });
    setState({ kind: "sending" });
    const res = await fetch("/api/offers", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, contact, note, offers: selected.map((i) => ({ item_id: i.id, amount: parseFloat(offers[i.id]) })) }),
    });
    if (res.ok) {
      setState({ kind: "done", msg: `Sent ${selected.length} offer${selected.length > 1 ? "s" : ""} — I'll get back to you at ${contact}.` });
      setOffers({});
    } else {
      const j = await res.json().catch(() => ({}));
      setState({ kind: "error", msg: j.error || "Something went wrong — try again." });
    }
  }

  const visibleCats = cats.filter((c) => cat === "All" || c === cat);

  return (
    <>
      <div className="toolbar">
        {["All", ...cats].map((c) => (
          <button key={c} className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
        ))}
        <label className="tog"><input type="checkbox" checked={hideSold} onChange={(e) => setHideSold(e.target.checked)} /> Hide sold</label>
      </div>
      <main>
        {visibleCats.map((c) => {
          const list = items.filter((i) => i.category === c && !(hideSold && i.status === "Sold"));
          if (!list.length) return null;
          return (
            <section className="cat" key={c}>
              <h2>{c} <small>{list.length} item{list.length > 1 ? "s" : ""}</small></h2>
              <div className="grid">
                {list.map((it) => {
                  const sold = it.status === "Sold";
                  const sel = offers[it.id] !== undefined;
                  return (
                    <article key={it.id} className={`card ${sold ? "sold" : ""} ${sel ? "selected" : ""}`}>
                      <div className="top">
                        <h3>{it.name}{it.qty > 1 && <span className="qty"> ×{it.qty}</span>}</h3>
                        <span className={`pill ${it.status}`}>{it.status}</span>
                      </div>
                      {it.dimensions && <div className="dims">{it.dimensions}</div>}
                      <p className="desc">{it.description}</p>
                      <div className="foot">
                        {sold ? (
                          <span className="price">Sold{it.sold_price ? <> · <b>{fmt(it.sold_price)}</b></> : null}</span>
                        ) : it.best_offer ? (
                          <span className="price">Best offer so far <b>{fmt(it.best_offer)}</b>{it.asking_price ? <> · asking {fmt(it.asking_price)}</> : null}</span>
                        ) : it.asking_price ? (
                          <span className="price">Asking <b>{fmt(it.asking_price)}</b></span>
                        ) : (
                          <span className="price">No offers yet</span>
                        )}
                        {sold ? (
                          <span className="btn" aria-disabled="true">Sold</span>
                        ) : sel ? (
                          <span className="offer-in">
                            $<input type="number" min={1} step={1} inputMode="numeric" value={offers[it.id]} placeholder="your offer"
                              onChange={(e) => setOffers((o) => ({ ...o, [it.id]: e.target.value }))} aria-label={`Your offer for ${it.name}`} />
                            <button className="btn ghost small" onClick={() => toggle(it)} aria-label="Remove">✕</button>
                          </span>
                        ) : (
                          <button className="btn" onClick={() => toggle(it)}>I want this</button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      {(selected.length > 0 || state.kind === "done") && (
        <div className="tray" role="region" aria-label="Your offers">
          <div className="in">
            {state.kind === "done" ? (
              <div className="row"><span className="ok">{state.msg}</span><button className="btn ghost" onClick={() => setState({ kind: "idle" })}>Make another</button></div>
            ) : (
              <>
                <div className="row">
                  <span className="sum"><b>{selected.length}</b> item{selected.length > 1 ? "s" : ""} · your offers total <b>{fmt(total)}</b></span>
                  <span className="muted">{selected.map((i) => i.name).join(" · ")}</span>
                </div>
                <form onSubmit={submit}>
                  <input required placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                  <input required placeholder="Phone or email" value={contact} onChange={(e) => setContact(e.target.value)} autoComplete="tel" />
                  <textarea placeholder="Anything else? (pickup timing, questions, bundle deal…)" value={note} onChange={(e) => setNote(e.target.value)} />
                  <div className="actions">
                    {state.kind === "error" && <span className="err">{state.msg}</span>}
                    <button className="btn" type="submit" disabled={state.kind === "sending"}>{state.kind === "sending" ? "Sending…" : "Send offers"}</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
