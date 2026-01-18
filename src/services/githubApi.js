/**
 * GitHub API Service
 * Handles fetching user repositories with pagination
 */

const GITHUB_API_BASE = 'https://api.github.com';
const PER_PAGE = 100; // GitHub API allows up to 100 per page

/**
 * Fetch all public repositories for a GitHub user
 * @param {string} username - GitHub username
 * @returns {Promise<Array>} Array of repository objects
 */
export async function fetchUserRepos(username) {
  if (!username || typeof username !== 'string') {
    throw new Error('Invalid username provided');
  }

  const repos = [];
  let page = 1;
  let hasMorePages = true;

  try {
    while (hasMorePages) {
      const url = `${GITHUB_API_BASE}/users/${username}/repos?per_page=${PER_PAGE}&page=${page}&sort=updated`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`User "${username}" not found`);
        } else if (response.status === 403) {
          throw new Error('GitHub API rate limit exceeded. Please try again later.');
        } else {
          throw new Error(`GitHub API error: ${response.status}`);
        }
      }

      const data = await response.json();
      
      if (data.length === 0) {
        hasMorePages = false;
      } else {
        repos.push(...data);
        page++;
        
        // If we got less than PER_PAGE results, we're on the last page
        if (data.length < PER_PAGE) {
          hasMorePages = false;
        }
      }
    }

    // Map to extract only the fields we need
    return repos.map(repo => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || 'No description available',
      stargazers_count: repo.stargazers_count || 0,
      language: repo.language || 'Unknown',
      html_url: repo.html_url,
      updated_at: repo.updated_at,
    }));

  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
}
