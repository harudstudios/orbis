import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByEvent = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("articles")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .order("desc")
      .collect();
  },
});

export const listByCluster = query({
  args: { clusterId: v.id("clusters") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("articles")
      .withIndex("by_cluster", (q) => q.eq("clusterId", args.clusterId))
      .order("desc")
      .collect();
  },
});

export const insert = mutation({
  args: {
    eventId: v.id("events"),
    clusterId: v.optional(v.id("clusters")),
    url: v.string(),
    headline: v.string(),
    source: v.string(),
    summary: v.optional(v.string()),
    publishedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const articleId = await ctx.db.insert("articles", {
      eventId: args.eventId,
      clusterId: args.clusterId,
      url: args.url,
      headline: args.headline,
      source: args.source,
      summary: args.summary,
      publishedAt: args.publishedAt,
      fetchedAt: Date.now(),
    });

    // Increment the event's article count and recalculate trust
    const event = await ctx.db.get(args.eventId);
    if (event) {
      const articlesCount = event.articlesCount + 1;
      const trustScore = event.reportsCount + articlesCount * 2;
      await ctx.db.patch(args.eventId, {
        articlesCount,
        trustScore,
        updatedAt: Date.now(),
      });
    }

    return articleId;
  },
});

export const bulkInsert = mutation({
  args: {
    eventId: v.id("events"),
    clusterId: v.optional(v.id("clusters")),
    articles: v.array(
      v.object({
        url: v.string(),
        headline: v.string(),
        source: v.string(),
        summary: v.optional(v.string()),
        publishedAt: v.optional(v.number()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const ids = [];
    for (const article of args.articles) {
      const id = await ctx.db.insert("articles", {
        eventId: args.eventId,
        clusterId: args.clusterId,
        url: article.url,
        headline: article.headline,
        source: article.source,
        summary: article.summary,
        publishedAt: article.publishedAt,
        fetchedAt: Date.now(),
      });
      ids.push(id);
    }

    // Update event article count and trust score
    const event = await ctx.db.get(args.eventId);
    if (event) {
      const articlesCount = event.articlesCount + args.articles.length;
      const trustScore = event.reportsCount + articlesCount * 2;
      await ctx.db.patch(args.eventId, {
        articlesCount,
        trustScore,
        updatedAt: Date.now(),
      });
    }

    return ids;
  },
});
