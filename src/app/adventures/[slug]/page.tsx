import { notFound } from "next/navigation";
import Link from "next/link";
import { adventures } from "@/lib/siteMap";

interface AdventurePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return adventures.map((adventure) => ({
    slug: adventure.slug,
  }));
}

const adventureContent: Record<string, {
  sections: { title: string; content: string }[];
}> = {
  "nols-alaska": {
    sections: [
      { title: "40 days in Alaska", content: "After my first year at Brown, I spent 40 days in the Brooks Range — the Noatak Wilderness and Gates of the Arctic National Park, in the northern reaches of Alaska. A float plane dropped us off, and from there it was just eight students, two instructors, and 500 miles of wilderness with no trails, no roads, and no civilization for a thousand miles in any direction. No cell phone, no hot water, no wallet, no amenities. I'd never camped before — I'd barely spent a single night in a tent.\n\nThe first ten days were spent backpacking through trailless terrain, navigating by topographical maps with no real sense of what the ground would look like until we were standing on it. After that, we transitioned to 30 days of canoeing down river systems. In total, we covered 500 miles and completed the full expedition objective." },
      { title: "Leadership & risk under real constraints", content: "NOLS expeditions typically include a solo experience where the instructors step back and let individuals operate independently. Because we were on the river at that point in the trip, a true solo wasn't feasible. Instead, the instructors decided to let the group continue together — without them — and they selected me to lead. I wasn't the oldest, but I was chosen to be in charge: responsible for keeping everyone safe, managing the group dynamic, navigating to our destination, and making sure we functioned as a team.\n\nI led the group for three days with no instructors. It was one of my first real designated leadership opportunities, and it went well. Keeping morale high mattered as much as keeping us on course — tired, hungry people in a remote wilderness need a leader who can hold both. Earning the respect of my expedition mates and getting us through that stretch without incident was a defining moment in my growth as a leader." },
      { title: "How it changed how I operate", content: "Being completely disconnected from technology for 40 days rewired how I think about it. We spend so much of our lives organizing our days around our devices, but technology is supposed to be a tool — something that helps us achieve things, not something we serve. In the backcountry, what you need is clear: shelter, food, water, safety. Everything else is a want. I realized that in modern life, we constantly confuse the two. We fill our time with things we think we need to do without ever asking the more important question: what do I actually want? Once you decide what you want, what you need to do reveals itself. That reframing — want first, then need — is something I've carried with me ever since. It shapes how I prioritize, how I build, and how I decide what's worth my time." },
      { title: "Photos & route map", content: "Visual documentation of the 500-mile expedition through the Brooks Range, Noatak Wilderness, and Gates of the Arctic — from float plane drop-off through backpacking and canoeing to extraction. Photos and route map to be added." },
    ],
  },
  cotopaxi: {
    sections: [
      { title: "Why Cotopaxi", content: "A group of friends from business school put the trip together. Cotopaxi is one of the highest active volcanoes in the world — 19,347 feet, higher than Kilimanjaro — and it sits in the Ecuadorian Andes about 50 kilometers south of Quito. I'd never done high-altitude mountaineering, and the combination of a physical challenge, a new country, and the chance to really disconnect made it hard to say no." },
      { title: "Preparation & training", content: "We spent ten days in Ecuador with no cell service, staying at a small hostel called the Secret Garden of Cotopaxi near the national park. Electricity would go out most of the week, and there was no Wi-Fi. It forced us to disconnect completely — something I hadn't done since Alaska — and come together as a group. In the days leading up to the summit attempt, we did four or five acclimatization hikes, including a rappelling rock climb. I'd never gone rock climbing in my life. The whole trip was about pushing into things I'd never done before, including some genuinely scary ones." },
      { title: "Summit attempt", content: "The summit attempt starts with a hike up to the refuge at about 15,000–16,000 feet. You go to sleep at 6 PM and wake up at 11 PM. Then you climb through the night — every step the highest you've ever been. Climbing in the dark is a real psychological drain. You can't see how far you've come and you can't see how far you have left. It's six hours up. We made good time, but there were several moments where I wasn't sure I was going to make it and thought I'd have to turn around. It was very physically demanding, very mentally demanding. But making it to the peak at 19,347 feet was one of the most rewarding experiences of my life." },
      { title: "Lessons about pacing, teams, and risk", content: "Doing hard things together brings people closer. I really value the relationships that were built and deepened on this trip, and I'm proud of myself for summiting something I'd never attempted before. But the deeper takeaway is the same one I keep coming back to: it's important to give yourself intentional time away from technology — no push notifications, no emails, no texts. As much of a technologist as I am, disconnecting lets you reconnect with yourself as a human being. I hadn't gone that long without a phone since Alaska, and I needed it more than I realized. We went in as friends and came out stronger together." },
    ],
  },
  "ski-and-outdoor": {
    sections: [
      { title: "Skiing & mountains as a recurring theme", content: "I started skiing when I was two or three years old at King Pine in Maine, outside of Portland. Skiing has always been something I've done with my family — it's brought us closer together and been a shared tradition I really value. When I was about 13, I switched to snowboarding exclusively as part of my own rebellion and exploration of who I was — everyone else in the family skied. I snowboarded for about 15 or 16 years before recently getting back on skis, picking up a backcountry setup to explore the mountains of New Hampshire." },
      { title: "Notable trips", content: "I ski every year, and I've done a couple of small backcountry expeditions throughout New England, particularly in New Hampshire. I'm hoping to do Tuckerman's Ravine this year if conditions allow. Beyond the skiing itself, some of the most important connections I've made have happened on the mountain. Some of our earliest investors and advisors at Pangea I actually met on a chairlift at Okemo in Vermont. You never know who you're going to meet. It's a great physical activity, a great way to get outside, and a surprisingly effective way to build relationships." },
      { title: "Ice Coast Films", content: "My love of skiing and my love of film came together in 2024 when I hosted a one-night ski film festival in Brooklyn. I worked with seven independent film directors, producers, and athletes, rented out a movie theater, and put on a two-hour show featuring independently produced short ski and snowboard films. It sold out. It was a really special event — a way to bring together two communities I care about and create something that felt like it mattered. I'm hoping to run it back again." },
      { title: "Why I keep going back to the mountains", content: "Mountains are a recurring theme in my life — from the Brooks Range in Alaska to Cotopaxi in Ecuador to a random Tuesday at a New Hampshire backcountry trailhead. There's something about being in the mountains that resets me. It's physical, it's present, and it strips away everything that doesn't matter. Whether it's a family tradition, a solo backcountry day, or buying out a ski mountain for 200 founders, the mountains keep showing up because they keep giving me what I need: perspective, challenge, and a reason to put the phone away." },
    ],
  },
};

