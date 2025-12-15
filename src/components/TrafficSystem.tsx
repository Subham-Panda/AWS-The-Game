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
            const state = useGameStore.getState();
            const { nodes, updateNodeLoad, unlockedTechs, addNode, removeNode, cash, updateCash, addLog } = state;

            // 1. Report Load
            const currentCounts = loadCounts.current;
            Object.keys(currentCounts).forEach(id => {
                const count = currentCounts[id];
                if (count > 0) {
                    updateNodeLoad(id, count);
                    currentCounts[id] = 0; // Reset
                }
            });

            // 2. Auto-Scaling Logic (Phase 15)
            if (unlockedTechs.includes('auto-scaling')) {
                const servers = nodes.filter(n => n.type === 'web-server' && n.status === 'active');
                if (servers.length > 0) {
                    const totalLoad = servers.reduce((acc, n) => acc + (n.currentLoad || 0), 0);
                    // Calculate Total Capacity
                    const totalCapacity = servers.reduce((acc, n) => {
                        const tier = n.tier || 1;
                        const config = TIER_CONFIG['web-server'][tier - 1];
                        return acc + (config ? config.capacity : 10);
                    }, 0);

                    const utilization = totalCapacity > 0 ? totalLoad / totalCapacity : 0;

                    // Scale Out (> 80%)
                    if (utilization > 0.8) {
                        const cost = TIER_CONFIG['web-server'][0].cost || 0; // Cost of Tier 1
                        if (cash >= cost) {
                            const id = `asg-${Date.now()}`;
                            // Simple Grid Positioning for ASG
                            // Start at [-8, -8] and fill right?
                            const offset = servers.length;
                            const x = (offset % 5) * 3 - 6;
                            const y = -8 - Math.floor(offset / 5) * 3;

                            updateCash(-cost);
                            addNode({
                                id,
                                type: 'web-server',
                                position: [x, y, 0],
                                status: 'active',
                                health: 100
                            });
                            addLog('info', `Auto-Scaling: Added Server ${id} (High Load: ${(utilization * 100).toFixed(0)}%)`, 'ASG');

                            // Auto-wire to LB?
                            // For now, let's assume "Smart LB" detects it if we update GameStore connections?
                            // Actually, standard logic requires manual linking.
                            // BUT Auto-Scaling implies Auto-Wiring.
                            // Let's Find specific LB and connect.
                            const lb = nodes.find(n => n.type === 'load-balancer');
                            if (lb) {
                                state.addConnection(lb.id, id);
                            }
                        }
                    }
                    // Scale In (< 30%)
                    else if (utilization < 0.3 && servers.length > 2) {
                        // Remove last added (non-initial)
                        // Initial nodes were manually placed. Let's only remove 'asg-' nodes if possible?
                        // Or just remove the last one in the array.
                        const victim = servers[servers.length - 1];
                        // Safety: Don't delete if only 2 left (Min Size)

                        removeNode(victim.id);
                        // Connections auto-cleanup? No, modify GameStore removeNode if needed? 
                        // GameStore removeNode doesn't cleanup connections. 
                        // Fix: Manually cleanup connections.
                        state.connections
                            .filter(c => c.sourceId === victim.id || c.targetId === victim.id)
                            .forEach(c => state.removeConnection(c.sourceId, c.targetId));

                        addLog('info', `Auto-Scaling: Terminated Server ${victim.id} (Low Load: ${(utilization * 100).toFixed(0)}%)`, 'ASG');
                    }
                }
            }
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

    // Helper for rewards
    const recordTransaction = (cashReward: number, scoreReward: number = 1) => {
        useGameStore.getState().updateCash(cashReward);
        useGameStore.getState().incrementRequestsServed(); // Added
        if (scoreReward > 0) {
            useGameStore.setState(s => ({ score: s.score + scoreReward }));
            // Research Points: 1 RP per 10 successful requests (0.1 per request)
            useGameStore.getState().addResearchPoints(scoreReward * 0.1);
        }
    };

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
                    } else {
                        // Punish for disconnected gateway
                        useGameStore.getState().recordFailure(gw.id, 'Gateway: No Route');
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
                        } else {
                            useGameStore.getState().recordFailure(gw.id, 'Gateway: No Route');
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
                            recordTransaction(0, 5); // Score +5, No Cash
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
                            // 50% Chance of SQL Injection (Try to reach Database)
                            if (Math.random() < 0.5) {
                                const sent = relayPacket(targetNode.id, packet.type, ['database']);
                                if (!sent) {
                                    // Failed to reach DB (Good? Or just query failed?)
                                    // Let's say if no DB, it's just a failed attack
                                    useGameStore.getState().addLog('info', 'SQL Injection blocked: No Database connected.', targetNode.id);
                                }
                            } else {
                                // standard web defacement
                                useGameStore.getState().updateCash(-50);
                                useGameStore.getState().damageNode(targetNode.id, 20);
                                useGameStore.getState().recordFailure(targetNode.id, 'Security Breach: Web Server Defaced');
                            }
                        } else {
                            recordTransaction(5, 1);
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
                            recordTransaction(10, 1);
                        } else {
                            const originType = packet.type === 'static' ? 's3' : 'database';
                            const sent = relayPacket(targetNode.id, packet.type, [originType]);
                            if (!sent) useGameStore.getState().recordFailure(targetNode.id, `Cache Miss: Origin ${originType} Unreachable`);
                        }
                    }
                    else if (targetNode.type === 'database') {
                        if (packet.type === 'malicious') {
                            // CRITICAL DATA LEAK
                            useGameStore.getState().updateCash(-250);
                            useGameStore.getState().updateReputation(-10);
                            useGameStore.getState().damageNode(targetNode.id, 50);
                            useGameStore.getState().recordFailure(targetNode.id, 'CRITICAL: SQL Injection Data Leak');
                        } else {
                            recordTransaction(packet.type === 'write' ? 20 : 15, 1);
                        }
                    }
                    else if (targetNode.type === 's3') {
                        recordTransaction(packet.type === 'upload' ? 25 : 5, 1);
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
