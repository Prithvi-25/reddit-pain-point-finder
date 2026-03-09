import express from 'express'
import cors from 'cors'
import { scrapeAll } from './scrape.js'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Manual refresh endpoint — triggers full scrape
app.post('/api/refresh', async (req, res) => {
    console.log('\n📡 Manual refresh triggered via webhook')

    try {
        const { subreddit, limit } = req.body || {}
        const results = await scrapeAll({ subreddit, limit })

        res.json({
            message: `Scraped ${results.pain_points_found} pain points, stored ${results.stored}`,
            ...results
        })
    } catch (err) {
        console.error('Refresh error:', err)
        res.status(500).json({ error: err.message })
    }
})

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Pain Point Finder API running on http://localhost:${PORT}`)
    console.log(`   POST /api/refresh  — trigger scrape`)
    console.log(`   GET  /api/health   — health check\n`)
})
