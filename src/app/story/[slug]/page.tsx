import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { storyChapters } from "@/lib/siteMap";

const chapterImages: Record<string, string> = {
  upbringing: "/images/ski_film_poster.jpg",
  brown: "/images/brown_intramural_hockey.jpg",
  "rhode-island": "/images/providence.JPG",
  yc: "/images/early_pangea_team.jpg",
  "new-york": "/images/nyc_founders_club.JPG",
  mit: "/images/rhode_island_panel.jpg",
};

const chapterInlineImages: Record<
  string,
  Record<string, { src: string; alt: string }>
> = {
  "rhode-island": {
    "Turning a student project into a company": {
      src: "/images/tedx.jpg",
      alt: "TEDx talk",
    },
    "Early customers, early mistakes": {
      src: "/images/rhode_island_panel.jpg",
      alt: "Panel discussion during early Pangea days",
    },
  },
};

const chapterLedes: Record<string, string> = {
  upbringing:
    "Early creativity, family, and the first instinct that I could just make things and put them out into the world.",
  brown:
    "History at Brown, NOLS Alaska, and the first version of what would become Pangea.",
  "rhode-island":
    "Post-grad in Providence, turning a student project into a real company.",
  yc: "W21, $125K, and three months that compressed years of learning into a season.",
  "new-york":
    "Moving to NYC, building a remote-first team, and scaling the marketplace through pivots.",
  mit: "Going back to school. Media Lab, the $100K, and Cambridge Founders Club on top of the ecosystem.",
};

interface StoryChapterPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return storyChapters.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: StoryChapterPageProps) {
  const { slug } = await params;
  const chapter = storyChapters.find((c) => c.slug === slug);
  if (!chapter) return {};
  return {
    title: chapter.title,
    description: chapterLedes[slug] ?? chapter.subtitle,
  };
}

const chapterContent: Record<
  string,
  { sections: { title: string; content: string }[] }
