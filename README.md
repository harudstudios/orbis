# Orbis — Real-Time Trust-Based News Intelligence

Decentralized intelligence system where users act as real-time sensors. People report events from the real world through a mobile app, and the system transforms these raw signals into structured, verified, and visual intelligence on a live map dashboard.

## Architecture

```
Flutter App → POST /api/events (Firebase Auth)
                  ↓
              Next.js API Layer
                  ↓
        ┌─────────┼──────────┐
        ↓         ↓          ↓
    Gemini     Convex DB   Apify/Exa
  (normalize   (store)    (enrich)
   + cluster)
        └─────────┼──────────┘
                  ↓
           Next.js Dashboard
       (Leaflet Map + Auth + UI)
```

## Tech Stack

| Layer           | Technology          |
| --------------- | ------------------- |
| Web Dashboard   | Next.js 16 (App Router), React 19, Tailwind CSS 4 |
| Map             | Leaflet + react-leaflet, Nominatim geocoding |
| Backend / DB    | Convex (real-time)  |
| Auth (backend)  | Firebase Admin (Google sign-in, token verification) |
| Auth (dashboard)| Firebase Client SDK (optional Google login, favorites) |
| AI              | Google Gemini Flash 2.5 (normalization, clustering, summaries) |
| Search          | Exa (semantic web search) |
| Scraping        | Apify REST API (Google News actor) |
| State           | Zustand (map, filters, theme, sidebar, auth) |
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
| `GEMINI_API_KEY` | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| `EXA_API_KEY` | [exa.ai/dashboard](https://exa.ai/dashboard) → API Keys |
| `APIFY_API_TOKEN` | [console.apify.com/account/integrations](https://console.apify.com/account/integrations) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console → Project Settings → General |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Console → Project Settings → General |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Console → Project Settings → General |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Console → Project Settings → General |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console → Project Settings → General |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase Console → Project Settings → General |

### 3. Firebase Auth

Place your `service-account-key.json` at the project root (for backend token verification).

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

## Dashboard Features

- **Live Map** — Full-screen interactive map with event markers, category filters, location search (Nominatim geocoding), custom zoom controls, and hover popups with click-to-navigate
- **Zone Explorer** — Click anywhere on the map to explore a zone with radius-based event filtering, Exa semantic search, and Apify-sourced related articles
- **Events** — Browse, filter, and search all events with trust badges, category icons, and article links
- **Analytics** — Overview stats, category breakdown, trust distribution, and top clusters
- **Favorites** — Logged-in users can favorite events from any page; viewable in a dedicated favorites tab
- **Settings** — Terms of Service, Privacy Policy, and About Orbis
- **Theme** — Light/dark mode toggle with persistent preference
- **Responsive** — Fully responsive across mobile, tablet, and desktop with collapsible icon-only sidebar
- **Optional Login** — Google sign-in via Firebase on the dashboard; not required to browse, only needed to favorite events

## API Endpoints

### Events

| Method | Route | Auth | Description |
| ------ | ----- | ---- | ----------- |
| `GET` | `/api/events` | No | List events. Query: `?category=crime&status=active&limit=50` |
| `POST` | `/api/events` | Firebase | Submit news. Normalizes via Gemini, clusters similar events, enforces one-per-user-per-cluster |
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
3. Gemini normalizes raw input → { title, description, summary }
4. System finds nearby active events (within 5km)
5. For each nearby event, Gemini computes semantic similarity
6. If similarity ≥ 0.8 (same event):
   a. Check if user already reported to this cluster → 409 if yes
   b. Add report → trust score increases
   c. Cluster aggregate trust is recalculated
7. If no match → create new cluster + event + initial report
8. Return result to mobile app
```

## Trust Score

```
Trust Score = Number of User Reports
```

Only real user reports from the mobile app increase the trust score. External articles fetched via Apify are tracked separately (`articlesCount`) for reference but do **not** affect the trust score.

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

**articles** — External news articles scraped via Apify
- `eventId`, `clusterId`, `url`, `headline`, `source`, `summary`

**favorites** — User-favorited events (dashboard login required)
- `userId`, `eventId`, `createdAt`

**userClusterSubmissions** — Dedup table (one submission per user per cluster)
- `userId`, `clusterId`, `eventId`

## Project Structure

```
orbis/
├── convex/                        # Convex backend
│   ├── schema.ts                  # Database schema (6 tables)
│   ├── events.ts                  # Event CRUD + queries
│   ├── reports.ts                 # Report submission + dedup check
│   ├── clusters.ts                # Cluster management
│   ├── articles.ts                # Article storage + bulk insert
│   └── favorites.ts               # Favorite toggle + queries
├── src/
│   ├── app/
│   │   ├── api/                   # REST API routes
│   │   │   ├── events/            # GET list, POST submit, GET [id], GET nearby
│   │   │   ├── categories/        # GET predefined categories
│   │   │   ├── clusters/          # GET list, GET [id]
│   │   │   ├── articles/          # GET [eventId] (auto-scrapes via Apify)
│   │   │   └── search/            # POST Exa semantic search
│   │   └── (dashboard)/           # Dashboard pages
│   │       ├── map/               # Live map with markers, search, zoom
│   │       ├── zone/              # Zone explorer with radius & Exa search
│   │       ├── events/            # Event list + detail pages
│   │       ├── analytics/         # Stats and breakdowns
│   │       ├── favorites/         # User favorites (login required)
│   │       ├── login/             # Optional Google sign-in
│   │       └── settings/          # Policies and about
│   ├── components/
│   │   ├── layout/sidebar.tsx     # Responsive sidebar with auth
│   │   ├── map/live-map.tsx       # Leaflet map with theme-aware tiles
│   │   ├── events/                # Event cards, trust badges, favorites
│   │   └── auth/                  # Auth init, login components
│   ├── lib/
│   │   ├── auth/verify.ts         # Firebase token verification
│   │   ├── firebase/admin.ts      # Firebase Admin SDK
│   │   ├── firebase/client.ts     # Firebase Client SDK (dashboard auth)
│   │   ├── convex/client.ts       # ConvexHttpClient for API routes
│   │   ├── gemini/                # Gemini normalization + similarity + summaries
│   │   ├── exa/                   # Zone-scoped semantic web search
│   │   ├── apify/                 # Google News scraper (REST API)
│   │   └── utils/                 # Geo (Haversine), trust score calc
│   ├── config/                    # Categories, constants, thresholds
│   ├── store/                     # Zustand (map, filters, theme, sidebar, auth)
│   └── hooks/                     # React hooks (Convex subscriptions, favorites, theme)
├── service-account-key.json       # Firebase (gitignored)
└── .env.local                     # API keys (gitignored)
```
