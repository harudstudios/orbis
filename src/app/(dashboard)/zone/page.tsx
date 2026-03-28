"use client";

import dynamic from "next/dynamic";
import { useState, useMemo, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useActiveEvents } from "@/hooks/use-events";
import { TrustBadge } from "@/components/events/trust-badge";
import { FavoriteButton } from "@/components/events/favorite-button";
import { CATEGORIES, CATEGORY_LIST, type EventCategory } from "@/config/categories";
import { haversineDistance } from "@/lib/utils/geo";

const LiveMap = dynamic(
  () => import("@/components/map/live-map").then((m) => m.LiveMap),
  { ssr: false, loading: () => <div className="h-full w-full bg-muted animate-pulse rounded-xl" /> },
);

function ZoneContent() {
  const searchParams = useSearchParams();
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");

  const [radius, setRadius] = useState(10);
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const { events, isLoading } = useActiveEvents();

  const nearbyEvents = useMemo(() => {
    let result = (events as any[]).filter((e: any) => {
      const dist = haversineDistance(
        { latitude: lat, longitude: lon },
        { latitude: e.latitude, longitude: e.longitude },
      );
      return dist <= radius;
    });
    if (category !== "all") {
      result = result.filter((e: any) => e.category === category);
    }
    return result.sort((a: any, b: any) => b.trustScore - a.trustScore);
  }, [events, lat, lon, radius, category]);

  const doSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, latitude: lat, longitude: lon, radiusKm: radius }),
      });
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch { /* silent */ } finally { setSearching(false); }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Top bar: search + back */}
      <div className="shrink-0 border-b border-border bg-card px-3 sm:px-5 py-3">
        <div className="flex items-center gap-2 sm:gap-4 max-w-6xl mx-auto">
          <Link
            href="/map"
            className="shrink-0 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
            <span className="hidden sm:inline">Map</span>
          </Link>

          <div className="flex-1 max-w-xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search zone with Exa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doSearch()}
                className="flex-1 min-w-0 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
              />
              <button
                onClick={doSearch}
                disabled={searching || !searchQuery.trim()}
                className="shrink-0 px-3 sm:px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
              >
                {searching ? "..." : "Search"}
              </button>
            </div>
          </div>

          <span className="shrink-0 text-[10px] sm:text-xs text-muted-foreground font-mono hidden sm:block">
            {lat.toFixed(4)}, {lon.toFixed(4)}
          </span>
        </div>
      </div>

      {/* Exa search results */}
      {searchResults.length > 0 && (
        <div className="shrink-0 border-b border-border bg-card/50 px-3 sm:px-5 py-3">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground">Web Results</span>
              <button onClick={() => setSearchResults([])} className="text-xs text-muted-foreground hover:text-foreground">Clear</button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
              {searchResults.slice(0, 6).map((r: any, i: number) => (
                <a
                  key={i}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 w-56 sm:w-64 p-3 rounded-lg bg-background border border-border hover:border-ring/30 transition-colors"
                >
                  <p className="text-sm font-medium leading-snug line-clamp-2">{r.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{r.snippet}</p>
                  <span className="text-xs text-primary mt-1 inline-block">{new URL(r.url).hostname}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main content: controls + events */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left panel: map + controls — on mobile scrolls inline */}
        <div className="shrink-0 md:w-[300px] lg:w-[320px] border-b md:border-b-0 md:border-r border-border flex flex-col overflow-y-auto">
          {/* Mini map */}
          <div className="h-[180px] sm:h-[220px] md:h-[240px] shrink-0">
            <LiveMap
              events={nearbyEvents}
              center={{ latitude: lat, longitude: lon }}
              zoom={11}
              showRadiusOverlay={false}
              interactive={false}
              onEventClick={() => {}}
            />
          </div>

          {/* Controls */}
          <div className="p-3 sm:p-4 space-y-4 sm:space-y-5">
            {/* Mobile: show coords */}
            <div className="sm:hidden text-xs text-muted-foreground font-mono">
              {lat.toFixed(4)}, {lon.toFixed(4)}
            </div>

            {/* Radius */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-foreground">Radius</label>
                <span className="text-xs font-semibold text-primary">{radius} km</span>
              </div>
              <input
                type="range"
                min={1}
                max={200}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full accent-primary h-1.5"
              />
              <p className="text-[11px] text-muted-foreground mt-1">Expand or shrink the search area around the selected point.</p>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring cursor-pointer"
              >
                <option value="all">All Categories</option>
                {CATEGORY_LIST.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                ))}
              </select>
              <p className="text-[11px] text-muted-foreground mt-1">Filter events by type. Only matching events appear.</p>
            </div>

            {/* Stats */}
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Events in zone</span>
                <span className="font-semibold">{nearbyEvents.length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Radius</span>
                <span className="font-semibold">{radius} km</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Filter</span>
                <span className="font-semibold">{category === "all" ? "All" : CATEGORIES[category as EventCategory]?.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: event list */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5">
          <h2 className="text-sm font-semibold mb-3 sm:mb-4">
            Events in Zone
            <span className="text-muted-foreground font-normal ml-2">({nearbyEvents.length})</span>
          </h2>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-28 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : nearbyEvents.length === 0 ? (
            <div className="text-center py-12 sm:py-16 text-muted-foreground">
              <p className="text-base sm:text-lg mb-1">No events in this zone</p>
              <p className="text-sm">Try increasing the radius or changing the category.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {nearbyEvents.map((event: any) => (
                <ZoneEventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ZoneEventCard({ event }: { event: any }) {
  const [articles, setArticles] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const cat = CATEGORIES[event.category as EventCategory] ?? CATEGORIES.other;

  const fetchArticles = useCallback(async () => {
    if (articles !== null) {
      setExpanded(!expanded);
      return;
    }
    setLoading(true);
    setExpanded(true);
    try {
      const res = await fetch(`/api/articles/${event._id}`);
      const data = await res.json();
      setArticles(data.articles || []);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [event._id, articles, expanded]);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <Link href={`/events/${event._id}`} className="block p-3 sm:p-4 hover:bg-muted/30 transition-colors">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span
                className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md"
                style={{ backgroundColor: cat.color + "20", color: cat.color }}
              >
                {cat.icon} {cat.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {event.reportsCount} {event.reportsCount === 1 ? "report" : "reports"}
              </span>
            </div>
            <h3 className="text-sm sm:text-[15px] font-semibold leading-snug">{event.title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">{event.description}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <FavoriteButton eventId={event._id} size="sm" />
            <TrustBadge score={event.trustScore} size="md" />
          </div>
        </div>
      </Link>

      {/* Related articles toggle */}
      <div className="border-t border-border">
        <button
          onClick={fetchArticles}
          className="w-full px-3 sm:px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors flex items-center justify-between"
        >
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
            Related Articles
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${expanded ? "rotate-180" : ""}`}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {expanded && (
          <div className="px-3 sm:px-4 pb-3">
            {loading ? (
              <div className="py-3 text-xs text-muted-foreground animate-pulse">Fetching articles from Google News...</div>
            ) : articles && articles.length === 0 ? (
              <div className="py-2 text-xs text-muted-foreground">No related articles found.</div>
            ) : (
              <div className="space-y-2">
                {(articles ?? []).slice(0, 5).map((a: any, i: number) => (
                  <a
                    key={a._id ?? i}
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 sm:p-2.5 rounded-lg bg-background border border-border hover:border-ring/30 transition-colors"
                  >
                    <p className="text-sm font-medium leading-snug">{a.headline}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs text-primary">{a.source}</span>
                      {a.publishedAt && (
                        <span className="text-xs text-muted-foreground">{new Date(a.publishedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                    {a.summary && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{a.summary}</p>}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ZonePage() {
  return (
    <Suspense fallback={<div className="p-6">Loading zone...</div>}>
      <ZoneContent />
    </Suspense>
  );
}
