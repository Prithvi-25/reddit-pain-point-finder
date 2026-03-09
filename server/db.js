import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
)

/**
 * Upsert a pain point — insert new or update existing (matched by title + subreddit)
 */
export async function upsertPainPoint(painPoint) {
    const record = {
        title: painPoint.title,
        description: painPoint.description,
        category: painPoint.category,
        trending_score: painPoint.trending_score,
        mention_count: painPoint.mention_count,
        avg_upvotes: painPoint.avg_upvotes,
        avg_comments: painPoint.avg_comments,
        subreddit: painPoint.subreddit,
        willingness_to_pay_score: painPoint.willingness_to_pay_score,
        source_links: painPoint.source_links,
        created_at: painPoint.created_at,
        last_seen: painPoint.last_seen
    }

    const { data, error } = await supabase
        .from('pain_points')
        .upsert(record, {
            onConflict: 'title,subreddit',
            ignoreDuplicates: false
        })
        .select()

    if (error) {
        // If unique constraint fails, try updating by title match
        if (error.code === '23505') {
            const { data: updated, error: updateError } = await supabase
                .from('pain_points')
                .update({
                    trending_score: record.trending_score,
                    mention_count: record.mention_count,
                    avg_upvotes: record.avg_upvotes,
                    avg_comments: record.avg_comments,
                    last_seen: record.last_seen,
                    source_links: record.source_links
                })
                .eq('title', record.title)
                .eq('subreddit', record.subreddit)
                .select()

            if (updateError) {
                console.error(`    ✗ DB update error: ${updateError.message}`)
                return null
            }
            return updated?.[0]
        }
        console.error(`    ✗ DB upsert error: ${error.message}`)
        return null
    }

    return data?.[0]
}

/**
 * Get active subreddits to scrape
 */
export async function getActiveSubreddits() {
    const { data, error } = await supabase
        .from('user_subreddits')
        .select('subreddit_name')
        .eq('active', true)

    if (error) {
        console.error('Error fetching subreddits:', error.message)
        // Fallback to defaults
        return ['SaaS', 'startups', 'Entrepreneur', 'sidehustle', 'realestate', 'homeowners']
    }

    return data.map(r => r.subreddit_name)
}

/**
 * Get count of pain points in database
 */
export async function getPainPointCount() {
    const { count, error } = await supabase
        .from('pain_points')
        .select('*', { count: 'exact', head: true })

    return error ? 0 : count
}
