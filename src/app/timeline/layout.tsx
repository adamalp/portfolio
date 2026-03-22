import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Timeline",
  description: "A chronological view of the journey — from Brown University to MIT Sloan and everything in between.",
};

export default function TimelineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
