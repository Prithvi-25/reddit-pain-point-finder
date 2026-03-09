import { useState, useMemo } from 'react'
import { usePainPoints } from './hooks/usePainPoints'
import { isDemoMode } from './lib/supabase'
import { PainPointCard } from './components/PainPointCard'
import { FilterBar } from './components/FilterBar'
import { PainPointModal } from './components/PainPointModal'
import { TrendingChart } from './components/TrendingChart'
import { RefreshButton } from './components/RefreshButton'
import { ExportButton } from './components/ExportButton'
import { StatsBar } from './components/StatsBar'
import { SearchX } from 'lucide-react'

function App() {
    const { painPoints, loading, error, refetch } = usePainPoints()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All Categories')
    const [sortBy, setSortBy] = useState('trending')
    const [selectedPainPoint, setSelectedPainPoint] = useState(null)

    const filteredPainPoints = useMemo(() => {
        let filtered = [...painPoints]

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.description?.toLowerCase().includes(query) ||
                p.subreddit?.toLowerCase().includes(query)
            )
        }

        // Category filter
        if (selectedCategory !== 'All Categories') {
            filtered = filtered.filter(p => p.category === selectedCategory)
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'trending':
                    return (b.trending_score || 0) - (a.trending_score || 0)
                case 'recent':
                    return new Date(b.created_at) - new Date(a.created_at)
                case 'wtp':
                    return (b.willingness_to_pay_score || 0) - (a.willingness_to_pay_score || 0)
                case 'upvotes':
                    return (b.avg_upvotes || 0) - (a.avg_upvotes || 0)
                case 'mentions':
                    return (b.mention_count || 0) - (a.mention_count || 0)
                default:
                    return 0
            }
        })

        return filtered
    }, [painPoints, searchQuery, selectedCategory, sortBy])

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading pain points...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="loading-container">
                <p style={{ color: 'var(--accent-rose)', fontSize: '1.1rem' }}>Error: {error}</p>
                <button className="btn btn-primary" onClick={refetch}>Retry</button>
            </div>
        )
    }

    return (
        <div className="app-container">
            {/* Header */}
            <header className="header">
                <div className="header-left">
                    <h1 className="header-title">Reddit Pain Point Finder</h1>
                    <p className="header-subtitle">
                        Discover product opportunities from real Reddit conversations
                    </p>
                </div>
                <div className="header-actions">
                    {isDemoMode && (
                        <span className="demo-badge">⚡ Demo Mode</span>
                    )}
                    <ExportButton painPoints={filteredPainPoints} />
                    <RefreshButton onRefresh={refetch} />
                </div>
            </header>

            {/* Stats */}
            <StatsBar painPoints={painPoints} />

            {/* Chart */}
            <TrendingChart painPoints={painPoints} />

            {/* Filters */}
            <FilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                sortBy={sortBy}
                onSortChange={setSortBy}
                filteredCount={filteredPainPoints.length}
                totalCount={painPoints.length}
            />

            {/* Pain Points Grid */}
            {filteredPainPoints.length > 0 ? (
                <div className="pain-points-grid">
                    {filteredPainPoints.map(point => (
                        <PainPointCard
                            key={point.id}
                            painPoint={point}
                            onClick={() => setSelectedPainPoint(point)}
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <SearchX />
                    <h3>No pain points found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            )}

            {/* Detail Modal */}
            {selectedPainPoint && (
                <PainPointModal
                    painPoint={selectedPainPoint}
                    onClose={() => setSelectedPainPoint(null)}
                />
            )}
        </div>
    )
}

export default App
