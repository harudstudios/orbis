"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useActiveEvents } from "@/hooks/use-events";
import { useMapStore } from "@/store/map-store";
import { useEventsStore } from "@/store/events-store";
import { useGeolocation } from "@/hooks/use-geolocation";
import { CATEGORY_LIST } from "@/config/categories";

const LiveMap = dynamic(
  () => import("@/components/map/live-map").then((m) => m.LiveMap),
  {
    ssr: false,
    loading: () => <div className="h-full w-full bg-card animate-pulse" />,
  },
);

export default function MapPage() {
  const router = useRouter();
  const { events, isLoading } = useActiveEvents();
  const { filters, setFilters } = useEventsStore();
  const geo = useGeolocation();

  const filteredEvents = useMemo(() => {
    let result = events as any[];
    if (filters.category !== "all") {
      result = result.filter((e: any) => e.category === filters.category);
    }
    return result;
  }, [events, filters.category]);

  const mapCenter = geo.location
    ? { latitude: geo.location.latitude, longitude: geo.location.longitude }
    : undefined;

  const mapZoom = geo.location ? 12 : undefined;

  return (
    <div className="h-full w-full relative">
      <LiveMap
        events={filteredEvents}
        center={mapCenter}
        zoom={mapZoom}
        onEventClick={(id) => router.push(`/events/${id}`)}
        onMapClick={(lat, lng) => {
          router.push(`/zone?lat=${lat.toFixed(6)}&lon=${lng.toFixed(6)}`);
        }}
      />

      {/* Top-left: category filter */}
      <div className="absolute top-3 left-3 z-[900]">
        <div className="bg-card/90 backdrop-blur-md border border-border rounded-xl p-2.5 sm:p-3 shadow-lg">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ category: e.target.value as any })}
            className="bg-transparent text-xs sm:text-sm text-foreground outline-none cursor-pointer"
          >
            <option value="all" className="bg-card">All Categories</option>
            {CATEGORY_LIST.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-card">
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bottom-left: event count */}
      <div className="absolute bottom-3 left-3 z-[900]">
        <div className="bg-card/90 backdrop-blur-md border border-border rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs text-muted-foreground shadow-lg">
          {isLoading ? (
            "Loading events..."
          ) : (
            <>
              <span className="text-foreground font-semibold">{filteredEvents.length}</span>{" "}
              events on map
            </>
          )}
        </div>
      </div>

      {/* Bottom-right: hint */}
      <div className="absolute bottom-3 right-3 z-[900] hidden sm:block">
        <div className="bg-card/90 backdrop-blur-md border border-border rounded-lg px-3 py-2 text-xs text-muted-foreground shadow-lg">
          Click anywhere on the map to explore a zone
        </div>
      </div>
    </div>
  );
}
