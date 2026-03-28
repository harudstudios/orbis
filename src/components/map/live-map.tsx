"use client";

import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Marker,
  Circle,
  Popup,
  Tooltip,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useMapStore } from "@/store/map-store";
import { useThemeStore } from "@/store/theme-store";
import { CATEGORIES, type EventCategory } from "@/config/categories";
import { MAP_DEFAULTS } from "@/config/constants";
import { TrustBadge } from "@/components/events/trust-badge";

interface MapEvent {
  _id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  category: string;
  trustScore: number;
  reportsCount: number;
}

export interface LiveMapProps {
  events: MapEvent[];
  center?: { latitude: number; longitude: number };
  zoom?: number;
  flyTo?: { latitude: number; longitude: number; zoom?: number } | null;
  userLocation?: { latitude: number; longitude: number } | null;
  onEventClick?: (eventId: string) => void;
  onMapClick?: (lat: number, lng: number) => void;
  showRadiusOverlay?: boolean;
  showZoomControls?: boolean;
  interactive?: boolean;
  hoverPopups?: boolean;
}

const LIGHT_TILES = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const DARK_TILES = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

export function LiveMap({
  events,
  center,
  zoom,
  flyTo,
  userLocation,
  onEventClick,
  onMapClick,
  showRadiusOverlay = true,
  showZoomControls = false,
  interactive = true,
  hoverPopups = false,
}: LiveMapProps) {
  const { viewState } = useMapStore();

  const lat = center?.latitude || viewState.center.latitude || MAP_DEFAULTS.CENTER.latitude;
  const lng = center?.longitude || viewState.center.longitude || MAP_DEFAULTS.CENTER.longitude;
  const z = zoom || viewState.zoom || MAP_DEFAULTS.ZOOM;

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={z}
      minZoom={MAP_DEFAULTS.MIN_ZOOM}
      maxZoom={MAP_DEFAULTS.MAX_ZOOM}
      className="h-full w-full"
      zoomControl={false}
    >
      <ThemeAwareTiles />

      {interactive && <MapEventHandler onMapClick={onMapClick} />}
      {interactive && <MapSync />}
      {center && <RecenterMap lat={lat} lng={lng} zoom={z} />}
      {flyTo && <FlyToLocation lat={flyTo.latitude} lng={flyTo.longitude} zoom={flyTo.zoom} />}
      {showZoomControls && <ZoomControls />}
      {userLocation && <UserLocationMarker lat={userLocation.latitude} lng={userLocation.longitude} />}

      {events.map((event) => {
        const cat = CATEGORIES[event.category as EventCategory] ?? CATEGORIES.other;
        const radius = Math.max(6, Math.min(event.trustScore * 1.5, 20));

        return (
          <CircleMarker
            key={event._id}
            center={[event.latitude, event.longitude]}
            radius={radius}
            pathOptions={{
              color: cat.color,
              fillColor: cat.color,
              fillOpacity: 0.6,
              weight: 2,
              opacity: 0.9,
            }}
            eventHandlers={
              hoverPopups
                ? {
                    click: (e) => {
                      L.DomEvent.stopPropagation(e);
                      onEventClick?.(event._id);
                    },
                    mouseover: (e) => e.target.openPopup(),
                    mouseout: (e) => e.target.closePopup(),
                  }
                : {
                    click: () => onEventClick?.(event._id),
                  }
            }
          >
            <Popup autoPan={false} closeButton={false}>
              <div className="min-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ color: cat.color }}>{cat.icon}</span>
                  <span className="text-xs font-medium" style={{ color: cat.color }}>
                    {cat.label}
                  </span>
                </div>
                <p className="font-semibold text-sm mb-1">{event.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {event.description}
                </p>
                <div className="flex items-center justify-between">
                  <TrustBadge score={event.trustScore} />
                  <span className="text-xs text-muted-foreground">
                    {event.reportsCount} reports
                  </span>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}

      {showRadiusOverlay && <RadiusOverlay />}
    </MapContainer>
  );
}

/**
 * Swaps tile layers at the Leaflet API level when theme changes.
 * This avoids react-leaflet's immutability issues with TileLayer.
 */
function ThemeAwareTiles() {
  const map = useMap();
  const theme = useThemeStore((s) => s.theme);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const url = theme === "dark" ? DARK_TILES : LIGHT_TILES;
    const layer = L.tileLayer(url, {
      attribution: MAP_DEFAULTS.TILE_ATTRIBUTION,
    });
    layer.addTo(map);
    tileLayerRef.current = layer;

    return () => {
      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
      }
    };
  }, [map, theme]);

  return null;
}

