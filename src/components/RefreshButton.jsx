import { RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { isDemoMode } from '../lib/supabase'

export function RefreshButton({ onRefresh }) {
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState('')

    const handleRefresh = async () => {
        setLoading(true)

        if (isDemoMode) {
            setStatus('Simulating refresh...')
            await new Promise(resolve => setTimeout(resolve, 1500))
            setStatus('✓ Demo data refreshed')
            onRefresh()
            setTimeout(() => {
                setStatus('')
                setLoading(false)
            }, 2000)
            return
        }

        setStatus('Scraping Reddit for pain points...')
        try {
            // Use local API server, or n8n webhook if configured
            const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:3001/api/refresh'
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })
            const data = await response.json()
            setStatus(`✓ ${data.message || 'Refresh completed'}`)
            setTimeout(() => {
                onRefresh()
                setStatus('')
            }, 2000)
        } catch (err) {
            setStatus(`✗ Error: ${err.message}`)
        } finally {
            setTimeout(() => setLoading(false), 2000)
        }
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
                className="btn btn-primary"
                onClick={handleRefresh}
                disabled={loading}
                id="refresh-data-btn"
            >
                <RefreshCw size={16} className={loading ? 'spinner' : ''} />
                {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
            {status && <span className="status-text">{status}</span>}
        </div>
    )
}
