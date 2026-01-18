import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import RepoSphere from './RepoSphere';
import Tooltip from './Tooltip';
import * as THREE from 'three';

/**
 * Main Galaxy component - renders the 3D scene with repositories
 * @param {Array} repositories - Array of repository objects
 * @param {Object} filters - Active filters (languages, starRange)
 * @param {String} sortBy - Sort criterion
 * @param {Number} animationSpeed - Animation speed multiplier
 * @param {Function} onSphereClick - Callback when sphere is clicked
 * @param {Ref} cameraRef - Camera control ref for external manipulation
 */
export default function Galaxy({ repositories, filters = {}, sortBy = 'stars', animationSpeed = 1, onSphereClick, cameraRef }) {
    const [hoveredRepo, setHoveredRepo] = useState(null);

    // Filter and sort repositories
    const processedRepositories = useMemo(() => {
        let filtered = [...repositories];

        // Apply language filter
        if (filters.languages && filters.languages.length > 0) {
            filtered = filtered.filter(repo =>
                filters.languages.includes(repo.language || 'Unknown')
            );
        }

        // Apply star range filter
        if (filters.starRange) {
            filtered = filtered.filter(repo =>
                repo.stargazers_count >= filters.starRange.min &&
                repo.stargazers_count <= filters.starRange.max
            );
        }

        // Sort repositories
        switch (sortBy) {
            case 'stars':
                filtered.sort((a, b) => b.stargazers_count - a.stargazers_count);
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'updated':
                filtered.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
                break;
            default:
                break;
        }

        return filtered;
    }, [repositories, filters, sortBy]);

    // Generate positions for repositories in a galaxy-like pattern
    const repositoryPositions = useMemo(() => {
        return processedRepositories.map((repo, index) => {
            // Create spiral galaxy distribution
            const totalRepos = processedRepositories.length;
            const angle = (index / totalRepos) * Math.PI * 4; // Multiple rotations
            const radius = 5 + (index / totalRepos) * 15; // Spread from center

            // Add some randomness for natural look
            const heightVariation = (Math.random() - 0.5) * 8;
            const radiusVariation = (Math.random() - 0.5) * 3;

            const x = Math.cos(angle) * (radius + radiusVariation);
            const y = heightVariation;
            const z = Math.sin(angle) * (radius + radiusVariation);

            return {
                repo,
                position: [x, y, z],
            };
        });
    }, [processedRepositories]);

    return (
        <>
            <Canvas
                camera={{ position: [0, 5, 25], fov: 60 }}
                gl={{
                    antialias: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.2
                }}
                style={{ background: 'transparent' }}
            >
                {/* Fog for depth effect */}
                <fog attach="fog" args={['#0a0a1e', 20, 60]} />

                {/* Lighting */}
                <ambientLight intensity={0.3} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#64c8ff" />
                <spotLight
                    position={[0, 20, 0]}
                    angle={0.6}
                    penumbra={1}
                    intensity={0.5}
                    color="#a864ff"
                />

                {/* Background stars */}
                <Stars
                    radius={100}
                    depth={50}
                    count={5000}
                    factor={4}
                    saturation={0}
                    fade
                    speed={animationSpeed}
                />

                {/* Repository spheres */}
                {repositoryPositions.map(({ repo, position }) => (
                    <RepoSphere
                        key={repo.id}
                        repo={repo}
                        position={position}
                        onHover={setHoveredRepo}
                        onUnhover={() => setHoveredRepo(null)}
                        onClick={onSphereClick}
                        animationSpeed={animationSpeed}
                    />
                ))}

                {/* Camera controls */}
                <OrbitControls
                    ref={cameraRef}
                    enableDamping
                    dampingFactor={0.05}
                    rotateSpeed={0.5}
                    minDistance={10}
                    maxDistance={50}
                />
            </Canvas>

            {/* Tooltip overlay */}
            {hoveredRepo && (
                <Tooltip
                    repo={hoveredRepo}
                    x={hoveredRepo.x}
                    y={hoveredRepo.y}
                />
            )}
        </>
    );
}
