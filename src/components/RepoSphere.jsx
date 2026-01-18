import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { getLanguageColor } from '../utils/languageColors';

/**
 * Individual repository sphere component
 * @param {Object} repo - Repository data
 * @param {Array} position - [x, y, z] position in 3D space
 * @param {Function} onHover - Callback when hovering
 * @param {Function} onUnhover - Callback when hover ends
 */
export default function RepoSphere({ repo, position, onHover, onUnhover }) {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);

    // Calculate sphere size based on star count
    // Using logarithmic scale for better visual distribution
    const baseSize = 0.3;
    const scaleFactor = Math.log10(repo.stargazers_count + 1) * 0.5;
    const radius = baseSize + scaleFactor;

    // Get color from language
    const color = getLanguageColor(repo.language);

    // Floating animation
    useFrame((state) => {
        if (meshRef.current) {
            const time = state.clock.getElapsedTime();
            // Create floating effect with sine waves
            meshRef.current.position.y = position[1] + Math.sin(time + position[0]) * 0.2;

            // Gentle rotation
            meshRef.current.rotation.x += 0.001;
            meshRef.current.rotation.y += 0.002;

            // Scale effect on hover
            const targetScale = hovered ? 1.3 : 1;
            meshRef.current.scale.lerp(
                new THREE.Vector3(targetScale, targetScale, targetScale),
                0.1
            );
        }
    });

    const handlePointerOver = (e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
        onHover({
            name: repo.name,
            description: repo.description,
            stars: repo.stargazers_count,
            language: repo.language,
            x: e.clientX,
            y: e.clientY,
        });
    };

    const handlePointerOut = () => {
        setHovered(false);
        document.body.style.cursor = 'auto';
        onUnhover();
    };

    const handleClick = () => {
        window.open(repo.html_url, '_blank');
    };

    return (
        <mesh
            ref={meshRef}
            position={position}
            onClick={handleClick}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
        >
            <sphereGeometry args={[radius, 32, 32]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={hovered ? 0.5 : 0.1}
                roughness={0.4}
                metalness={0.6}
            />
        </mesh>
    );
}
