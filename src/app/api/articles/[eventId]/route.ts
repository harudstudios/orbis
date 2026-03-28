import { NextRequest, NextResponse } from "next/server";
import { getConvexClient } from "@/lib/convex/client";
import { scrapeGoogleNews, buildNewsQuery } from "@/lib/apify/scraper";
import { api } from "@convex/_generated/api";

/**
 * GET /api/articles/[eventId] — Get related articles for an event.
 * If no articles exist yet, triggers Apify Google News scraping.
 * Query params: refresh=true to force re-scrape
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  const { eventId } = await params;
  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get("refresh") === "true";

  try {
    const convex = getConvexClient();

    // Get the event first
    const event = await convex.query(api.events.getById, {
      id: eventId as any,
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check for existing articles
    const existingArticles = await convex.query(api.articles.listByEvent, {
      eventId: eventId as any,
    });

    if (existingArticles.length > 0 && !forceRefresh) {
      return NextResponse.json({ articles: existingArticles, cached: true });
    }

    // Scrape Google News via Apify
    const query = buildNewsQuery(event.title, event.category, event.description);
    const scraped = await scrapeGoogleNews(query, 10);

    if (scraped.length === 0) {
      return NextResponse.json({ articles: existingArticles, cached: true });
    }

    // Store articles in Convex
    const articlesToInsert = scraped.map((article) => ({
      url: article.url,
      headline: article.headline,
      source: article.source,
      summary: article.summary,
      publishedAt: article.publishedAt,
    }));

    await convex.mutation(api.articles.bulkInsert, {
      eventId: eventId as any,
      clusterId: event.clusterId || undefined,
      articles: articlesToInsert,
    });

    // Fetch the updated list
    const updatedArticles = await convex.query(api.articles.listByEvent, {
      eventId: eventId as any,
    });

    return NextResponse.json({ articles: updatedArticles, cached: false });
  } catch (error: any) {
    console.error("GET /api/articles error:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles", details: error.message },
      { status: 500 },
    );
  }
}
