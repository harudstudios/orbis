import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const favs = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    const events = await Promise.all(
      favs.map(async (fav) => {
        const event = await ctx.db.get(fav.eventId);
        return event ? { ...event, favoriteId: fav._id, favoritedAt: fav.createdAt } : null;
      }),
    );

    return events.filter(Boolean);
  },
});

export const isFavorited = query({
  args: { userId: v.string(), eventId: v.id("events") },
  handler: async (ctx, { userId, eventId }) => {
    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user_event", (q) => q.eq("userId", userId).eq("eventId", eventId))
      .first();
    return !!existing;
  },
});

export const toggle = mutation({
  args: { userId: v.string(), eventId: v.id("events") },
  handler: async (ctx, { userId, eventId }) => {
    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user_event", (q) => q.eq("userId", userId).eq("eventId", eventId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { action: "removed" as const };
    }

    await ctx.db.insert("favorites", {
      userId,
      eventId,
      createdAt: Date.now(),
    });
    return { action: "added" as const };
  },
});
