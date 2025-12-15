'use client';

import { Canvas } from '@react-three/fiber';
import { MapControls, OrthographicCamera } from '@react-three/drei';
import { GridSystem } from './GridSystem';
import { GhostItem } from './GhostItem';
import { InfrastructureNode } from './InfrastructureNode';
import { ConnectionManager } from './ConnectionManager';
import { TrafficSystem } from './TrafficSystem';
import { ChaosEngine } from './ChaosEngine';
import { useGameStore } from '@/store/GameStore';

export function Scene() {
    const nodes = useGameStore((state) => state.nodes);

    return (
        <div className="w-full h-full bg-slate-900">
            <Canvas shadows>
                {/* Isometric Camera setup */}
                <OrthographicCamera
                    makeDefault
                    position={[20, 20, 20]}
                    zoom={40}
                    near={-50}
                    far={200}
                />

                {/* Controls - Locked to Pan/Zoom only (no rotation for true ISO feel) */}
                <MapControls
                    enableRotate={false}
                    enableZoom={true}
                    screenSpacePanning={false}
                    maxZoom={100}
                    minZoom={20}
                />

                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <directionalLight
                    position={[10, 20, 10]}
                    intensity={1}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                />

                {/* The Game Board */}
                <GridSystem />
                <ConnectionManager />
                <TrafficSystem />
                <ChaosEngine />
                <GhostItem />

                {/* Render Placed Nodes with Interaction Logic */}
                {nodes.map((node) => (
                    <InfrastructureNode
                        key={node.id}
                        id={node.id}
                        type={node.type}
                        position={node.position}
                        status={node.status}
                        health={node.health}
                    />
                ))}
            </Canvas>
        </div>
    );
}
