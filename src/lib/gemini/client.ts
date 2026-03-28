import { GoogleGenerativeAI } from "@google/generative-ai";

let instance: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (!instance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY is not set");
    instance = new GoogleGenerativeAI(key);
  }
  return instance;
}
