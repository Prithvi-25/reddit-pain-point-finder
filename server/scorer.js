/**
 * Calculate trending score for a pain point based on multiple signals.
 *
 * Formula:
 *   (mentions × recency × 0.25)
 * + (avg_upvotes × 0.20)
 * + (avg_comments × 0.15)
 * + (engagement_normalized × 0.15)
 * + (willingness_to_pay × 0.25)
 */
export function calculateTrendingScore(painPoint) {
    const {
        mention_count = 1,
        avg_upvotes = 0,
        avg_comments = 0,
        willingness_to_pay_score = 0,
        created_at
    } = painPoint

    // Recency multiplier
    const daysOld = created_at
        ? (Date.now() - new Date(created_at).getTime()) / (1000 * 60 * 60 * 24)
        : 30

    let recencyMultiplier
    if (daysOld <= 7) recencyMultiplier = 3.0
    else if (daysOld <= 30) recencyMultiplier = 1.5
    else recencyMultiplier = 1.0

    // Normalize components to roughly 0-10 scale
    const mentionScore = Math.min(mention_count * recencyMultiplier, 30) // cap at 30
    const upvoteScore = Math.min(avg_upvotes / 10, 50) // 500 upvotes = max
    const commentScore = Math.min(avg_comments / 5, 30) // 150 comments = max
    const engagementScore = Math.min((avg_upvotes + avg_comments * 2) / 20, 30)
    const wtpScore = willingness_to_pay_score * 2 // 0-20 scale

    const score = (
        mentionScore * 0.25 +
        upvoteScore * 0.20 +
        commentScore * 0.15 +
        engagementScore * 0.15 +
        wtpScore * 0.25
    )

    return Math.round(score * 100) / 100
}

/**
 * Enrich a pain point with aggregated stats from its source posts
 */
export function enrichWithStats(painPoint, sourcePosts) {
    const scores = sourcePosts.map(p => p.score || 0)
    const comments = sourcePosts.map(p => p.num_comments || 0)

    const avg = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0

    // Find earliest and latest post dates
    const timestamps = sourcePosts
        .map(p => p.created_utc)
        .filter(Boolean)
        .sort()

    const enriched = {
        ...painPoint,
        mention_count: sourcePosts.length,
        avg_upvotes: Math.round(avg(scores)),
        avg_comments: Math.round(avg(comments)),
        subreddit: sourcePosts[0]?.subreddit || painPoint.subreddit || 'unknown',
        source_links: sourcePosts.map(p => p.url).filter(Boolean),
        created_at: timestamps[0] ? new Date(timestamps[0] * 1000).toISOString() : new Date().toISOString(),
        last_seen: timestamps.length
            ? new Date(timestamps[timestamps.length - 1] * 1000).toISOString()
            : new Date().toISOString()
    }

    enriched.trending_score = calculateTrendingScore(enriched)

    return enriched
}
