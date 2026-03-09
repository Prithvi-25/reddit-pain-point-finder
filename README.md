# Reddit Pain Point Finder

> Automated product discovery tool that scrapes Reddit for pain points, uses AI to analyze and cluster them, and surfaces trending opportunities.

**[Live Demo →](https://reddit-pain-point-finder.vercel.app/)** *(Demo link — deploy to Vercel for your own instance)*

---

## Features

- 🔍 **Smart Scraping** — Scrapes 9 subreddits with 25+ keyword patterns
- 🤖 **AI-Powered Analysis** — GPT-4o-mini extracts and categorizes each pain point
- 📊 **Multi-Factor Trending Score** — Recency, engagement, and willingness-to-pay composite
- 🎯 **Real-Time Search & Filters** — Search, category filter, and sort by multiple criteria
- 📈 **Trending Visualization** — Interactive chart showing pain points over time
- 💾 **CSV Export** — Download filtered results for analysis
- 🌐 **Demo Mode** — Works offline with realistic mock data

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Scraper** | Node.js + snoowrap (Reddit API) |
| **AI Analysis** | OpenAI GPT-4o-mini |
| **Database** | Supabase (PostgreSQL) |
| **Frontend** | React 18 + Vite |
| **Charts** | Recharts |

## Quick Start

```bash
# Install dependencies
npm install

# Run in demo mode (no credentials needed)
npm run dev

# Visit http://localhost:5173
```

## Live Mode Setup

1. Copy `.env.example` to `.env`
2. Create a Reddit "script" app at [reddit.com/prefs/apps](https://reddit.com/prefs/apps)
3. Get an OpenAI API key at [platform.openai.com](https://platform.openai.com)
4. Create a Supabase project and run `database/schema.sql`
5. Fill in all credentials in `.env`

```bash
# Run the scraper (fetches real Reddit data)
npm run scrape

# Or start the API server for manual refresh from the dashboard
npm run server    # runs on port 3001
npm run dev       # runs frontend on port 5173
```

## How It Works

```
Reddit API → Keyword Filter → GPT-4o-mini Analysis → Trending Score → Supabase → React Dashboard
```

1. **Scraper** fetches hot + new posts from 9 subreddits via Reddit API
2. **Keyword filter** matches 25+ pain-point regex patterns (wish, frustrated, need, etc.)
3. **GPT-4o-mini** extracts title, description, category, and willingness-to-pay score
4. **Trending score** calculated: recency × engagement × WTP signals
5. **Supabase** stores with deduplication (upsert on title + subreddit)
6. **React dashboard** displays results with search, filters, and charts

## Project Structure

```
reddit-pain-point-finder/
├── server/
│   ├── redditClient.js   # Reddit OAuth2 + keyword filtering
│   ├── analyzer.js        # GPT-4o-mini pain point extraction
│   ├── scorer.js          # Trending score calculation
│   ├── db.js              # Supabase server-side client
│   ├── scrape.js          # Main orchestrator CLI
│   └── webhook.js         # Express API for manual refresh
├── database/
│   └── schema.sql
├── docs/
│   ├── EXTERNAL_SERVICES_SETUP.md
│   └── USER_GUIDE.md
├── src/
│   ├── components/        # 7 React components
│   ├── data/mockData.js   # Demo mode data
│   ├── hooks/usePainPoints.js
│   ├── lib/supabase.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

## npm Scripts

| Script | Description |
|--------|------------|
| `npm run dev` | Start Vite dev server (frontend) |
| `npm run scrape` | Run Reddit scraper CLI |
| `npm run server` | Start Express API (port 3001) |
| `npm run build` | Production build |

## Author

**Prithvi** — [Portfolio](https://prithvi-25.github.io/)
