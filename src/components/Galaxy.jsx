import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import RepoSphere from './RepoSphere';
import Tooltip from './Tooltip';
import * as THREE from 'three';

/**
 * Main Galaxy component - renders the 3D scene with repositories
 * @param {Array} repositories - Array of repository objects
 */
export default function Galaxy({ repositories }) {
    const [hoveredRepo, setHoveredRepo] = useState(null);

    // Generate positions for repositories in a galaxy-like pattern
    const repositoryPositions = useMemo(() => {
        return repositories.map((repo, index) => {
            // Create spiral galaxy distribution
            const totalRepos = repositories.length;
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
    }, [repositories]);

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
                    speed={1}
                />

                {/* Repository spheres */}
                {repositoryPositions.map(({ repo, position }) => (
                    <RepoSphere
                        key={repo.id}
                        repo={repo}
                        position={position}
                        onHover={setHoveredRepo}
                        onUnhover={() => setHoveredRepo(null)}
                    />
                ))}

                {/* Camera controls */}
                <OrbitControls
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
