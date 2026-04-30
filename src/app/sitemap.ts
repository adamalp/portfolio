import type { MetadataRoute } from "next";
import {
  adventures,
  buildProjects,
  storyChapters,
  writingPosts,
} from "@/lib/siteMap";

const SITE_URL = "https://adam-alpert.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/projects`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/writing`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
  ];

  const projectRoutes = buildProjects.map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const writingRoutes = writingPosts.map((w) => ({
    url: `${SITE_URL}/writing/${w.slug}`,
    lastModified: new Date(w.date),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  const storyRoutes = storyChapters.map((c) => ({
    url: `${SITE_URL}/story/${c.slug}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const adventureRoutes = adventures.map((a) => ({
    url: `${SITE_URL}/adventures/${a.slug}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...projectRoutes,
    ...writingRoutes,
    ...storyRoutes,
    ...adventureRoutes,
  ];
}
