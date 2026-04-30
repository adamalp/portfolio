import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Essays on marketplaces, founder communities, AI, and building products.",
  alternates: { canonical: "/writing" },
  openGraph: {
    title: "Writing · Adam Alpert",
    description:
      "Essays on marketplaces, founder communities, AI, and building products.",
    url: "/writing",
    type: "website",
  },
};

export default function WritingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
