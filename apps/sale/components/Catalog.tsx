"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { PublicItem } from "@/lib/db";
import { biddingOpen, BIDS_CLOSE_LABEL, pickupDays, PICKUP_ADDRESS, PICKUP_DAY_KEY, PICKUP_DAY_LABEL, PICKUP_TIMES } from "@/lib/pickup";
import { FREE_MIN_SPEND, freeEligible, MIN_INCREMENT, minBid, REWARD_TIERS, rewardEligible, rewardSpendFor, rewardTier } from "@/lib/deals";
import CopyPrompt from "@/components/CopyPrompt";

const fmt = (n: number | null | undefined) => (n == null ? null : "$" + Math.round(n).toLocaleString());
const STORAGE = "sale-cart-v1";

type Cart = Record<number, string>; // item id -> amount text

/** Suggested opening bid: a bit over the current best, else the asking price. */
function suggest(it: PublicItem): string {
  if (it.best_offer) return String(Math.max(Math.round(it.best_offer * 1.1), minBid(it.best_offer)!));
  if (it.asking_price) return String(it.asking_price);
  return "";
}

export default function Catalog({ items, pickerEnabled = false }: { items: PublicItem[]; pickerEnabled?: boolean }) {
  const router = useRouter();
  const cats = useMemo(() => Array.from(new Set(items.map((i) => i.category))), [items]);
  const [cat, setCat] = useState("All");
  const [hideSold, setHideSold] = useState(false);
  const [bidFilter, setBidFilter] = useState<"all" | "none" | "has">("all");
  const [q, setQ] = useState("");
  const [rewardId, setRewardId] = useState<number | null>(null);
  const [pickQ, setPickQ] = useState("");
  const [pickOpen, setPickOpen] = useState(false);
  const [topPickerVisible, setTopPickerVisible] = useState(false);
  const topPicker = useRef<HTMLElement | null>(null);
  const [pick, setPick] = useState<{ kind: "idle" | "busy" | "done" | "error"; msg?: string }>({ kind: "idle" });
  const noBidCount = items.filter((i) => i.status !== "Sold" && !i.open_offers).length;
  const hasBidCount = items.filter((i) => i.status !== "Sold" && i.open_offers > 0).length;
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
          setRewardId(typeof saved.rewardId === "number" ? saved.rewardId : null);
          setName(saved.name ?? "");
          setContact(saved.contact ?? "");
        }
      }
    } catch {}
    loaded.current = true;
  }, []);
  useEffect(() => {
    if (!loaded.current) return;
    try { localStorage.setItem(STORAGE, JSON.stringify({ cart, name, contact, mine, rewardId })); } catch {}
  }, [cart, name, contact, mine, rewardId]);

  // Prefilled cart: ?cart=2:300,22:20 (built by assistants or shared links) loads those bids and opens checkout.
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("cart");
    if (!raw) return;
    const add: Cart = {};
    for (const part of raw.split(",")) {
      const [id, amt] = part.split(":");
      const it = byId.get(Number(id));
      if (it && it.status !== "Sold") add[it.id] = amt && Number(amt) > 0 ? String(Math.round(Number(amt))) : suggest(it);
    }
    if (!Object.keys(add).length) return;
    setCart((cur) => ({ ...cur, ...add }));
    setOpen(true);
    window.history.replaceState(null, "", window.location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Deep link: ?item=18 scrolls to and highlights that card.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("item");
    if (!id) return;
    const el = document.getElementById("item-" + id);
    if (!el) return;
    setTimeout(() => { el.scrollIntoView({ block: "center" }); el.classList.add("flash"); }, 50);
  }, []);

  // Keep best offers fresh while people browse.
  useEffect(() => {
    const t = setInterval(() => { if (document.visibilityState === "visible") router.refresh(); }, 45000);
    return () => clearInterval(t);
  }, [router]);

  // Drawer (and the picker sheet on phones): lock scroll, close on Escape.
  useEffect(() => {
    const sheet = pickOpen && window.matchMedia("(max-width:560px)").matches;
    if (!open && !sheet) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); setPickOpen(false); } };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open, pickOpen]);

  // The floating picker button steps aside while the top picker box is already on screen.
  useEffect(() => {
    const el = topPicker.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setTopPickerVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [pickerEnabled]);

  const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
  const inCart = Object.keys(cart).map(Number).map((id) => byId.get(id)).filter((i): i is PublicItem => !!i && i.status !== "Sold");
  const paidTotal = inCart.filter((i) => !freeEligible(i) && i.id !== rewardId).reduce((s, i) => s + (parseFloat(cart[i.id]) || 0), 0);
  const freeUnlocked = paidTotal >= FREE_MIN_SPEND;
  const freeCount = inCart.filter((i) => freeEligible(i)).length;
  const tier = rewardTier(paidTotal);
  const nextTier = REWARD_TIERS.find((t) => t.spend > paidTotal) ?? null;
  const rewardChoices = items.filter((i) => rewardEligible(i) && tier != null && (i.asking_price ?? 0) <= tier.cap);
  const reward = rewardId != null ? byId.get(rewardId) ?? null : null;
  const rewardValid = !!reward && !!tier && rewardEligible(reward) && (reward.asking_price ?? 0) <= tier.cap;
  const amountFor = (i: PublicItem) => (rewardValid && i.id === rewardId ? 0 : freeUnlocked && freeEligible(i) ? 0 : parseFloat(cart[i.id]) || 0);
  const total = inCart.reduce((s, i) => s + amountFor(i), 0);
  const rewardInCart = rewardValid && cart[rewardId!] !== undefined;

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
    const bad = inCart.filter((i) => !(amountFor(i) > 0) && !(freeUnlocked && freeEligible(i)) && !(rewardValid && i.id === rewardId));
    if (bad.length) return setState({ kind: "error", msg: `Enter a price for: ${bad.map((b) => b.name).join(", ")}` });
    const short = inCart.filter((i) => i.best_offer != null && amountFor(i) > 0 && !(mine[i.id] != null && mine[i.id] >= i.best_offer) && amountFor(i) < minBid(i.best_offer)!);
    if (short.length) return setState({ kind: "error", msg: `Bids have to beat the current best by $${MIN_INCREMENT}: ${short.map((i) => `${i.name} (at least ${fmt(minBid(i.best_offer))})`).join(", ")}` });
    if (contact.replace(/\D/g, "").length < 10) return setState({ kind: "error", msg: "Enter a phone number I can text (10 digits)." });
    if (!biddingOpen()) return setState({ kind: "error", msg: `Bidding closed ${BIDS_CLOSE_LABEL}.` });
    const pickedDays = dayOptions.filter((d) => days.includes(d.key)).map((d) => d.label);
    const pickup = pickedDays.length || times.length
      ? `Pickup: ${pickedDays.length ? pickedDays.join(", ") : "any day"}${times.length ? " · " + times.join("/").toLowerCase() : ""}`
      : "";
    const rewardLine = rewardValid && reward ? `Free pick: ${reward.name} (cart ${fmt(paidTotal)})` : "";
    const fullNote = [pickup, rewardLine, note.trim()].filter(Boolean).join("\n");
    const extra = rewardValid && !rewardInCart && reward ? [{ item_id: reward.id, amount: 0 }] : [];
    setState({ kind: "sending" });
    const res = await fetch("/api/offers", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, contact, note: fullNote, offers: [...inCart.map((i) => ({ item_id: i.id, amount: amountFor(i) })), ...extra] }),
    });
    if (res.ok) {
      setState({ kind: "done", msg: `Sent ${inCart.length} offer${inCart.length > 1 ? "s" : ""}. I'll text you at ${contact}.` });
      setMine((m) => ({ ...m, ...Object.fromEntries(inCart.map((i) => [i.id, Math.round(amountFor(i))])) }));
      setCart({});
      setRewardId(null);
      setNote("");
      setDays([]);
      setTimes([]);
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setState({ kind: "error", msg: j.error || "Something went wrong. Try again." });
    }
  }

  async function runPicker(e: React.FormEvent) {
    e.preventDefault();
    if (pickQ.trim().length < 3) return;
    setPick({ kind: "busy" });
    try {
      const res = await fetch("/api/pick", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ query: pickQ }) });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) return setPick({ kind: "error", msg: j.error || "Something went wrong. Try again." });
      const picks: { item_id: number; amount: number; why: string }[] = j.picks || [];
      if (!picks.length) return setPick({ kind: "error", msg: j.note || "Nothing matched. Try describing the room or the items." });
      setCart((cur) => ({ ...cur, ...Object.fromEntries(picks.map((p) => [p.item_id, String(p.amount)])) }));
      setPick({ kind: "done", msg: j.note });
      setState({ kind: "idle" });
      setPickOpen(false);
      setOpen(true);
    } catch {
      setPick({ kind: "error", msg: "Something went wrong. Try again." });
    }
  }

  const matches = (i: PublicItem) => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return (i.name + " " + i.category + " " + i.description).toLowerCase().includes(s);
  };
  const visibleCats = cats.filter((c) => cat === "All" || c === cat);
  const count = inCart.length;
  const [openForBids, setOpenForBids] = useState(true);
  useEffect(() => { setOpenForBids(biddingOpen()); const t = setInterval(() => setOpenForBids(biddingOpen()), 30000); return () => clearInterval(t); }, []);

  return (
    <>
      {pickerEnabled && (
        <section className="picker" aria-label="Help me pick" ref={topPicker}>
          <form onSubmit={runPicker}>
            <label htmlFor="pickq"><b>Not sure where to start?</b> Tell me what you need and I&apos;ll build you a cart.</label>
            <div className="row">
              <input id="pickq" value={pickQ} onChange={(e) => setPickQ(e.target.value)} placeholder="e.g. furnishing a studio, need a bed setup and kitchen basics, budget $300" maxLength={600} />
              <button className="btn" type="submit" disabled={pick.kind === "busy" || pickQ.trim().length < 3}>{pick.kind === "busy" ? "Picking…" : "Build my cart"}</button>
            </div>
            {pick.kind === "busy" && <p className="muted fine left">Reading all {items.length} items and putting a cart together. Usually under 10 seconds.</p>}
            {pick.kind === "error" && <p className="err">{pick.msg}</p>}
            {pick.kind === "done" && <p className="ok">{pick.msg} Your cart is open, tweak anything you like.</p>}
          </form>
          <CopyPrompt compact />
        </section>
      )}
      <div className="toolbar">
        <input className="search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search items…" aria-label="Search items" />
        {["All", ...cats].map((c) => (
          <button key={c} className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
        ))}
        <span className="sep" aria-hidden="true" />
        <button className="chip needs" aria-pressed={bidFilter === "none"} onClick={() => setBidFilter(bidFilter === "none" ? "all" : "none")}>No bids yet · {noBidCount}</button>
        <button className="chip" aria-pressed={bidFilter === "has"} onClick={() => setBidFilter(bidFilter === "has" ? "all" : "has")}>Has bids · {hasBidCount}</button>
        <label className="tog"><input type="checkbox" checked={hideSold} onChange={(e) => setHideSold(e.target.checked)} /> Hide sold</label>
      </div>

      <main>
        {visibleCats.map((c) => {
          const list = items.filter((i) => matches(i) && i.category === c && !(hideSold && i.status === "Sold")
            && (bidFilter === "all" || (bidFilter === "none" ? i.status !== "Sold" && !i.open_offers : i.open_offers > 0)));
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
                    <article key={it.id} id={`item-${it.id}`} className={`card ${sold ? "sold" : ""} ${sel ? "selected" : ""} ${it.image_url ? "has-img" : ""}`}>
                      {it.image_url && (
                        <a className="img" href={it.image_url} target="_blank" rel="noreferrer" aria-label={`Photo of ${it.name}`}>
                          <img src={it.image_url} alt="" loading="lazy" />
                        </a>
                      )}
                      <div className="top">
                        <h3>{it.name}{it.qty > 1 && <span className="qty"> ×{it.qty}</span>}</h3>
                        {it.status === "Available" ? (
                          it.open_offers > 0 && it.best_offer
                            ? <span className="pill bids">{it.open_offers} bid{it.open_offers > 1 ? "s" : ""}</span>
                            : it.open_offers > 0
                            ? <span className="pill Tentative">Free pick claimed</span>
                            : <span className="pill nobids">No bids yet</span>
                        ) : (
                          <span className={`pill ${it.status}`}>{it.status}</span>
                        )}
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
                              {it.asking_price && <span className="price sub">Started at {fmt(it.asking_price)}</span>}
                            </>
                          ) : it.asking_price ? (
                            <>
                              <span className="price">Starting at <b>{fmt(it.asking_price)}</b></span>
                              {it.open_offers > 0 ? <span className="price sub">Claimed as a free pick · any paid bid takes it</span>
                                : freeEligible(it) ? <span className="freetag">Free with a {fmt(FREE_MIN_SPEND)}+ cart</span>
                                : rewardEligible(it) ? <span className="freetag">Free pick with a {fmt(rewardSpendFor(it.asking_price)!)}+ cart</span>
                                : <span className="price sub">No bids yet</span>}
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
                        {sold ? null : !openForBids ? (
                          <span className="price">Bidding closed</span>
                        ) : sel ? (
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

      {pickerEnabled && openForBids && !open && (
        <div className={`pickfab ${count > 0 || state.kind === "done" ? "lifted" : ""} ${pickOpen ? "open" : ""} ${topPickerVisible && !pickOpen ? "away" : ""}`}>
          {pickOpen && <div className="pickscrim" onClick={() => setPickOpen(false)} aria-hidden="true" />}
          {pickOpen && (
            <form className="pickpop" onSubmit={runPicker} aria-label="Help me pick">
              <div className="pp-head"><b>Tell me what you need</b><button type="button" className="btn ghost small" onClick={() => setPickOpen(false)} aria-label="Close">✕</button></div>
              <textarea autoFocus value={pickQ} onChange={(e) => setPickQ(e.target.value)} placeholder="e.g. furnishing a studio, need a bed setup and kitchen basics, budget $300" maxLength={600} rows={3} />
              {pick.kind === "busy" && <p className="muted fine left">Reading all {items.length} items and putting a cart together. Usually under 10 seconds.</p>}
              {pick.kind === "error" && <p className="err">{pick.msg}</p>}
              <button className="btn" type="submit" disabled={pick.kind === "busy" || pickQ.trim().length < 3}>{pick.kind === "busy" ? "Picking…" : "Build my cart"}</button>
            </form>
          )}
          <button type="button" className="pill" aria-expanded={pickOpen} onClick={() => setPickOpen((v) => !v)}>
            <span className="spark" aria-hidden="true">✦</span> {pickOpen ? "Close" : <><span className="long">Not sure? Let me build your cart</span><span className="short">Help me pick</span></>}
          </button>
        </div>
      )}

      {openForBids && (count > 0 || state.kind === "done") && !open && (
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
                    const low = it.best_offer != null && amt > 0 && amt < minBid(it.best_offer)! && !(mine[it.id] != null && mine[it.id] >= it.best_offer);
                    const underStart = !low && it.asking_price != null && amt > 0 && amt < it.asking_price;
                    return (
                      <li key={it.id} className="cart-item">
                        <div className="ci-main">
                          <div className="ci-name">{it.name}{it.qty > 1 && <span className="qty"> ×{it.qty}</span>}</div>
                          <div className="ci-meta">
                            {it.best_offer ? <>Current best {fmt(it.best_offer)}</> : it.asking_price ? <>Starting at {fmt(it.asking_price)}</> : <>No bids yet</>}
                            {low && <span className="warn"> · needs at least {fmt(minBid(it.best_offer))}</span>}
                            {underStart && <span className="warn"> · below the starting price</span>}
                            {freeEligible(it) && !freeUnlocked && <span className="hint"> · free once the rest of your cart hits {fmt(FREE_MIN_SPEND)}</span>}
                          </div>
                        </div>
                        <div className="ci-amt">
                          {(freeUnlocked && freeEligible(it)) || (rewardValid && it.id === rewardId) ? (
                            <span className="free">FREE</span>
                          ) : (
                            <>
                              <span className="cur">$</span>
                              <input type="number" min={1} step={1} inputMode="numeric" value={cart[it.id]} placeholder="Price"
                                onChange={(e) => setAmount(it.id, e.target.value)} aria-label={`Your offer for ${it.name}`} />
                            </>
                          )}
                          <button type="button" className="btn ghost small" onClick={() => remove(it.id)} aria-label={`Remove ${it.name}`}>✕</button>
                        </div>
                      </li>
                    );
                  })}
                </ol>
                <div className="cart-total"><span>{count} item{count > 1 ? "s" : ""}{freeCount > 0 && freeUnlocked && <> · <span className="okt">{freeCount} free</span></>}</span><b>{fmt(total)}</b></div>
                {freeCount > 0 && !freeUnlocked && <p className="muted fine">Add {fmt(FREE_MIN_SPEND - paidTotal)} more in other items and the {freeCount} small item{freeCount > 1 ? "s" : ""} in your cart become free.</p>}

                <fieldset className="reward">
                  <legend>🎁 Your free pick</legend>
                  {tier ? (
                    <>
                      <p className="muted">Your cart is over {fmt(tier.spend)}, so you can take one unbid item up to <b>{fmt(tier.cap)}</b> for free.{nextTier && <> Reach {fmt(nextTier.spend)} and the cap goes to {fmt(nextTier.cap)}.</>}</p>
                      <select value={rewardId ?? ""} onChange={(e) => setRewardId(e.target.value ? Number(e.target.value) : null)} aria-label="Choose your free item">
                        <option value="">Choose an item…</option>
                        {rewardChoices.map((i) => <option key={i.id} value={i.id}>{i.name} · {fmt(i.asking_price)}</option>)}
                      </select>
                      {rewardValid && reward && <p className="muted fine left">{reward.name} is free with this order. If someone bids on it before Thursday, I&apos;ll text you an alternative.</p>}
                    </>
                  ) : (
                    <p className="muted">Spend {fmt((nextTier ?? REWARD_TIERS[0]).spend - paidTotal)} more in bids and you can pick one unbid item up to <b>{fmt((nextTier ?? REWARD_TIERS[0]).cap)}</b> for free. Bigger carts unlock bigger picks: {REWARD_TIERS.map((t) => `${fmt(t.spend)} → up to ${fmt(t.cap)}`).join(", ")}.</p>
                  )}
                </fieldset>

                <fieldset className="pickup">
                  <legend>When could you pick up?</legend>
                  <p className="muted"><b>{PICKUP_DAY_LABEL}</b> is pickup day at {PICKUP_ADDRESS} (beer provided). Tap Monday, or any other days that could work.</p>
                  <div className="chips">
                    {dayOptions.map((d) => (
                      <button type="button" key={d.key} className={`chip ${d.key === PICKUP_DAY_KEY ? "star" : ""}`} aria-pressed={days.includes(d.key)} onClick={() => toggleIn(setDays, d.key)}>{d.key === PICKUP_DAY_KEY ? "🍻 " : ""}{d.label}</button>
                    ))}
                  </div>
                  <div className="chips">
                    {PICKUP_TIMES.map((t) => (
                      <button type="button" key={t} className="chip" aria-pressed={times.includes(t)} onClick={() => toggleIn(setTimes, t)}>{t}</button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="who">
                  <legend>Where should I text you?</legend>
                  <input required placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                  <input required type="tel" inputMode="tel" placeholder="Phone number (I'll text you)" value={contact} onChange={(e) => setContact(e.target.value)} autoComplete="tel" />
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
