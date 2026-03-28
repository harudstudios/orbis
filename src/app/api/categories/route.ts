import { NextResponse } from "next/server";
import { CATEGORIES } from "@/config/categories";

/**
 * GET /api/categories — Returns all predefined event categories.
 * Used by the mobile app for the category picker and by the dashboard for filters.
 */
export async function GET() {
  const categories = Object.entries(CATEGORIES).map(([id, config]) => ({
    id,
    ...config,
  }));

  return NextResponse.json({ categories });
}
