"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useEvent } from "@/hooks/use-events";
import { TrustBadge, TrustBar } from "@/components/events/trust-badge";
import { CATEGORIES, type EventCategory } from "@/config/categories";

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { event, isLoading } = useEvent(id);
  const [articles, setArticles] = useState<any[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const loadArticles = async () => {
    setArticlesLoading(true);
    try {
      const res = await fetch(`/api/articles/${id}`);
      const data = await res.json();
      setArticles(data.articles || []);
    } catch { /* silent */ } finally { setArticlesLoading(false); }
  };

  const doSearch = async () => {
    if (!searchQuery.trim() || !event) return;
    setSearching(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, latitude: event.latitude, longitude: event.longitude, radiusKm: 50 }),
      });
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch { /* silent */ } finally { setSearching(false); }
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-2/3" />
          <div className="h-48 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-4 sm:p-6 max-w-4xl mx-auto text-center py-20">
        <p className="text-lg text-muted-foreground">Event not found</p>
        <Link href="/events" className="text-primary text-sm mt-2 inline-block hover:underline">Back to events</Link>
      </div>
    );
  }

  const cat = CATEGORIES[event.category as EventCategory] ?? CATEGORIES.other;

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <Link href="/events" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        Back to events
      </Link>

      {/* Header */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md" style={{ backgroundColor: cat.color + "20", color: cat.color }}>
                {cat.icon} {cat.label}
              </span>
              <span className="text-xs text-muted-foreground px-2 py-1 rounded-md bg-muted">{event.status}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-semibold mb-2">{event.title}</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
            {event.summary && (
              <p className="text-sm text-foreground/80 mt-3 italic border-l-2 border-primary/30 pl-3">{event.summary}</p>
            )}
          </div>
          <TrustBadge score={event.trustScore} size="lg" />
        </div>
        <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-border">
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground mb-3">
            <span>{event.reportsCount} reports</span>
            <span>{event.articlesCount ?? 0} articles</span>
            <span className="font-mono text-[11px] sm:text-xs">{event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}</span>
          </div>
          <TrustBar score={event.trustScore} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* Reports */}
        <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
          <h2 className="text-sm font-semibold mb-3 sm:mb-4">Reports ({event.reports?.length ?? 0})</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {(event.reports ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No reports yet.</p>
            ) : (
              (event.reports as any[]).map((report: any, i: number) => (
                <div key={report._id ?? i} className="border-l-2 border-border pl-3 py-1">
                  <p className="text-sm">{report.rawInput}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(report.createdAt).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Articles */}
        <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-sm font-semibold">Related Articles</h2>
            <button onClick={loadArticles} disabled={articlesLoading} className="text-xs text-primary hover:text-primary/80 disabled:opacity-50">
              {articlesLoading ? "Loading..." : articles.length > 0 ? "Refresh" : "Fetch Articles"}
            </button>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {articles.length === 0 ? (
              <p className="text-sm text-muted-foreground">Click &quot;Fetch Articles&quot; to find related news.</p>
            ) : (
              articles.map((a: any, i: number) => (
                <a key={a._id ?? i} href={a.url} target="_blank" rel="noopener noreferrer" className="block p-2.5 sm:p-3 rounded-lg bg-background border border-border hover:border-ring/30 transition-colors">
                  <p className="text-sm font-medium leading-snug">{a.headline}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className="text-xs text-primary">{a.source}</span>
                    {a.publishedAt && <span className="text-xs text-muted-foreground">{new Date(a.publishedAt).toLocaleDateString()}</span>}
                  </div>
                  {a.summary && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.summary}</p>}
                </a>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Exa Search */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5 mt-3 sm:mt-4">
        <h2 className="text-sm font-semibold mb-2">Search the Web (Zone)</h2>
        <p className="text-xs text-muted-foreground mb-3">Semantic search via Exa, scoped to the event&apos;s geographic area.</p>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder={`Search about "${event.title}"...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && doSearch()}
            className="flex-1 min-w-0 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
          />
          <button onClick={doSearch} disabled={searching || !searchQuery.trim()} className="shrink-0 px-3 sm:px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg disabled:opacity-50 transition-colors">
            {searching ? "..." : "Search"}
          </button>
        </div>
        {searchResults.length > 0 && (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {searchResults.map((r: any, i: number) => (
              <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="block p-2.5 sm:p-3 rounded-lg bg-background border border-border hover:border-ring/30 transition-colors">
                <p className="text-sm font-medium">{r.title}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.snippet}</p>
                <span className="text-xs text-primary mt-1 inline-block">{new URL(r.url).hostname}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
