# Lyric Analysis

Tracks and ranks songs by their lyrical characteristics — vocabulary uniqueness, total word count, average word length, and more. Search any song via the Musixmatch API, submit it, and see how it stacks up on five leaderboards.

The uniqueness ratio is simply unique words ÷ total words × 100. A good score is 40%+; average is closer to 25%. Daft Punk's *Around the World* scores under 1%.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- A [Musixmatch API key](https://developer.musixmatch.com/) (free tier is fine)

## Setup

### 1. Install dependencies

```bash
# Frontend (Angular)
npm install

# Backend
cd server && npm install
```

### 2. Configure the backend

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/lyric_analysis"
MUSIXMATCH_API_KEY="your_key_here"
```

### 3. Create the database schema

```bash
cd server && npm run db:migrate
```

## Running locally

Start both servers in separate terminals:

```bash
# Terminal 1 — backend API (port 3000)
cd server && npm run dev

# Terminal 2 — Angular dev server (port 4200)
npm start
```

Open [http://localhost:4200](http://localhost:4200). The Angular dev server proxies all `/api` requests to the backend via `proxy.conf.json`.

## Running the tests

### Frontend — Angular/Karma

```bash
npm test
```

Runs all `*.spec.ts` files via Karma + Jasmine. Covers:

- `AppComponent` — shell renders nav links and `<router-outlet>`
- `SongService` — HTTP calls match correct URLs, methods, and request bodies
- `SearchComponent` — search/submit logic and template states (results, success card, error)
- `LeaderboardComponent` — metric tabs, `metricValue()` formatting, error handling

### Backend — Jest

```bash
cd server && npm test
```

Runs all `*.test.ts` files via Jest + ts-jest. No database or external API calls are made; Prisma and the Musixmatch client are mocked. Covers:

- `analyzeText()` — word counting, unique ratio, avg length, case folding, copyright stripping
- `GET /api/search` — param validation, query trimming, result forwarding, error handling
- `POST /api/songs` — deduplication, lyrics fetch, analysis pipeline, 422 on no lyrics
- `GET /api/leaderboard/:metric` — all five sort orders, 50-item cap, unknown metric rejection

Watch mode:

```bash
cd server && npm run test:watch
```

## Building for production

```bash
# Frontend → dist/
npm run build

# Backend → server/dist/
cd server && npm run build
node dist/index.js
```
