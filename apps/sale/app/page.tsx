import Catalog from "@/components/Catalog";
import Gallery from "@/components/Gallery";
import RecentBids from "@/components/RecentBids";
import { MOVE_OUT_LABEL, PICKUP_DEADLINE_LABEL } from "@/lib/pickup";
import { publicItems, recentBids } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [items, bids] = await Promise.all([publicItems(), recentBids()]);
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
          kitchen gear. Put your price on anything you want and hit Add. When you&apos;re done, review your cart and send it all at once with your name and number. Prices are just starting points, and the best offer takes it. Everything needs to be picked up by <b>{PICKUP_DEADLINE_LABEL}</b>.
        </p>
        <div className="stats">
          <span><b>{avail}</b> available</span>
          <span><b>{pending}</b> pending</span>
          <span><b>{sold}</b> sold</span>
        </div>
      </header>
      <Gallery />
      <RecentBids bids={bids} />
      <Catalog items={items} />
      <div className="how">
        <h2>How offers work</h2>
        <p>It works like a quiet auction. Every item has a low starting price, and each card shows the current best bid, so you know what to beat. Type your price, hit <em>Add</em>, and keep browsing. When you&apos;re done, open your cart, check your numbers, and send everything in one go. You only give your name and phone number once.</p>
        <p>If someone outbids you, the card updates and you can come back and bid again. I&apos;ll text you when an offer is accepted.</p>
        <p>I&apos;m moving out on {MOVE_OUT_LABEL}, so everything has to be picked up by <b>{PICKUP_DEADLINE_LABEL}</b>. Tell me in the cart which days work for you and I&apos;ll confirm a time.</p>
        <p>Pairs and lots are priced for the whole set unless noted. Pickup is from the apartment; happy to coordinate a time. Items marked <em>tentative</em> might be kept — offers on those are welcome but non-binding on my side.</p>
      </div>
    </div>
  );
}
