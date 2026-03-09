import { BarChart3, TrendingUp, DollarSign, Layers } from 'lucide-react'

export function StatsBar({ painPoints }) {
    const totalPoints = painPoints.length
    const avgScore = totalPoints > 0
        ? (painPoints.reduce((sum, p) => sum + (p.trending_score || 0), 0) / totalPoints).toFixed(1)
        : 0
    const highWTP = painPoints.filter(p => p.willingness_to_pay_score >= 7).length
    const categories = new Set(painPoints.map(p => p.category)).size

    return (
        <div className="stats-bar">
            <div className="stat-card">
                <div className="stat-icon indigo">
                    <BarChart3 size={22} />
                </div>
                <div>
                    <div className="stat-value">{totalPoints}</div>
                    <div className="stat-label">Pain Points</div>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon cyan">
                    <TrendingUp size={22} />
                </div>
                <div>
                    <div className="stat-value">{avgScore}</div>
                    <div className="stat-label">Avg Trending Score</div>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon emerald">
                    <DollarSign size={22} />
                </div>
                <div>
                    <div className="stat-value">{highWTP}</div>
                    <div className="stat-label">High WTP (≥7)</div>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon amber">
                    <Layers size={22} />
                </div>
                <div>
                    <div className="stat-value">{categories}</div>
                    <div className="stat-label">Categories</div>
                </div>
            </div>
        </div>
    )
}
