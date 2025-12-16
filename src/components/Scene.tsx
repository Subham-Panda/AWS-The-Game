'use client';

import { Canvas } from '@react-three/fiber';
import { MapControls, OrthographicCamera, OrbitControls } from '@react-three/drei';
import { GridSystem } from './GridSystem';
import { GhostItem } from './GhostItem';
import { InfrastructureNode } from './InfrastructureNode';
import { ConnectionManager } from './ConnectionManager';
import { TrafficSystem } from './TrafficSystem';
import { ChaosEngine } from './ChaosEngine';
import { ExplosionParticles } from './VFX/ExplosionParticles';
import { useGameStore } from '@/store/GameStore';

export function Scene() {
    const nodes = useGameStore((state) => state.nodes);
    const appState = useGameStore((state) => state.appState);

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

                {/* Controls - Context Aware */}
                {appState === 'playing' ? (
                    <MapControls
                        enableRotate={false}
                        enableZoom={true}
                        screenSpacePanning={false}
                        maxZoom={100}
                        minZoom={20}
                    />
                ) : (
                    <OrbitControls
                        autoRotate
                        autoRotateSpeed={1.0}
                        enableZoom={true} // Allow zooming in to see details
                        maxZoom={20}
                        minZoom={5}
                        enablePan={false}
                        enableRotate={true}
                        enableDamping={true}
                        dampingFactor={0.05}
                        maxPolarAngle={Math.PI / 2.1} // Allow looking lower
                        minPolarAngle={Math.PI / 6}   // Allow looking higher
                    />
                )}

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
                <ExplosionParticles />
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
