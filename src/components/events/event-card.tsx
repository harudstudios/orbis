"use client";

import Link from "next/link";
import { TrustBadge } from "./trust-badge";
import { CATEGORIES } from "@/config/categories";
import type { EventCategory } from "@/config/categories";

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  trustScore: number;
  reportsCount: number;
  createdAt: number;
  compact?: boolean;
  onClick?: () => void;
}

export function EventCard({
  id, title, description, category, trustScore, reportsCount, createdAt, compact = false, onClick,
}: EventCardProps) {
  const cat = CATEGORIES[category as EventCategory] ?? CATEGORIES.other;
  const timeAgo = getTimeAgo(createdAt);

  const content = (
    <div
      className={`bg-card border border-border rounded-xl transition-all hover:border-ring/30 hover:shadow-md cursor-pointer ${compact ? "p-3" : "p-4"}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md"
              style={{ backgroundColor: cat.color + "20", color: cat.color }}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </span>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
          <h3 className={`font-semibold leading-snug ${compact ? "text-sm" : "text-[15px]"}`}>{title}</h3>
          {!compact && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>}
        </div>
        <TrustBadge score={trustScore} size={compact ? "sm" : "md"} />
      </div>
      <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          {reportsCount} {reportsCount === 1 ? "report" : "reports"}
        </span>
      </div>
    </div>
  );

  if (onClick) return content;
  return <Link href={`/events/${id}`}>{content}</Link>;
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
