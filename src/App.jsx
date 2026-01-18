import { useState, useRef } from 'react';
import Galaxy from './components/Galaxy';
import SearchBar from './components/SearchBar';
import StatsPanel from './components/StatsPanel';
import ControlsPanel from './components/ControlsPanel';
import RepoDetailsPanel from './components/RepoDetailsPanel';
import { fetchUserRepos } from './services/githubApi';
import './App.css';

function App() {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [filters, setFilters] = useState({
    languages: [],
    starRange: { min: 0, max: 10000 }
  });
  const [sortBy, setSortBy] = useState('stars');
  const [animationSpeed, setAnimationSpeed] = useState(1);

  const cameraRef = useRef();

  const handleSearch = async (username) => {
    setLoading(true);
    setError(null);
    setRepositories([]);
    setSelectedRepo(null);

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

  const handleFilterChange = (newFilters) => {
    setFilters({
      languages: newFilters.languages || [],
      starRange: newFilters.starRange || { min: 0, max: 10000 }
    });
    setSortBy(newFilters.sortBy || 'stars');
    setAnimationSpeed(newFilters.animationSpeed || 1);
  };

  const handleResetCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.reset();
    }
  };

  const handleSphereClick = (repo) => {
    setSelectedRepo(repo);
  };

  return (
    <div className="app">
      <SearchBar
        onSearch={handleSearch}
        loading={loading}
        error={error}
      />

      {searched && repositories.length > 0 && (
        <>
          <StatsPanel
            repositories={repositories}
            visible={true}
          />

          <ControlsPanel
            repositories={repositories}
            onFilterChange={handleFilterChange}
            onResetCamera={handleResetCamera}
          />

          <div className="galaxy-container">
            <Galaxy
              repositories={repositories}
              filters={filters}
              sortBy={sortBy}
              animationSpeed={animationSpeed}
              onSphereClick={handleSphereClick}
              cameraRef={cameraRef}
            />
          </div>

          {selectedRepo && (
            <RepoDetailsPanel
              repo={selectedRepo}
              onClose={() => setSelectedRepo(null)}
            />
          )}
        </>
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
