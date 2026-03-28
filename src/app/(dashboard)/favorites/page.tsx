"use client";

import { useAuthStore } from "@/store/auth-store";
import { useFavorites } from "@/hooks/use-favorites";
import { EventCard } from "@/components/events/event-card";
import Link from "next/link";

export default function FavoritesPage() {
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const { favorites, isLoading } = useFavorites();

  if (!initialized) {
    return (
      <div className="p-4 sm:p-6 max-w-5xl mx-auto">
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-4" />
        <div className="h-4 w-64 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold mb-1">Sign in to see Favorites</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Save events you care about and access them here anytime.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-xl transition-colors"
          >
            Sign in with Google
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl font-semibold">Favorites</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Events you&apos;ve saved — {favorites.length} {favorites.length === 1 ? "item" : "items"}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 animate-pulse h-32" />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-16 sm:py-20 text-muted-foreground">
          <p className="text-base sm:text-lg mb-1">No favorites yet</p>
          <p className="text-sm">
            Tap the heart icon on any event to save it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {favorites.map((event: any) => (
            <EventCard
              key={event._id}
              id={event._id}
              title={event.title}
              description={event.description}
              category={event.category}
              trustScore={event.trustScore}
              reportsCount={event.reportsCount}
              createdAt={event._creationTime}
            />
          ))}
        </div>
      )}
    </div>
  );
}
