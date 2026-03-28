export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapViewState {
  center: GeoPoint;
  zoom: number;
  bounds?: MapBounds;
}

export interface HotZone {
  center: GeoPoint;
  radius: number;
  intensity: number;
  eventCount: number;
}

export type MapPin = {
  id: string;
  position: GeoPoint;
  category: string;
  trustScore: number;
  title: string;
};
