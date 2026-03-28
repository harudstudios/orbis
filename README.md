# Orbis — Real-Time Trust-Based Intelligence

Decentralized intelligence system where users act as real-time sensors. People report events from the real world through a mobile app, and the system transforms these raw signals into structured, verified, and visual intelligence on a live map dashboard.

## Architecture

```
Flutter App → POST /api/events (Firebase Auth)
                  ↓
              Next.js API Layer
                  ↓
        ┌─────────┼──────────┐
        ↓         ↓          ↓
    OpenAI    Convex DB    Apify/Exa
  (normalize   (store)    (enrich)
   + cluster)
        └─────────┼──────────┘
                  ↓
           Next.js Dashboard
          (Leaflet Map + UI)
```

## Tech Stack

| Layer           | Technology          |
| --------------- | ------------------- |
| Web Dashboard   | Next.js 16 (App Router), React 19, Tailwind CSS 4 |
| Map             | Leaflet + react-leaflet |
| Backend / DB    | Convex (real-time)  |
| Auth            | Firebase Admin (Google sign-in) |
| AI              | OpenAI GPT-4o-mini (normalization, clustering, summaries) |
| Search          | Exa (semantic web search) |
| Scraping        | Apify (Google News actor) |
| State           | Zustand             |
| Mobile          | Flutter (separate repo) |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment

Copy `.env.example` to `.env.local` and fill in your keys:

```bash
cp .env.example .env.local
```

