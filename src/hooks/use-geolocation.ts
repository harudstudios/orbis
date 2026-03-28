"use client";

import { useEffect, useState } from "react";
import type { GeoPoint } from "@/types/map";

interface GeolocationState {
  location: GeoPoint | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ location: null, loading: false, error: "Geolocation not supported" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          location: { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
          loading: false,
          error: null,
        });
      },
      (err) => {
        setState({ location: null, loading: false, error: err.message });
      },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  }, []);

  return state;
}
