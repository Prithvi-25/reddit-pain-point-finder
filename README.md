# Reddit Pain Point Finder

> Automated product discovery tool that scrapes Reddit for pain points, uses AI to analyze and cluster them, and surfaces trending opportunities.

**[Live Demo →](#)** *(deploy to Vercel to get your live URL)*

---

## Features

- 🔍 **Smart Scraping** — Scrapes 9 subreddits for pain points (SaaS, startups, real estate, etc.)
- 🤖 **AI-Powered Analysis** — GPT-4 extracts and categorizes each pain point
- 📊 **Multi-Factor Trending Score** — Recency, engagement, and willingness-to-pay composite
- 🎯 **Real-Time Search & Filters** — Search, category filter, and sort by multiple criteria
- 📈 **Trending Visualization** — Interactive chart showing pain points over time
- 💾 **CSV Export** — Download filtered results for analysis
- 🌐 **Demo Mode** — Works offline with realistic mock data

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | n8n Cloud (scheduled workflows) |
| **Database** | Supabase (PostgreSQL) |
| **Frontend** | React 18 + Vite |
| **Charts** | Recharts |
| **AI** | OpenAI GPT-4 Turbo |
| **Deployment** | Vercel |

## Quick Start

```bash
# Install dependencies
npm install

# Run in demo mode (no credentials needed)
npm run dev

# Visit http://localhost:5173
```

## Connect Live Data

1. Copy `.env.example` to `.env`
2. Add your Supabase and n8n credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_N8N_WEBHOOK_URL=your_n8n_webhook_url
   ```
3. Run the database schema: `database/schema.sql` in Supabase SQL Editor
4. Set up n8n workflows (see `docs/EXTERNAL_SERVICES_SETUP.md`)

## How It Works

1. **n8n workflow** scrapes Reddit daily (or on-demand via webhook)
2. **Keyword filter** identifies potential pain points using regex patterns
3. **OpenAI GPT-4** analyzes, categorizes, and scores willingness-to-pay
4. **Trending score** calculated from recency × engagement × WTP signals
5. **Supabase** stores all data with deduplication
6. **React dashboard** displays results with search, filters, and charts

## Project Structure

```
reddit-pain-point-finder/
├── database/
│   └── schema.sql          # Supabase database schema
├── docs/
│   ├── EXTERNAL_SERVICES_SETUP.md
│   └── USER_GUIDE.md
├── src/
│   ├── components/
│   │   ├── ExportButton.jsx
│   │   ├── FilterBar.jsx
│   │   ├── PainPointCard.jsx
│   │   ├── PainPointModal.jsx
│   │   ├── RefreshButton.jsx
│   │   ├── StatsBar.jsx
│   │   └── TrendingChart.jsx
│   ├── data/
│   │   └── mockData.js     # Demo mode data
│   ├── hooks/
│   │   └── usePainPoints.js
│   ├── lib/
│   │   └── supabase.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

## Author

**Prithvi** — Product Manager
