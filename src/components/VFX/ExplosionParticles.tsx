import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '@/store/GameStore';
import * as THREE from 'three';

interface Explosion {
    id: string;
    position: [number, number, number];
    startTime: number;
}

export function ExplosionParticles() {
    const logs = useGameStore((state) => state.logs);
    const nodes = useGameStore((state) => state.nodes);
    const [explosions, setExplosions] = useState<Explosion[]>([]);
    const lastLogIdRef = useRef<string | null>(null);

    // Watch for new Chaos logs
    useEffect(() => {
        if (logs.length === 0) return;
        const latestLog = logs[0]; // Logs are prepended

        if (latestLog.id !== lastLogIdRef.current) {
            lastLogIdRef.current = latestLog.id;

            // Check if it's a kill event
            if (latestLog.message.includes('CHAOS MONKEY KILLED NODE') && latestLog.sourceId) {
                const victim = nodes.find(n => n.id === latestLog.sourceId);
                if (victim) {
                    // Spawn Explosion
                    const id = Math.random().toString();
                    setExplosions(prev => [...prev, {
                        id,
                        position: victim.position,
                        startTime: Date.now()
                    }]);

                    // Cleanup after 1s
                    setTimeout(() => {
                        setExplosions(prev => prev.filter(e => e.id !== id));
                    }, 1000);
                }
            }
        }
    }, [logs, nodes]);

    return (
        <group>
            {explosions.map(exp => (
                <ParticleBurst key={exp.id} position={exp.position} />
            ))}
        </group>
    );
}

function ParticleBurst({ position }: { position: [number, number, number] }) {
    const count = 20;
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const [dummy] = useState(() => new THREE.Object3D());

    // Store localized speeds for each particle
    const [speeds] = useState(() => {
        return new Array(count).fill(0).map(() => ({
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            )
        }));
    });

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        let activeCount = 0;

        speeds.forEach((data, i) => {
            // Update position based on velocity
            // We simulate physics by expanding outward
            // Actually, we need to store current positions or just use time.
            // Simplified: Just move them outward each frame.

            // We can't easily store state per instance in this simple loop without ref array.
            // But since this component is short-lived (1s), let's just use time since mount?
            // No, we need per-particle distinct directions.

            // Let's use the dummy to update matrix.
            // But we need expected position.
            // Let's just move the dummy by velocity * delta.

            // Issue: We need to READ the current matrix to update it, or keep a shadow copy.
            // Keeping shadow copy is heavy.

            // Alternative: use a shader material points?
            // R3F `Points` is easier.
        });
    });

    // Let's switch to <Points> for simplicity and performance
    return <BurstPoints position={position} count={count} />;
}

function BurstPoints({ position, count }: { position: [number, number, number], count: number }) {
    const pointsRef = useRef<THREE.Points>(null);

    // Initial positions (all at center)
    const [positions] = useState(() => new Float32Array(count * 3));

    // Velocities
    const [velocities] = useState(() => {
        const v = [];
        for (let i = 0; i < count; i++) {
            v.push(
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 15
            );
        }
        return v;
    });

    useFrame((state, delta) => {
        if (!pointsRef.current) return;

        const positionsAttribute = pointsRef.current.geometry.attributes.position;

        for (let i = 0; i < count; i++) {
            // Update X, Y, Z
            positionsAttribute.setX(i, positionsAttribute.getX(i) + velocities[i * 3 + 0] * delta);
            positionsAttribute.setY(i, positionsAttribute.getY(i) + velocities[i * 3 + 1] * delta);
            positionsAttribute.setZ(i, positionsAttribute.getZ(i) + velocities[i * 3 + 2] * delta);
        }

        positionsAttribute.needsUpdate = true;

        // Fade out? Material opacity.
        const mat = pointsRef.current.material as THREE.PointsMaterial;
        if (mat.opacity > 0) mat.opacity -= delta * 1.5;
    });

    return (
        <points ref={pointsRef} position={position}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.6}
                color="#ff4400"
                transparent
                opacity={1}
                sizeAttenuation
                depthWrite={false}
            />
        </points>
    );
}
