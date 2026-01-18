import React from 'react';
import './RepoDetailsPanel.css';

/**
 * Repository Details Panel - Expandable panel with detailed repo info
 * @param {Object} repo - Selected repository object
 * @param {Function} onClose - Callback to close the panel
 */
export default function RepoDetailsPanel({ repo, onClose }) {
    if (!repo) return null;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(repo.html_url);
        // Could add a toast notification here
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="repo-details-panel">
            <div className="details-header">
                <div className="details-title-section">
                    <h2>{repo.name}</h2>
                    <button className="close-btn" onClick={onClose} aria-label="Close panel">
                        ✕
                    </button>
                </div>
                <p className="details-description">{repo.description || 'No description available'}</p>
            </div>

            <div className="details-stats">
                <div className="stat-item">
                    <span className="stat-icon">⭐</span>
                    <div className="stat-info">
                        <div className="stat-number">{repo.stargazers_count.toLocaleString()}</div>
                        <div className="stat-text">Stars</div>
                    </div>
                </div>

                {repo.forks_count !== undefined && (
                    <div className="stat-item">
                        <span className="stat-icon">🔱</span>
                        <div className="stat-info">
                            <div className="stat-number">{repo.forks_count.toLocaleString()}</div>
                            <div className="stat-text">Forks</div>
                        </div>
                    </div>
                )}

                {repo.watchers_count !== undefined && (
                    <div className="stat-item">
                        <span className="stat-icon">👁️</span>
                        <div className="stat-info">
                            <div className="stat-number">{repo.watchers_count.toLocaleString()}</div>
                            <div className="stat-text">Watchers</div>
                        </div>
                    </div>
                )}
            </div>

            <div className="details-meta">
                <div className="meta-item">
                    <span className="meta-label">Language</span>
                    <span className="meta-value language-badge">{repo.language || 'Unknown'}</span>
                </div>
                {repo.updated_at && (
                    <div className="meta-item">
                        <span className="meta-label">Last Updated</span>
                        <span className="meta-value">{formatDate(repo.updated_at)}</span>
                    </div>
                )}
            </div>

            {repo.topics && repo.topics.length > 0 && (
                <div className="details-topics">
                    <div className="meta-label">Topics</div>
                    <div className="topics-list">
                        {repo.topics.slice(0, 10).map(topic => (
                            <span key={topic} className="topic-tag">{topic}</span>
                        ))}
                    </div>
                </div>
            )}

            <div className="details-actions">
                <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-button primary"
                >
                    <span>🚀</span> View on GitHub
                </a>
                <button
                    className="action-button secondary"
                    onClick={copyToClipboard}
                >
                    <span>📋</span> Copy URL
                </button>
            </div>
        </div>
    );
}
