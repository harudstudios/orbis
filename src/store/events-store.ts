import { create } from "zustand";
import type { EventCategory } from "@/types/events";

interface EventFilters {
  category: EventCategory | "all";
  minTrustScore: number;
  status: "active" | "resolved" | "all";
}

interface EventsStore {
  filters: EventFilters;
  searchQuery: string;
  setFilters: (filters: Partial<EventFilters>) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: EventFilters = {
  category: "all",
  minTrustScore: 0,
  status: "active",
};

export const useEventsStore = create<EventsStore>((set) => ({
  filters: DEFAULT_FILTERS,
  searchQuery: "",

  setFilters: (partial) =>
    set((state) => ({
      filters: { ...state.filters, ...partial },
    })),

  setSearchQuery: (query) => set({ searchQuery: query }),

  resetFilters: () => set({ filters: DEFAULT_FILTERS, searchQuery: "" }),
}));
