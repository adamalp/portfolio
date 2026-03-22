import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing",
  description: "Essays on marketplaces, founder communities, AI, and building products.",
};

export default function WritingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
