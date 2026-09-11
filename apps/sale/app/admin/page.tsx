import { db, type Item, type Offer } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import { login, decideOffer, updateItem, logout, setPaid, closeSale, sellTo, addItem } from "./actions";
import { receipts, receiptToken, normalizeContact, VENMO } from "@/lib/receipt";
import { biddingOpen } from "@/lib/pickup";
import { parseNotes, smsHref, waHref, winnerMessage, counterMessage, leftoversMessage, type WonLine } from "@/lib/outreach";
import CopyText from "@/components/CopyText";

export const dynamic = "force-dynamic";

const fmt = (n: number | null | undefined) => (n == null ? "—" : "$" + Math.round(n).toLocaleString());
const when = (s: string) => new Date(s).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

export default async function Admin({ searchParams }: { searchParams: { tab?: string; err?: string } }) {
  if (!isAdmin()) {
    return (
      <form className="login" action={login}>
        <h1>Sale admin</h1>
        <input name="passcode" type="password" placeholder="Passcode" autoFocus required />
        {searchParams.err && <span className="muted">Wrong passcode.</span>}
        <button className="btn" type="submit">Sign in</button>
      </form>
    );
  }
  const s = db();
  const [{ data: items }, { data: offers }, R] = await Promise.all([
    s.from("items").select("*").order("sort_order").order("id"),
    s.from("offers").select("*").order("created_at", { ascending: false }),
    receipts(),
  ]);
  const I = (items ?? []) as Item[];
  const O = (offers ?? []) as Offer[];
  const tab = searchParams.tab ?? (biddingOpen() ? "offers" : "winners");
  const byItem = new Map<number, Offer[]>();
  for (const o of O) byItem.set(o.item_id, [...(byItem.get(o.item_id) ?? []), o]);
  const openCount = O.filter((o) => o.status === "open").length;
  const revenue = I.filter((i) => i.status === "Sold").reduce((a, i) => a + (i.sold_price ?? 0), 0);

  // ---- Winners view: who gets what, and one-tap texts to tell them. ----
  type Lead = { item: Item; top: Offer; bidders: Offer[] };
  const leads: Lead[] = [];
  for (const it of I) {
    if (it.status === "Sold" || it.status === "Hidden") continue;
    const open = (byItem.get(it.id) ?? []).filter((o) => o.status === "open");
    if (!open.length) continue;
    const top = open.reduce((m, o) => (o.amount > m.amount ? o : m));
    leads.push({ item: it, top, bidders: [...open].sort((a, b) => b.amount - a.amount) });
  }
  const ready = leads.filter((l) => l.top.amount > 0 && l.top.amount >= (l.item.asking_price ?? 0));
  const undecided = leads.filter((l) => !ready.includes(l));
  type Buyer = { key: string; name: string; contact: string; won: WonLine[]; pending: WonLine[]; total: number; notes: string[]; settle: string; wanted: string[] };
  const buyers = new Map<string, Buyer>();
  const buyer = (name: string, contact: string) => {
    const key = normalizeContact(contact);
    let b = buyers.get(key);
    if (!b) { b = { key, name, contact, won: [], pending: [], total: 0, notes: [], settle: "due", wanted: [] }; buyers.set(key, b); }
    return b;
  };
  for (const r of R) { const b = buyer(r.name, r.contact); b.won = r.items.map((i) => ({ name: i.name, price: i.sold_price ?? 0 })); b.total = r.total; b.settle = r.settle; }
  for (const l of leads) { const b = buyer(l.top.buyer_name, l.top.buyer_contact); b.pending.push({ name: l.item.name, price: l.top.amount }); }
  for (const o of O) {
    if (o.status === "withdrawn") continue;
    const b = buyers.get(normalizeContact(o.buyer_contact));
    if (b && o.note) b.notes.push(o.note);
  }
  const winners = [...buyers.values()].filter((b) => b.won.length || b.pending.length).sort((a, b) => b.total + b.pending.reduce((s, p) => s + p.price, 0) - (a.total + a.pending.reduce((s, p) => s + p.price, 0)));
  // People who bid and got nothing, plus what is still unsold, for a last-call text.
  const losers = new Map<string, Buyer>();
  for (const o of O) {
    if (o.status === "withdrawn" || buyers.get(normalizeContact(o.buyer_contact))?.won.length || buyers.get(normalizeContact(o.buyer_contact))?.pending.length) continue;
    const key = normalizeContact(o.buyer_contact);
    let b = losers.get(key);
    if (!b) { b = { key, name: o.buyer_name, contact: o.buyer_contact, won: [], pending: [], total: 0, notes: [], settle: "due", wanted: [] }; losers.set(key, b); }
    const nm = I.find((i) => i.id === o.item_id)?.name;
    if (nm && !b.wanted.includes(nm)) b.wanted.push(nm);
    if (o.note) b.notes.push(o.note);
  }
  const leftovers: WonLine[] = I.filter((i) => i.status !== "Sold" && i.status !== "Hidden" && !leads.some((l) => l.item.id === i.id)).map((i) => ({ name: i.name, price: i.asking_price ?? 0 }));
  const readyTotal = ready.reduce((s, l) => s + l.top.amount, 0);

  return (
    <div className="wrap admin">
      <header className="hero">
        <div className="eyebrow">Admin</div>
        <h1>Offers &amp; inventory</h1>
        <div className="stats">
          <span><b>{openCount}</b> open offers</span>
          <span><b>{I.filter((i) => i.status === "Sold").length}</b> sold</span>
          <span><b>{fmt(revenue)}</b> collected</span>
          <span><a href="/">View public page</a></span>
          <form action={logout} style={{ display: "inline" }}><button className="chip">Sign out</button></form>
        </div>
      </header>
      <div className="tabs">
        <a className="chip" aria-pressed={tab === "winners"} href="/admin?tab=winners">Winners &amp; texts</a>
        <a className="chip" aria-pressed={tab === "offers"} href="/admin?tab=offers">Offers by item</a>
        <a className="chip" aria-pressed={tab === "buyers"} href="/admin?tab=buyers">By buyer</a>
        <a className="chip" aria-pressed={tab === "items"} href="/admin?tab=items">Items</a>
        <a className="chip" aria-pressed={tab === "receipts"} href="/admin?tab=receipts">Receipts</a>
      </div>

      {tab === "winners" && (
        <div className="winners">
          {ready.length > 0 && (
            <div className="item-block closeit">
              <header>
                <h3>Close the sale</h3>
                <form action={closeSale}><button className="btn">Accept all {ready.length} leading bids at or above start ({fmt(readyTotal)})</button></form>
              </header>
              <p className="muted">Marks each of those items sold to its top bidder, declines the rest, and builds their receipts. Bids under the start price are listed below for you to decide one by one.</p>
              <p className="muted">{ready.map((l) => `${l.item.name} → ${l.top.buyer_name} $${l.top.amount}`).join(" · ")}</p>
            </div>
          )}

          {undecided.length > 0 && (
            <div className="item-block">
              <header><h3>Needs your call <span className="pill open">{undecided.length}</span></h3><span className="muted">top bid is under the start price, or a free pick</span></header>
              <div className="tblwrap"><table className="t">
                <thead><tr><th>Item</th><th>Top bid</th><th>Start</th><th></th></tr></thead>
                <tbody>
                  {undecided.map((l) => {
                    const counter = counterMessage({ name: l.top.buyer_name, item: l.item.name, bid: l.top.amount, ask: l.item.asking_price ?? 0 });
                    const sms = smsHref(l.top.buyer_contact, counter);
                    return (
                      <tr key={l.item.id}>
                        <td><b>{l.item.name}</b> {l.item.status === "Tentative" && <span className="pill Tentative">Tentative</span>}<br /><span className="muted">{l.bidders.map((o) => `${o.buyer_name} $${o.amount}`).join(" · ")}</span></td>
                        <td className="num"><b>{fmt(l.top.amount)}</b><br /><span className="muted">{l.top.buyer_name}</span></td>
                        <td className="num">{fmt(l.item.asking_price)}</td>
                        <td>
                          <span className="inline">
                            <form action={decideOffer}><input type="hidden" name="id" value={l.top.id} /><input type="hidden" name="decision" value="accepted" /><input type="hidden" name="back" value="winners" /><button className="btn small">Accept {fmt(l.top.amount)}</button></form>
                            {sms && <a className="btn ghost small" href={sms}>Text a counter at {fmt(l.item.asking_price)}</a>}
                            <form action={decideOffer}><input type="hidden" name="id" value={l.top.id} /><input type="hidden" name="decision" value="declined" /><input type="hidden" name="back" value="winners" /><button className="btn ghost small">Decline</button></form>
                          </span>
                          <form action={sellTo} className="inline sellto">
                            <input type="hidden" name="item_id" value={l.item.id} />
                            <select name="bidder" defaultValue="">
                              <option value="">Someone else…</option>
                              {l.bidders.map((o) => <option key={o.id} value={`${o.buyer_name}|${o.buyer_contact}`}>{o.buyer_name} ({o.buyer_contact})</option>)}
                            </select>
                            <input name="name" placeholder="name" style={{ width: 90 }} />
                            <input name="contact" placeholder="phone" style={{ width: 110 }} />
                            <input name="price" type="number" placeholder="$" defaultValue={l.top.amount} style={{ width: 70 }} required />
                            <button className="btn ghost small">Sell to them</button>
                          </form>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table></div>
            </div>
          )}

          <h2 className="wh">{winners.length} buyers to text</h2>
          <p className="muted">Each card has their items, what they told you about pickup, and a Text button that opens Messages with the note already written. Edit it before you hit send if you like.</p>
          {winners.map((b) => {
            const n = parseNotes(b.notes);
            const msg = winnerMessage({ name: b.name, items: b.won, pending: b.pending, total: b.total, token: receiptToken(b.contact), pickup: n.pickup, venmo: VENMO });
            const sms = smsHref(b.contact, msg);
            const wa = waHref(n.whatsapp ?? b.contact, msg);
            const showWa = !!n.whatsapp || b.contact.trim().startsWith("+") || /whats/i.test(b.notes.join(" "));
            return (
              <div className="item-block buyer" key={b.key}>
                <header>
                  <h3>{b.name} <span className="muted">{b.contact}{n.whatsapp ? ` · WhatsApp ${n.whatsapp}` : ""}</span></h3>
                  <span className="inline">
                    <b className="tot">{fmt(b.total)}</b>
                    {b.won.length > 0 && <span className={`pill ${b.settle === "due" ? "open" : "accepted"}`}>{b.settle === "paid" ? "Paid" : b.settle === "deposit" ? "Deposit" : "Due"}</span>}
                  </span>
                </header>
                <ul className="lines-list">
                  {b.won.map((w) => <li key={w.name}>{w.name} <b>{w.price > 0 ? fmt(w.price) : "free"}</b></li>)}
                  {b.pending.map((w) => <li key={"p" + w.name} className="muted">{w.name} <b>{fmt(w.price)}</b> <span className="pill open">not yet accepted</span></li>)}
                </ul>
                {(n.pickup.length > 0 || n.text.length > 0) && (
                  <p className="muted notes">
                    {n.pickup.length > 0 && <>🗓 {n.pickup.join(" · ")}<br /></>}
                    {n.text.map((t, i) => <span key={i}>💬 {t}<br /></span>)}
                  </p>
                )}
                <div className="inline actions">
                  {sms ? <a className="btn small" href={sms}>Text {b.name.split(" ")[0]}</a> : <span className="muted">no phone number</span>}
                  {showWa && wa && <a className="btn ghost small" href={wa} target="_blank" rel="noreferrer">WhatsApp</a>}
                  <CopyText text={msg} />
                  {b.won.length > 0 && <a className="btn ghost small" href={`/receipt/${receiptToken(b.contact)}`} target="_blank" rel="noreferrer">Receipt</a>}
                  {b.won.length > 0 && b.settle !== "deposit" && (
                    <form action={setPaid} className="inline">
                      <input type="hidden" name="contact" value={b.contact} />
                      <input type="hidden" name="paid" value={b.settle === "paid" ? "0" : "1"} />
                      <button className="btn ghost small">{b.settle === "paid" ? "Mark unpaid" : "Mark paid"}</button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
          {!winners.length && <p className="empty">Nothing sold yet. Close the sale above to fill this in.</p>}

          {losers.size > 0 && (
            <>
              <h2 className="wh">{losers.size} bidders who won nothing</h2>
              <p className="muted">{leftovers.length ? `A last-call text listing the ${leftovers.length} unsold item${leftovers.length === 1 ? "" : "s"} at start price: ${leftovers.map((l) => `${l.name} $${l.price}`).join(", ")}.` : "Everything with a bid is sold, so there is nothing to offer them yet. Decline or resolve the items above first."}</p>
              <div className="tblwrap"><table className="t">
                <tbody>
                  {[...losers.values()].map((b) => {
                    const msg = leftoversMessage({ name: b.name, wanted: b.wanted, leftovers });
                    const sms = smsHref(b.contact, msg);
                    return (
                      <tr key={b.key}>
                        <td><b>{b.name}</b> <span className="muted">{b.contact}</span><br /><span className="muted">wanted: {b.wanted.join(", ")}</span></td>
                        <td><span className="inline">{sms && leftovers.length > 0 && <a className="btn ghost small" href={sms}>Text last call</a>}<CopyText text={msg} /></span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table></div>
            </>
          )}
        </div>
      )}

      {tab === "receipts" && (
        <div className="tblwrap receipts">
          <p className="muted">One receipt per buyer, built from the items marked sold to them. Unpaid receipts show the Venmo handle and &quot;Payment due&quot;; mark paid once the money lands.</p>
          <table className="t">
            <thead><tr><th>Buyer</th><th>Contact</th><th>Items</th><th>Total</th><th>Paid</th><th>Link</th></tr></thead>
            <tbody>
              {R.map((r) => (
                <tr key={r.token}>
                  <td>{r.name}</td>
                  <td>{r.contact}</td>
                  <td className="num">{r.items.length}</td>
                  <td className="num">{fmt(r.total)}</td>
                  <td>
                    <form action={setPaid} className="inline">
                      <input type="hidden" name="contact" value={r.contact} />
                      <input type="hidden" name="paid" value={r.settle === "paid" ? "0" : "1"} />
                      <span className={`pill ${r.settle === "due" ? "open" : "accepted"}`}>{r.settle === "paid" ? "Paid" : r.settle === "deposit" ? "Deposit" : "Due"}</span>
                      {r.settle !== "deposit" && <button className="btn ghost small">{r.settle === "paid" ? "Mark unpaid" : "Mark paid"}</button>}
                    </form>
                  </td>
                  <td><a className="code" href={`/receipt/${r.token}`} target="_blank" rel="noreferrer">sale.adam-alpert.com/receipt/{r.token}</a></td>
                </tr>
              ))}
              {!R.length && <tr><td colSpan={6} className="muted">Nothing sold yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === "offers" && (
        <div>
          {I.filter((i) => byItem.has(i.id)).sort((a, b) => (byItem.get(b.id)!.filter((o) => o.status === "open").length) - (byItem.get(a.id)!.filter((o) => o.status === "open").length)).map((it) => {
            const list = [...byItem.get(it.id)!].sort((a, b) => b.amount - a.amount);
            return (
              <div className="item-block" key={it.id}>
                <header>
                  <h3>{it.name} <span className={`pill ${it.status}`}>{it.status}</span></h3>
                  <span className="muted">asking {fmt(it.asking_price)} · {list.filter((o) => o.status === "open").length} open</span>
                </header>
                <div className="tblwrap"><table className="t">
                  <thead><tr><th>Offer</th><th>Buyer</th><th>Contact</th><th>Note</th><th>When</th><th>Status</th><th></th></tr></thead>
                  <tbody>
                    {list.map((o) => (
                      <tr key={o.id}>
                        <td className="num"><b>{fmt(o.amount)}</b></td>
                        <td>{o.buyer_name}</td>
                        <td>{o.buyer_contact}</td>
                        <td className="muted">{o.note}</td>
                        <td className="muted">{when(o.created_at)}</td>
                        <td><span className={`pill ${o.status}`}>{o.status}</span></td>
                        <td>
                          {o.status === "open" && (
                            <span className="inline">
                              <form action={decideOffer}><input type="hidden" name="id" value={o.id} /><input type="hidden" name="decision" value="accepted" /><button className="btn small">Accept &amp; mark sold</button></form>
                              <form action={decideOffer}><input type="hidden" name="id" value={o.id} /><input type="hidden" name="decision" value="declined" /><button className="btn ghost small">Decline</button></form>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table></div>
              </div>
            );
          })}
          {!O.length && <p className="empty">No offers yet.</p>}
        </div>
      )}

      {tab === "buyers" && (
        <div>
          {Array.from(new Set(O.map((o) => o.submission_id))).map((sid) => {
            const list = O.filter((o) => o.submission_id === sid);
            const b = list[0];
            return (
              <div className="item-block" key={sid}>
                <header><h3>{b.buyer_name} <span className="muted">{b.buyer_contact}</span></h3><span className="muted">{when(b.created_at)} · total {fmt(list.reduce((a, o) => a + o.amount, 0))}</span></header>
                {b.note && <p className="muted">{b.note}</p>}
                <ul>
                  {list.map((o) => <li key={o.id}>{I.find((i) => i.id === o.item_id)?.name ?? o.item_id} — <b>{fmt(o.amount)}</b> <span className={`pill ${o.status}`}>{o.status}</span></li>)}
                </ul>
              </div>
            );
          })}
          {!O.length && <p className="empty">No offers yet.</p>}
        </div>
      )}

      {tab === "items" && (
        <div className="tblwrap">
        <form action={addItem} className="item-block inline addit">
          <b>Add an off-list item</b>
          <input name="name" placeholder="what it is" required style={{ width: 200 }} />
          <input name="sold_price" type="number" placeholder="$" style={{ width: 70 }} />
          <input name="sold_name" placeholder="sold to (name)" style={{ width: 130 }} />
          <input name="sold_contact" placeholder="phone" style={{ width: 120 }} />
          <button className="btn small">Add</button>
          <span className="muted">Leave the buyer blank to list it as available at that price.</span>
        </form>
        <table className="t">
          <thead><tr><th>#</th><th>Item</th><th>Category</th><th>Asking</th><th>Best open</th><th>Status</th><th>Sold for / to</th><th></th></tr></thead>
          <tbody>
            {I.map((it) => {
              const best = (byItem.get(it.id) ?? []).filter((o) => o.status === "open").reduce((m, o) => Math.max(m, o.amount), 0);
              return (
                <tr key={it.id}>
                  <td className="muted">{it.id}</td>
                  <td><b>{it.name}</b><br /><span className="muted">{it.dimensions}</span></td>
                  <td className="muted">{it.category}</td>
                  <td colSpan={5}>
                    <form action={updateItem} className="inline">
                      <input type="hidden" name="id" value={it.id} />
                      <input name="asking_price" type="number" placeholder="asking" defaultValue={it.asking_price ?? ""} style={{ width: 90 }} />
                      <span className="muted">best open {best ? fmt(best) : "—"}</span>
                      <select name="status" defaultValue={it.status}>
                        {["Available", "Pending", "Sold", "Tentative", "Hidden"].map((s) => <option key={s}>{s}</option>)}
                      </select>
                      <input name="sold_price" type="number" placeholder="sold $" defaultValue={it.sold_price ?? ""} style={{ width: 80 }} />
                      <input name="sold_to" placeholder="sold to" defaultValue={it.sold_to ?? ""} style={{ width: 120 }} />
                      <button className="btn small">Save</button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table></div>
      )}
    </div>
  );
}
