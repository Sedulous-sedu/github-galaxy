import React, { useState, useEffect } from 'react';
import './StatsPanel.css';

/**
 * Stats Dashboard Panel - Shows repository statistics
 * @param {Array} repositories - Array of repository objects
 * @param {Boolean} visible - Whether panel is visible
 */
export default function StatsPanel({ repositories, visible }) {
    const [stats, setStats] = useState({
        totalRepos: 0,
        totalStars: 0,
        topLanguage: 'Unknown',
        topRepo: null,
        languageDistribution: {}
    });

    const [animatedStars, setAnimatedStars] = useState(0);
    const [animatedRepos, setAnimatedRepos] = useState(0);

    useEffect(() => {
        if (repositories.length === 0) return;

        // Calculate statistics
        const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        const languageCount = {};
        
        repositories.forEach(repo => {
            const lang = repo.language || 'Unknown';
            languageCount[lang] = (languageCount[lang] || 0) + 1;
        });

        const topLanguage = Object.entries(languageCount)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';

        const topRepo = repositories.reduce((max, repo) => 
            repo.stargazers_count > (max?.stargazers_count || 0) ? repo : max
        , null);

        setStats({
            totalRepos: repositories.length,
            totalStars,
            topLanguage,
            topRepo,
            languageDistribution: languageCount
        });

        // Animate counters
        animateCounter(0, repositories.length, setAnimatedRepos, 1000);
        animateCounter(0, totalStars, setAnimatedStars, 1500);
    }, [repositories]);

    const animateCounter = (start, end, setter, duration) => {
        const startTime = Date.now();
        const range = end - start;

        const updateCounter = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const easeOutQuad = progress * (2 - progress); // Easing function
            const current = Math.floor(start + range * easeOutQuad);
            
            setter(current);

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    };

    if (!visible) return null;

    const topLanguages = Object.entries(stats.languageDistribution)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const maxCount = Math.max(...topLanguages.map(([, count]) => count));

    return (
        <div className="stats-panel">
            <div className="stats-header">
                <h3>📊 Statistics</h3>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">{animatedRepos}</div>
                    <div className="stat-label">Repositories</div>
                </div>

                <div className="stat-card">
                    <div className="stat-value">⭐ {animatedStars.toLocaleString()}</div>
                    <div className="stat-label">Total Stars</div>
                </div>
            </div>

            {stats.topRepo && (
                <div className="stat-highlight">
                    <div className="stat-label">Most Starred</div>
                    <div className="stat-repo-name">{stats.topRepo.name}</div>
                    <div className="stat-repo-stars">⭐ {stats.topRepo.stargazers_count.toLocaleString()}</div>
                </div>
            )}

            <div className="language-distribution">
                <div className="stat-label">Top Languages</div>
                {topLanguages.map(([language, count]) => (
                    <div key={language} className="language-bar-container">
                        <div className="language-info">
                            <span className="language-name">{language}</span>
                            <span className="language-count">{count}</span>
                        </div>
                        <div className="language-bar-track">
                            <div 
                                className="language-bar-fill"
                                style={{ 
                                    width: `${(count / maxCount) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
