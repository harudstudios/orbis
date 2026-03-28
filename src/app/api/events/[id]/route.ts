import { NextRequest, NextResponse } from "next/server";
import { getConvexClient } from "@/lib/convex/client";
import { api } from "@convex/_generated/api";

/**
 * GET /api/events/[id] — Get single event with reports and articles.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const convex = getConvexClient();
    const event = await convex.query(api.events.getById, { id: id as any });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch event", details: error.message },
      { status: 500 },
    );
  }
}
