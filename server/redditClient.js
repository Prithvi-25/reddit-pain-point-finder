import Snoowrap from 'snoowrap'
import dotenv from 'dotenv'

dotenv.config()

// Pain point keyword patterns
const PAIN_KEYWORDS = [
    /\bwish\b/i, /\bfrustrat/i, /\bhate\b/i, /\bannoy/i,
    /\bneed\b.*\btool\b/i, /\bneed\b.*\bapp\b/i, /\bneed\b.*\bsoftware\b/i,
    /\bpay\b.*\bfor\b/i, /\bwould pay\b/i, /\btake my money\b/i,
    /\bwhy\b.*\bno\b.*\btool\b/i, /\bwhy\b.*\bnobody\b/i,
    /\bpain\s*point/i, /\bstruggl/i, /\btedious/i, /\btime.?consuming/i,
    /\bmanual/i, /\bspreadsheet/i, /\bworkaround/i,
    /\bbroke/i, /\bcrash/i, /\bbug/i, /\bunreliable/i,
    /\bexpensive/i, /\boverpriced/i, /\bcost.*too/i,
    /\balternative/i, /\breplace/i, /\bswitch.*from/i,
    /\bcan't find\b/i, /\bdoesn't exist\b/i, /\bno good\b/i,
    /\bshould\b.*\bbe\b/i, /\bif only\b/i,
    /\b(startup|saas|app)\b.*\bidea/i,
    /\bwilling to pay\b/i, /\bshut up and take\b/i
]

let reddit = null

function getClient() {
    if (reddit) return reddit

    reddit = new Snoowrap({
        userAgent: `reddit-pain-point-finder:v1.0 (by /u/${process.env.REDDIT_USERNAME})`,
        clientId: process.env.REDDIT_CLIENT_ID,
        clientSecret: process.env.REDDIT_CLIENT_SECRET,
        username: process.env.REDDIT_USERNAME,
        password: process.env.REDDIT_PASSWORD
    })

    // Rate limiting — snoowrap handles this automatically
    reddit.config({
        requestDelay: 1100, // ~55 requests/min (under 60 limit)
        continueAfterRatelimitError: true,
        warnings: false
    })

    return reddit
}

/**
 * Fetch recent posts from a subreddit
 * @param {string} subreddit - subreddit name (without r/)
 * @param {number} limit - max posts to fetch (default 50)
 * @returns {Array} filtered posts matching pain point keywords
 */
export async function fetchSubredditPosts(subreddit, limit = 50) {
    const client = getClient()
    const sixtyDaysAgo = Date.now() / 1000 - 60 * 24 * 60 * 60

    try {
        // Fetch from hot + new for broader coverage
        const [hotPosts, newPosts] = await Promise.all([
            client.getSubreddit(subreddit).getHot({ limit: Math.ceil(limit / 2) }),
            client.getSubreddit(subreddit).getNew({ limit: Math.ceil(limit / 2) })
        ])

        // Deduplicate by ID
        const seen = new Set()
        const allPosts = [...hotPosts, ...newPosts].filter(post => {
            if (seen.has(post.id)) return false
            seen.add(post.id)
            return true
        })

        // Filter: recent + matches pain keywords
        const filtered = allPosts.filter(post => {
            // Must be within last 60 days
            if (post.created_utc < sixtyDaysAgo) return false

            // Check title + selftext against keywords
            const text = `${post.title} ${post.selftext || ''}`
            return PAIN_KEYWORDS.some(regex => regex.test(text))
        })

        console.log(`  r/${subreddit}: ${allPosts.length} posts → ${filtered.length} pain point candidates`)

        return filtered.map(post => ({
            id: post.id,
            title: post.title,
            selftext: (post.selftext || '').slice(0, 2000), // Truncate for GPT context window
            subreddit: post.subreddit.display_name,
            url: `https://reddit.com${post.permalink}`,
            score: post.score,
            num_comments: post.num_comments,
            created_utc: post.created_utc
        }))
    } catch (err) {
        console.error(`  ✗ Error fetching r/${subreddit}:`, err.message)
        return []
    }
}

/**
 * Fetch top comments for a post (for additional context)
 * @param {string} postId - Reddit post ID
 * @param {number} limit - max comments
 */
export async function fetchPostComments(postId, limit = 5) {
    const client = getClient()
    try {
        const submission = client.getSubmission(postId)
        const comments = await submission.expandReplies({ limit, depth: 1 })
        return comments.comments
            .slice(0, limit)
            .map(c => c.body?.slice(0, 500) || '')
            .filter(Boolean)
    } catch {
        return []
    }
}
