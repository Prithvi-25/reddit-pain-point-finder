import { X, ExternalLink, TrendingUp, Calendar } from 'lucide-react'
import { useEffect } from 'react'

export function PainPointModal({ painPoint, onClose }) {
    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', handleEsc)
        return () => document.removeEventListener('keydown', handleEsc)
    }, [onClose])

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [])

    if (!painPoint) return null

    const wtpClass = painPoint.willingness_to_pay_score >= 7 ? 'high' : ''

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <div>
                        <h2 className="modal-title">{painPoint.title}</h2>
                        <div className="modal-meta">
                            <span className={`category-badge ${getCategoryClass(painPoint.category)}`}>
                                {painPoint.category}
                            </span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                r/{painPoint.subreddit}
                            </span>
                        </div>
                    </div>
                    <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
                        <X size={22} />
                    </button>
                </div>

                {/* Body */}
                <div className="modal-body">
                    {/* Trending Score Breakdown */}
                    <div className="score-breakdown">
                        <div className="score-breakdown-header">
                            <TrendingUp size={20} style={{ color: 'var(--accent-indigo)' }} />
                            <h3>Trending Score</h3>
                            <span className="score-breakdown-value">{painPoint.trending_score}</span>
                        </div>
                        <div>
                            <div className="score-row">
                                <span className="label">Mentions</span>
                                <span className="value">{painPoint.mention_count}</span>
                            </div>
                            <div className="score-row">
                                <span className="label">Avg Upvotes</span>
                                <span className="value">{painPoint.avg_upvotes}</span>
                            </div>
                            <div className="score-row">
                                <span className="label">Avg Comments</span>
                                <span className="value">{painPoint.avg_comments}</span>
                            </div>
                            <div className="score-row">
                                <span className="label">Willingness to Pay</span>
                                <span className={`value ${wtpClass}`}>
                                    {painPoint.willingness_to_pay_score}/10
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="modal-section">
                        <h3>Description</h3>
                        <p className="modal-description">{painPoint.description}</p>
                    </div>

                    {/* Source Links */}
                    <div className="modal-section">
                        <h3>Source Threads</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {painPoint.source_links?.map((link, i) => (
                                <a
                                    key={i}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="source-link"
                                >
                                    <ExternalLink size={16} />
                                    <span>{link}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Footer metadata */}
                    <div className="modal-footer">
                        <Calendar size={14} />
                        <span>First seen: {new Date(painPoint.created_at).toLocaleDateString()}</span>
                        <span>·</span>
                        <span>Last seen: {new Date(painPoint.last_seen).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function getCategoryClass(category) {
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
