import React, { useState, useEffect } from 'react';
import './ControlsPanel.css';

/**
 * Controls Panel - Interactive filters and options
 * @param {Array} repositories - All repositories
 * @param {Function} onFilterChange - Callback when filters change
 * @param {Function} onResetCamera - Reset camera position
 */
export default function ControlsPanel({ repositories, onFilterChange, onResetCamera }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [starRange, setStarRange] = useState({ min: 0, max: 10000 });
    const [sortBy, setSortBy] = useState('stars');
    const [animationSpeed, setAnimationSpeed] = useState(1);

    // Get unique languages
    const languages = [...new Set(repositories.map(r => r.language || 'Unknown'))].sort();

    useEffect(() => {
        // Apply filters
        onFilterChange({
            languages: selectedLanguages,
            starRange,
            sortBy,
            animationSpeed
        });
    }, [selectedLanguages, starRange, sortBy, animationSpeed]);

    const toggleLanguage = (lang) => {
        setSelectedLanguages(prev =>
            prev.includes(lang)
                ? prev.filter(l => l !== lang)
                : [...prev, lang]
        );
    };

    const selectAllLanguages = () => {
        setSelectedLanguages(languages);
    };

    const clearLanguages = () => {
        setSelectedLanguages([]);
    };

    const resetFilters = () => {
        setSelectedLanguages([]);
        setStarRange({ min: 0, max: 10000 });
        setSortBy('stars');
        setAnimationSpeed(1);
    };

    const maxStars = Math.max(...repositories.map(r => r.stargazers_count), 10000);

    return (
        <div className={`controls-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <div className="controls-header">
                <h3>🎛️ Controls</h3>
                <button
                    className="toggle-btn"
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-label={isExpanded ? 'Collapse panel' : 'Expand panel'}
                >
                    {isExpanded ? '›' : '‹'}
                </button>
            </div>

            {isExpanded && (
                <div className="controls-content">
                    {/* Language Filter */}
                    <div className="control-section">
                        <label className="control-label">Filter by Language</label>
                        <div className="language-filter-actions">
                            <button className="filter-action-btn" onClick={selectAllLanguages}>
                                All
                            </button>
                            <button className="filter-action-btn" onClick={clearLanguages}>
                                None
                            </button>
                        </div>
                        <div className="language-chips">
                            {languages.slice(0, 10).map(lang => (
                                <button
                                    key={lang}
                                    className={`language-chip ${selectedLanguages.includes(lang) ? 'active' : ''}`}
                                    onClick={() => toggleLanguage(lang)}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                        {selectedLanguages.length > 0 && (
                            <div className="filter-info">
                                {selectedLanguages.length} language{selectedLanguages.length !== 1 ? 's' : ''} selected
                            </div>
                        )}
                    </div>

                    {/* Star Range */}
                    <div className="control-section">
                        <label className="control-label">
                            Star Range: {starRange.min} - {starRange.max === 10000 ? '∞' : starRange.max}
                        </label>
                        <div className="range-inputs">
                            <input
                                type="range"
                                min="0"
                                max={maxStars}
                                value={starRange.min}
                                onChange={(e) => setStarRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                                className="range-slider"
                            />
                            <input
                                type="range"
                                min="0"
                                max={maxStars}
                                value={starRange.max}
                                onChange={(e) => setStarRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                                className="range-slider"
                            />
                        </div>
                    </div>

                    {/* Sort Options */}
                    <div className="control-section">
                        <label className="control-label">Sort By</label>
                        <div className="sort-options">
                            <button
                                className={`sort-btn ${sortBy === 'stars' ? 'active' : ''}`}
                                onClick={() => setSortBy('stars')}
                            >
                                ⭐ Stars
                            </button>
                            <button
                                className={`sort-btn ${sortBy === 'name' ? 'active' : ''}`}
                                onClick={() => setSortBy('name')}
                            >
                                🔤 Name
                            </button>
                            <button
                                className={`sort-btn ${sortBy === 'updated' ? 'active' : ''}`}
                                onClick={() => setSortBy('updated')}
                            >
                                📅 Updated
                            </button>
                        </div>
                    </div>

                    {/* Animation Speed */}
                    <div className="control-section">
                        <label className="control-label">
                            Animation Speed: {animationSpeed.toFixed(1)}x
                        </label>
                        <input
                            type="range"
                            min="0.5"
                            max="3"
                            step="0.1"
                            value={animationSpeed}
                            onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                            className="range-slider"
                        />
                    </div>

                    {/* Actions */}
                    <div className="control-section">
                        <button className="action-btn reset-camera" onClick={onResetCamera}>
                            🎥 Reset Camera
                        </button>
                        <button className="action-btn reset-filters" onClick={resetFilters}>
                            🔄 Reset Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
