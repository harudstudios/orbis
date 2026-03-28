const ARTICLE_WEIGHT = 2;

/**
 * Trust Score = Reports Count + (Articles Count × Weight)
 * Higher trust = more corroborated from multiple sources.
 */
export function calculateTrustScore(
  reportsCount: number,
  articlesCount: number,
): number {
  return reportsCount + articlesCount * ARTICLE_WEIGHT;
}

export type TrustLevel = "low" | "medium" | "high" | "verified";

export function getTrustLevel(score: number): TrustLevel {
  if (score >= 20) return "verified";
  if (score >= 10) return "high";
  if (score >= 4) return "medium";
  return "low";
}
