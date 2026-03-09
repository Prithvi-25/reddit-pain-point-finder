import { useMemo } from 'react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, AreaChart, Area
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
        <div style={{
            background: '#1F2937',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            padding: '12px 16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
        }}>
            <p style={{ color: '#f1f5f9', fontSize: '0.82rem', fontWeight: 600, marginBottom: 4 }}>
                {label}
            </p>
            <p style={{ color: '#6366f1', fontSize: '0.9rem', fontWeight: 700 }}>
                {payload[0].value} pain point{payload[0].value !== 1 ? 's' : ''}
            </p>
        </div>
    )
}

export function TrendingChart({ painPoints }) {
    const chartData = useMemo(() => {
        const dateMap = new Map()

        painPoints.forEach(point => {
            const date = new Date(point.created_at)
            const key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            dateMap.set(key, (dateMap.get(key) || 0) + 1)
        })

        return Array.from(dateMap.entries())
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(a.date + ', 2026') - new Date(b.date + ', 2026'))
    }, [painPoints])

    if (chartData.length === 0) return null

    return (
        <div className="chart-container">
            <div className="chart-header">
                <h2 className="chart-title">Pain Points Over Time</h2>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Last 60 days
                </span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.04)"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="date"
                        stroke="#64748b"
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                        tickLine={false}
                    />
                    <YAxis
                        stroke="#64748b"
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#6366f1"
                        strokeWidth={2.5}
                        fill="url(#colorCount)"
                        dot={{ fill: '#6366f1', r: 4, strokeWidth: 2, stroke: '#1a1f35' }}
                        activeDot={{ r: 6, fill: '#818cf8', stroke: '#6366f1', strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
