"use client";

import { useIsFavorited, useToggleFavorite } from "@/hooks/use-favorites";

export function FavoriteButton({ eventId, size = "sm" }: { eventId: string; size?: "sm" | "md" }) {
  const isFav = useIsFavorited(eventId);
  const toggle = useToggleFavorite();

  const px = size === "sm" ? "w-7 h-7" : "w-8 h-8";
  const iconSize = size === "sm" ? 14 : 16;

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(eventId); }}
      title={isFav ? "Remove from favorites" : "Add to favorites"}
      className={`${px} flex items-center justify-center rounded-lg transition-colors shrink-0 ${
        isFav
          ? "text-red-500 hover:text-red-400 bg-red-500/10"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill={isFav ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