| Variable | Where to get it |
| --- | --- |
| `NEXT_PUBLIC_CONVEX_URL` | Auto-set by `npx convex dev` |
| `CONVEX_DEPLOYMENT` | Auto-set by `npx convex dev` |
| `OPENAI_API_KEY` | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| `EXA_API_KEY` | [exa.ai/dashboard](https://exa.ai/dashboard) → API Keys |
| `APIFY_API_TOKEN` | [console.apify.com/account/integrations](https://console.apify.com/account/integrations) |

### 3. Firebase Auth

Place your `service-account-key.json` at the project root.

Get it from: Firebase Console → Project Settings → Service Accounts → Generate New Private Key.

### 4. Start Convex

```bash
npx convex dev
```

This syncs your schema, deploys functions, and auto-writes Convex env vars to `.env.local`.

### 5. Start Next.js

```bash
npm run dev
```

## API Endpoints

### Events

| Method | Route | Auth | Description |
| ------ | ----- | ---- | ----------- |
| `GET` | `/api/events` | No | List events. Query: `?category=crime&status=active&limit=50` |
| `POST` | `/api/events` | Firebase | Submit news. Normalizes via OpenAI, clusters similar events, enforces one-per-user-per-cluster |
| `GET` | `/api/events/[id]` | No | Single event with reports + articles |
| `GET` | `/api/events/nearby` | No | Events in radius. Query: `?lat=25.2&lon=55.3&radius=10&category=all` |

### Categories

| Method | Route | Auth | Description |
| ------ | ----- | ---- | ----------- |
| `GET` | `/api/categories` | No | All predefined categories (for app picker + dashboard filter) |

### Clusters

| Method | Route | Auth | Description |
| ------ | ----- | ---- | ----------- |
| `GET` | `/api/clusters` | No | List clusters. Query: `?category=crime&limit=20` |
| `GET` | `/api/clusters/[id]` | No | Cluster detail with all events |

### Articles

| Method | Route | Auth | Description |
| ------ | ----- | ---- | ----------- |
| `GET` | `/api/articles/[eventId]` | No | Related news articles. Auto-scrapes via Apify on first call. `?refresh=true` to re-scrape |

### Search

| Method | Route | Auth | Description |
| ------ | ----- | ---- | ----------- |
| `POST` | `/api/search` | No | Exa semantic web search. Body: `{ query, latitude?, longitude?, radiusKm?, numResults? }` |

## Event Submission Flow

```
1. User submits raw text + lat/lon + category + Firebase token
2. API verifies Firebase auth → extracts userId
3. OpenAI normalizes raw input → { title, description, summary }
4. System finds nearby active events (within 5km)
5. For each nearby event, OpenAI computes semantic similarity
6. If similarity ≥ 0.8 (same event):
   a. Check if user already reported to this cluster → 409 if yes
   b. Add report → trust score increases
7. If no match → create new cluster + event
8. Return result to mobile app
```

## Trust Score

```
Trust Score = Reports Count + (Articles Count × 2)
```

| Level | Score | Color |
| ----- | ----- | ----- |
| Low | 0–3 | Gray |
| Medium | 4–9 | Yellow |
| High | 10–19 | Green |
| Verified | 20+ | Blue |

## Categories

| ID | Label | Icon |
| -- | ----- | ---- |
| `accident` | Accident | 🚗 |
| `protest` | Protest | 📢 |
| `crime` | Crime | 🚨 |
| `natural_disaster` | Natural Disaster | 🌊 |
| `fire` | Fire | 🔥 |
| `infrastructure` | Infrastructure | 🏗️ |
| `health` | Health | 🏥 |
| `politics` | Politics | 🏛️ |
| `conflict` | Conflict | ⚔️ |
| `weather` | Weather | ⛈️ |
| `traffic` | Traffic | 🚦 |
| `environment` | Environment | 🌍 |
| `other` | Other | 📌 |

## Data Model (Convex)

**events** — Normalized news events
- `title`, `description`, `latitude`, `longitude`, `category`, `clusterId`
- `reportsCount`, `articlesCount`, `trustScore`, `status`, `userId`

**reports** — Raw user submissions linked to events
- `eventId`, `clusterId`, `rawInput`, `latitude`, `longitude`, `userId`

**clusters** — Groups of semantically similar nearby events
- `label`, `category`, `centerLatitude`, `centerLongitude`, `radius`
- `eventCount`, `aggregateTrustScore`

**articles** — External news articles from Apify/Exa
- `eventId`, `clusterId`, `url`, `headline`, `source`, `summary`

**userClusterSubmissions** — Dedup table (one submission per user per cluster)
- `userId`, `clusterId`, `eventId`

## Project Structure

```
orbis/
├── convex/                        # Convex backend
│   ├── schema.ts                  # Database schema (5 tables)
│   ├── events.ts                  # Event CRUD + queries
│   ├── reports.ts                 # Report submission + dedup check
│   ├── clusters.ts                # Cluster management
│   └── articles.ts                # Article storage + bulk insert
├── src/
│   ├── app/
│   │   ├── api/                   # REST API routes
│   │   │   ├── events/            # GET list, POST submit, GET [id], GET nearby
│   │   │   ├── categories/        # GET predefined categories
│   │   │   ├── clusters/          # GET list, GET [id]
│   │   │   ├── articles/          # GET [eventId] (auto-scrapes)
│   │   │   └── search/            # POST Exa semantic search
│   │   └── (dashboard)/           # Dashboard pages (map, events, analytics)
│   ├── lib/
│   │   ├── auth/verify.ts         # Firebase token verification
│   │   ├── firebase/admin.ts      # Firebase Admin SDK
│   │   ├── convex/client.ts       # ConvexHttpClient for API routes
│   │   ├── openai/                # Normalization + similarity + summaries
│   │   ├── exa/                   # Zone-scoped semantic web search
│   │   ├── apify/                 # Google News scraper
│   │   └── utils/                 # Geo (Haversine), trust score calc
│   ├── config/                    # Categories, constants, thresholds
│   ├── types/                     # TypeScript interfaces
│   ├── store/                     # Zustand (map state, filters)
│   └── hooks/                     # React hooks for Convex subscriptions
├── service-account-key.json       # Firebase (gitignored)
└── .env.local                     # API keys (gitignored)
```
