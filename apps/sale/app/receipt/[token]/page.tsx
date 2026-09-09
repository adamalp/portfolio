import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { receiptByToken, VENMO } from "@/lib/receipt";
import { PICKUP_ADDRESS, PICKUP_CITY, PICKUP_MAP_URL } from "@/lib/pickup";
import SplitHelper from "@/components/SplitHelper";

export const dynamic = "force-dynamic";

const fmt = (n: number) => "$" + Math.round(n).toLocaleString();
const longDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "America/New_York" });

export async function generateMetadata({ params }: { params: { token: string } }): Promise<Metadata> {
  const r = await receiptByToken(params.token);
  return { title: r ? `Receipt for ${r.name}` : "Receipt", robots: { index: false, follow: false } };
}

export default async function ReceiptPage({ params }: { params: { token: string } }) {
  const r = await receiptByToken(params.token);
  if (!r) notFound();
  return (
    <main className="sheet">
      <article className="paper receipt">
        <p className="eyebrow">Adam&apos;s Moving Sale</p>
        <h1>Receipt for {r.name}</h1>
        <dl className="meta">
          <dt>Date</dt><dd>{longDate(r.date)}</dd>
          <dt>Picked up</dt><dd><a href={PICKUP_MAP_URL}>{PICKUP_ADDRESS}</a>, {PICKUP_CITY}</dd>
          <dt>Status</dt><dd>{r.paid ? <span className="paid">Paid in full</span> : <span className="due">Payment due</span>}</dd>
          {!r.paid && <><dt>Pay by</dt><dd>Venmo{VENMO ? <> <b>{VENMO}</b></> : " (Adam will send the handle)"}, {fmt(r.total)} total</dd></>}
        </dl>
        <h2>{r.items.length} item{r.items.length === 1 ? "" : "s"}</h2>
        <table className="lines">
          <tbody>
            {r.items.map((it) => (
              <tr key={it.id}>
                <td className="item">{it.name}{it.qty > 1 ? <span className="qty"> ×{it.qty}</span> : null}</td>
                {it.sold_price ? <td className="price">{fmt(it.sold_price)}</td> : <td className="price free">Included</td>}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="total"><span className="label">Total</span><span className="amt"><sup>$</sup>{Math.round(r.total).toLocaleString()}</span></div>
        <SplitHelper total={r.total} />
        <div className="foot">
          <p className="thanks">Thanks for taking so much off my hands.</p>
          <p>Questions about anything here: <a href="mailto:aalpert421@gmail.com">aalpert421@gmail.com</a>. What&apos;s left is at <a href="/">sale.adam-alpert.com</a>.</p>
        </div>
      </article>
    </main>
  );
}
