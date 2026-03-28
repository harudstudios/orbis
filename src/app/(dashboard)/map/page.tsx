"use client";

import dynamic from "next/dynamic";
import {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { useActiveEvents } from "@/hooks/use-events";
import { useMapStore } from "@/store/map-store";
import { useEventsStore } from "@/store/events-store";
import { useGeolocation } from "@/hooks/use-geolocation";
import { CATEGORY_LIST } from "@/config/categories";
import type { LiveMapProps } from "@/components/map/live-map";

const LiveMap = dynamic<LiveMapProps>(
  () => import("@/components/map/live-map").then((m) => m.LiveMap),
  {
    ssr: false,
    loading: () => <div className="h-full w-full bg-card animate-pulse" />,
  },
);

interface GeoResult {
  display_name: string;
  lat: string;
  lon: string;
}

export default function MapPage() {
  const router = useRouter();
  const { events, isLoading } = useActiveEvents();
  const { filters, setFilters } = useEventsStore();
  const geo = useGeolocation();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [flyTo, setFlyTo] = useState<{ latitude: number; longitude: number; zoom?: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setResults([]);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const searchLocation = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim()) { setResults([]); return; }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5`,
          { headers: { "Accept-Language": "en" } },
        );
        if (res.ok) {
          const data: GeoResult[] = await res.json();
          setResults(data);
        }
      } catch {
        /* ignore */
      } finally {
        setSearching(false);
      }
    }, 350);
  }, []);

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    searchLocation(value);
  };

  const selectResult = (r: GeoResult) => {
    setFlyTo({ latitude: parseFloat(r.lat), longitude: parseFloat(r.lon), zoom: 13 });
    setSearchQuery(r.display_name.split(",")[0]);
    setResults([]);
    setSearchOpen(false);
  };

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
        flyTo={flyTo}
        userLocation={geo.location ?? null}
        onEventClick={(id) => router.push(`/events/${id}`)}
        onMapClick={(lat, lng) => {
          router.push(`/zone?lat=${lat.toFixed(6)}&lon=${lng.toFixed(6)}`);
        }}
        hoverPopups
        showZoomControls
      />

      {/* Top-center: location search with toggle arrow — pushed below category filter on mobile */}
      <div
        ref={wrapperRef}
        className="absolute top-14 sm:top-3 left-3 sm:left-1/2 sm:-translate-x-1/2 z-[900] flex flex-col items-center sm:items-center"
      >
        {searchOpen ? (
          <div className="relative">
            <div className="bg-card/90 backdrop-blur-md border border-border rounded-xl shadow-lg flex items-center gap-2 px-3 py-2 w-[260px] sm:w-[340px]">
              <svg className="w-4 h-4 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && results.length > 0) selectResult(results[0]);
                  if (e.key === "Escape") { setSearchOpen(false); setResults([]); }
                }}
                placeholder="Search a location..."
                className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1 min-w-0"
              />
              {searching && (
                <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin shrink-0" />
              )}
              {searchQuery && !searching && (
                <button
                  onClick={() => { setSearchQuery(""); setResults([]); }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => { setSearchOpen(false); setResults([]); }}
                className="text-muted-foreground hover:text-foreground transition-colors ml-1"
                title="Close search"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="m18 15-6-6-6 6" />
                </svg>
              </button>
            </div>

            {/* Results dropdown */}
            {results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-lg overflow-hidden">
                {results.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => selectResult(r)}
                    className="w-full text-left px-3 py-2.5 text-sm text-foreground hover:bg-accent/50 transition-colors flex items-start gap-2 border-b border-border/50 last:border-0"
                  >
                    <svg className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="line-clamp-2">{r.display_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="bg-card/90 backdrop-blur-md border border-border rounded-xl shadow-lg px-3 py-2 flex items-center gap-2 hover:bg-card transition-colors"
            title="Search location"
          >
            <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <span className="text-xs text-muted-foreground hidden sm:inline">Search location</span>
            <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        )}
      </div>

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
