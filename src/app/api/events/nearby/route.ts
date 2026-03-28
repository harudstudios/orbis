import { NextRequest, NextResponse } from "next/server";
import { getConvexClient } from "@/lib/convex/client";
import { haversineDistance } from "@/lib/utils/geo";
import { api } from "@convex/_generated/api";

/**
 * GET /api/events/nearby — Events within a radius of a point.
 * Query params: lat, lon, radius (km, default 5), category (optional)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") || "");
  const lon = parseFloat(searchParams.get("lon") || "");
  const radius = parseFloat(searchParams.get("radius") || "5");
  const category = searchParams.get("category") || undefined;

  if (isNaN(lat) || isNaN(lon)) {
    return NextResponse.json(
      { error: "lat and lon are required numeric parameters" },
      { status: 400 },
    );
  }

  if (isNaN(radius) || radius <= 0 || radius > 500) {
    return NextResponse.json(
      { error: "radius must be between 0 and 500 km" },
      { status: 400 },
    );
  }

  try {
    const convex = getConvexClient();
    const allEvents = await convex.query(api.events.list, {
      category,
      status: "active",
    });

    const nearbyEvents = (allEvents as any[])
      .filter((event: any) => {
        const distance = haversineDistance(
          { latitude: lat, longitude: lon },
          { latitude: event.latitude, longitude: event.longitude },
        );
        return distance <= radius;
      })
      .map((event: any) => ({
        ...event,
        distance: Math.round(
          haversineDistance(
            { latitude: lat, longitude: lon },
            { latitude: event.latitude, longitude: event.longitude },
          ) * 100,
        ) / 100,
      }))
      .sort((a: any, b: any) => a.distance - b.distance);

    return NextResponse.json({
      events: nearbyEvents,
      center: { latitude: lat, longitude: lon },
      radiusKm: radius,
      count: nearbyEvents.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch nearby events", details: error.message },
      { status: 500 },
    );
  }
}
