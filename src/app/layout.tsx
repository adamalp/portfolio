import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Navigation, Footer, PageTransition } from "@/components/layout";
import { GridBackground, ScanlineOverlay } from "@/components/effects";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Adam Alpert | Builder, Founder, Community Creator",
    template: "%s | Adam Alpert",
  },
  description:
    "Co-founder & CEO of Pangea. Building AI-native platforms, curating founder communities, and exploring what's next at MIT Sloan.",
  metadataBase: new URL("https://adamalpert.com"),
  openGraph: {
    title: "Adam Alpert | Builder, Founder, Community Creator",
    description:
      "Co-founder & CEO of Pangea. Building AI-native platforms, curating founder communities, and exploring what's next at MIT Sloan.",
    url: "https://adamalpert.com",
    siteName: "Adam Alpert",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adam Alpert | Builder, Founder, Community Creator",
    description:
      "Co-founder & CEO of Pangea. Building AI-native platforms, curating founder communities, and exploring what's next at MIT Sloan.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-background text-text min-h-screen flex flex-col`}
      >
        <GridBackground />
        <ScanlineOverlay opacity={0.02} />
        <Navigation />
        <main className="flex-1 pt-16">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
