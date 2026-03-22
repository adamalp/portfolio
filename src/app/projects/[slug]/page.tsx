import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { buildProjects } from "@/lib/siteMap";
import { Button, TechTag } from "@/components/ui";

const projectImages: Record<string, string> = {
  "pangea": "/images/early_pangea.JPG",
  "founder-communities": "/images/nycfc_ramp.JPG",
};

const projectInlineImages: Record<string, Record<string, { src: string; alt: string }>> = {
  "pangea": {
    "The journey": { src: "/images/old_pangea_app_store.PNG", alt: "Early Pangea app store listing" },
  },
  "founder-communities": {
    "NYC Founders Club": { src: "/images/nyski_mountin_bouyout.JPG", alt: "NYC Founders Club annual ski mountain buyout" },
  },
};

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return buildProjects.map((project) => ({
    slug: project.slug,
  }));
}

// Detailed content for each project
const projectDetails: Record<string, {
  longDescription: string;
  sections: { title: string; content: string }[];
  tags: string[];
  links?: { label: string; href: string }[];
}> = {
  pangea: {
    longDescription: "The first AI-native staffing and recruiting platform, focused on fractional creative, marketing, and growth talent. Built from a Brown dorm room through Y Combinator to profitability.",
    tags: ["Marketplace", "Next.js", "PostgreSQL", "BigQuery", "n8n"],
    links: [{ label: "Visit Pangea", href: "https://pangea.app" }],
    sections: [
      { title: "The problem", content: "Hiring is still very broken. But one thing that makes humans unique as a species is our ability to form teams, collaborate, and work together — it goes back to our foundational evolution, and I believe it's going to remain foundational to who we are. I wanted to make it easier to create opportunities for people to work together, particularly in creative, marketing, and growth fields — areas where you need creative minds focused on what humans do well, and increasingly, people who really understand how to wield AI to get things done.\n\nThe old model — join a company, stay for 20 or 30 or 40 years — has already gone away for most people. We live in an environment where people want to try different things, progress, and have multiple projects in their lives. The internet enabled that shift, and AI is accelerating it. Right now, I personally run three different projects with nine active work streams across them. People can get a lot more done in a lot less time, and that's why fractional work and contract-to-hire models are rising. It's also smarter: work with someone part-time to see if there's a long-term fit before committing to a full-time W-2 hire. And while the dream of a one-person billion-dollar company is compelling, the reality is that you're going to need teams of two or three or ten or twenty. Organizations might cap out at 100 or 200 employees instead of 10,000, but so long as you're building products with real complexity, you'll need to keep assembling great people. Great teams build great products. If we can help assemble great teams, we can enable more great products to exist in the world." },
      { title: "The journey", content: "Pangea's evolution mirrors my own professional progression — learning to hire well, learning to build, and ultimately wanting to work on multiple things at once. We went from a college-focused mobile app to a professional fractional marketplace, and from handing out rubber ducks on campuses to working with companies hiring experienced AI-native talent across 150+ countries. Each phase forced us to rethink what we were building and who we were building it for. The constant through all of it was the same conviction: the way people find and form teams is changing, and there should be a platform designed for how work actually happens now." },
      { title: "What we built", content: "Pangea is now the first AI-native staffing and recruiting platform, focused on fractional creative, marketing, and growth talent. We've built an entire native experience from top of funnel all the way through to matching and payment. Our agentic matching system connects companies with high-quality talent, and we facilitate contracts and payments through the platform. We're building our own series of internal AI agents to manage operations as we scale — automating the coordination layer so we can focus on what matters: the quality of the match." },
      { title: "Scaling the system", content: "I built out our entire data engineering architecture personally — dbt transformations, data warehousing with BigQuery, and reverse ETL pipelines that activate our data for marketing workflows and operational automation. On top of that, we've layered BI dashboards and hundreds of automations that keep the marketplace running efficiently. Now, with my technical abilities continuing to grow, I'm not only contributing on the sales and customer experience side but pushing new code and features directly to production. It's a different kind of CEO role — one where I'm talking to customers and managing service issues in the morning and shipping code in the afternoon." },
      { title: "Business outcomes", content: "We've grown the platform to over $5 million in GMV and reached cash flow break-even. The economics of the business have improved substantially since our college marketplace days — larger contracts, more meaningful margins, and a clear path to long-term sustainability. We've gone from a scrappy student project to a real business with the option to become one of the first truly agentic-first hiring platforms. That's what we're actively building toward right now." },
      { title: "What I actually did", content: "Everything. I own the P&L, led fundraising, and set the strategic direction. But what makes my role unusual is how hands-on it's stayed. I've built the data infrastructure, managed customer relationships directly, developed the automation layer, and now — thanks to AI coding tools — I'm shipping production code alongside the engineering team. I talk directly to our customers, manage service issues, and push features to production, often in the same day. It's the kind of role that only works if you genuinely want to understand every layer of the business, and I do." },
    ],
  },
  "founder-communities": {
    longDescription: "Curated IRL founder communities in NYC and Cambridge — intimate dinners, meaningful collisions, and a custom-built platform to keep people connected.",
    tags: ["Community", "Events", "Next.js", "Supabase", "Resend"],
    sections: [
      { title: "Why founder communities", content: "I really value the people I spend time with. There's something important about finding people at a similar stage to you — a stage ahead, a stage behind — who share your values. For me, those values are ambition, creativity, confidence, a willingness to make mistakes, and a high level of integrity and honesty with each other. We wanted to create spaces where a small group of high-quality individuals could come together and actually get to know each other over time. There's a formula to building real relationships: frequency and time spent together. That's why we structured things the way we did — we're not an events company that does a ton of stuff for outside sponsors. Our focus is on supporting our members. That's why we built it as a dues-based organization, more of a social club than an events platform.\n\nThere's also a bigger thesis here. In an AI-first world where we're spending more and more time inside our computers and AI systems, I think there's going to be an increased emphasis and value placed on coming together in real, physical spaces with other humans. I'm really excited by the idea of building platforms and tools that enable IRL — real human connection in the face of what traditional social networks have become. The future isn't another feed. It's curated, intentional, in-person communities. And I believe finding community and spending meaningful time with people is a panacea to a lot of society's challenges — our polarization, our isolation, our tendency to retreat into screens." },
      { title: "NYC Founders Club", content: "The wider NYC Founders Club network has grown to over 5,000–6,000 individuals, with a core group of around 50 paid members. We host different tiers of events: members-only dinners weekly, larger membership-wide gatherings, and \"founders and friends\" events like demo days and our annual tradition of buying out a ski mountain every February for 200 founders to spend the day together. We occasionally work with sponsors like JP Morgan, Rho, and Brex, but the community always comes first — sponsors support the experience, they don't define it." },
      { title: "Cambridge Founders Club", content: "When I moved to Cambridge for MIT, I took the same model and applied it with a lighter touch. The Cambridge community is focused on connecting builders and founders across the MIT and Harvard ecosystems — hosting dinners and creating spaces where people can genuinely get to know each other. It's a high-quality network centered around people who are actively building things. I really believe in the power of bringing people together. It's what makes society and humanity special, and it's worth doing well in every city I find myself in." },
      { title: "My role", content: "I do everything from organizing events to managing all of our backend technology. While I've been in Cambridge, the technology layer has been one of the primary ways I've continued to contribute to the NYC club — my partners handle more of the weekly day-to-day in New York while I focus on systems, strategy, and the Cambridge community. It's a distributed team running a community about in-person connection, which has its own kind of irony." },
      { title: "The community OS", content: "I custom-built our entire community platform from scratch — a full-stack application using Next.js and Supabase where I've been the sole engineer and developer. It handles everything: tracking applications, running interview funnels, managing membership, and coordinating events. It integrates with Beehiiv for newsletters, Luma for events, and uses Resend and Ingest for transactional emails. Building it replaced a patchwork of Zapier, Tally, and Framer with something purpose-built and cohesive. Having a proprietary system means we can move fast, customize everything to how we actually operate, and keep the experience feeling intentional rather than stitched together from off-the-shelf tools." },
    ],
  },
  reprally: {
    longDescription: "Led product for a 3-sided CPG marketplace connecting emerging brands with independent sales reps and brick-and-mortar retail stores.",
    tags: ["Product", "Marketplace", "CPG", "n8n"],
    sections: [
      { title: "Context", content: "Through my founder community work, I connected with a friend who was building a three-sided marketplace and scaling rapidly. They were looking for someone with experience in both marketplaces and startups. I joined as an AI consultant, and the role quickly expanded — I ended up managing their technical and design teams directly as Head of Product." },
      { title: "What Reprally is", content: "Reprally is a three-sided CPG marketplace connecting emerging brands with a network of independent sales reps who get those brands placed and distributed into brick-and-mortar and independently owned retail stores. It sits at the intersection of brand discovery, field sales, and retail distribution — three sides that each have very different needs and incentives." },
      { title: "Key product work", content: "I shipped several things during my time there. The biggest was overhauling SLA enforcement — developing new policies, tracking mechanisms, and data architecture to reduce SLA violations from brands. I also built out self-service portals so brands, reps, and stores could manage more of their own accounts without relying on internal ops. And I worked through a potential path toward a more managed marketplace model on the rep side, which would have changed the economics and quality control of the platform significantly." },
      { title: "Impact", content: "The company was achieving meaningful monthly GMV during my time there. Beyond the metrics I can share, the bigger value for me was the experience of working within a larger organization where I wasn't the lead. I had to manage expectations across multiple teams focused on different personas and features within the platform — a very different dynamic than being the CEO of my own company, and one that taught me a lot about operating within a structure rather than building one from scratch." },
      { title: "AI & automation", content: "One of the things I'm most proud of at Reprally was helping transform the organization's relationship with AI. I organized an internal hackathon focused on AI development and pushed to get all teams involved — not just engineers, but operations, sales, and support. The goal was to encourage everyone to start learning these tools and building with them, not just delegating AI to the technical side. It was about shifting the culture toward being AI-native across the entire organization." },
    ],
  },
  surviveai: {
    longDescription: "Offline survival assistant powered by on-device LLMs — a full agentic loop running on your phone with zero connectivity required.",
    tags: ["React Native", "LLM", "On-device AI", "Qwen"],
    sections: [
      { title: "The idea", content: "I've spent significant time in the wilderness and in regions of the world with zero cellular connectivity. Sometimes you have questions out there — about health, cooking, plant identification, basic survival — that would be genuinely helpful to answer in the moment. With everything these LLMs have compressed into their weights, it felt obvious that you should be able to access that knowledge without needing a cell tower. So I built a survival assistant that runs entirely on-device, using edge computing, with no connectivity required." },
      { title: "What I built", content: "A React Native app running Qwen 1.7B on-device with tool calling to a local knowledge base, speech-to-text for hands-free interaction, and vision input so you can point your camera at something and ask about it. The entire system works offline — no cloud, no API calls, no signal needed. It's a full agentic loop running on your phone." },
      { title: "Why it matters", content: "I think this points to where the world is heading. As small language models become more powerful, there's a growing case for keeping compute on-device — for privacy, for cost efficiency, and for reliability. If you architect these systems well with agentic tool calling, they can be surprisingly capable even at small parameter counts. Beyond the wilderness use case, there's a broader infrastructure argument: systems that depend entirely on cloud connectivity are a single point of failure. If systems go down, you lose functionality. On-device LLMs can unlock local capabilities that traditionally required the cloud, and that resilience matters — whether you're in the backcountry or just dealing with unreliable infrastructure." },
      { title: "What I learned", content: "Building SurviveAI taught me a lot about the current capabilities and limitations of smaller parameter models, how to construct effective agentic tool-calling patterns at the edge, and how to design UX for high-stress situations where simplicity is everything. It was also just a fun end-to-end product using a mobile-centric stack that was different from my usual web work — and a nice full-circle connection to those 40 days in Alaska where I had nothing but a topographical map and my own judgment." },
    ],
  },
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = buildProjects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const details = projectDetails[slug];

  // Find prev/next projects
  const currentIndex = buildProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? buildProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < buildProjects.length - 1 ? buildProjects[currentIndex + 1] : null;

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 font-mono text-sm text-muted hover:text-primary transition-colors mb-8"
        >
          ← All projects
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-mono text-primary">{project.role}</span>
            {project.status === "active" && (
              <span className="flex items-center gap-1 text-xs font-mono text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                Active
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-mono font-bold text-text mb-4">
            {project.title}
          </h1>
          <p className="text-xl text-muted mb-6">{details?.longDescription || project.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {details?.tags.map((tag) => (
              <TechTag key={tag}>{tag}</TechTag>
            ))}
          </div>

          {/* Links */}
          {details?.links && (
            <div className="flex gap-4">
              {details.links.map((link) => (
                <Button key={link.href} href={link.href} variant="primary" external>
                  {link.label} →
                </Button>
              ))}
            </div>
          )}
        </header>

        {/* Hero image */}
        {projectImages[slug] && (
          <div className="relative aspect-video rounded-lg overflow-hidden border border-border mb-12">
            <Image
              src={projectImages[slug]}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content sections */}
        <div className="space-y-12">
          {details?.sections.map((section, index) => (
            <section key={index}>
              <h2 className="font-mono text-xl text-text mb-4">{section.title}</h2>
              <div className="p-6 bg-surface border border-border rounded-lg space-y-4">
                {section.content.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="text-muted leading-relaxed">{paragraph}</p>
                ))}
              </div>
              {projectInlineImages[slug]?.[section.title] && (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-border mt-6">
                  <Image
                    src={projectInlineImages[slug][section.title].src}
                    alt={projectInlineImages[slug][section.title].alt}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Prev/Next navigation */}
        <nav className="mt-16 pt-8 border-t border-border">
          <div className="flex justify-between">
            {prevProject ? (
              <Link
                href={`/projects/${prevProject.slug}`}
                className="group flex flex-col"
              >
                <span className="text-xs font-mono text-muted mb-1">← Previous</span>
                <span className="font-mono text-text group-hover:text-primary transition-colors">
                  {prevProject.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {nextProject ? (
              <Link
                href={`/projects/${nextProject.slug}`}
                className="group flex flex-col text-right"
              >
                <span className="text-xs font-mono text-muted mb-1">Next →</span>
                <span className="font-mono text-text group-hover:text-primary transition-colors">
                  {nextProject.title}
                </span>
              </Link>
            ) : (
              <Link
                href="/projects"
                className="font-mono text-sm text-muted hover:text-primary transition-colors"
              >
                ← All projects
              </Link>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
