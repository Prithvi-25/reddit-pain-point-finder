# Reddit Pain Point Finder — User Guide

## Overview

This tool discovers product opportunities by analyzing Reddit conversations for pain points and unmet needs.

## Dashboard

The main dashboard shows pain point cards sorted by trending score. Each card displays:

- **Title** — AI-extracted summary of the pain point
- **Category Badge** — Color-coded category (UX, Pricing, Technical, etc.)
- **Trending Score** — Composite score based on multiple factors
- **Metadata** — Upvotes, comments, subreddit source
- **💰 High WTP** — Badge appears when willingness-to-pay ≥ 7/10

## Search & Filters

- **Search** — Type keywords to filter by title or description
- **Category** — Filter by pain point category
- **Sort options:**
  - Trending Score (default) — best composite signal
  - Most Recent — newest first
  - Willingness to Pay — strongest buying intent first
  - Most Upvotes — highest engagement first
  - Most Mentions — most frequently discussed

## Pain Point Details

Click any card to see the full modal with:

- Complete description
- Trending score breakdown (mentions, upvotes, comments, WTP score)
- Clickable source Reddit threads
- First/last seen dates

## Refresh Data

Click **"Refresh Data"** to trigger immediate scraping (runs n8n workflow on-demand).

## Export

Click **"Export CSV"** to download filtered pain points for analysis in Excel or Google Sheets.

---

## Trending Score Formula

```
score = (mentions × recency_multiplier × 0.25)
      + (avg_upvotes × 0.20)
      + (avg_comments × 0.15)
      + (subreddit_size_normalized × 0.15)
      + (willingness_to_pay × 0.25)
```

**Recency multiplier:**
- Last 7 days: **3.0×**
- 8–30 days: **1.5×**
- 31–60 days: **1.0×**

**Willingness to Pay (0–10):**
- 9–10: Explicit price mentioned (*"I'd pay $50/mo"*)
- 7–8: Strong intent (*"take my money"*, *"I would definitely pay"*)
- 4–6: Moderate interest
- 1–3: Weak/no buying intent

---

## Tips for Product Discovery

1. **High WTP + High Trending = Hot Opportunity** — Look for WTP ≥ 7 and trending score > 30
2. **Category Clustering** — If many pain points cluster in one category, it's a strong signal
3. **Read Source Threads** — Click through to Reddit to validate the pain point
4. **Export & Track** — Download CSV to track pain points over time in a spreadsheet
