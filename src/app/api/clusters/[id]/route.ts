import { NextRequest, NextResponse } from "next/server";
import { getConvexClient } from "@/lib/convex/client";
import { api } from "@convex/_generated/api";

/**
 * GET /api/clusters/[id] — Get cluster detail with all its events.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const convex = getConvexClient();
    const cluster = await convex.query(api.clusters.getById, {
      id: id as any,
    });

    if (!cluster) {
      return NextResponse.json(
        { error: "Cluster not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ cluster });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch cluster", details: error.message },
      { status: 500 },
    );
  }
}
