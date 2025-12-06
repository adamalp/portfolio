import { SectionHeader, Button } from "@/components/ui";

const collaborationTypes = [
  {
    title: "Advising & Consulting",
    description: "Product strategy, marketplace design, and growth for startups.",
  },
  {
    title: "Speaking & Panels",
    description: "Talks on marketplaces, community building, and founder journeys.",
  },
  {
    title: "Founder Communities",
    description: "Joining or partnering with NYC or Cambridge Founders Clubs.",
  },
];

const contactMethods = [
  {
    label: "Email",
    value: "adam@pangea.app",
    href: "mailto:adam@pangea.app",
    primary: true,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/adamalpert",
    href: "https://linkedin.com/in/adamalpert",
    primary: false,
  },
  {
    label: "Twitter",
    value: "@adamalpert",
    href: "https://twitter.com/adamalpert",
    primary: false,
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeader subtitle="Let's build something together">
          Work with me
        </SectionHeader>

        {/* Intro */}
        <div className="mb-12 p-6 bg-surface border border-border rounded-lg">
          <p className="text-muted leading-relaxed text-lg">
            If you're building something ambitious and want help with product, marketplaces,
            or founder communities — or just want to compare notes — I'm always open to good
            conversations.
          </p>
        </div>

        {/* Ways to collaborate */}
        <div className="mb-16">
          <h3 className="font-mono text-lg text-muted mb-6">
            <span className="text-primary">//</span> Ways to collaborate
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collaborationTypes.map((type) => (
              <div
                key={type.title}
                className="p-6 bg-surface border border-border rounded-lg"
              >
                <h4 className="font-mono text-text mb-2">{type.title}</h4>
                <p className="text-sm text-muted">{type.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact methods */}
        <div className="mb-16">
          <h3 className="font-mono text-lg text-muted mb-6">
            <span className="text-primary">//</span> Get in touch
          </h3>
          <div className="space-y-4">
            {contactMethods.map((method) => (
              <a
                key={method.label}
                href={method.href}
                target={method.href.startsWith("mailto") ? undefined : "_blank"}
                rel={method.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                  method.primary
                    ? "bg-primary/10 border-primary/30 hover:bg-primary/20"
                    : "bg-surface border-border hover:border-primary/50"
                }`}
              >
                <div>
                  <div className="font-mono text-xs text-muted mb-1">{method.label}</div>
                  <div className={`font-mono ${method.primary ? "text-primary" : "text-text"}`}>
                    {method.value}
                  </div>
                </div>
                <span className="text-primary">→</span>
              </a>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="p-6 bg-surface border border-border rounded-lg">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
            <span className="font-mono text-text">Currently open to conversations</span>
          </div>
          <p className="text-sm text-muted mt-2">
            I typically respond within 24-48 hours. For time-sensitive inquiries, email is best.
          </p>
        </div>
      </div>
    </div>
  );
}
