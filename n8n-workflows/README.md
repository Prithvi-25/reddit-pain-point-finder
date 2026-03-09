# n8n Workflows — Import Guide

This directory contains two n8n workflows that scrape Reddit, analyze pain points with AI, and store results in Supabase.

---

## 📦 What's Included

| File | Workflow | Trigger | Purpose |
|------|----------|---------|---------|
| `1-daily-reddit-scraper.json` | Daily Scraper | Cron (midnight) | Automated daily scraping |
| `2-manual-refresh-webhook.json` | Manual Refresh | Webhook (POST) | On-demand refresh from frontend |

---

## 🚀 Quick Start

### Prerequisites

Before importing these workflows, you MUST have:

1. ✅ **n8n Cloud account** (free tier) — [n8n.io](https://n8n.io)
2. ✅ **Supabase project** with schema created
3. ✅ **Reddit API credentials** (Client ID + Secret)
4. ✅ **OpenAI API key**

If you don't have these yet, follow `docs/EXTERNAL_SERVICES_SETUP.md` first.

---

## Step 1: Add Credentials to n8n

Before importing workflows, add these 3 credentials:

### 1. Supabase (Postgres)

1. In n8n: **Credentials** → **Add Credential** → Search `Postgres`
2. **Name:** `supabase-reddit-pain-points` *(must match exactly!)*
3. Fill in:
   - **Host:** `db.yourproject.supabase.co` *(from Supabase connection string)*
   - **Database:** `postgres`
   - **User:** `postgres`
   - **Password:** *(your Supabase DB password)*
   - **Port:** `5432`
   - **SSL:** ✅ Enable
4. Click **Save**

### 2. Reddit API (HTTP Basic Auth)

1. In n8n: **Credentials** → **Add Credential** → Search `HTTP Basic Auth`
2. **Name:** `reddit-api-basic-auth` *(must match exactly!)*
3. Fill in:
   - **Username:** *(your Reddit Client ID)*
   - **Password:** *(your Reddit Client Secret)*
4. Click **Save**

### 3. OpenAI

1. In n8n: **Credentials** → **Add Credential** → Search `OpenAI`
2. **Name:** `openai-pain-point-analyzer` *(must match exactly!)*
3. Fill in:
   - **API Key:** *(your OpenAI API key)*
4. Click **Save**

> **Important:** The credential names MUST match exactly as shown above, or the imported workflows won't work.

---

## Step 2: Import Workflows

### Import Workflow 1: Daily Scraper

1. In n8n dashboard, click **Workflows** (left sidebar)
2. Click **⋮** (three dots, top right) → **Import from File**
3. Select `1-daily-reddit-scraper.json`
4. Click **Import**
5. The workflow will open automatically

### Import Workflow 2: Manual Refresh Webhook

1. Click **Workflows** → **⋮** → **Import from File**
2. Select `2-manual-refresh-webhook.json`
3. Click **Import**

---

## Step 3: Configure & Test Workflows

### Test Workflow 1 (Daily Scraper)

1. Open **"Reddit Pain Point Scraper - Daily"** workflow
2. Click **Execute Workflow** (top right)
3. **Wait 2-5 minutes** (it's scraping 9 subreddits + calling OpenAI)
4. Check the final node output → should show inserted pain points
5. Verify in Supabase:
   - Go to Supabase → **Table Editor** → `pain_points`
   - You should see new rows with Reddit data

**If it works:** ✅ Activate the workflow (toggle in top right)

**If it fails:** Check:
- Credential names match exactly
- Supabase schema was created
- Reddit API credentials are correct
- OpenAI API key is valid and has credits

### Test Workflow 2 (Manual Refresh Webhook)

1. Open **"Reddit Pain Point Scraper - Manual Refresh"** workflow
2. Find the **Webhook** node (first node)
3. Click **Listen for Test Event**
4. Copy the webhook URL shown (e.g., `https://yourinstance.app.n8n.cloud/webhook/reddit-refresh`)
5. **Test with curl:**

```bash
curl -X POST https://yourinstance.app.n8n.cloud/webhook/reddit-refresh
```

**Expected response:**

```json
{
  "status": "success",
  "message": "Refresh completed successfully",
  "pain_points_processed": 12,
  "timestamp": "2026-03-08T10:30:00.000Z"
}
```

**If it works:**
- ✅ Activate the workflow (toggle in top right)
- ✅ Copy the webhook URL

---

## Step 4: Connect Frontend to n8n Webhook

1. Open your Reddit Pain Point Finder `.env` file
2. Add the webhook URL:

```env
VITE_N8N_WEBHOOK_URL=https://yourinstance.app.n8n.cloud/webhook/reddit-refresh
```

3. Restart your dev server: `npm run dev`
4. Click **"Refresh Data"** button in the frontend
5. You should see:
   - Loading spinner
   - Success message
   - New pain points appear

---

## 📊 How the Workflows Work

### Data Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. TRIGGER (Schedule or Webhook)                        │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 2. SET SUBREDDITS LIST                                  │
│    [SaaS, startups, Entrepreneur, ...]                  │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 3. LOOP THROUGH SUBREDDITS (9 iterations)               │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 4. FETCH REDDIT API                                     │
│    GET /r/{subreddit}/hot.json?limit=100               │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 5. PARSE POSTS + FILTER LAST 60 DAYS                   │
│    Extract: title, body, upvotes, comments, etc.        │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 6. KEYWORD FILTER                                       │
│    Regex: "frustrated", "wish there was", etc.          │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 7. OPENAI ANALYSIS (GPT-4 Turbo)                       │
│    Extract: title, description, category, WTP score     │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 8. COMBINE DATA                                         │
│    Merge AI response + Reddit metadata                  │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 9. CALCULATE TRENDING SCORE                             │
│    Formula: mentions × recency + upvotes + WTP          │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 10. UPSERT TO SUPABASE                                  │
│     Insert new or update existing pain points           │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 11. RESPOND (Webhook only)                              │
│     Return JSON: {status, pain_points_processed}        │
└─────────────────────────────────────────────────────────┘
```

### Keyword Filters

The workflows filter for these pain point indicators:

- `frustrated with`
- `wish there was`
- `looking for a tool`
- `need a solution`
- `can't find`
- `struggling with`
- `tired of`
- `hate that`
- `anyone know of a`
- `is there a tool`
- `need a way to`
- `how do i`
- `better way to`

### Trending Score Formula

```javascript
trending_score =
  (mention_count × recency_multiplier × 0.25) +
  (avg_upvotes × 0.20) +
  (avg_comments × 0.15) +
  (subreddit_size_normalized × 0.15) +
  (willingness_to_pay_score × 0.25)
```

**Recency Multiplier:**
- Last 7 days: **3.0×**
- 8-30 days: **1.5×**
- 31-60 days: **1.0×**

---

## 🔧 Customization

### Change Subreddits

Edit the **"Set Subreddits"** node in both workflows:

```javascript
["SaaS", "startups", "Entrepreneur", "aiautomation", "sidehustle", "realestate", "n8n_ai_agents", "homeowners", "businessowners"]
```

Add or remove subreddits as needed.

### Change Schedule

In **Workflow 1**, edit the **Schedule Trigger** node:

- Current: `0 0 * * *` (daily at midnight)
- Every 12 hours: `0 */12 * * *`
- Twice a day: `0 0,12 * * *`

### Adjust Pain Point Keywords

Edit the **"Filter Pain Point Keywords"** node:

Add more regex patterns to the `painPointKeywords` array.

### Modify Trending Score Formula

Edit the **"Calculate Trending Score"** node:

Change the weights in the formula (currently: 0.25, 0.20, 0.15, 0.15, 0.25).

---

## 📈 Monitoring & Costs

### Monitor Workflow Executions

1. Go to n8n dashboard → **Executions** (left sidebar)
2. See all workflow runs with timestamps and status
3. Click any execution to see detailed logs

### Check OpenAI Usage

- Go to [platform.openai.com](https://platform.openai.com) → **Usage**
- Expected: ~$0.30/day for 300 posts analyzed
- Set budget alerts at $15 (will hit $20 monthly cap)

### n8n Free Tier Limits

- **2,500 executions/month**
- Daily workflow = ~30 executions/month (well under limit)
- If you hit limit, reduce frequency or upgrade

---

## ❌ Troubleshooting

### "Credential not found" Error

**Problem:** Credential names don't match

**Fix:** Rename credentials in n8n to match exactly:
- `supabase-reddit-pain-points`
- `reddit-api-basic-auth`
- `openai-pain-point-analyzer`

### "401 Unauthorized" from Reddit

**Problem:** Reddit API credentials incorrect

**Fix:**
1. Verify Client ID and Secret at [reddit.com/prefs/apps](https://reddit.com/prefs/apps)
2. Check HTTP Basic Auth credential uses:
   - Username = Client ID
   - Password = Client Secret

### "Connection failed" to Supabase

**Problem:** Postgres connection settings wrong

**Fix:**
1. Get connection string from Supabase → Settings → Database
2. Extract host (format: `db.xxxx.supabase.co`)
3. Verify SSL is enabled in n8n credential

### "OpenAI API rate limit exceeded"

**Problem:** Too many API calls too fast

**Fix:**
1. Reduce `limit=100` to `limit=50` in Reddit API URL
2. Add delay between subreddit loops
3. Check OpenAI dashboard for rate limits

### No Pain Points Appearing in Supabase

**Problem:** Posts not matching keyword filters or AI extraction failing

**Fix:**
1. Check **"Filter Pain Point Keywords"** node output → should have items
2. Check **"OpenAI Analyze Pain Point"** node output → verify JSON format
3. Temporarily remove keyword filter to see all posts
4. Check Supabase logs for SQL errors

---

## 🎯 Success Checklist

Before considering the setup complete:

- [ ] Both workflows imported successfully
- [ ] All 3 credentials added and working
- [ ] Daily Scraper workflow tested manually → data appears in Supabase
- [ ] Manual Refresh webhook tested with curl → returns success JSON
- [ ] Daily Scraper workflow activated (will run at midnight)
- [ ] Manual Refresh webhook activated and URL added to frontend `.env`
- [ ] Frontend "Refresh Data" button triggers webhook and shows new data
- [ ] OpenAI usage monitored (set $20 budget cap)

---

## 📚 Additional Resources

- **n8n Documentation:** [docs.n8n.io](https://docs.n8n.io)
- **Reddit API Docs:** [reddit.com/dev/api](https://www.reddit.com/dev/api/)
- **OpenAI API Docs:** [platform.openai.com/docs](https://platform.openai.com/docs)
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)

---

## 🚨 Important Notes

1. **Never commit credentials** — These workflow JSONs don't contain credentials (they reference them by name)
2. **Rate limits** — Reddit allows 60 requests/minute (workflow respects this)
3. **OpenAI costs** — ~$10/month for 300 posts/day. Monitor usage!
4. **Supabase free tier** — 500MB database (should last months before needing upgrade)
5. **HTTPS required** — Frontend must be HTTPS to call n8n webhook (Vercel handles this)

---

**Need help?** Check `docs/EXTERNAL_SERVICES_SETUP.md` for detailed service setup instructions.
