import { Download } from 'lucide-react'

export function ExportButton({ painPoints }) {
    const handleExport = () => {
        const headers = [
            'Title',
            'Description',
            'Category',
            'Trending Score',
            'Mentions',
            'Avg Upvotes',
            'Avg Comments',
            'Subreddit',
            'Willingness to Pay',
            'Created At',
            'Last Seen',
            'Source Link'
        ]

        const rows = painPoints.map(p => [
            `"${(p.title || '').replace(/"/g, '""')}"`,
            `"${(p.description || '').replace(/"/g, '""')}"`,
            p.category,
            p.trending_score,
            p.mention_count,
            p.avg_upvotes,
            p.avg_comments,
            p.subreddit,
            p.willingness_to_pay_score,
            new Date(p.created_at).toLocaleDateString(),
            new Date(p.last_seen).toLocaleDateString(),
            p.source_links?.[0] || ''
        ])

        const csv = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n')

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `reddit-pain-points-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <button
            className="btn btn-secondary"
            onClick={handleExport}
            id="export-csv-btn"
        >
            <Download size={16} />
            Export CSV
        </button>
    )
}