export default async function AdventurePage({ params }: AdventurePageProps) {
  const { slug } = await params;
  const adventure = adventures.find((a) => a.slug === slug);

  if (!adventure) {
    notFound();
  }

  const content = adventureContent[slug];
  const currentIndex = adventures.findIndex((a) => a.slug === slug);
  const prevAdventure = currentIndex > 0 ? adventures[currentIndex - 1] : null;
  const nextAdventure = currentIndex < adventures.length - 1 ? adventures[currentIndex + 1] : null;

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/about"
          className="inline-flex items-center gap-2 font-mono text-sm text-muted hover:text-primary transition-colors mb-8"
        >
          ← About
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="font-mono text-sm text-primary mb-2">{adventure.year}</div>
          <h1 className="text-3xl md:text-4xl font-mono font-bold text-text mb-4">
            {adventure.title}
          </h1>
          <p className="text-xl text-muted">{adventure.subtitle}</p>
        </header>

        {/* Hero image placeholder */}
        <div className="aspect-video bg-surface border border-border rounded-lg mb-12 flex items-center justify-center">
          <span className="font-mono text-muted">// Photo to be added</span>
        </div>

        {/* Content sections */}
        <div className="space-y-12">
          {content?.sections.map((section, index) => (
            <section key={index}>
              <h2 className="font-mono text-xl text-text mb-4">{section.title}</h2>
              <div className="p-6 bg-surface border border-border rounded-lg space-y-4">
                {section.content.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="text-muted leading-relaxed">{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Prev/Next navigation */}
        <nav className="mt-16 pt-8 border-t border-border">
          <div className="flex justify-between">
            {prevAdventure ? (
              <Link href={`/adventures/${prevAdventure.slug}`} className="group flex flex-col">
                <span className="text-xs font-mono text-muted mb-1">← Previous</span>
                <span className="font-mono text-text group-hover:text-primary transition-colors">{prevAdventure.title}</span>
              </Link>
            ) : (
              <div />
            )}
            {nextAdventure ? (
              <Link href={`/adventures/${nextAdventure.slug}`} className="group flex flex-col text-right">
                <span className="text-xs font-mono text-muted mb-1">Next →</span>
                <span className="font-mono text-text group-hover:text-primary transition-colors">{nextAdventure.title}</span>
              </Link>
            ) : (
              <Link href="/about" className="font-mono text-sm text-muted hover:text-primary transition-colors">
                ← About
              </Link>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
