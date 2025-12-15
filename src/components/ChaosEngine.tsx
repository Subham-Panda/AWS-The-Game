'use client';

import { useGameStore } from '@/store/GameStore';
import { useEffect } from 'react';

export function ChaosEngine() {
    const nodes = useGameStore((state) => state.nodes);
    const setNodeStatus = useGameStore((state) => state.setNodeStatus);
    const chaosEnabled = useGameStore((state) => state.chaosEnabled);

    useEffect(() => {
        if (!chaosEnabled) return;

        // Run Chaos tick every 10 seconds (frequent enough for testing)
        const interval = setInterval(() => {
            // 50% chance of a failure event per tick (Boosted for testing)
            if (Math.random() < 0.5) {
                const activeNodes = nodes.filter(n =>
                    n.status === 'active' &&
                    n.type !== 'gateway' &&
                    n.type !== 'load-balancer'
                );

                if (activeNodes.length > 0) {
                    // Event Type: Random Node Failure or Zone Failure?
                    // 50% chance of ZONE FAILURE (Boosted for testing)
                    if (Math.random() < 0.5) {
                        // Pick a zone (Left = A, Right = B)
                        const zone = Math.random() < 0.5 ? 'A' : 'B';
                        const zoneNodes = activeNodes.filter(n =>
                            zone === 'A' ? n.position[0] < 0 : n.position[0] > 0
                        );

                        console.warn(`CHAOS EVENT: ZONE ${zone} OUTAGE!`);
                        zoneNodes.forEach(n => setNodeStatus(n.id, 'down'));

                    } else {
                        // Single Node Failure
                        const victim = activeNodes[Math.floor(Math.random() * activeNodes.length)];
                        console.warn(`CHAOS EVENT: Node ${victim.id} failed.`);
                        setNodeStatus(victim.id, 'down');
                    }
                }
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [nodes, setNodeStatus]);

    return null; // Logic only, no visible render
}
