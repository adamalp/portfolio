"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { PublicItem } from "@/lib/db";
import { pickupDays, PICKUP_TIMES } from "@/lib/pickup";

const fmt = (n: number | null | undefined) => (n == null ? null : "$" + Math.round(n).toLocaleString());
const STORAGE = "sale-cart-v1";

type Cart = Record<number, string>; // item id -> amount text

/** Suggested opening bid: a bit over the current best, else the asking price. */
function suggest(it: PublicItem): string {
  if (it.best_offer) return String(Math.max(Math.round(it.best_offer * 1.1), it.best_offer + 5));
  if (it.asking_price) return String(it.asking_price);
  return "";
}

export default function Catalog({ items }: { items: PublicItem[] }) {
  const router = useRouter();
  const cats = useMemo(() => Array.from(new Set(items.map((i) => i.category))), [items]);
  const [cat, setCat] = useState("All");
  const [hideSold, setHideSold] = useState(false);
  const [cart, setCart] = useState<Cart>({});
  const [drafts, setDrafts] = useState<Cart>({}); // per-card input before "Add"
  const [mine, setMine] = useState<Record<number, number>>({}); // item id -> my last submitted bid
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [note, setNote] = useState("");
  const [days, setDays] = useState<string[]>([]);
  const [times, setTimes] = useState<string[]>([]);
  const dayOptions = useMemo(() => pickupDays(), []);
  const toggleIn = (set: React.Dispatch<React.SetStateAction<string[]>>, v: string) =>
    set((arr) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]));
  const [state, setState] = useState<{ kind: "idle" | "sending" | "done" | "error"; msg?: string }>({ kind: "idle" });
  const loaded = useRef(false);

  // Persist the cart so people can come back later.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && typeof saved === "object") {
          setCart(saved.cart ?? {});
          setMine(saved.mine ?? {});
          setName(saved.name ?? "");
          setContact(saved.contact ?? "");
        }
      }
    } catch {}
    loaded.current = true;
  }, []);
  useEffect(() => {
    if (!loaded.current) return;
    try { localStorage.setItem(STORAGE, JSON.stringify({ cart, name, contact, mine })); } catch {}
  }, [cart, name, contact, mine]);

  // Keep best offers fresh while people browse.
  useEffect(() => {
    const t = setInterval(() => { if (document.visibilityState === "visible") router.refresh(); }, 45000);
    return () => clearInterval(t);
  }, [router]);

  // Drawer: lock scroll, close on Escape.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open]);

  const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
  const inCart = Object.keys(cart).map(Number).map((id) => byId.get(id)).filter((i): i is PublicItem => !!i && i.status !== "Sold");
  const total = inCart.reduce((s, i) => s + (parseFloat(cart[i.id]) || 0), 0);

  function add(it: PublicItem) {
    const amt = drafts[it.id] ?? suggest(it);
    setCart((c) => ({ ...c, [it.id]: amt }));
    setState({ kind: "idle" });
  }
  function remove(id: number) {
    setCart((c) => { const n = { ...c }; delete n[id]; return n; });
  }
  function setAmount(id: number, v: string) {
    setCart((c) => ({ ...c, [id]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const bad = inCart.filter((i) => !(parseFloat(cart[i.id]) > 0));
    if (bad.length) return setState({ kind: "error", msg: `Enter a price for: ${bad.map((b) => b.name).join(", ")}` });
    const pickedDays = dayOptions.filter((d) => days.includes(d.key)).map((d) => d.label);
    const pickup = pickedDays.length || times.length
      ? `Pickup: ${pickedDays.length ? pickedDays.join(", ") : "any day"}${times.length ? " · " + times.join("/").toLowerCase() : ""}`
      : "";
    const fullNote = [pickup, note.trim()].filter(Boolean).join("\n");
    setState({ kind: "sending" });
    const res = await fetch("/api/offers", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, contact, note: fullNote, offers: inCart.map((i) => ({ item_id: i.id, amount: parseFloat(cart[i.id]) })) }),
    });
    if (res.ok) {
      setState({ kind: "done", msg: `Sent ${inCart.length} offer${inCart.length > 1 ? "s" : ""}. I'll get back to you at ${contact}.` });
      setMine((m) => ({ ...m, ...Object.fromEntries(inCart.map((i) => [i.id, Math.round(parseFloat(cart[i.id]))])) }));
      setCart({});
      setNote("");
      setDays([]);
      setTimes([]);
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setState({ kind: "error", msg: j.error || "Something went wrong. Try again." });
    }
  }

  const visibleCats = cats.filter((c) => cat === "All" || c === cat);
  const count = inCart.length;

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
                  const sel = cart[it.id] !== undefined;
                  const draft = drafts[it.id] ?? suggest(it);
                  const my = mine[it.id];
                  const leading = my != null && it.best_offer != null && my >= it.best_offer;
                  return (
                    <article key={it.id} className={`card ${sold ? "sold" : ""} ${sel ? "selected" : ""}`}>
                      <div className="top">
                        <h3>{it.name}{it.qty > 1 && <span className="qty"> ×{it.qty}</span>}</h3>
                        <span className={`pill ${it.status}`}>{it.status}</span>
                      </div>
                      {it.dimensions && <div className="dims">{it.dimensions}</div>}
                      <p className="desc">{it.description}</p>
                      <div className="foot">
                        <div className="bid">
                          {sold ? (
                            <span className="price">Sold{it.sold_price ? <> for <b>{fmt(it.sold_price)}</b></> : null}</span>
                          ) : it.best_offer ? (
                            <>
                              <span className="price lead">Current best <b>{fmt(it.best_offer)}</b></span>
                              {it.asking_price && <span className="price sub">Asking {fmt(it.asking_price)}</span>}
                            </>
                          ) : it.asking_price ? (
                            <>
                              <span className="price">Asking <b>{fmt(it.asking_price)}</b></span>
                              <span className="price sub">No bids yet</span>
                            </>
                          ) : (
                            <span className="price">No bids yet. Name your price.</span>
                          )}
                        </div>
                        {!sold && my != null && !sel && (
                          <div className={`mybid ${leading ? "leading" : "outbid"}`}>
                            {leading ? <>You&apos;re the top bid at <b>{fmt(my)}</b></> : <>Your bid <b>{fmt(my)}</b> was outbid. Raise it?</>}
                          </div>
                        )}
                        {sold ? null : sel ? (
                          <div className="incart">
                            <span className="tick">✓ In your cart · <b>{fmt(parseFloat(cart[it.id]) || 0)}</b></span>
                            <button className="btn ghost small" onClick={() => setOpen(true)}>Edit</button>
                            <button className="btn ghost small" onClick={() => remove(it.id)} aria-label={`Remove ${it.name} from cart`}>✕</button>
                          </div>
                        ) : (
                          <form className="offer-in" onSubmit={(e) => { e.preventDefault(); add(it); }}>
                            <span className="cur">$</span>
                            <input type="number" min={1} step={1} inputMode="numeric" value={draft} placeholder="Your price" required
                              onChange={(e) => setDrafts((d) => ({ ...d, [it.id]: e.target.value }))} aria-label={`Your offer for ${it.name}`} />
                            <button className="btn" type="submit">Add</button>
                          </form>
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

      {(count > 0 || state.kind === "done") && !open && (
        <div className="cartbar" role="region" aria-label="Your cart">
          <div className="in">
            {state.kind === "done" && count === 0 ? (
              <>
                <span className="ok">{state.msg}</span>
                <button className="btn ghost" onClick={() => setState({ kind: "idle" })}>Done</button>
              </>
            ) : (
              <>
                <span className="sum"><b>{count}</b> item{count > 1 ? "s" : ""} in your cart · <b>{fmt(total)}</b> total</span>
                <button className="btn" onClick={() => setOpen(true)}>Review &amp; send offers →</button>
              </>
            )}
          </div>
        </div>
      )}

      {open && (
        <div className="overlay" onClick={() => setOpen(false)}>
          <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" onClick={(e) => e.stopPropagation()}>
            <header>
              <h2 id="cart-title">Your offers</h2>
              <button className="btn ghost small" onClick={() => setOpen(false)} aria-label="Close">✕</button>
            </header>

            {state.kind === "done" && count === 0 ? (
              <div className="done">
                <div className="big">✓</div>
                <p className="ok">{state.msg}</p>
                <p className="muted">Each card now shows your bid as the current best if it's the highest. You can come back and bid again any time.</p>
                <button className="btn" onClick={() => { setOpen(false); setState({ kind: "idle" }); }}>Back to the sale</button>
              </div>
            ) : count === 0 ? (
              <div className="done">
                <p className="muted">Your cart is empty. Put a price on anything you'd like and hit Add.</p>
                <button className="btn ghost" onClick={() => setOpen(false)}>Browse items</button>
              </div>
            ) : (
              <form onSubmit={submit} className="checkout">
                <ol className="cart-list">
                  {inCart.map((it) => {
                    const amt = parseFloat(cart[it.id]) || 0;
                    const low = it.best_offer != null && amt > 0 && amt <= it.best_offer;
                    return (
                      <li key={it.id} className="cart-item">
                        <div className="ci-main">
                          <div className="ci-name">{it.name}{it.qty > 1 && <span className="qty"> ×{it.qty}</span>}</div>
                          <div className="ci-meta">
                            {it.best_offer ? <>Current best {fmt(it.best_offer)}</> : it.asking_price ? <>Asking {fmt(it.asking_price)}</> : <>No bids yet</>}
                            {low && <span className="warn"> · below the current best</span>}
                          </div>
                        </div>
                        <div className="ci-amt">
                          <span className="cur">$</span>
                          <input type="number" min={1} step={1} inputMode="numeric" value={cart[it.id]} placeholder="Price"
                            onChange={(e) => setAmount(it.id, e.target.value)} aria-label={`Your offer for ${it.name}`} />
                          <button type="button" className="btn ghost small" onClick={() => remove(it.id)} aria-label={`Remove ${it.name}`}>✕</button>
                        </div>
                      </li>
                    );
                  })}
                </ol>
                <div className="cart-total"><span>{count} item{count > 1 ? "s" : ""}</span><b>{fmt(total)}</b></div>

                <fieldset className="pickup">
                  <legend>When could you pick up?</legend>
                  <p className="muted">Pickup is from the apartment. Tap every day that could work.</p>
                  <div className="chips">
                    {dayOptions.map((d) => (
                      <button type="button" key={d.key} className="chip" aria-pressed={days.includes(d.key)} onClick={() => toggleIn(setDays, d.key)}>{d.label}</button>
                    ))}
                  </div>
                  <div className="chips">
                    {PICKUP_TIMES.map((t) => (
                      <button type="button" key={t} className="chip" aria-pressed={times.includes(t)} onClick={() => toggleIn(setTimes, t)}>{t}</button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="who">
                  <legend>Where should I reach you?</legend>
                  <input required placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                  <input required placeholder="Phone or email" value={contact} onChange={(e) => setContact(e.target.value)} autoComplete="tel" />
                  <textarea placeholder="Anything else? Pickup timing, questions, bundle deal…" value={note} onChange={(e) => setNote(e.target.value)} />
                </fieldset>

                <div className="actions">
                  {state.kind === "error" && <span className="err">{state.msg}</span>}
                  <button className="btn big" type="submit" disabled={state.kind === "sending"}>
                    {state.kind === "sending" ? "Sending…" : `Send ${count} offer${count > 1 ? "s" : ""}`}
                  </button>
                </div>
                <p className="muted fine">One message, all your offers. Nothing's binding until we agree on pickup.</p>
              </form>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
