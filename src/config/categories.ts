export type EventCategory =
  | "accident"
  | "protest"
  | "crime"
  | "natural_disaster"
  | "fire"
  | "infrastructure"
  | "health"
  | "politics"
  | "conflict"
  | "weather"
  | "traffic"
  | "environment"
  | "other";

interface CategoryConfig {
  label: string;
  color: string;
  icon: string;
  description: string;
}

export const CATEGORIES: Record<EventCategory, CategoryConfig> = {
  accident: {
    label: "Accident",
    color: "#EF4444",
    icon: "🚗",
    description: "Vehicle crashes, workplace incidents, mishaps",
  },
  protest: {
    label: "Protest",
    color: "#F59E0B",
    icon: "📢",
    description: "Demonstrations, rallies, strikes",
  },
  crime: {
    label: "Crime",
    color: "#DC2626",
    icon: "🚨",
    description: "Theft, assault, vandalism, suspicious activity",
  },
  natural_disaster: {
    label: "Natural Disaster",
    color: "#8B5CF6",
    icon: "🌊",
    description: "Earthquake, flood, tsunami, landslide",
  },
  fire: {
    label: "Fire",
    color: "#F97316",
    icon: "🔥",
    description: "Building fires, wildfires, explosions",
  },
  infrastructure: {
    label: "Infrastructure",
    color: "#6366F1",
    icon: "🏗️",
    description: "Road damage, power outage, water disruption",
  },
  health: {
    label: "Health",
    color: "#10B981",
    icon: "🏥",
    description: "Disease outbreak, medical emergency, health advisory",
  },
  politics: {
    label: "Politics",
    color: "#3B82F6",
    icon: "🏛️",
    description: "Elections, government announcements, policy changes",
  },
  conflict: {
    label: "Conflict",
    color: "#B91C1C",
    icon: "⚔️",
    description: "Armed conflict, military activity, border incidents",
  },
  weather: {
    label: "Weather",
    color: "#0EA5E9",
    icon: "⛈️",
    description: "Severe storms, extreme heat/cold, weather warnings",
  },
  traffic: {
    label: "Traffic",
    color: "#D97706",
    icon: "🚦",
    description: "Road closures, major congestion, diversions",
  },
  environment: {
    label: "Environment",
    color: "#059669",
    icon: "🌍",
    description: "Pollution, oil spill, deforestation, ecological events",
  },
  other: {
    label: "Other",
    color: "#6B7280",
    icon: "📌",
    description: "Events that don't fit other categories",
  },
};

export const CATEGORY_LIST = Object.entries(CATEGORIES).map(([id, config]) => ({
  id: id as EventCategory,
  ...config,
}));
