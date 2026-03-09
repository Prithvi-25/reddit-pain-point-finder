import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SYSTEM_PROMPT = `You are a product analyst. Given Reddit posts, extract pain points that represent real product opportunities.

For each post that contains a genuine pain point, extract:
1. title: A clear, actionable pain point title (max 80 chars)
2. description: 2-3 sentence summary of the problem users face
3. category: One of: "Product-Market Fit", "User Experience", "Pricing", "Competition", "Ease of Use", "Technical Issues", "Integrations", "Onboarding", "Customer Support"
4. willingness_to_pay_score: 0-10 scale based on buying intent signals:
   - 9-10: Explicit price mentioned ("I'd pay $X for this")
   - 7-8: Strong intent ("take my money", "would definitely pay")
   - 4-6: Moderate interest (clearly wants a solution, mentions budget)
   - 1-3: Weak/no buying intent (just venting, no solution sought)

Skip posts that are:
- Just memes, jokes, or shitposts
- Self-promotion or product launches
- General discussion without a clear pain point
- Already solved by widely-known tools

Return a JSON array of extracted pain points. Return an empty array [] if no genuine pain points found.`

/**
 * Analyze a batch of Reddit posts using GPT-4
 * @param {Array} posts - Array of {title, selftext, subreddit, url, score, num_comments}
 * @returns {Array} Extracted pain points
 */
export async function analyzePosts(posts) {
    if (!posts.length) return []

    // Process in batches of 5 to balance cost vs context
    const batchSize = 5
    const results = []

    for (let i = 0; i < posts.length; i += batchSize) {
        const batch = posts.slice(i, i + batchSize)
        const batchNum = Math.floor(i / batchSize) + 1
        const totalBatches = Math.ceil(posts.length / batchSize)

        console.log(`    Analyzing batch ${batchNum}/${totalBatches} (${batch.length} posts)...`)

        const userMessage = batch.map((post, idx) =>
            `--- POST ${idx + 1} ---
Subreddit: r/${post.subreddit}
Title: ${post.title}
Score: ${post.score} upvotes, ${post.num_comments} comments
URL: ${post.url}
Body: ${post.selftext || '(no body text)'}
`
        ).join('\n')

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini', // Cost-effective, still very good at extraction
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: userMessage }
                ],
                response_format: { type: 'json_object' },
                temperature: 0.3, // Low temp for consistent extraction
                max_tokens: 2000
            })

            const content = response.choices[0].message.content
            const parsed = JSON.parse(content)

            // Handle both {pain_points: [...]} and [...] formats
            const painPoints = Array.isArray(parsed) ? parsed : (parsed.pain_points || parsed.results || [])

            // Attach source metadata
            const enriched = painPoints.map(pp => ({
                ...pp,
                source_posts: batch.map(p => ({
                    url: p.url,
                    subreddit: p.subreddit,
                    score: p.score,
                    num_comments: p.num_comments,
                    created_utc: p.created_utc
                }))
            }))

            results.push(...enriched)
        } catch (err) {
            console.error(`    ✗ GPT analysis error (batch ${batchNum}):`, err.message)
        }
    }

    return results
}
