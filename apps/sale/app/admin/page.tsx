import { db, type Item, type Offer } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import { login, decideOffer, updateItem, logout, setPaid } from "./actions";
import { receipts } from "@/lib/receipt";

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
  const tab = searchParams.tab ?? "offers";
  const byItem = new Map<number, Offer[]>();
  for (const o of O) byItem.set(o.item_id, [...(byItem.get(o.item_id) ?? []), o]);
  const openCount = O.filter((o) => o.status === "open").length;
  const revenue = I.filter((i) => i.status === "Sold").reduce((a, i) => a + (i.sold_price ?? 0), 0);

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
        <a className="chip" aria-pressed={tab === "offers"} href="/admin?tab=offers">Offers by item</a>
        <a className="chip" aria-pressed={tab === "buyers"} href="/admin?tab=buyers">By buyer</a>
        <a className="chip" aria-pressed={tab === "items"} href="/admin?tab=items">Items</a>
        <a className="chip" aria-pressed={tab === "receipts"} href="/admin?tab=receipts">Receipts</a>
      </div>

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
        <div className="tblwrap"><table className="t">
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
