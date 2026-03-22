"use client";

import Link from "next/link";
import { TechTag } from "./TechTag";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  slug: string;
  featured?: boolean;
}

export function ProjectCard({
  title,
  description,
  tags,
  slug,
  featured = false,
}: ProjectCardProps) {
  return (
    <Link
      href={`/build/${slug}`}
      className={`
        group block p-6 bg-surface border border-border rounded-lg
        transition-all duration-300
        hover:border-primary/50 hover:bg-surface/80
        ${featured ? "md:col-span-2" : ""}
      `}
    >
      {/* Terminal-style header */}
      <div className="flex items-center gap-2 mb-4 text-xs font-mono text-muted">
        <span className="text-primary">$</span>
        <span>cat project/{slug}</span>
        <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-primary">
          [Enter to view]
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-mono text-text group-hover:text-primary transition-colors mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-muted text-sm mb-4 line-clamp-2">{description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <TechTag key={tag} variant="muted">
            {tag}
          </TechTag>
        ))}
      </div>

      {/* Decorative corner brackets */}
      <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-transparent group-hover:border-primary/30 transition-colors" />
      <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-transparent group-hover:border-primary/30 transition-colors" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-transparent group-hover:border-primary/30 transition-colors" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-transparent group-hover:border-primary/30 transition-colors" />
    </Link>
  );
}
