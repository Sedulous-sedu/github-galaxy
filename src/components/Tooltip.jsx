import React from 'react';
import { getLanguageColor } from '../utils/languageColors';
import './Tooltip.css';

/**
 * Tooltip component for displaying repository information
 * @param {Object} repo - Repository data (name, description, stars, language)
 * @param {Number} x - X position
 * @param {Number} y - Y position
 */
export default function Tooltip({ repo, x, y }) {
    if (!repo) return null;

    const languageColor = getLanguageColor(repo.language);

    return (
        <div
            className="tooltip"
            style={{
                left: `${x + 20}px`,
                top: `${y + 20}px`,
            }}
        >
            <div className="tooltip-header">
                <h3>{repo.name}</h3>
            </div>

            <p className="tooltip-description">
                {repo.description || 'No description available'}
            </p>

            <div className="tooltip-stats">
                <div className="tooltip-stat">
                    <span className="stat-label">⭐</span>
                    <span className="stat-value">{repo.stargazers_count?.toLocaleString() || repo.stars?.toLocaleString()}</span>
                </div>

                {repo.forks_count !== undefined && (
                    <div className="tooltip-stat">
                        <span className="stat-label">🔱</span>
                        <span className="stat-value">{repo.forks_count.toLocaleString()}</span>
                    </div>
                )}
            </div>

            <div className="tooltip-footer">
                <span
                    className="tooltip-language"
                    style={{
                        backgroundColor: `${languageColor}20`,
                        borderColor: languageColor,
                        color: languageColor
                    }}
                >
                    <span
                        className="language-dot"
                        style={{ backgroundColor: languageColor }}
                    />
                    {repo.language || 'Unknown'}
                </span>
            </div>
        </div>
    );
}
