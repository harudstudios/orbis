import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  events: defineTable({
    title: v.string(),
    description: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    category: v.string(),
    clusterId: v.optional(v.id("clusters")),
    reportsCount: v.number(),
    articlesCount: v.number(),
    trustScore: v.number(),
    status: v.union(
      v.literal("active"),
      v.literal("resolved"),
      v.literal("expired"),
    ),
    summary: v.optional(v.string()),
    userId: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_cluster", ["clusterId"])
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"])
    .index("by_user", ["userId"]),

  reports: defineTable({
    eventId: v.id("events"),
    clusterId: v.optional(v.id("clusters")),
    rawInput: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    userId: v.string(),
    createdAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_user", ["userId"])
    .index("by_created", ["createdAt"]),

  // Enforces one submission per user per cluster
  userClusterSubmissions: defineTable({
    userId: v.string(),
    clusterId: v.id("clusters"),
    eventId: v.id("events"),
    createdAt: v.number(),
  }).index("by_user_cluster", ["userId", "clusterId"]),

  clusters: defineTable({
    label: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    centerLatitude: v.number(),
    centerLongitude: v.number(),
    radius: v.number(),
    eventCount: v.number(),
    aggregateTrustScore: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_trust", ["aggregateTrustScore"])
    .index("by_created", ["createdAt"]),

  articles: defineTable({
    eventId: v.id("events"),
    clusterId: v.optional(v.id("clusters")),
    url: v.string(),
    headline: v.string(),
    source: v.string(),
    summary: v.optional(v.string()),
    publishedAt: v.optional(v.number()),
    fetchedAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_cluster", ["clusterId"])
    .index("by_fetched", ["fetchedAt"]),
});
