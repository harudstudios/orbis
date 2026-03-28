import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;

    if (args.category && args.category !== "all") {
      return await ctx.db
        .query("clusters")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .order("desc")
        .take(limit);
    }

    return await ctx.db
      .query("clusters")
      .withIndex("by_trust")
      .order("desc")
      .take(limit);
  },
});

export const getById = query({
  args: { id: v.id("clusters") },
  handler: async (ctx, args) => {
    const cluster = await ctx.db.get(args.id);
    if (!cluster) return null;

    const events = await ctx.db
      .query("events")
      .withIndex("by_cluster", (q) => q.eq("clusterId", args.id))
      .collect();

    return { ...cluster, events };
  },
});

export const create = mutation({
  args: {
    label: v.string(),
    category: v.string(),
    centerLatitude: v.number(),
    centerLongitude: v.number(),
    radius: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("clusters", {
      label: args.label,
      category: args.category,
      centerLatitude: args.centerLatitude,
      centerLongitude: args.centerLongitude,
      radius: args.radius,
      eventCount: 1,
      aggregateTrustScore: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const incrementEventCount = mutation({
  args: { id: v.id("clusters") },
  handler: async (ctx, args) => {
    const cluster = await ctx.db.get(args.id);
    if (!cluster) throw new Error("Cluster not found");

    // Recalculate aggregate trust from all events in cluster
    const events = await ctx.db
      .query("events")
      .withIndex("by_cluster", (q) => q.eq("clusterId", args.id))
      .collect();

    const aggregateTrustScore = events.reduce(
      (sum, e) => sum + e.trustScore,
      0,
    );

    await ctx.db.patch(args.id, {
      eventCount: cluster.eventCount + 1,
      aggregateTrustScore,
      updatedAt: Date.now(),
    });
  },
});

export const recalculateTrust = mutation({
  args: { id: v.id("clusters") },
  handler: async (ctx, args) => {
    const events = await ctx.db
      .query("events")
      .withIndex("by_cluster", (q) => q.eq("clusterId", args.id))
      .collect();

    const aggregateTrustScore = events.reduce(
      (sum, e) => sum + e.trustScore,
      0,
    );

    await ctx.db.patch(args.id, {
      aggregateTrustScore,
      eventCount: events.length,
      updatedAt: Date.now(),
    });
  },
});
