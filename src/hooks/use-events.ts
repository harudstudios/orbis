"use client";

import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";

export function useEvents(filters?: {
  category?: string;
  status?: string;
  limit?: number;
}) {
  const events = useQuery(api.events.list, {
    category: filters?.category,
    status: filters?.status,
    limit: filters?.limit,
  });
  return { events: events ?? [], isLoading: events === undefined };
}

export function useEvent(eventId: string) {
  const event = useQuery(api.events.getById, {
    id: eventId as Id<"events">,
  });
  return { event: event ?? null, isLoading: event === undefined };
}

export function useActiveEvents() {
  const events = useQuery(api.events.getAllActive);
  return { events: events ?? [], isLoading: events === undefined };
}

export function useCluster(clusterId: string) {
  const cluster = useQuery(api.clusters.getById, {
    id: clusterId as Id<"clusters">,
  });
  return { cluster: cluster ?? null, isLoading: cluster === undefined };
}

export function useClusters(filters?: {
  category?: string;
  limit?: number;
}) {
  const clusters = useQuery(api.clusters.list, {
    category: filters?.category,
    limit: filters?.limit,
  });
  return { clusters: clusters ?? [], isLoading: clusters === undefined };
}
