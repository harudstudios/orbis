"use client";

import { useMapStore } from "@/store/map-store";

/**
 * Convenience hook that exposes map controls and state together.
 */
export function useMap() {
  const viewState = useMapStore((s) => s.viewState);
  const selectedEventId = useMapStore((s) => s.selectedEventId);
  const setViewState = useMapStore((s) => s.setViewState);
  const setSelectedEvent = useMapStore((s) => s.setSelectedEvent);
  const panTo = useMapStore((s) => s.panTo);

  return { viewState, selectedEventId, setViewState, setSelectedEvent, panTo };
}
