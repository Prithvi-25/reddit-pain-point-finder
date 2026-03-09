import { TrendingUp, ThumbsUp, MessageCircle, Repeat } from 'lucide-react'

const categoryToClass = (category) => {
    const map = {
        'Product-Market Fit': 'product-market-fit',
        'User Experience': 'user-experience',
        'Pricing': 'pricing',
        'Competition': 'competition',
        'Ease of Use': 'ease-of-use',
        'Technical Issues': 'technical-issues',
        'Integrations': 'integrations',
        'Onboarding': 'onboarding',
        'Customer Support': 'customer-support'
    }
    return map[category] || 'default'
}

export function PainPointCard({ painPoint, onClick }) {
    return (
        <div className="pain-point-card" onClick={onClick}>
            <div className="card-header">
                <h3 className="card-title">{painPoint.title}</h3>
                <div className="trending-score">
                    <TrendingUp />
                    <span>{painPoint.trending_score}</span>
                </div>
            </div>

            <span className={`category-badge ${categoryToClass(painPoint.category)}`}>
                {painPoint.category}
            </span>

            <p className="card-description">{painPoint.description}</p>

            <div className="card-meta">
                <div className="meta-item">
                    <ThumbsUp />
                    <span>{painPoint.avg_upvotes}</span>
                </div>
                <div className="meta-item">
                    <MessageCircle />
                    <span>{painPoint.avg_comments}</span>
                </div>
                <div className="meta-item">
                    <span>r/{painPoint.subreddit}</span>
                </div>
                <div className="meta-item">
                    <Repeat size={14} />
                    <span>{painPoint.mention_count}× voiced</span>
                </div>
                {painPoint.willingness_to_pay_score >= 7 && (
                    <span className="wtp-badge">💰 High WTP</span>
                )}
            </div>
        </div>
    )
}
