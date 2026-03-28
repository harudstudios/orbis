import { create } from "zustand";
import type { MapViewState, GeoPoint } from "@/types/map";

interface MapStore {
  viewState: MapViewState;
  selectedEventId: string | null;
  clickedLocation: GeoPoint | null;
  selectedRadius: number;
  setViewState: (state: Partial<MapViewState>) => void;
  setSelectedEvent: (id: string | null) => void;
  setClickedLocation: (point: GeoPoint | null) => void;
  setSelectedRadius: (km: number) => void;
  panTo: (point: GeoPoint) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  viewState: {
    center: { latitude: 25.276987, longitude: 55.296249 },
    zoom: 5,
  },
  selectedEventId: null,
  clickedLocation: null,
  selectedRadius: 10,

  setViewState: (partial) =>
    set((state) => ({
      viewState: { ...state.viewState, ...partial },
    })),

  setSelectedEvent: (id) => set({ selectedEventId: id }),

  setClickedLocation: (point) => set({ clickedLocation: point }),

  setSelectedRadius: (km) => set({ selectedRadius: km }),

  panTo: (point) =>
    set((state) => ({
      viewState: { ...state.viewState, center: point, zoom: 12 },
    })),
}));
