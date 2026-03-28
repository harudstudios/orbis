import { getExaClient } from "./client";

interface ExaSearchResult {
  url: string;
  title: string;
  snippet: string;
  publishedDate?: string;
  score: number;
}

/**
 * Performs zone-scoped semantic search via Exa.
 * Adds geographic context to the query for location-relevant results.
 */
export async function searchInZone(
  query: string,
  latitude: number,
  longitude: number,
  radiusKm: number,
  numResults: number = 10,
): Promise<ExaSearchResult[]> {
  const client = getExaClient();

  // Augment query with location context for better geo-relevance
  const locationContext = await reverseGeocodeApprox(latitude, longitude);
  const augmentedQuery = locationContext
    ? `${query} in ${locationContext}`
    : query;

  const response = await client.searchAndContents(augmentedQuery, {
    type: "neural",
    numResults,
    text: { maxCharacters: 500 },
  });

  return response.results.map((r: any) => ({
    url: r.url,
    title: r.title || "",
    snippet: r.text || "",
    publishedDate: r.publishedDate || undefined,
    score: r.score || 0,
  }));
}

/**
 * General web search via Exa without zone scoping.
 */
export async function searchWeb(
  query: string,
  numResults: number = 10,
): Promise<ExaSearchResult[]> {
  const client = getExaClient();

  const response = await client.searchAndContents(query, {
    type: "neural",
    numResults,
    text: { maxCharacters: 500 },
  });

  return response.results.map((r: any) => ({
    url: r.url,
    title: r.title || "",
    snippet: r.text || "",
    publishedDate: r.publishedDate || undefined,
    score: r.score || 0,
  }));
}

/**
 * Rough reverse geocode using lat/lon to get a city/region name.
 * Uses Nominatim (free, no key needed) for approximate location context.
 */
async function reverseGeocodeApprox(
  lat: number,
  lon: number,
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10`,
      { headers: { "User-Agent": "Orbis/1.0" } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    // Return city or state-level name
    return (
      data.address?.city ||
      data.address?.town ||
      data.address?.state ||
      data.address?.country ||
      null
    );
  } catch {
    return null;
  }
}
