import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getLanguageColor } from '../utils/languageColors';

/**
 * Individual repository sphere component
 * @param {Object} repo - Repository data
 * @param {Array} position - [x, y, z] position in 3D space
 * @param {Function} onHover - Callback when hovering
 * @param {Function} onUnhover - Callback when hover ends
 * @param {Function} onClick - Callback when clicked
 * @param {Number} animationSpeed - Speed multiplier for animations
 */
export default function RepoSphere({ repo, position, onHover, onUnhover, onClick, animationSpeed = 1 }) {
    const meshRef = useRef();
    const glowRef = useRef();
    const [hovered, setHovered] = useState(false);

    // Calculate sphere size based on star count
    // Using logarithmic scale for better visual distribution
    const baseSize = 0.3;
    const scaleFactor = Math.log10(repo.stargazers_count + 1) * 0.5;
    const radius = baseSize + scaleFactor;

    // Check if this is a highly-starred repo
    const isPopular = repo.stargazers_count > 1000;

    // Get color from language
    const color = getLanguageColor(repo.language);

    // Floating animation
    useFrame((state) => {
        if (meshRef.current) {
            const time = state.clock.getElapsedTime() * animationSpeed;
            // Create floating effect with sine waves
            meshRef.current.position.y = position[1] + Math.sin(time + position[0]) * 0.2;

            // Gentle rotation
            meshRef.current.rotation.x += 0.001 * animationSpeed;
            meshRef.current.rotation.y += 0.002 * animationSpeed;

            // Scale effect on hover
            const targetScale = hovered ? 1.3 : 1;
            meshRef.current.scale.lerp(
                new THREE.Vector3(targetScale, targetScale, targetScale),
                0.1
            );
        }

        // Pulsing glow for popular repos
        if (glowRef.current && isPopular) {
            const time = state.clock.getElapsedTime() * animationSpeed;
            const pulse = Math.sin(time * 2) * 0.3 + 0.7;
            glowRef.current.scale.setScalar(pulse * (hovered ? 1.5 : 1.2));
            glowRef.current.material.opacity = pulse * 0.3;
        } else if (glowRef.current && hovered) {
            glowRef.current.scale.setScalar(1.8);
            glowRef.current.material.opacity = 0.4;
        } else if (glowRef.current) {
            glowRef.current.scale.setScalar(1);
            glowRef.current.material.opacity = 0;
        }
    });

    const handlePointerOver = (e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
        onHover({
            ...repo,
            x: e.clientX,
            y: e.clientY,
        });
    };

    const handlePointerOut = () => {
        setHovered(false);
        document.body.style.cursor = 'auto';
        onUnhover();
    };

    const handleClick = (e) => {
        e.stopPropagation();
        onClick(repo);
    };

    return (
        <group position={position}>
            {/* Glow ring effect */}
            <mesh ref={glowRef}>
                <ringGeometry args={[radius * 1.2, radius * 1.5, 32]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Main sphere */}
            <mesh
                ref={meshRef}
                onClick={handleClick}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
            >
                <sphereGeometry args={[radius, 32, 32]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={hovered ? 0.6 : (isPopular ? 0.3 : 0.1)}
                    roughness={0.4}
                    metalness={0.6}
                />
            </mesh>
        </group>
    );
}
