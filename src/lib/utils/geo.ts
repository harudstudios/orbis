import type { GeoPoint } from "@/types/map";

const EARTH_RADIUS_KM = 6371;

/**
 * Haversine formula: calculates distance between two geographic points in km.
 */
export function haversineDistance(a: GeoPoint, b: GeoPoint): number {
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Checks if a point falls within a given radius (km) of a center point.
 */
export function isWithinRadius(
  point: GeoPoint,
  center: GeoPoint,
  radiusKm: number,
): boolean {
  return haversineDistance(point, center) <= radiusKm;
}
