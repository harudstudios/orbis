import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    category: v.optional(v.string()),
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 200;

    if (args.category && args.category !== "all") {
      const events = await ctx.db
        .query("events")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .order("desc")
        .take(limit);
      if (args.status && args.status !== "all") {
        return events.filter((e) => e.status === args.status);
      }
      return events;
    }

    if (args.status && args.status !== "all") {
      const events = await ctx.db
        .query("events")
        .withIndex("by_status", (q) => q.eq("status", args.status as "active" | "resolved" | "expired"))
        .order("desc")
        .take(limit);
      return events;
    }

    return await ctx.db
      .query("events")
      .withIndex("by_created")
      .order("desc")
      .take(limit);
  },
});

export const getById = query({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.id);
    if (!event) return null;

    const reports = await ctx.db
      .query("reports")
      .withIndex("by_event", (q) => q.eq("eventId", args.id))
      .order("desc")
      .collect();

    const articles = await ctx.db
      .query("articles")
      .withIndex("by_event", (q) => q.eq("eventId", args.id))
      .order("desc")
      .collect();

    return { ...event, reports, articles };
  },
});

export const getAllActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("events")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    category: v.string(),
    clusterId: v.optional(v.id("clusters")),
    userId: v.string(),
    summary: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const eventId = await ctx.db.insert("events", {
      title: args.title,
      description: args.description,
      latitude: args.latitude,
      longitude: args.longitude,
      category: args.category,
      clusterId: args.clusterId,
      reportsCount: 0,
      articlesCount: 0,
      trustScore: 0,
      status: "active",
      summary: args.summary,
      userId: args.userId,
      createdAt: now,
      updatedAt: now,
    });
    return eventId;
  },
});

export const updateTrustScore = mutation({
  args: {
    id: v.id("events"),
    reportsCount: v.number(),
    articlesCount: v.number(),
    trustScore: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      reportsCount: args.reportsCount,
      articlesCount: args.articlesCount,
      trustScore: args.trustScore,
      updatedAt: Date.now(),
    });
  },
});

export const incrementArticlesCount = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.id);
    if (!event) throw new Error("Event not found");

    await ctx.db.patch(args.id, {
      articlesCount: event.articlesCount + 1,
      updatedAt: Date.now(),
    });
  },
});
