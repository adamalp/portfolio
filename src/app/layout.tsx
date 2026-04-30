import type { Metadata } from "next";
import { JetBrains_Mono, Inter_Tight, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Navigation, Footer, PageTransition } from "@/components/layout";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const SITE_URL = "https://adam-alpert.com";
const SITE_TITLE = "Adam Alpert · Founder, Builder, Operator";
const SITE_DESCRIPTION =
  "Founder of Pangea.app, NYC & Cambridge Founders Clubs, MIT Sloan MBA '27. Building marketplaces, AI products, and founder communities.";

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: "%s · Adam Alpert",
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  applicationName: "Adam Alpert",
  authors: [{ name: "Adam Alpert", url: SITE_URL }],
  creator: "Adam Alpert",
  publisher: "Adam Alpert",
  keywords: [
    "Adam Alpert",
    "Pangea",
    "Pangea.app",
    "NYC Founders Club",
    "Cambridge Founders Club",
    "MIT Sloan",
    "Y Combinator",
    "marketplaces",
    "AI products",
    "fractional talent",
    "founder communities",
    "agentic AI",
    "Clawviyo",
    "MyLogia",
    "SurviveAI",
    "Friend Roulette",
  ],
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "Adam Alpert",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Adam Alpert — Founder, Builder, Operator. YC W21 · MIT Sloan · adamalpert.com",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    creator: "@the_pangean",
    site: "@the_pangean",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Adam Alpert — Founder, Builder, Operator. YC W21 · MIT Sloan · adamalpert.com",
        type: "image/png",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Adam Alpert",
  url: SITE_URL,
  image: `${SITE_URL}/og-image.png`,
  jobTitle: "Co-founder & CEO, Pangea",
  description: SITE_DESCRIPTION,
  email: "mailto:aalpert421@gmail.com",
  sameAs: [
    "https://linkedin.com/in/adamalp",
    "https://twitter.com/the_pangean",
    "https://pangea.app",
  ],
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Brown University" },
    { "@type": "CollegeOrUniversity", name: "MIT Sloan School of Management" },
  ],
  worksFor: { "@type": "Organization", name: "Pangea", url: "https://pangea.app" },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: SITE_URL,
  name: "Adam Alpert",
  description: SITE_DESCRIPTION,
  author: { "@type": "Person", name: "Adam Alpert" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${interTight.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Navigation />
        <main className="flex-1 pt-16">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
