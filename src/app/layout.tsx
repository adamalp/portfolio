import type { Metadata } from "next";
import { JetBrains_Mono, Inter_Tight, Instrument_Serif } from "next/font/google";
import "./globals.css";
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

export const metadata: Metadata = {
  title: {
    default: "Adam Alpert · Founder, Builder, Operator",
    template: "%s | Adam Alpert",
  },
  description:
    "Founder of Pangea.app, NYC & Cambridge Founders Clubs, MIT Sloan MBA. Building marketplaces, AI products, and founder communities.",
  metadataBase: new URL("https://adam-alpert.com"),
  openGraph: {
    title: "Adam Alpert · Founder, Builder, Operator",
    description:
      "Founder of Pangea.app, NYC & Cambridge Founders Clubs, MIT Sloan MBA. Building marketplaces, AI products, and founder communities.",
    url: "https://adam-alpert.com",
    siteName: "Adam Alpert",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adam Alpert · Founder, Builder, Operator",
    description:
      "Founder of Pangea.app, NYC & Cambridge Founders Clubs, MIT Sloan MBA. Building marketplaces, AI products, and founder communities.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${interTight.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} antialiased`}
      >
        <Navigation />
        <main className="flex-1 pt-16">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
