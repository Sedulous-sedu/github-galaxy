import React from 'react';
import './Tooltip.css';

/**
 * Tooltip component for displaying repository information
 * @param {Object} repo - Repository data (name, description, stars, language)
 * @param {Number} x - X position
 * @param {Number} y - Y position
 */
export default function Tooltip({ repo, x, y }) {
    if (!repo) return null;

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
                <span className="tooltip-stars">⭐ {repo.stars}</span>
            </div>
            <p className="tooltip-description">{repo.description}</p>
            <div className="tooltip-footer">
                <span className="tooltip-language">{repo.language}</span>
            </div>
        </div>
    );
}