> = {
  upbringing: {
    sections: [
      {
        title: "Where I grew up",
        content:
          "I grew up in the suburbs of New York City, the only boy in a house with four sisters. From an early age I was drawn to making things — not in the \"lemonade stand\" way people usually mean when they say a kid was entrepreneurial, but through a camera lens. I got a video camera in sixth grade and was immediately hooked. I'd spend weekends learning manual settings, recruiting friends to make short films, and uploading everything to YouTube right as the platform was taking off. One of those videos crossed a million views — it's since been taken down, but at the time it was a glimpse of something I couldn't fully articulate yet: the ability to take a vision and turn it into something real.",
      },
      {
        title: "Early signs of building",
        content:
          "Film became my first medium for that instinct. In high school, I founded the filmmaking club, and when I realized there was no formal class for it, I petitioned the administration to create one. They agreed, hired a graduate from RISD to teach it, and — fifteen years later — she's still there, now teaching four levels of videography. It was a small thing, but it taught me something I've carried ever since: just because a system is set up a certain way doesn't mean it can't be changed.",
      },
      {
        title: "Finding my voice",
        content:
          "Growing up the only boy with four sisters meant I had to carve out my own space. I love them, but we were into different things — I was the one snowboarding, playing paintball, and drumming while they had their own worlds. But being part of a big family taught me things I didn't fully appreciate until later: compromise, emotional intelligence, how to read a room. When six people are making decisions together, you learn to make space for others while still creating space for yourself. That dynamic — coexisting, collaborating, advocating for your perspective without steamrolling — turns out to be pretty good training for building companies and communities.",
      },
      {
        title: "The through-line to today",
        content:
          "I still think of myself as a creative, even though I haven't picked up a camera in years. What videography really taught me was that you can make things — and you can make things that other people genuinely enjoy. Somewhere in those early years I established a KPI that I've never really let go of — the number of smiles you can generate in the world. It sounds soft for someone who went through Y Combinator and builds software, but it's the through-line connecting everything: the films I made in middle school, the class I convinced my high school to create, and every product I've shipped since.",
      },
    ],
  },
  brown: {
    sections: [
      {
        title: "Why Brown / Why History",
        content:
          "Brown was an obvious choice. I'd considered film school, but decided I wanted a broader education — I figured I could always learn the technical side of filmmaking on my own. What I couldn't teach myself was how to think across disciplines, and Brown's open curriculum gave me room to do that. I started as a Modern Culture & Media major but found I cared less about the theory of media and more about its actual impact on the world. So I landed in History, where I could pursue the questions that genuinely fascinated me.\n\nI had two threads within my concentration. The first explored how the emergence of new media — photography, film, radio — fundamentally changed the way history was recorded, edited, and understood. The second traced how energy regime transformations — from fire to farming, steam engines to fossil fuels, and now solar and nuclear — have driven step-function increases in humanity's ability to do work.",
      },
      {
        title: "NOLS & Alaska",
        content:
          "After my first year at Brown, I spent 40 days in the Brooks Range — the Noatak Wilderness and Gates of the Arctic National Park, in the northern reaches of Alaska. I went out there with seven other students and two instructors. No cell phone, no hot water, no wallet, no amenities. A thousand miles from the nearest road. I'd never camped before. I'd barely spent a single night in a tent.\n\nThe first ten days are about learning to survive. Then you move past surviving into thriving. Being completely disconnected from technology for that long changed how I thought about it. We spend so much of our lives organizing our days around our devices, but at the end of the day, technology is supposed to be a tool — something that helps us achieve things, not something we serve. In the backcountry, what you need is clear: shelter, food, water, safety. Everything else is a want. That reframing — want first, then need — is something I've tried to carry with me ever since.",
      },
      {
        title: "The first version of Pangea",
        content:
          "Those two intellectual threads converged into a question I couldn't let go of: if better energy systems produce better hardware, and better hardware produces better software, and that cycle keeps accelerating — what happens to work? Technology creates enormous value, but that value doesn't distribute itself equally. There would likely be significant displacement in the types of jobs people do, and that gap would need something to bridge it.\n\nI started exploring the role marketplaces could play. That line of thinking is what led me to build the earliest version of Pangea: a fractional hiring platform designed to connect people with flexible, high-quality work.",
      },
      {
        title: "Key lessons",
        content:
          "Brown gave me three things I didn't know I needed. An intellectual framework for thinking about how technology, media, and energy shape society. A wilderness experience that rewired how I think about leadership, survival, and what actually matters. And the earliest version of an idea — Pangea — that I'd spend the next decade building. I arrived as a kid who liked making videos. I left as someone with a point of view about where the world was heading and a conviction that I could build something to meet it.",
      },
    ],
  },
  "rhode-island": {
    sections: [
      {
        title: "Staying in Providence",
        content:
          "Staying in Providence wasn't some grand strategic decision — it happened because that's where our users were. Rhode Island has an absurd concentration of college students: Brown, RISD, Johnson & Wales, and about twelve other universities packed into a small state. If you're building for the college market, there's no better place to just walk onto a campus and talk to people.",
      },
      {
        title: "Turning a student project into a company",
        content:
          "Pangea started as a side project John and I were tinkering with, and I honestly didn't think of it as a company. The turning point came in a job interview at Harry's. I spent most of it talking about the concept we were building. The COO interrupted me and said, \"You seem very excited about this idea. Have you considered working on it after you graduate?\" I remember thinking — is that even possible?\n\nWe ended up applying to Brown's summer venture accelerator and got in. They gave each of us a small stipend to work on Pangea for eight weeks. We figured — what's the worst that happens? We'll learn a lot doing something we want to do. So we did it.",
      },
      {
        title: "Early customers, early mistakes",
        content:
          "We signed up our first thousand users by hand. Literally walking onto campuses, handing out rubber ducks and two-dollar bills to get people to download the app. The bigger issue was how anchored we got on our initial assumptions. We were locked into it being a mobile app, locked into the college student market, locked into a model where both buyers and sellers were students. That gave us a very limited view of the problems people were actually willing to pay to solve. It took us longer than it should have to realize we needed to shift toward higher-quality talent and a more professional freelance and fractional marketplace.",
      },
      {
        title: "Going all-in on Pangea",
        content:
          "There wasn't one dramatic \"burn the boats\" moment — it was more of a gradual compounding of commitment. Every small win made it harder to walk away, and every mistake taught us something we couldn't have learned any other way. The conviction came not from certainty that it would work, but from the fact that we genuinely wanted to do it.",
      },
    ],
  },
  yc: {
    sections: [
      {
        title: "Getting into YC (W21)",
        content:
          "We applied to YC twice. The first time, we got an interview but didn't get in. We were seeing rapid growth on the supply side — when the pandemic hit, we went from being at a handful of Rhode Island schools to over 1,800 colleges across the US almost overnight. But we couldn't tell a convincing story on the demand side. So we got to work, and reapplied six months later. W21 was one of the remote batches, so we did the whole thing from Rhode Island. But it was still one of the most exciting moments for the team.",
      },
      {
        title: "What changed during the batch",
        content:
          "YC taught us better discipline around speed. The entire batch is structured around one question: what can you accomplish between now and Demo Day? They have you pick a single KPI and try to grow it week over week. That forcing function was exactly what we needed — it compressed our decision-making and cut out a lot of the noise.",
      },
      {
        title: "How YC shaped Pangea",
        content:
          "By Demo Day, we'd raised $3.3 million in total funding and were able to run at things much more aggressively. But the lasting value of YC wasn't the money — it was the network. The relationships from YC have compounded in ways I couldn't have predicted, and they've shaped not just Pangea but everything I've built since.",
      },
      {
        title: "Principles I kept, advice I ignored",
        content:
          "YC gives you an enormous amount of advice, but it takes time for the lessons to actually internalize. People can tell you things all day — you still have to come to your own conclusions and figure out how to apply them in your specific context. We leaned into being a product-led, self-serve platform because we thought we needed volume. In hindsight, being more sales-led, more consultative, more curated would have served us better. Sometimes the faster path to something huge is building a viable business first, and then scaling from a position of strength.",
      },
    ],
  },
  "new-york": {
    sections: [
      {
        title: "Moving to New York",
        content:
          "I moved to New York in 2023. I'm from the area originally, and after six years in Providence it was time for a change. What drew me to New York was the density of the founder ecosystem. I'd begun to realize how much it mattered to be around other smart, ambitious people — and New York just has more of them by sheer gravity.",
      },
      {
        title: "Building the team",
        content:
          "As Pangea matured, the team became increasingly remote and global. We moved away from needing everyone in one place and started hiring based on talent, not geography — which, for a company building a global talent marketplace, felt like the right way to practice what we preached.",
      },
      {
        title: "From campus to global",
        content:
          "The New York chapter coincided with Pangea's biggest strategic shift. We moved from being a campus-oriented marketplace to a professionally oriented fractional marketplace focused on AI-native talent. The platform expanded to talent in over 150 countries. It was a fundamentally different business than what we'd started with in that Brown accelerator, but the core thesis was the same: connect great people with great work, and make the process as frictionless as possible.",
      },
      {
        title: "Starting founder communities",
        content:
          "My friends Akash and Mike and I saw an opportunity to cultivate something more intentional. We started the NYC Founders Club as a curated community of founders we genuinely wanted to spend time with. We built it to our own tastes and standards: intimate dinners, meaningful collisions, a space where ambitious people could be honest with each other. It turned into something I care about as much as Pangea.",
      },
    ],
  },
  mit: {
    sections: [
      {
        title: "Why business school (and why MIT)",
        content:
          "I've always seen the value in networks and communities, and when the opportunity to attend MIT Sloan came up, I saw it as a chance to both contribute to and embed myself in one of the most important ecosystems in the world. We're in the middle of an AI transformation, and a huge amount of the foundational research is coming out of MIT. Everything is shifting, and I wanted to be where the shift is happening.",
      },
      {
        title: "Core threads",
        content:
          "Most of my time at Sloan has been spent building. I've been deep in the agentic web — exploring agentic CRMs, agentic memory systems, agent-to-agent experiences, and platforms that treat AI agents as first-class participants rather than features bolted on to existing software.",
      },
      {
        title: "MIT roles",
        content:
          "I'm on the leadership team of the MIT $100K, the longest-running student startup competition in the country. I've also been putting together a working group to better connect MIT Sloan and the MIT Media Lab. And I launched the Cambridge Founders Club — an extension of the community-building work I started in New York — complete with a full-stack application I built to support it.",
      },
      {
        title: "How Sloan fits the bigger arc",
        content:
          "The MIT chapter isn't a detour from building — it's an accelerant. I'm using this time to reinvent Pangea as an AI-natively powered platform, agentically driven from the inside out. The question I keep coming back to is the same one I've been asking since Brown: what does the future of work look like, and how do you build the platform that meets it? The tools have changed dramatically, but the mission hasn't.",
      },
    ],
  },
};

