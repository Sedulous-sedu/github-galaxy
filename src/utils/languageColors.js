/**
 * Language color mapping utilities
 * Uses official GitHub language colors
 */

import githubColors from 'github-colors';

/**
 * Get color for a programming language
 * @param {string} language - Programming language name
 * @returns {string} Hex color code
 */
export function getLanguageColor(language) {
    if (!language || language === 'Unknown') {
        return '#8B8B8B'; // Gray for unknown languages
    }

    const colorData = githubColors.get(language);

    if (colorData && colorData.color) {
        return colorData.color;
    }

    // Fallback colors for common languages not in the package
    const fallbackColors = {
        'JavaScript': '#f1e05a',
        'Python': '#3572A5',
        'Java': '#b07219',
        'TypeScript': '#2b7489',
        'C++': '#f34b7d',
        'C': '#555555',
        'Ruby': '#701516',
        'Go': '#00ADD8',
        'Rust': '#dea584',
        'PHP': '#4F5D95',
        'Swift': '#ffac45',
        'Kotlin': '#F18E33',
        'C#': '#178600',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Shell': '#89e051',
    };

    return fallbackColors[language] || '#8B8B8B';
}

/**
 * Convert hex color to Three.js compatible color
 * @param {string} hexColor - Hex color code
 * @returns {string} Hex color without #
 */
export function hexToThreeColor(hexColor) {
    return hexColor.replace('#', '0x');
}
