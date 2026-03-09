#!/usr/bin/env node

/**
 * Reddit Pain Point Scraper — Main Orchestrator
 *
 * Usage: node server/scrape.js [--subreddit=name] [--limit=50]
 *
 * Scrapes Reddit for pain points, analyzes with GPT-4, scores, and stores in Supabase.
 */

import { fetchSubredditPosts } from './redditClient.js'
import { analyzePosts } from './analyzer.js'
import { enrichWithStats } from './scorer.js'
import { upsertPainPoint, getActiveSubreddits, getPainPointCount } from './db.js'
import dotenv from 'dotenv'

dotenv.config()

// Parse CLI args
const args = Object.fromEntries(
    process.argv.slice(2)
        .filter(a => a.startsWith('--'))
        .map(a => a.replace('--', '').split('='))
)

export async function scrapeAll(options = {}) {
    const startTime = Date.now()
    const limit = parseInt(options.limit || args.limit || '50')

    console.log('═══════════════════════════════════════════')
    console.log('  Reddit Pain Point Scraper')
    console.log('═══════════════════════════════════════════')
    console.log()

    // Validate credentials
    const missing = []
    if (!process.env.REDDIT_CLIENT_ID) missing.push('REDDIT_CLIENT_ID')
    if (!process.env.REDDIT_CLIENT_SECRET) missing.push('REDDIT_CLIENT_SECRET')
    if (!process.env.REDDIT_USERNAME) missing.push('REDDIT_USERNAME')
    if (!process.env.REDDIT_PASSWORD) missing.push('REDDIT_PASSWORD')
    if (!process.env.OPENAI_API_KEY) missing.push('OPENAI_API_KEY')
    if (!process.env.VITE_SUPABASE_URL) missing.push('VITE_SUPABASE_URL')

    if (missing.length) {
        console.error('✗ Missing required environment variables:')
        missing.forEach(v => console.error(`  - ${v}`))
        console.error('\nCopy .env.example to .env and fill in your credentials.')
        process.exit(1)
    }

    // Determine subreddits to scrape
    let subreddits
    if (options.subreddit || args.subreddit) {
        subreddits = [(options.subreddit || args.subreddit)]
    } else {
        subreddits = await getActiveSubreddits()
    }

    console.log(`Subreddits: ${subreddits.join(', ')}`)
    console.log(`Posts per subreddit: ${limit}`)

    const beforeCount = await getPainPointCount()
    let totalPosts = 0
    let totalPainPoints = 0
    let totalStored = 0

    for (const subreddit of subreddits) {
        console.log(`\n▸ Scraping r/${subreddit}...`)

        // Step 1: Fetch and keyword-filter posts
        const posts = await fetchSubredditPosts(subreddit, limit)
        totalPosts += posts.length

        if (!posts.length) {
            console.log('  No matching posts found, skipping.')
            continue
        }

        // Step 2: AI analysis
        console.log(`  Sending ${posts.length} posts to GPT for analysis...`)
        const painPoints = await analyzePosts(posts)
        totalPainPoints += painPoints.length

        if (!painPoints.length) {
            console.log('  No pain points extracted.')
            continue
        }

        console.log(`  Extracted ${painPoints.length} pain points`)

        // Step 3: Score and store
        for (const pp of painPoints) {
            const enriched = enrichWithStats(pp, pp.source_posts || [])
            // Default subreddit if not set
            if (!enriched.subreddit || enriched.subreddit === 'unknown') {
                enriched.subreddit = subreddit
            }

            const stored = await upsertPainPoint(enriched)
            if (stored) {
                totalStored++
                console.log(`    ✓ "${enriched.title}" (score: ${enriched.trending_score})`)
            }
        }
    }

    const afterCount = await getPainPointCount()
    const duration = ((Date.now() - startTime) / 1000).toFixed(1)

    console.log('\n═══════════════════════════════════════════')
    console.log('  Results')
    console.log('═══════════════════════════════════════════')
    console.log(`  Posts scanned:      ${totalPosts}`)
    console.log(`  Pain points found:  ${totalPainPoints}`)
    console.log(`  Stored/updated:     ${totalStored}`)
    console.log(`  Total in database:  ${afterCount} (was ${beforeCount})`)
    console.log(`  Duration:           ${duration}s`)
    console.log()

    return {
        posts_scanned: totalPosts,
        pain_points_found: totalPainPoints,
        stored: totalStored,
        total_in_db: afterCount,
        duration_seconds: parseFloat(duration)
    }
}

// Run if called directly
const isMainModule = process.argv[1]?.includes('scrape.js')
if (isMainModule) {
    scrapeAll().catch(err => {
        console.error('Fatal error:', err)
        process.exit(1)
    })
}
