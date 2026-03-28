import { getApifyClient } from "./client";

interface ScrapedArticle {
  url: string;
  headline: string;
  source: string;
  summary?: string;
  publishedAt?: number;
}

/**
 * Uses the Apify Google News Scraper actor to find articles related to an event.
 * Actor ID: google-news-scraper (or use the specific one the user selected).
 */
export async function scrapeGoogleNews(
  searchQuery: string,
  maxArticles: number = 10,
): Promise<ScrapedArticle[]> {
  const client = getApifyClient();

  const run = await client.actor("trudax/google-news-scraper").call({
    query: searchQuery,
    maxItems: maxArticles,
    language: "en",
    extractBody: false,
  });

  const { items } = await client.dataset(run.defaultDatasetId).listItems();

  return items.map((item: any) => ({
    url: item.url || item.link || "",
    headline: item.title || "",
    source: item.source?.name || item.publisher || "Unknown",
    summary: item.snippet || item.description || undefined,
    publishedAt: item.publishedAt
      ? new Date(item.publishedAt).getTime()
      : undefined,
  }));
}

/**
 * Builds an optimal search query from event data for Google News.
 */
export function buildNewsQuery(
  title: string,
  category: string,
  description?: string,
): string {
  // Use the title as primary query; append category for context
  const query = `${title} ${category}`;
  return query.slice(0, 128);
}
