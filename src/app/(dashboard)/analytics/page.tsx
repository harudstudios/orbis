"use client";

import { useActiveEvents, useClusters } from "@/hooks/use-events";
import { CATEGORIES, type EventCategory } from "@/config/categories";
import { getTrustLevel } from "@/lib/utils/trust";

export default function AnalyticsPage() {
  const { events, isLoading: eventsLoading } = useActiveEvents();
  const { clusters, isLoading: clustersLoading } = useClusters();

  const allEvents = events as any[];
  const allClusters = clusters as any[];
  const totalReports = allEvents.reduce((sum: number, e: any) => sum + e.reportsCount, 0);

  const categoryStats = allEvents.reduce((acc: Record<string, number>, e: any) => {
    acc[e.category] = (acc[e.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryEntries = Object.entries(categoryStats).sort((a, b) => b[1] - a[1]);

  const trustDist = { low: 0, medium: 0, high: 0, verified: 0 };
  allEvents.forEach((e: any) => { trustDist[getTrustLevel(e.trustScore)]++; });

  const topClusters = [...allClusters].sort((a: any, b: any) => b.aggregateTrustScore - a.aggregateTrustScore).slice(0, 5);
  const isLoading = eventsLoading || clustersLoading;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl font-semibold">Analytics</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Aggregate intelligence — event volume, trust distribution, and top clusters.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <StatCard label="Active Events" value={allEvents.length} loading={isLoading} />
        <StatCard label="Total Reports" value={totalReports} loading={isLoading} />
        <StatCard label="Clusters" value={allClusters.length} loading={isLoading} />
        <StatCard label="Verified Events" value={trustDist.verified} loading={isLoading} accent />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* Category breakdown */}
        <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
          <h2 className="text-sm font-semibold mb-3 sm:mb-4">By Category</h2>
          {isLoading ? <Skeleton count={5} /> : categoryEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events yet.</p>
          ) : (
            <div className="space-y-3">
              {categoryEntries.map(([catId, count]) => {
                const cat = CATEGORIES[catId as EventCategory] ?? CATEGORIES.other;
                const pct = Math.round((count / allEvents.length) * 100);
                return (
                  <div key={catId}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center gap-2 text-xs sm:text-sm"><span>{cat.icon}</span>{cat.label}</span>
                      <span className="text-xs text-muted-foreground">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: cat.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Trust distribution */}
        <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
          <h2 className="text-sm font-semibold mb-3 sm:mb-4">Trust Distribution</h2>
          {isLoading ? <Skeleton count={4} /> : (
            <div className="space-y-4">
              {([
                { key: "verified", label: "Verified (20+)", color: "#3b82f6" },
                { key: "high", label: "High (10–19)", color: "#10b981" },
                { key: "medium", label: "Medium (4–9)", color: "#f59e0b" },
                { key: "low", label: "Low (0–3)", color: "#6b7280" },
              ] as const).map((level) => {
                const count = trustDist[level.key];
                const pct = allEvents.length ? Math.round((count / allEvents.length) * 100) : 0;
                return (
                  <div key={level.key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs sm:text-sm">{level.label}</span>
                      <span className="text-xs text-muted-foreground">{count}</span>
                    </div>
                    <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: level.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top clusters */}
        <div className="bg-card border border-border rounded-xl p-4 sm:p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold mb-3 sm:mb-4">Top Clusters</h2>
          {isLoading ? <Skeleton count={3} h={12} /> : topClusters.length === 0 ? (
            <p className="text-sm text-muted-foreground">No clusters yet.</p>
          ) : (
            <div className="space-y-2">
              {topClusters.map((cluster: any, i: number) => {
                const cat = CATEGORIES[cluster.category as EventCategory] ?? CATEGORIES.other;
                return (
                  <div key={cluster._id} className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-lg bg-background border border-border">
                    <span className="text-base sm:text-lg font-semibold text-muted-foreground w-5 sm:w-6 text-right shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium truncate">{cluster.label}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-0.5 text-xs text-muted-foreground">
                        <span style={{ color: cat.color }}>{cat.icon} {cat.label}</span>
                        <span>{cluster.eventCount} events</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-primary">{cluster.aggregateTrustScore}</p>
                      <p className="text-xs text-muted-foreground">trust</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, loading, accent }: { label: string; value: number; loading: boolean; accent?: boolean }) {
  return (
    <div className="bg-card border border-border rounded-xl p-3 sm:p-4">
      <p className="text-[11px] sm:text-xs text-muted-foreground mb-1">{label}</p>
      {loading ? <div className="h-7 w-16 bg-muted rounded animate-pulse" /> : (
        <p className={`text-xl sm:text-2xl font-semibold ${accent ? "text-primary" : ""}`}>{value}</p>
      )}
    </div>
  );
}

function Skeleton({ count, h = 6 }: { count: number; h?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-muted rounded animate-pulse" style={{ height: `${h * 4}px` }} />
      ))}
    </div>
  );
}
