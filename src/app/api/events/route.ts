import { NextRequest, NextResponse } from "next/server";
import { getConvexClient } from "@/lib/convex/client";
import { verifyAuth, isAuthenticated } from "@/lib/auth/verify";
import { normalizeEventInput, computeSemanticSimilarity } from "@/lib/gemini/normalize";
import { haversineDistance } from "@/lib/utils/geo";
import { api } from "@convex/_generated/api";
import { CLUSTERING } from "@/config/constants";

/**
 * GET /api/events — List events with optional filters.
 * Query params: category, status, limit
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || undefined;
  const status = searchParams.get("status") || undefined;
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit")!)
    : undefined;

  try {
    const convex = getConvexClient();
    const events = await convex.query(api.events.list, {
      category,
      status,
      limit,
    });
    return NextResponse.json({ events });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch events", details: error.message },
      { status: 500 },
    );
  }
}

/**
 * POST /api/events — Submit new news from mobile app.
 * Requires Firebase auth. Body: { rawInput, latitude, longitude, category }
 *
 * Flow:
 * 1. Verify Firebase token
 * 2. Normalize raw input via OpenAI
 * 3. Find nearby events, check semantic similarity
 * 4. If similar → check user hasn't already reported to that cluster → add report
 * 5. If new → create cluster + event
 * 6. Record user-cluster submission
 */
export async function POST(request: NextRequest) {
  // 1. Auth
  const authResult = await verifyAuth(request);
  if (!isAuthenticated(authResult)) return authResult;
  const user = authResult;

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { rawInput, latitude, longitude, category } = body;

  if (!rawInput || latitude == null || longitude == null || !category) {
    return NextResponse.json(
      { error: "Missing required fields: rawInput, latitude, longitude, category" },
      { status: 400 },
    );
  }

  try {
    const convex = getConvexClient();

    // 2. Normalize via Gemini
    const normalized = await normalizeEventInput(rawInput, category);

    // 3. Find nearby active events
    const allActive = await convex.query(api.events.getAllActive, {});
    const nearbyEvents = (allActive as any[]).filter((event: any) => {
      const distance = haversineDistance(
        { latitude, longitude },
        { latitude: event.latitude, longitude: event.longitude },
      );
      return distance <= CLUSTERING.MAX_RADIUS_KM;
    });

    // 4. Check semantic similarity with nearby events
    let matchedEvent = null;
    let highestSimilarity = 0;

    for (const event of nearbyEvents) {
      const similarity = await computeSemanticSimilarity(
        normalized.title,
        normalized.description,
        event.title,
        event.description,
      );

      if (
        similarity >= CLUSTERING.SIMILARITY_THRESHOLD &&
        similarity > highestSimilarity
      ) {
        highestSimilarity = similarity;
        matchedEvent = event;
      }
    }

    if (matchedEvent && matchedEvent.clusterId) {
      // 5a. Similar event found — add as corroborating report

      // Check one-per-user-per-cluster rule
      const alreadySubmitted = await convex.query(
        api.reports.checkUserClusterSubmission,
        { userId: user.uid, clusterId: matchedEvent.clusterId },
      );

      if (alreadySubmitted) {
        return NextResponse.json(
          {
            error: "You have already submitted a report for this event cluster",
            eventId: matchedEvent._id,
            clusterId: matchedEvent.clusterId,
          },
          { status: 409 },
        );
      }

      // Create report → increments trust score automatically
      const reportId = await convex.mutation(api.reports.submit, {
        eventId: matchedEvent._id,
        clusterId: matchedEvent.clusterId,
        rawInput,
        latitude,
        longitude,
        userId: user.uid,
      });

      // Record user-cluster submission for dedup
      await convex.mutation(api.reports.recordUserClusterSubmission, {
        userId: user.uid,
        clusterId: matchedEvent.clusterId,
        eventId: matchedEvent._id,
      });

      // Recalculate cluster aggregate trust
      await convex.mutation(api.clusters.recalculateTrust, {
        id: matchedEvent.clusterId,
      });

      return NextResponse.json({
        action: "report_added",
        eventId: matchedEvent._id,
        clusterId: matchedEvent.clusterId,
        reportId,
        similarity: highestSimilarity,
        message: "Your report was added to an existing event cluster",
      });
    }

    // 5b. No similar event — create new cluster + event

    const clusterId = await convex.mutation(api.clusters.create, {
      label: normalized.title,
      category,
      centerLatitude: latitude,
      centerLongitude: longitude,
      radius: CLUSTERING.MAX_RADIUS_KM,
    });

    const eventId = await convex.mutation(api.events.create, {
      title: normalized.title,
      description: normalized.description,
      latitude,
      longitude,
      category,
      clusterId,
      userId: user.uid,
      summary: normalized.summary,
    });

    // Create the initial report
    await convex.mutation(api.reports.submit, {
      eventId,
      clusterId,
      rawInput,
      latitude,
      longitude,
      userId: user.uid,
    });

    // Record user-cluster submission
    await convex.mutation(api.reports.recordUserClusterSubmission, {
      userId: user.uid,
      clusterId,
      eventId,
    });

    // Recalculate cluster aggregate trust
    await convex.mutation(api.clusters.recalculateTrust, { id: clusterId });

    return NextResponse.json({
      action: "event_created",
      eventId,
      clusterId,
      title: normalized.title,
      description: normalized.description,
      message: "New event created and clustered",
    });
  } catch (error: any) {
    console.error("POST /api/events error:", error);
    return NextResponse.json(
      { error: "Failed to process event submission", details: error.message },
      { status: 500 },
    );
  }
}