export default async function StoryChapterPage({ params }: StoryChapterPageProps) {
  const { slug } = await params;
  const chapter = storyChapters.find((c) => c.slug === slug);
  if (!chapter) notFound();

  const idx = storyChapters.findIndex((c) => c.slug === slug);
  const prev = idx > 0 ? storyChapters[idx - 1] : null;
  const next = idx < storyChapters.length - 1 ? storyChapters[idx + 1] : null;

  const content = chapterContent[slug];
  const heroImg = chapterImages[slug];

  return (
    <div className="page" data-page="story">
      <section className="detail-hero">
        <div className="shell">
          <Link href="/about" className="detail-back">← Back to about</Link>
          <div className="detail-eyebrow">
            <span className="role">Chapter 0{idx + 1}</span>
            <span className="dim">·</span>
            <span>{chapter.year}</span>
          </div>
          <h1 className="detail-title">{chapter.title}</h1>
          <p className="detail-lede">
            {chapterLedes[slug] ?? chapter.subtitle}
          </p>
        </div>
      </section>

      {heroImg && (
        <section style={{ padding: 0 }}>
          <div className="shell">
            <div className="story-figure">
              <Image
                src={heroImg}
                alt={chapter.title}
                fill
                sizes="(min-width: 1240px) 1080px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>
      )}

      <section style={{ paddingTop: 64 }}>
        <div className="shell">
          <div className="story-body">
            {content?.sections.map((sec, i) => (
              <div key={i} className="story-sec">
                <div className="story-sec-num">0{i + 1}</div>
                <div className="story-sec-content">
                  <h2 className="story-sec-title">{sec.title}</h2>
                  {sec.content.split("\n\n").map((par, j) => (
                    <p key={j}>{par}</p>
                  ))}
                  {chapterInlineImages[slug]?.[sec.title] && (
                    <div
                      className="story-figure"
                      style={{ marginTop: 24, aspectRatio: "16/9" }}
                    >
                      <Image
                        src={chapterInlineImages[slug][sec.title].src}
                        alt={chapterInlineImages[slug][sec.title].alt}
                        fill
                        sizes="(min-width: 1240px) 720px, 100vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: 100 }}>
        <div className="shell">
          <div className="pn">
            {prev ? (
              <Link href={`/story/${prev.slug}`}>
                <span className="lab">← Previous chapter</span>
                <span className="nm">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/story/${next.slug}`} className="right">
                <span className="lab">Next chapter →</span>
                <span className="nm">{next.title}</span>
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
