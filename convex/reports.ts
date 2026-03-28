import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByEvent = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reports")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .order("desc")
      .collect();
  },
});

export const submit = mutation({
  args: {
    eventId: v.id("events"),
    clusterId: v.optional(v.id("clusters")),
    rawInput: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const reportId = await ctx.db.insert("reports", {
      eventId: args.eventId,
      clusterId: args.clusterId,
      rawInput: args.rawInput,
      latitude: args.latitude,
      longitude: args.longitude,
      userId: args.userId,
      createdAt: Date.now(),
    });

    // Increment event's report count and recalculate trust
    const event = await ctx.db.get(args.eventId);
    if (event) {
      const reportsCount = event.reportsCount + 1;
      const trustScore = reportsCount + event.articlesCount * 2;
      await ctx.db.patch(args.eventId, {
        reportsCount,
        trustScore,
        updatedAt: Date.now(),
      });
    }

    return reportId;
  },
});

export const checkUserClusterSubmission = query({
  args: {
    userId: v.string(),
    clusterId: v.id("clusters"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userClusterSubmissions")
      .withIndex("by_user_cluster", (q) =>
        q.eq("userId", args.userId).eq("clusterId", args.clusterId),
      )
      .first();
    return existing !== null;
  },
});

export const recordUserClusterSubmission = mutation({
  args: {
    userId: v.string(),
    clusterId: v.id("clusters"),
    eventId: v.id("events"),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("userClusterSubmissions", {
      userId: args.userId,
      clusterId: args.clusterId,
      eventId: args.eventId,
      createdAt: Date.now(),
    });
  },
});
