import { NextRequest, NextResponse } from "next/server";
import { searchInZone, searchWeb } from "@/lib/exa/search";

/**
 * POST /api/search — Exa-powered web search, optionally scoped to a geographic zone.
 * Body: { query, latitude?, longitude?, radiusKm?, numResults? }
 *
 * If lat/lon provided, search is augmented with location context.
 * Otherwise, performs a general web search.
 */
export async function POST(request: NextRequest) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { query, latitude, longitude, radiusKm, numResults } = body;

  if (!query || typeof query !== "string") {
    return NextResponse.json(
      { error: "query is required" },
      { status: 400 },
    );
  }

  try {
    let results;

    if (latitude != null && longitude != null) {
      results = await searchInZone(
        query,
        latitude,
        longitude,
        radiusKm || 50,
        numResults || 10,
      );
    } else {
      results = await searchWeb(query, numResults || 10);
    }

    return NextResponse.json({
      results,
      query,
      zone:
        latitude != null
          ? { latitude, longitude, radiusKm: radiusKm || 50 }
          : null,
    });
  } catch (error: any) {
    console.error("POST /api/search error:", error);
    return NextResponse.json(
      { error: "Search failed", details: error.message },
      { status: 500 },
    );
  }
}
