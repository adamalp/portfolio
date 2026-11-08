import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Timeline",
  description: "A chronological view of the journey — from Brown University to a16z and everything in between.",
};

export default function TimelineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
