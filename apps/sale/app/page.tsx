import Catalog from "@/components/Catalog";
import { publicItems } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const items = await publicItems();
  const avail = items.filter((i) => i.status === "Available" || i.status === "Tentative").length;
  const pending = items.filter((i) => i.status === "Pending").length;
  const sold = items.filter((i) => i.status === "Sold").length;
  return (
    <div className="wrap">
      <header className="hero">
        <div className="eyebrow">Moving sale</div>
        <h1>Adam&apos;s Moving Sale</h1>
        <p className="lede">
          Everything below is up for grabs before the move — mostly walnut furniture, a sectional, rugs, plants, and
          kitchen gear. Tick anything you want, put in your price for each, and send it over. Highest reasonable offer takes it.
        </p>
        <div className="stats">
          <span><b>{avail}</b> available</span>
          <span><b>{pending}</b> pending</span>
          <span><b>{sold}</b> sold</span>
        </div>
      </header>
      <Catalog items={items} />
      <div className="how">
        <h2>How offers work</h2>
        <p>Tick the items you&apos;re interested in and enter your offer for each. One form at the bottom sends them all at once. Each card shows the best offer so far, so you can see what you&apos;d need to beat.</p>
        <p>Pairs and lots are priced for the whole set unless noted. Pickup is from the apartment; happy to coordinate a time. Items marked <em>tentative</em> might be kept — offers on those are welcome but non-binding on my side.</p>
      </div>
    </div>
  );
}
