interface ScrapedArticle {
  url: string;
  headline: string;
  source: string;
  summary?: string;
  publishedAt?: number;
}

const ACTOR_ID = "eWUEW5YpCaCBAa0Zs";
const APIFY_BASE = "https://api.apify.com/v2";

/**
 * Calls the Apify Google News actor via REST API (no apify-client needed).
 * This avoids Turbopack's "expression is too dynamic" issue.
 */
export async function scrapeGoogleNews(
  searchQuery: string,
  maxArticles: number = 10,
): Promise<ScrapedArticle[]> {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) throw new Error("APIFY_API_TOKEN is not set");

  // Start the actor run and wait for it to finish
  const runRes = await fetch(
    `${APIFY_BASE}/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: searchQuery,
        topics: [],
        topicsHashed: [],
        language: "US:en",
        maxItems: maxArticles,
        fetchArticleDetails: true,
        proxyConfiguration: { useApifyProxy: true },
      }),
    },
  );

  if (!runRes.ok) {
    const errorText = await runRes.text();
    throw new Error(`Apify API error (${runRes.status}): ${errorText}`);
  }

  const items: any[] = await runRes.json();

  return items.map((item: any) => ({
    url: item.url || item.link || "",
    headline: item.title || item.headline || "",
    source: item.source?.name || item.source || item.publisher || "Unknown",
    summary: item.snippet || item.description || item.content?.slice(0, 300) || undefined,
    publishedAt: item.publishedAt || item.publishDate || item.date
      ? new Date(item.publishedAt || item.publishDate || item.date).getTime()
      : undefined,
  }));
}

export function buildNewsQuery(
  title: string,
  category: string,
  _description?: string,
): string {
  return `${title} ${category}`.slice(0, 128);
}
