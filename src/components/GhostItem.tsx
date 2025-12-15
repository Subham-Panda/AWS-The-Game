'use client';

import { useGameStore } from '@/store/GameStore';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';

export function GhostItem() {
    const { draggedItem, cursorPosition, nodes } = useGameStore();
    const meshRef = useRef<Mesh>(null);

    // If nothing is being dragged, don't render
    if (!draggedItem) return null;

    // Check validity (Overlap detection)
    const isOccupied = nodes.some(n =>
        n.position[0] === cursorPosition[0] &&
        n.position[2] === cursorPosition[2]
    );

    const color = isOccupied ? '#ef4444' : '#22c55e'; // Red if blocked, Green if good

    return (
        <mesh position={cursorPosition} ref={meshRef}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={color} transparent opacity={0.5} />
        </mesh>
    );
}
