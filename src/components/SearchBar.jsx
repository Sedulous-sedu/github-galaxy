import React, { useState } from 'react';
import './SearchBar.css';

/**
 * Futuristic search bar component
 * @param {Function} onSearch - Callback when search is submitted
 * @param {Boolean} loading - Loading state
 * @param {String} error - Error message
 */
export default function SearchBar({ onSearch, loading, error }) {
    const [username, setUsername] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            onSearch(username.trim());
        }
    };

    return (
        <div className="search-container">
            <div className="search-header">
                <h1 className="title">
                    <span className="title-icon">🌌</span>
                    GitHub Galaxy
                </h1>
                <p className="subtitle">Explore the universe of code</p>
            </div>

            <form onSubmit={handleSubmit} className="search-form">
                <div className="input-wrapper">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter GitHub username..."
                        className="search-input"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        className="search-button"
                        disabled={loading || !username.trim()}
                    >
                        {loading ? (
                            <span className="loading-spinner">⏳</span>
                        ) : (
                            <span>🚀 Explore</span>
                        )}
                    </button>
                </div>
            </form>

            {error && (
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {error}
                </div>
            )}

            {loading && (
                <div className="loading-message">
                    <span className="loading-text">Fetching repositories from the cosmos...</span>
                </div>
            )}
        </div>
    );
}
