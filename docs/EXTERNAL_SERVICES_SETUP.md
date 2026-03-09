# External Services Setup — Step-by-Step Guide

This guide walks you through setting up the 4 external services needed to make Reddit Pain Point Finder fully live. **The frontend works without these (demo mode), but you'll need all 4 to get real data.**

---

## 1. Supabase (Database) — ~5 minutes

Supabase provides a free PostgreSQL database to store your pain points.

### Steps

1. **Create account:** Go to [supabase.com](https://supabase.com) → Sign up (GitHub or email)
2. **Create project:**
   - Click **"New Project"**
   - Name: `reddit-pain-point-finder`
   - Generate a strong database password → **save it somewhere safe**
   - Region: Choose the one closest to you
   - Click **"Create new project"** (takes ~2 minutes)
3. **Run database schema:**
   - Go to **SQL Editor** (left sidebar)
   - Click **"New Query"**
   - Copy and paste the contents of `database/schema.sql`
   - Click **"Run"**
   - Verify: Go to **Table Editor** → you should see `pain_points` and `user_subreddits` tables
4. **Get your credentials:**
   - Go to **Settings → API** (left sidebar)
   - Copy **Project URL** → this is your `VITE_SUPABASE_URL`
   - Copy **anon public key** → this is your `VITE_SUPABASE_ANON_KEY`
5. **Update your `.env` file:**
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...your-key-here
   ```

---

## 2. Reddit API — ~3 minutes

Reddit's free API lets you scrape posts and comments from subreddits.

### Steps

1. **Create Reddit app:**
   - Go to [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps)
   - Scroll to bottom → click **"create another app"**
   - Name: `pain-point-scraper`
   - Type: Select **"script"**
   - Description: `Product discovery tool`
   - About URL: *(leave blank)*
   - Redirect URI: `http://localhost:8080`
   - Click **"create app"**
2. **Save your credentials:**
   - **Client ID:** The 14-character string shown under the app name
   - **Client Secret:** Click "edit" to reveal, copy the secret
   - **User Agent:** `pain-point-scraper:v1.0 (by /u/YOUR_REDDIT_USERNAME)`

> **Note:** You'll enter these when configuring n8n workflows (Step 4), not in the frontend .env file.

---

## 3. OpenAI API — ~3 minutes

OpenAI's GPT-4 analyzes Reddit posts to extract pain points and score willingness-to-pay.

### Steps

1. **Create account:** Go to [platform.openai.com](https://platform.openai.com) → Sign up
2. **Get API key:**
   - Go to **API Keys** (left sidebar)
   - Click **"Create new secret key"**
   - Name: `reddit-pain-point-finder`
   - Click **"Create secret key"**
   - **Copy key immediately** (it won't be shown again!)
3. **Set spending limits (important!):**
   - Go to **Settings → Limits**
   - Set **Monthly budget:** `$20`
   - Enable email notifications at `$15`

> **Cost estimate:** ~$0.01 per 10 posts analyzed = ~$10/month for 300 posts/day.

---

## 4. n8n Cloud (Workflow Automation) — ~15 minutes

n8n Cloud runs the automated scraping, filtering, and AI analysis workflows.

### Steps

1. **Create account:**
   - Go to [n8n.io](https://n8n.io) → Click **"Get Started Free"**
   - Sign up with email
   - Choose **"Cloud"** plan (free tier: 2,500 executions/month)
   - Verify email

2. **Add credentials to n8n:**
   - Go to **Credentials** (left sidebar) → Click **"Add Credential"**

   **Supabase (Postgres):**
   - Type: Search for `Postgres`
   - Name: `supabase-reddit-pain-points`
   - Host: *(from your Supabase connection string, e.g. `db.xxxx.supabase.co`)*
   - Database: `postgres`
   - User: `postgres`
   - Password: *(your Supabase DB password from Step 1)*
   - Port: `5432`
   - SSL: **Enable**
   - Click **"Save"**

   **OpenAI:**
   - Type: Search for `OpenAI`
   - Name: `openai-pain-point-analyzer`
   - API Key: *(paste your OpenAI key from Step 3)*
   - Click **"Save"**

3. **Create the Daily Scraper Workflow:**
   - Click **"Add Workflow"** → Name: `Reddit Pain Point Scraper - Daily`
   - Build the following node chain:

   ```
   Schedule Trigger (daily @ midnight)
     → Set Node (subreddits list)
       → Loop Over Items
         → HTTP Request (Reddit API with Basic Auth)
           → Code Node (parse + filter 60 days)
             → Code Node (keyword regex filter)
               → OpenAI Node (extract pain point)
                 → Code Node (calculate trending score)
                   → Postgres Node (upsert to Supabase)
   ```

   > **Tip:** The full n8n workflow configuration is documented in detail in the implementation plan at `docs/plans/2026-03-08-reddit-pain-point-finder-implementation.md` (Tasks 5-9).

4. **Create the Manual Refresh Webhook:**
   - Click **"Add Workflow"** → Name: `Reddit Pain Point Scraper - Manual Refresh`
   - Add a **Webhook** trigger node:
     - HTTP Method: `POST`
     - Path: `reddit-refresh`
   - Copy all nodes from the Daily Scraper workflow (except the Schedule Trigger)
   - Connect Webhook → first processing node
   - Add a **Respond to Webhook** node at the end
   - Click **"Listen for Test Event"** → copy the webhook URL
   - Toggle **Active** in top right

5. **Update your `.env` file:**
   ```
   VITE_N8N_WEBHOOK_URL=https://your-instance.app.n8n.cloud/webhook/reddit-refresh
   ```

---

## Verification Checklist

After setting up all 4 services:

- [ ] Supabase tables exist (`pain_points`, `user_subreddits`)
- [ ] Running `npm run dev` loads pain points from Supabase (not demo data)
- [ ] Clicking "Refresh Data" triggers n8n webhook and returns new pain points
- [ ] n8n daily workflow activates and runs at midnight
- [ ] OpenAI spending stays within $20/month budget

---

## Cost Summary

| Service | Tier | Monthly Cost |
|---------|------|-------------|
| Supabase | Free (500MB) | $0 |
| Reddit API | Free | $0 |
| n8n Cloud | Free (2,500 executions) | $0 |
| OpenAI API | Pay-as-you-go | ~$10 |
| Vercel (deployment) | Free | $0 |
| **Total** | | **~$10/month** |
