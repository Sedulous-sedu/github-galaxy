import { useState } from 'react';
import Galaxy from './components/Galaxy';
import SearchBar from './components/SearchBar';
import { fetchUserRepos } from './services/githubApi';
import './App.css';

function App() {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (username) => {
    setLoading(true);
    setError(null);
    setRepositories([]);

    try {
      const repos = await fetchUserRepos(username);

      if (repos.length === 0) {
        setError(`No public repositories found for "${username}"`);
      } else {
        setRepositories(repos);
        setSearched(true);
      }
    } catch (err) {
      setError(err.message);
      setRepositories([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <SearchBar
        onSearch={handleSearch}
        loading={loading}
        error={error}
      />

      {searched && repositories.length > 0 && (
        <div className="galaxy-container">
          <Galaxy repositories={repositories} />
        </div>
      )}

      {!searched && !loading && (
        <div className="welcome-message">
          <div className="welcome-content">
            <h2>🌠 Welcome to GitHub Galaxy</h2>
            <p>Enter a GitHub username to visualize their repositories as a beautiful 3D galaxy</p>
            <div className="features">
              <div className="feature">
                <span className="feature-icon">📊</span>
                <span>Size = Stars</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🎨</span>
                <span>Color = Language</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🖱️</span>
                <span>Interactive 3D</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
