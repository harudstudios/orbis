"use client";

import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Circle,
  Popup,
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

interface LiveMapProps {
  events: MapEvent[];
  center?: { latitude: number; longitude: number };
  zoom?: number;
  onEventClick?: (eventId: string) => void;
  onMapClick?: (lat: number, lng: number) => void;
  showRadiusOverlay?: boolean;
  interactive?: boolean;
}

const LIGHT_TILES = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const DARK_TILES = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

export function LiveMap({
  events,
  center,
  zoom,
  onEventClick,
  onMapClick,
  showRadiusOverlay = true,
  interactive = true,
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
            eventHandlers={{
              click: () => onEventClick?.(event._id),
            }}
          >
            <Popup>
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
