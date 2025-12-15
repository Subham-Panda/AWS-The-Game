'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D, Vector3, QuadraticBezierCurve3, Color } from 'three';
import { useGameStore, TIER_CONFIG } from '@/store/GameStore';

// Request Types based on Operator Manual
type RequestType = 'static' | 'read' | 'write' | 'upload' | 'search' | 'malicious';

interface Packet {
    active: boolean;
    progress: number;
    speed: number;
    curve: QuadraticBezierCurve3;
    targetId: string;
    type: RequestType;
}

const MAX_PACKETS = 2000; // Increased for variety

export function TrafficSystem() {
    const meshRef = useRef<InstancedMesh>(null);
    const connections = useGameStore((state) => state.connections);
    const nodes = useGameStore((state) => state.nodes);
    const trafficConfig = useGameStore((state) => state.trafficConfig);
    const updateNodeLoad = useGameStore((state) => state.updateNodeLoad);
    const damageNode = useGameStore((state) => state.damageNode);

    const packets = useRef<Packet[]>([]);
    const dummy = useMemo(() => new Object3D(), []);
    const color = useMemo(() => new Color(), []);

    // Accumulator for fractional spawn rates
    const spawnAccumulator = useRef(0);

    // Load Tracking
    const loadCounts = useRef<Record<string, number>>({});

    // Initial fill
    useEffect(() => {
        packets.current = Array(MAX_PACKETS).fill(null).map(() => ({
            active: false,
            progress: 0,
            speed: 0,
            curve: new QuadraticBezierCurve3(new Vector3(), new Vector3(), new Vector3()),
            targetId: '',
            type: 'read' // Default
        }));
    }, []);

    // Load Reporting Interval
    useEffect(() => {
        const interval = setInterval(() => {
            const currentCounts = loadCounts.current;
            Object.keys(currentCounts).forEach(id => {
                const count = currentCounts[id];
                if (count > 0) {
                    updateNodeLoad(id, count);
                    currentCounts[id] = 0; // Reset after reporting
                } else {
                    // Optionally clear load to 0 if inactive
                    // updateNodeLoad(id, 0); 
                    // Kept simple: only update active nodes or we spam updates
                }
            });
            // Force clear stale ones? 
            // Better: Iterate ALL nodes in store and set load?
            // Expensive. Let's just rely on active traffic updates. 
            // Users will see 0 if we reset on read? 
            // Actually, we should iterate store nodes to zero-out idle ones.
            // But we can't access store state easily here without subscription.
            // Let's stick to active reporting.
        }, 1000);
        return () => clearInterval(interval);
    }, [updateNodeLoad]);

    const spawnPacket = (sourceId: string, targetId: string, inheritedType?: RequestType) => {
        const packet = packets.current.find(p => !p.active);
        if (!packet) return;

        const sourceNode = nodes.find(n => n.id === sourceId);
        const targetNode = nodes.find(n => n.id === targetId);

        if (sourceNode && targetNode) {
            packet.active = true;
            packet.progress = 0;
            packet.speed = 0.01 + Math.random() * 0.005;

            if (inheritedType) {
                packet.type = inheritedType;
            } else {
                // SPAWN DISTRIBUTION LOGIC
                if (trafficConfig.mode === 'aggregate') {
                    // Aggregate Mode: Use Weighted Random based on %
                    const rand = Math.random() * 100;
                    let cumulative = 0;

                    // Order matters for cumulative check
                    const types: RequestType[] = ['static', 'read', 'write', 'search', 'upload', 'malicious'];
                    for (const type of types) {
                        cumulative += trafficConfig.distribution[type];
                        if (rand < cumulative) {
                            packet.type = type;
                            break;
                        }
                    }
                } else {
                    // Granular Mode
                    packet.type = 'read';
                }
            }

            const start = new Vector3(...sourceNode.position);
            const end = new Vector3(...targetNode.position);
            const mid = start.clone().add(end).multiplyScalar(0.5);
            mid.y -= 2;

            packet.curve = new QuadraticBezierCurve3(start, mid, end);
            packet.targetId = targetId;
        }
    };

    // Helper to find downstream targets including active check
    const relayPacket = (currentId: string, type: RequestType, targetTypes: string[]) => {
        const neighbors = connections
            .filter(c => c.sourceId === currentId || c.targetId === currentId)
            .map(c => c.sourceId === currentId ? c.targetId : c.sourceId);

        const validTargets = neighbors.filter(id => {
            const node = nodes.find(n => n.id === id);
            return node && targetTypes.includes(node.type) && node.status === 'active';
        });

        if (validTargets.length > 0) {
            const nextHopId = validTargets[Math.floor(Math.random() * validTargets.length)];
            spawnPacket(currentId, nextHopId, type);
            return true; // Sent
        }

        return false; // No path found (Dead End)
    };

    const isPaused = useGameStore((state) => state.isPaused);
    const timeScale = useGameStore((state) => state.timeScale);

    useFrame((state, delta) => {
        if (!meshRef.current || isPaused) return;

        // Apply Time Scale to Delta
        const simDelta = delta * timeScale;

        // --- TRAFFIC SPAWNER LOGIC ---
        const gateways = nodes.filter(n => n.type === 'gateway');

        if (gateways.length > 0) {
            if (trafficConfig.mode === 'aggregate') {
                const ratePerGateway = trafficConfig.totalRate / gateways.length;
                const packetsToSpawn = ratePerGateway * simDelta;

                spawnAccumulator.current += packetsToSpawn;

                while (spawnAccumulator.current >= 1) {
                    spawnAccumulator.current -= 1;
                    const gw = gateways[Math.floor(Math.random() * gateways.length)];
                    const neighbors = connections
                        .filter(c => c.sourceId === gw.id || c.targetId === gw.id)
                        .map(c => c.sourceId === gw.id ? c.targetId : c.sourceId);

                    const validTargets = neighbors.filter(id => {
                        const node = nodes.find(n => n.id === id);
                        return node && (node.type === 'load-balancer' || node.type === 'web-server' || node.type === 'waf');
                    });

                    if (validTargets.length > 0) {
                        const targetId = validTargets[Math.floor(Math.random() * validTargets.length)];
                        spawnPacket(gw.id, targetId);
                    }
                }
            } else {
                const types: RequestType[] = ['static', 'read', 'write', 'search', 'upload', 'malicious'];

                types.forEach(type => {
                    const rate = trafficConfig.granularRates[type];
                    if (rate <= 0) return;

                    const totalPackets = rate * simDelta;
                    let count = Math.floor(totalPackets);
                    if (Math.random() < (totalPackets - count)) count++;

                    for (let k = 0; k < count; k++) {
                        const gw = gateways[Math.floor(Math.random() * gateways.length)];
                        const neighbors = connections
                            .filter(c => c.sourceId === gw.id || c.targetId === gw.id)
                            .map(c => c.sourceId === gw.id ? c.targetId : c.sourceId);

                        const validTargets = neighbors.filter(id => {
                            const node = nodes.find(n => n.id === id);
                            return node && (node.type === 'load-balancer' || node.type === 'web-server' || node.type === 'waf');
                        });

                        if (validTargets.length > 0) {
                            const targetId = validTargets[Math.floor(Math.random() * validTargets.length)];
                            spawnPacket(gw.id, targetId, type);
                        }
                    }
                });
            }
        }

        packets.current.forEach((packet, i) => {
            if (!packet.active) {
                dummy.scale.set(0, 0, 0);
                dummy.updateMatrix();
                meshRef.current!.setMatrixAt(i, dummy.matrix);
                return;
            }

            // Apply TimeScale to Speed
            packet.progress += packet.speed * timeScale;

            switch (packet.type) {
                case 'static': color.setHex(0x06b6d4); break;
                case 'read': color.setHex(0x3b82f6); break;
                case 'write': color.setHex(0xf97316); break;
                case 'upload': color.setHex(0xa855f7); break;
                case 'search': color.setHex(0xec4899); break;
                case 'malicious': color.setHex(0xef4444); break;
                default: color.setHex(0xffffff);
            }
            meshRef.current!.setColorAt(i, color);

            if (packet.progress >= 1) {
                packet.active = false;
                const targetNode = nodes.find(n => n.id === packet.targetId);

                // --- LOAD TRACKING ---
                if (targetNode) {
                    loadCounts.current[targetNode.id] = (loadCounts.current[targetNode.id] || 0) + 1;

                    // Capacity / Overload Check
                    const config = TIER_CONFIG[targetNode.type];
                    if (config) {
                        const stats = config[(targetNode.tier || 1) - 1];
                        const capacity = stats?.capacity || 100;

                        if (loadCounts.current[targetNode.id] > capacity) {
                            // OVERLOAD PENALTY
                            useGameStore.getState().damageNode(targetNode.id, 2.0);
                            useGameStore.getState().recordFailure(targetNode.id, `Capacity Exceeded (${loadCounts.current[targetNode.id]} > ${capacity})`);
                            return;
                        }
                    }
                }

                if (targetNode && (targetNode.status === 'down' || targetNode.status === 'rebooting')) {
                    useGameStore.getState().updateCash(-5);
                    useGameStore.getState().recordFailure(targetNode.id, `Connection Refused: Node ${targetNode.status.toUpperCase()}`);
                }
                else if (targetNode) {
                    if (targetNode.type === 'waf') {
                        if (packet.type === 'malicious') {
                            useGameStore.setState(s => ({ score: s.score + 5 }));
                        } else {
                            const sent = relayPacket(targetNode.id, packet.type, ['load-balancer', 'web-server']);
                            if (!sent) useGameStore.getState().recordFailure(targetNode.id, 'WAF: No Route to Application');
                        }
                    }
                    else if (targetNode.type === 'load-balancer') {
                        const sent = relayPacket(targetNode.id, packet.type, ['web-server']);
                        if (!sent) useGameStore.getState().recordFailure(targetNode.id, 'LB: No Healthy Web Servers');
                    }
                    else if (targetNode.type === 'web-server') {
                        if (packet.type === 'malicious') {
                            useGameStore.getState().updateCash(-50);
                            useGameStore.getState().damageNode(targetNode.id, 20);
                            useGameStore.getState().recordFailure(targetNode.id, 'Security Breach: Malicious Traffic on Web Server');
                        } else {
                            useGameStore.getState().updateCash(5);
                            // DISABLED DEGRADATION
                            // useGameStore.getState().damageNode(targetNode.id, 0.5);

                            if (packet.type === 'write' || packet.type === 'upload') {
                                const targetType = packet.type === 'write' ? 'database' : 's3';
                                const sent = relayPacket(targetNode.id, packet.type, [targetType]);
                                if (!sent) useGameStore.getState().recordFailure(targetNode.id, `App: Write Failed - No ${targetType} available`);
                            }
                            else {
                                const cached = relayPacket(targetNode.id, packet.type, ['cache']);
                                if (!cached) {
                                    const targetType = packet.type === 'static' ? 's3' : 'database';
                                    const sent = relayPacket(targetNode.id, packet.type, [targetType]);
                                    if (!sent) useGameStore.getState().recordFailure(targetNode.id, `App: Read Failed - No ${targetType} available`);
                                }
                            }
                        }
                    }
                    else if (targetNode.type === 'cache') {
                        let hitRate = 0;
                        if (packet.type === 'static') hitRate = 0.90;
                        else if (packet.type === 'read') hitRate = 0.40;
                        else if (packet.type === 'search') hitRate = 0.15;

                        if (Math.random() < hitRate) {
                            useGameStore.getState().updateCash(10);
                            useGameStore.setState(s => ({ score: s.score + 1 }));
                        } else {
                            const originType = packet.type === 'static' ? 's3' : 'database';
                            const sent = relayPacket(targetNode.id, packet.type, [originType]);
                            if (!sent) useGameStore.getState().recordFailure(targetNode.id, `Cache Miss: Origin ${originType} Unreachable`);
                        }
                    }
                    else if (targetNode.type === 'database') {
                        useGameStore.getState().updateCash(packet.type === 'write' ? 20 : 15);
                    }
                    else if (targetNode.type === 's3') {
                        useGameStore.getState().updateCash(packet.type === 'upload' ? 25 : 5);
                    }
                }
            } else {
                const point = packet.curve.getPoint(packet.progress);
                dummy.position.copy(point);
                dummy.scale.set(1, 1, 1);
                dummy.updateMatrix();
                meshRef.current!.setMatrixAt(i, dummy.matrix);
            }
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, MAX_PACKETS]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
        </instancedMesh>
    );
}
