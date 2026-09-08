import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adam's Moving Sale",
  description: "Furniture, rugs, plants and kitchen gear — make an offer on anything.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Young+Serif&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
