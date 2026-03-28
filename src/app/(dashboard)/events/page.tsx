"use client";

import { useState } from "react";
import { useEvents } from "@/hooks/use-events";
import { EventCard } from "@/components/events/event-card";
import { CATEGORY_LIST } from "@/config/categories";

export default function EventsListPage() {
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("active");
  const [search, setSearch] = useState("");

  const { events, isLoading } = useEvents({
    category: category === "all" ? undefined : category,
    status: status === "all" ? undefined : status,
  });

  const filtered = search
    ? (events as any[]).filter(
        (e: any) =>
          e.title.toLowerCase().includes(search.toLowerCase()) ||
          e.description.toLowerCase().includes(search.toLowerCase()),
      )
    : (events as any[]);

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl font-semibold">Events</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          All reported events across the network — real-time feed ranked by trust score.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-card border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring w-full sm:w-64 placeholder:text-muted-foreground"
        />

        <div className="flex gap-2 flex-1 sm:flex-none">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-card border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring cursor-pointer flex-1 sm:flex-none"
          >
            <option value="all">All Categories</option>
            {CATEGORY_LIST.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-card border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring cursor-pointer flex-1 sm:flex-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        <div className="text-sm text-muted-foreground self-center sm:ml-auto">
          {filtered.length} {filtered.length === 1 ? "event" : "events"}
        </div>
      </div>

      {/* Event grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 animate-pulse h-32" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 sm:py-20 text-muted-foreground">
          <p className="text-base sm:text-lg mb-1">No events found</p>
          <p className="text-sm">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((event: any) => (
            <EventCard
              key={event._id}
              id={event._id}
              title={event.title}
              description={event.description}
              category={event.category}
              trustScore={event.trustScore}
              reportsCount={event.reportsCount}
              createdAt={event._creationTime}
            />
          ))}
        </div>
      )}
    </div>
  );
}