function RecenterMap({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], zoom);
  }, [map, lat, lng, zoom]);
  return null;
}

function MapEventHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  const setClickedLocation = useMapStore((s) => s.setClickedLocation);

  useMapEvents({
    click(e) {
      setClickedLocation({ latitude: e.latlng.lat, longitude: e.latlng.lng });
      onMapClick?.(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

function MapSync() {
  const map = useMap();
  const setViewState = useMapStore((s) => s.setViewState);

  useEffect(() => {
    const handler = () => {
      const center = map.getCenter();
      setViewState({
        center: { latitude: center.lat, longitude: center.lng },
        zoom: map.getZoom(),
      });
    };
    map.on("moveend", handler);
    return () => { map.off("moveend", handler); };
  }, [map, setViewState]);

  return null;
}

function FlyToLocation({ lat, lng, zoom }: { lat: number; lng: number; zoom?: number }) {
  const map = useMap();
  const prevRef = useRef("");

  useEffect(() => {
    const key = `${lat},${lng}`;
    if (key === prevRef.current) return;
    prevRef.current = key;
    map.flyTo([lat, lng], zoom ?? 13, { duration: 1.5 });
  }, [map, lat, lng, zoom]);

  return null;
}

function ZoomControls() {
  const map = useMap();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    L.DomEvent.disableClickPropagation(el);
    L.DomEvent.disableScrollPropagation(el);
    const stop = (e: Event) => e.stopPropagation();
    el.addEventListener("pointerdown", stop);
    el.addEventListener("mousedown", stop);
    el.addEventListener("touchstart", stop);
    el.addEventListener("dblclick", stop);
    return () => {
      el.removeEventListener("pointerdown", stop);
      el.removeEventListener("mousedown", stop);
      el.removeEventListener("touchstart", stop);
      el.removeEventListener("dblclick", stop);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: "absolute", bottom: 48, right: 12, zIndex: 1000 }}
    >
      <div className="flex flex-col gap-1">
        <button
          onClick={(e) => { e.stopPropagation(); map.zoomIn(); }}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-card/90 backdrop-blur-md border border-border shadow-lg text-foreground hover:bg-card transition-colors text-lg font-medium"
          title="Zoom in"
        >
          +
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); map.zoomOut(); }}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-card/90 backdrop-blur-md border border-border shadow-lg text-foreground hover:bg-card transition-colors text-lg font-medium"
          title="Zoom out"
        >
          −
        </button>
      </div>
    </div>
  );
}

const USER_LOCATION_ICON = L.divIcon({
  className: "",
  html: `<div style="position:relative;width:20px;height:20px">
    <div style="position:absolute;inset:0;border-radius:50%;background:rgba(59,130,246,0.25);animation:pulse-ring 2s ease-out infinite"></div>
    <div style="position:absolute;top:4px;left:4px;width:12px;height:12px;border-radius:50%;background:#3b82f6;border:2.5px solid #fff;box-shadow:0 0 6px rgba(59,130,246,0.5)"></div>
  </div>
  <style>@keyframes pulse-ring{0%{transform:scale(1);opacity:1}100%{transform:scale(2.2);opacity:0}}</style>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function UserLocationMarker({ lat, lng }: { lat: number; lng: number }) {
  return (
    <Marker position={[lat, lng]} icon={USER_LOCATION_ICON} interactive={false}>
      <Tooltip direction="top" offset={[0, -12]} permanent={false}>
        You are here
      </Tooltip>
    </Marker>
  );
}

function RadiusOverlay() {
  const clickedLocation = useMapStore((s) => s.clickedLocation);
  const selectedRadius = useMapStore((s) => s.selectedRadius);

  if (!clickedLocation) return null;

  return (
    <Circle
      center={[clickedLocation.latitude, clickedLocation.longitude]}
      radius={selectedRadius * 1000}
      pathOptions={{
        color: "#f59e0b",
        fillColor: "#f59e0b",
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: "6 4",
      }}
    />
  );
}
