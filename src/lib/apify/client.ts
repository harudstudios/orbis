import { ApifyClient } from "apify-client";

let apifyInstance: ApifyClient | null = null;

export function getApifyClient(): ApifyClient {
  if (!apifyInstance) {
    apifyInstance = new ApifyClient({
      token: process.env.APIFY_API_TOKEN,
    });
  }
  return apifyInstance;
}
