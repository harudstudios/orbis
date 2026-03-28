import { NextRequest, NextResponse } from "next/server";
import { getConvexClient } from "@/lib/convex/client";
import { api } from "@convex/_generated/api";

/**
 * GET /api/clusters — List active clusters.
 * Query params: category, limit
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || undefined;
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit")!)
    : undefined;

  try {
    const convex = getConvexClient();
    const clusters = await convex.query(api.clusters.list, {
      category,
      limit,
    });
    return NextResponse.json({ clusters });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch clusters", details: error.message },
      { status: 500 },
    );
  }
}
