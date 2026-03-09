import { Search } from 'lucide-react'
import { CATEGORIES } from '../data/mockData'

export function FilterBar({
    searchQuery,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    sortBy,
    onSortChange,
    filteredCount,
    totalCount
}) {
    return (
        <div className="filter-bar">
            <div className="search-wrapper">
                <Search className="search-icon" size={18} />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search pain points by title or description..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    id="search-pain-points"
                />
            </div>

            <div className="filter-row">
                <select
                    className="filter-select"
                    value={selectedCategory}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    id="category-filter"
                >
                    {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <select
                    className="filter-select"
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value)}
                    id="sort-selector"
                >
                    <option value="trending">Trending Score</option>
                    <option value="recent">Most Recent</option>
                    <option value="wtp">Willingness to Pay</option>
                    <option value="upvotes">Most Upvotes</option>
                    <option value="mentions">Most Mentions</option>
                </select>

                <span className="result-count">
                    Showing {filteredCount} of {totalCount} pain points
                </span>
            </div>
        </div>
    )
}
