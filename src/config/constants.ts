export const APP_NAME = "Orbis";

export const MAP_DEFAULTS = {
  CENTER: { latitude: 25.276987, longitude: 55.296249 } as const, // Dubai
  ZOOM: 5,
  MIN_ZOOM: 2,
  MAX_ZOOM: 18,
  TILE_URL: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  TILE_ATTRIBUTION:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
};

export const CLUSTERING = {
  SIMILARITY_THRESHOLD: 0.8,
  MAX_RADIUS_KM: 5,
  MIN_REPORTS_FOR_CLUSTER: 2,
};

export const TRUST = {
  ARTICLE_WEIGHT: 2,
  VERIFIED_THRESHOLD: 20,
  HIGH_THRESHOLD: 10,
  MEDIUM_THRESHOLD: 4,
};
