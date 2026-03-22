import { notFound } from "next/navigation";
import Link from "next/link";
import { storyChapters } from "@/lib/siteMap";

interface StoryChapterPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return storyChapters.map((chapter) => ({
    slug: chapter.slug,
  }));
}

// Placeholder content for each chapter
const chapterContent: Record<string, { sections: { title: string; content: string }[] }> = {
  upbringing: {
    sections: [
      { title: "Where I grew up", content: "I grew up in the suburbs of New York City, the only boy in a house with four sisters. From an early age I was drawn to making things — not in the \"lemonade stand\" way people usually mean when they say a kid was entrepreneurial, but through a camera lens. I got a video camera in sixth grade and was immediately hooked. I'd spend weekends learning manual settings, recruiting friends to make short films, and uploading everything to YouTube right as the platform was taking off. One of those videos crossed a million views — it's since been taken down, but at the time it was a glimpse of something I couldn't fully articulate yet: the ability to take a vision and turn it into something real." },
      { title: "Early signs of building", content: "Film became my first medium for that instinct. In high school, I founded the filmmaking club, and when I realized there was no formal class for it, I petitioned the administration to create one. They agreed, hired a graduate from RISD to teach it, and — fifteen years later — she's still there, now teaching four levels of videography. It was a small thing, but it taught me something I've carried ever since: just because a system is set up a certain way doesn't mean it can't be changed. That lesson — that you can reshape the structures around you, not just work within them — became a recurring thread in everything I did after." },
      { title: "Finding my voice", content: "Growing up the only boy with four sisters meant I had to carve out my own space. I love them, but we were into different things — I was the one snowboarding, playing paintball, and drumming while they had their own worlds. But being part of a big family taught me things I didn't fully appreciate until later: compromise, emotional intelligence, how to read a room. When six people are making decisions together, you learn to make space for others while still creating space for yourself. If you wanted to be heard, you had to find your voice — not by being the loudest, but by having something worth saying. That dynamic — coexisting, collaborating, advocating for your perspective without steamrolling — turns out to be pretty good training for building companies and communities." },
      { title: "The through-line to today", content: "I still think of myself as a creative, even though I haven't picked up a camera in years. What videography really taught me was that you can make things — and you can make things that other people genuinely enjoy. That feeling never went away. It just found new mediums: a marketplace, a community, a product. Somewhere in those early years I established a KPI that I've never really let go of — the number of smiles you can generate in the world. It sounds soft for someone who went through Y Combinator and builds software, but it's the through-line connecting everything: the films I made in middle school, the class I convinced my high school to create, and every product I've shipped since. Vision into action, in service of something people actually want." },
    ],
  },
  brown: {
    sections: [
      { title: "Why Brown / Why History", content: "Brown was an obvious choice. I'd considered film school, but decided I wanted a broader education — I figured I could always learn the technical side of filmmaking on my own. What I couldn't teach myself was how to think across disciplines, and Brown's open curriculum gave me room to do that. I started as a Modern Culture & Media major but found I cared less about the theory of media and more about its actual impact on the world. So I landed in History, where I could pursue the questions that genuinely fascinated me.\n\nI had two threads within my concentration. The first explored how the emergence of new media — photography, film, radio — fundamentally changed the way history was recorded, edited, and understood. When you read something, you maintain a distance from it; you can interrogate the text, form your own images. But when you see a video or a photograph, it lands differently. It's more immediate, more visceral, harder to question. I'd argue this is one of the reasons the world has become more polarized — people don't always recognize the level of editing and framing that goes into visual media, and it shapes how they understand reality. That challenge has only intensified with the rise of AI-generated content, where what's \"real\" is increasingly difficult to agree on.\n\nThe second thread traced how energy regime transformations — from fire to farming, steam engines to fossil fuels, and now solar and nuclear — have driven step-function increases in humanity's ability to do work. If you plot the arc of civilization and quality of life, it tracks remarkably well against how societies capture, store, and use energy. That lens became even more relevant as I started thinking about AI: the bottleneck for these systems is ultimately energy production and efficiency, and an energy transition could unlock the next exponential leap in what technology can do for us." },
      { title: "NOLS & Alaska", content: "After my first year at Brown, I spent 40 days in the Brooks Range — the Noatak Wilderness and Gates of the Arctic National Park, in the northern reaches of Alaska. I went out there with seven other students and two instructors. No cell phone, no hot water, no wallet, no amenities. A thousand miles from the nearest road. I'd never camped before. I'd barely spent a single night in a tent.\n\nThe first ten days are about learning to survive: pitching shelter, handling injuries, cooking in the backcountry, foraging. You're backpacking through terrain with no trails — you have a destination you need to reach, and you plot your own route using topographical maps with no real sense of what the ground looks like until you're standing on it. You make your best-guess plan, pick a line, and start moving. Sometimes you have to adjust because a river is impassable or a slope turns out to be a scree field you can't safely navigate with a crew. And it's not just about whether you can make it — it's about how you work as a team. These environments create real pressure. You're not sleeping well, you're not eating much, you're tired and wet and not happy. But you're stuck there together, and your literal survival depends on having the emotional stability to work through it. You get to know people at a fundamental level in those conditions. There's no better place to learn real leadership than navigating primal challenges in the wilderness with a group of people who are counting on each other.\n\nBut the deeper shift happened when I moved past surviving into thriving. Being completely disconnected from technology for that long changed how I thought about it. We spend so much of our lives organizing our days around our devices, but at the end of the day, technology is supposed to be a tool — something that helps us go achieve things, not something we serve. In the backcountry, what you need is clear: shelter, food, water, safety. Everything else is a want. And I realized that in modern life, we constantly confuse the two. We fill our time with things we think we need to do without ever asking the more important question: what do I actually want? Once you decide what you want, what you need to do reveals itself. That reframing — want first, then need — is something I've tried to carry with me ever since." },
      { title: "The first version of Pangea", content: "Those two intellectual threads converged into a question I couldn't let go of: if better energy systems produce better hardware, and better hardware produces better software, and that cycle keeps accelerating — what happens to work? Technology creates enormous value, but that value doesn't distribute itself equally. There would likely be significant displacement in the types of jobs people do, and that gap would need something to bridge it.\n\nI started exploring the role marketplaces could play — future-forward platforms that don't just match people to today's jobs but help set up the kinds of roles we'll see more of tomorrow. That line of thinking is what led me to build the earliest version of Pangea: a fractional hiring platform designed to connect people with flexible, high-quality work. Alongside that, I was also looking at models like Alaska's Permanent Fund and Scandinavian sovereign wealth funds — places where revenues from natural resource extraction are redistributed in ways that genuinely improve quality of life. The idea that entrepreneurship-driven capitalism and stronger social safety nets aren't opposites but complements stuck with me. Pangea was my way of working on one side of that equation." },
      { title: "Key lessons", content: "Brown gave me three things I didn't know I needed. An intellectual framework for thinking about how technology, media, and energy shape society. A wilderness experience that rewired how I think about leadership, survival, and what actually matters. And the earliest version of an idea — Pangea — that I'd spend the next decade building. I arrived as a kid who liked making videos. I left as someone with a point of view about where the world was heading and a conviction that I could build something to meet it." },
    ],
  },
  "rhode-island": {
    sections: [
      { title: "Staying in Providence", content: "Staying in Providence wasn't some grand strategic decision — it happened because that's where our users were. Rhode Island has an absurd concentration of college students: Brown, RISD, Johnson & Wales, and about twelve other universities packed into a small state. If you're building for the college market, there's no better place to just walk onto a campus and talk to people. Beyond that, I genuinely loved Providence. It was affordable, it was focused, and it let my co-founder John and me put all our energy into building without the distractions and burn rate of New York or San Francisco." },
      { title: "Turning a student project into a company", content: "Pangea started as a side project John and I were tinkering with, and I honestly didn't think of it as a company. The turning point came in the most unlikely place — a job interview. I was interviewing at Harry's, the DTC razor company, talking to their COO. I was young and didn't really know what I was doing, and I spent most of the interview talking about this concept we were building instead of, you know, answering his questions. He interrupted me and said, \"You seem very excited about this idea. Have you considered working on it after you graduate?\" I remember thinking — is that even possible? Launching a company straight out of college wasn't something people around me were doing. It wasn't a path I'd ever seen modeled.\n\nWe ended up applying to Brown's summer venture accelerator. It was designed for students going into their junior or senior year, but we applied as graduating seniors and got in. They gave each of us a small stipend to work on Pangea for eight weeks. We figured — what's the worst that happens? We'll learn a lot doing something we want to do. So we did it." },
      { title: "Early customers, early mistakes", content: "We signed up our first thousand users by hand. Literally walking onto campuses, handing out rubber ducks and two-dollar bills to get people to download the app. It was scrappy and it worked — at least for getting people in the door. But we made a lot of mistakes in those early years. We tried to be product-first, building custom software when we probably could have shipped something faster with low-code tools — though in fairness, Airtable and Bubble weren't what they are today. We were very opinionated about what we thought the world wanted, and we kept trying to sell instead of listen. Two ears and one mouth, as the saying goes.\n\nThe bigger issue was how anchored we got on our initial assumptions. We were locked into it being a mobile app, locked into the college student market, locked into a model where both buyers and sellers were students. That gave us a very limited view of the problems people were actually willing to pay to solve. It took us longer than it should have to realize we needed to shift toward higher-quality talent and a more professional freelance and fractional marketplace." },
      { title: "Going all-in on Pangea", content: "There wasn't one dramatic \"burn the boats\" moment — it was more of a gradual compounding of commitment. The accelerator kept us in Providence for the summer, and then we just... kept going. Every small win made it harder to walk away, and every mistake taught us something we couldn't have learned any other way. We took it a lot further than we ever thought we would. The conviction came not from certainty that it would work, but from the fact that we genuinely wanted to do it. And once you know what you want, what you need to do reveals itself." },
    ],
  },
  yc: {
    sections: [
      { title: "Getting into YC (W21)", content: "We applied to YC twice. The first time, we got an interview but didn't get in. We were seeing rapid growth on the supply side — when the pandemic hit, we went from being at a handful of Rhode Island schools to over 1,800 colleges across the US almost overnight. But we couldn't tell a convincing story on the demand side. We didn't have enough companies hiring through the platform. So we got to work: we put our own talent base — our college students — to work helping us acquire companies as clients. Over the next six months, we grew revenue in a meaningful way, reapplied, and got in. W21 was one of the remote batches, so we did the whole thing from Rhode Island. But it was still one of the most exciting moments for the team — a real validation that what we were building mattered." },
      { title: "What changed during the batch", content: "YC taught us better discipline around speed. The entire batch is structured around one question: what can you accomplish between now and Demo Day? They have you pick a single KPI and try to grow it week over week. That forcing function was exactly what we needed — it compressed our decision-making and cut out a lot of the noise. Being part of a peer network of other builders and founders was equally valuable. You're surrounded by people operating at the same intensity, facing the same kinds of problems, and that energy is contagious." },
      { title: "How YC shaped Pangea", content: "By Demo Day, we'd raised $3.3 million in total funding and were able to run at things much more aggressively. But the lasting value of YC wasn't the money — it was the network. I'm still deeply connected to the YC community. Through the NYC Founders Club, I helped run alumni happy hours every single month, and two of my batch mates became founding partners in that community. The relationships from YC have compounded in ways I couldn't have predicted, and they've shaped not just Pangea but everything I've built since." },
      { title: "Principles I kept, advice I ignored", content: "YC gives you an enormous amount of advice, but it takes time for the lessons to actually internalize. People can tell you things all day — you still have to come to your own conclusions and figure out how to apply them in your specific context. The biggest tension I felt was around scale. YC really encourages you to think big — how does this become a billion-dollar company? And that's valuable, but it can also cause you to make decisions that sacrifice short-term growth for a vision that's still too far away. We leaned into being a product-led, self-serve platform because we thought we needed volume. In hindsight, being more sales-led, more consultative, more curated in our approach would have served us better in those early post-batch years. Sometimes the faster path to something huge is building a viable business first, and then scaling from a position of strength." },
    ],
  },
  "new-york": {
    sections: [
      { title: "Moving to New York", content: "I moved to New York in 2023. I'm from the area originally, and after six years in Providence it was time for a change. The company had shifted to working more remotely, so my location was less tied to where the team sat. What drew me to New York was the density of the founder ecosystem. I'd begun to realize how much it mattered to be around other smart, ambitious people — and New York just has more of them by sheer gravity. The energy there is different. You're constantly running into people building interesting things, and that proximity shapes how you think and what you think is possible." },
      { title: "Building the team", content: "As Pangea matured, the team became increasingly remote and global. We moved away from needing everyone in one place and started hiring based on talent, not geography — which, for a company building a global talent marketplace, felt like the right way to practice what we preached. Managing a distributed team taught me a lot about communication, trust, and the importance of clear systems. You can't rely on hallway conversations when your team is spread across time zones. Everything needs to be more intentional." },
      { title: "From campus to global", content: "The New York chapter coincided with Pangea's biggest strategic shift. We moved from being a campus-oriented marketplace — college students hiring college students — to a professionally oriented fractional marketplace focused on AI-native talent. The users we wanted to serve weren't undergrads anymore; they were experienced professionals building with new tools, and there were more of them in cities like New York than on college campuses. The platform expanded to talent in over 150 countries. It was a fundamentally different business than what we'd started with in that Brown accelerator, but the core thesis was the same: connect great people with great work, and make the process as frictionless as possible." },
      { title: "Starting founder communities", content: "New York has an incredible density of founders, but that density can actually work against you. The community gets diluted. There are thousands of people in the very early stages of building something, and finding the ones who've raised venture funding, gone through programs like YC, have real customers and revenue and serious ambitions — that takes effort. My friends Akash and Mike and I saw an opportunity to cultivate something more intentional. We started the NYC Founders Club as a curated community of founders we genuinely wanted to spend time with — people operating at a similar level, focused on real-life connection rather than another Slack group. We built it to our own tastes and standards: intimate dinners, meaningful collisions, a space where ambitious people could be honest with each other. It turned into something I care about as much as Pangea." },
    ],
  },
  mit: {
    sections: [
      { title: "Why business school (and why MIT)", content: "I've always seen the value in networks and communities, and when the opportunity to attend MIT Sloan came up, I saw it as a chance to both contribute to and embed myself in one of the most important ecosystems in the world — particularly right now. We're in the middle of an AI transformation, and a huge amount of the foundational research is coming out of MIT. The founders and builders emerging from this ecosystem are shaping what comes next. Sloan is a unique place to do a business degree compared to other historically top programs. The world has changed, and being in a more technical, more future-forward network feels far more valuable than a traditional MBA experience. Everything is shifting, and I wanted to be where the shift is happening." },
      { title: "Core threads", content: "Most of my time at Sloan has been spent building. I've been deep in the agentic web — exploring agentic CRMs, agentic memory systems, agent-to-agent experiences, and platforms that treat AI agents as first-class participants rather than features bolted on to existing software. I've built several platforms on my own during this time, testing ideas about what the future of the web looks like when you design for agents first and humans alongside them. And I've been spending most of my days building in Claude Code, using AI coding agents to work at a speed and scope that would have been impossible even a year ago." },
      { title: "MIT roles", content: "Beyond my own building, I've been working to support the broader MIT entrepreneurial ecosystem. I'm on the leadership team of the MIT $100K, the longest-running student startup competition in the country. I've also been putting together a working group to better connect MIT Sloan and the MIT Media Lab, which has an extraordinary amount of frontier research happening that deserves more connectivity to the entrepreneurial side of campus. And I launched the Cambridge Founders Club — an extension of the community-building work I started in New York — complete with a full-stack application I built to support it. Same thesis, new city: curate a group of ambitious people, create space for real connection, and see what compounds." },
      { title: "How Sloan fits the bigger arc", content: "The MIT chapter isn't a detour from building — it's an accelerant. I'm using this time to reinvent Pangea as an AI-natively powered platform, agentically driven from the inside out. I'm modernizing the entire tech stack — front end to back end — using AI coding agents to move faster than a traditional engineering team could. The question I keep coming back to is the same one I've been asking since Brown: what does the future of work look like, and how do you build the platform that meets it? The tools have changed dramatically, but the mission hasn't. Pangea started as a way to connect people with meaningful work. Now I'm building the version of it that's designed for a world where agents and humans work side by side." },
    ],
  },
};

