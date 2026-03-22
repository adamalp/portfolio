import Link from "next/link";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center py-16">
      <div className="text-center px-4">
        {/* ASCII art error */}
        <pre className="font-mono text-primary text-xs md:text-sm mb-8 inline-block text-left">
{`
  ╔═══════════════════════════════════════╗
  ║                                       ║
  ║   ERROR 404: PAGE NOT FOUND           ║
  ║                                       ║
  ║   The requested resource could not    ║
  ║   be located on this server.          ║
  ║                                       ║
  ║   > Path does not exist               ║
  ║   > Check URL and try again           ║
  ║                                       ║
  ╚═══════════════════════════════════════╝
`}
        </pre>

        {/* Error code */}
        <div className="font-mono text-6xl md:text-8xl text-accent font-bold mb-4">
          404
        </div>

        {/* Message */}
        <p className="font-mono text-muted mb-8">
          <span className="text-secondary">$</span> The page you&apos;re looking
          for doesn&apos;t exist.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button href="/" variant="primary">
            Go Home
          </Button>
          <Button href="/build" variant="secondary">
            View Projects
          </Button>
        </div>
      </div>
    </div>
  );
}
