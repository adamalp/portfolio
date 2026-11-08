-- Seed for adam-alpert.com content tables. Idempotent (upserts). Run after schema.sql.

-- Posts ------------------------------------------------------------------
insert into posts (slug, title, excerpt, body_md, tags, reading_time, status, published_at, author)
values ($x$marketplace-lessons$x$, $x$What I Learned Building a Marketplace$x$, $x$Seven years of lessons from Pangea on liquidity, trust, and scaling both sides.$x$, $md$Seven years ago, my co-founder John and I walked onto college campuses in Rhode Island handing out rubber ducks and two-dollar bills to get people to download an app. Today, Pangea is an AI-native staffing platform connecting companies with fractional creative and marketing talent across 150+ countries. Here's what I learned along the way.

Listen more than you sell. In the early days, we were very opinionated about what we thought the world wanted. We kept trying to sell our vision instead of listening to what the market was telling us. Two ears and one mouth, as the saying goes. The companies that wanted to hire through us had very different needs than what we'd imagined, and it took us too long to hear that.

Product-led vs. sales-led is not a permanent decision. YC encouraged us to think big and build for scale, which pushed us toward a product-led, self-serve model. But in a marketplace where trust and quality matter, being more sales-led, consultative, and curated would have served us better in those early years. Sometimes the fastest path to something huge is building a viable business first and scaling from a position of strength.

Great teams build great products. This is the whole thesis. If you can help assemble great teams, you can enable more great products to exist in the world. The old model of working at one company for decades is gone. People want flexibility, they want to work on interesting problems, and they want to progress.$md$, array[$x$Marketplaces$x$,$x$Pangea$x$]::text[], $x$8 min$x$, 'published', '2026-03-22T12:00:00Z', 'adam')
on conflict (slug) do update set title = excluded.title, excerpt = excluded.excerpt, body_md = excluded.body_md, tags = excluded.tags, reading_time = excluded.reading_time;

insert into posts (slug, title, excerpt, body_md, tags, reading_time, status, published_at, author)
values ($x$founder-communities$x$, $x$Why I Build Founder Communities$x$, $x$Density, trust, and real relationships as leverage for ambitious people.$x$, $md$In an AI-first world where we're spending more and more time inside our computers, I think the most valuable thing you can invest in is the people you spend time with in person.

So we built something curated. A dues-based social club, not an events platform. Members-only dinners weekly. Larger membership-wide events. And our annual tradition of buying out a ski mountain every February for 200 founders. The wider network has grown to over 5,000 people, but the core membership stays small — around 50 paid members — because that's what makes it work.

Curation is the product. The value of the community is entirely a function of who's in it. We look for founders who share certain values: ambition, creativity, confidence, a willingness to make mistakes, and a high level of integrity and honesty with each other.

When I moved to Cambridge for MIT, I started the Cambridge Founders Club with the same thesis. The irony isn't lost on me: a distributed team building tools to facilitate in-person connection. But that's exactly the balance I think the world needs more of. Technology as the tool, human connection as the goal.$md$, array[$x$Community Building$x$]::text[], $x$5 min$x$, 'published', '2026-03-15T12:00:00Z', 'adam')
on conflict (slug) do update set title = excluded.title, excerpt = excluded.excerpt, body_md = excluded.body_md, tags = excluded.tags, reading_time = excluded.reading_time;

insert into posts (slug, title, excerpt, body_md, tags, reading_time, status, published_at, author)
values ($x$ship-fast-systematize$x$, $x$Ship Fast, Then Systematize$x$, $x$How to balance speed with sustainability when building products.$x$, $md$One of the biggest mistakes I made in the early days of Pangea was trying to build the perfect product before we had users who cared. The instinct — to build it right the first time — cost us years.

Speed is a feature. Y Combinator hammered this home. The entire batch is structured around one question: what can you accomplish between now and Demo Day? Pick a KPI, grow it week over week. That forcing function compressed our decision-making and cut through the noise.

AI has changed the equation. Right now, I run three different projects with nine active work streams. I'm reinventing Pangea's entire tech stack using AI coding agents to move faster than a traditional engineering team could. The "ship fast" part has gotten dramatically faster. You can go from idea to working prototype in hours, not weeks. But the "systematize" part is just as important as ever.

The future of building belongs to people who can move between creation and systematization fluidly — who know when to be scrappy and when to be rigorous. AI makes the fast part faster. But knowing what to build, and when to build it properly, is still the hard part.$md$, array[$x$AI & Product$x$]::text[], $x$6 min$x$, 'published', '2026-03-08T12:00:00Z', 'adam')
on conflict (slug) do update set title = excluded.title, excerpt = excluded.excerpt, body_md = excluded.body_md, tags = excluded.tags, reading_time = excluded.reading_time;