export default async function StoryChapterPage({ params }: StoryChapterPageProps) {
  const { slug } = await params;
  const chapter = storyChapters.find((c) => c.slug === slug);
  const currentIndex = storyChapters.findIndex((c) => c.slug === slug);

  if (!chapter) {
    notFound();
  }

  const content = chapterContent[slug];
  const prevChapter = currentIndex > 0 ? storyChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < storyChapters.length - 1 ? storyChapters[currentIndex + 1] : null;

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
          <div className="font-mono text-sm text-primary mb-2">{chapter.year}</div>
          <h1 className="text-3xl md:text-4xl font-mono font-bold text-text mb-4">
            {chapter.title}
          </h1>
          <p className="text-xl text-muted">{chapter.subtitle}</p>
        </header>

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

        {/* Chapter navigation */}
        <nav className="mt-16 pt-8 border-t border-border">
          <div className="flex justify-between">
            {prevChapter ? (
              <Link
                href={`/story/${prevChapter.slug}`}
                className="group flex flex-col"
              >
                <span className="text-xs font-mono text-muted mb-1">← Previous</span>
                <span className="font-mono text-text group-hover:text-primary transition-colors">
                  {prevChapter.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {nextChapter && (
              <Link
                href={`/story/${nextChapter.slug}`}
                className="group flex flex-col text-right"
              >
                <span className="text-xs font-mono text-muted mb-1">Next →</span>
                <span className="font-mono text-text group-hover:text-primary transition-colors">
                  {nextChapter.title}
                </span>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
