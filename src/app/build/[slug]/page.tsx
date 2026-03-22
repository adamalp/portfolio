import { redirect } from "next/navigation";
import { buildProjects } from "@/lib/siteMap";

interface BuildProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return buildProjects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function BuildProjectPage({ params }: BuildProjectPageProps) {
  const { slug } = await params;
  redirect(`/projects/${slug}`);
}
