import { getGeminiClient } from "./client";

const MODEL = "gemini-2.5-flash";

interface NormalizedEvent {
  title: string;
  description: string;
  summary: string;
}

/**
 * Takes raw user input and normalizes it into structured event data.
 */
export async function normalizeEventInput(
  rawInput: string,
  category: string,
): Promise<NormalizedEvent> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({
    model: MODEL,
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  });

  const prompt = `You are a news normalization engine. Given raw user-reported text about a real-world event, produce a clean structured version. Return JSON with these fields:
- "title": A concise, news-headline-style title (max 15 words)
- "description": A clean, factual 2-3 sentence description of the event
- "summary": A single-sentence summary

Rules:
- Remove personal opinions, profanity, excessive punctuation
- Keep factual information: what happened, where, when
- Use neutral, journalistic tone
- Category context: ${category}

Raw input: ${rawInput}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  if (!text) throw new Error("Gemini returned empty response");

  return JSON.parse(text) as NormalizedEvent;
}

/**
 * Compares two event descriptions and returns a similarity score (0-1).
 */
export async function computeSemanticSimilarity(
  titleA: string,
  descriptionA: string,
  titleB: string,
  descriptionB: string,
): Promise<number> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({
    model: MODEL,
    generationConfig: { temperature: 0, responseMimeType: "application/json" },
  });

  const prompt = `You compare two news event reports and determine if they describe the same real-world event. Return JSON: { "similarity": <number 0.0 to 1.0>, "reasoning": "<brief explanation>" }

Scoring guide:
- 0.9-1.0: Definitely the same event
- 0.7-0.89: Very likely the same event, minor detail differences
- 0.4-0.69: Related topic but different specific events
- 0.0-0.39: Unrelated events

Event A:
Title: ${titleA}
Description: ${descriptionA}

Event B:
Title: ${titleB}
Description: ${descriptionB}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  if (!text) throw new Error("Gemini returned empty response");

  const parsed = JSON.parse(text);
  return parsed.similarity;
}

/**
 * Generates a merged summary when multiple reports describe the same event.
 */
export async function generateClusterSummary(
  eventDescriptions: string[],
): Promise<string> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({
    model: MODEL,
    generationConfig: { temperature: 0.3 },
  });

  const prompt = `You synthesize multiple reports of the same event into a single comprehensive summary. Be factual and concise (2-3 sentences). Mention the most corroborated details.

Multiple reports about the same event:

${eventDescriptions.map((d, i) => `Report ${i + 1}: ${d}`).join("\n\n")}

Write a merged summary:`;

  const result = await model.generateContent(prompt);
  return result.response.text() ?? "";
}
