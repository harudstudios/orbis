import type { Id } from "../../convex/_generated/dataModel";
import type { EventCategory } from "@/config/categories";

export type { EventCategory };

export type EventStatus = "active" | "resolved" | "expired";

export interface OrbisEvent {
  _id: Id<"events">;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  category: EventCategory;
  clusterId?: Id<"clusters">;
  reportsCount: number;
  articlesCount: number;
  trustScore: number;
  status: EventStatus;
  summary?: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
}

export interface Report {
  _id: Id<"reports">;
  eventId: Id<"events">;
  clusterId?: Id<"clusters">;
  rawInput: string;
  latitude: number;
  longitude: number;
  userId: string;
  createdAt: number;
}

export interface Cluster {
  _id: Id<"clusters">;
  label: string;
  description?: string;
  category: string;
  centerLatitude: number;
  centerLongitude: number;
  radius: number;
  eventCount: number;
  aggregateTrustScore: number;
  createdAt: number;
  updatedAt: number;
}

export interface Article {
  _id: Id<"articles">;
  eventId: Id<"events">;
  clusterId?: Id<"clusters">;
  url: string;
  headline: string;
  source: string;
  summary?: string;
  publishedAt?: number;
  fetchedAt: number;
}

export interface EventWithDetails extends OrbisEvent {
  reports: Report[];
  articles: Article[];
}
