import Link from "next/link";

const socialLinks = [
  { href: "mailto:alalpert@mit.edu", label: "Email" },
  { href: "https://linkedin.com/in/adamalp", label: "LinkedIn" },
  { href: "https://github.com/adamalp", label: "GitHub" },
  { href: "https://x.com/the_pangean", label: "X" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Bio */}
          <div className="md:col-span-2">
            <Link href="/" className="font-mono text-lg font-bold text-primary mb-4 block">
              Adam Alpert
            </Link>
            <p className="text-muted text-sm max-w-md mb-4">
              Founder and builder focused on marketplaces, AI-powered products, and
              high-trust founder communities. Currently at MIT Sloan.
            </p>
            {/* Status */}
            <div className="flex items-center gap-2 text-sm font-mono text-muted">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span>Open to conversations</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-mono text-sm text-text mb-4">Connect</h4>
            <ul className="space-y-2">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("mailto") ? undefined : "_blank"}
                    rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    {link.label} →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-mono text-muted">
            © {new Date().getFullYear()} Adam Alpert
          </p>
          <p className="text-xs font-mono text-muted">
            Built with Next.js • Deployed on Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}
