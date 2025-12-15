'use client';

import { useGameStore } from '@/store/GameStore';
import { Cable } from './Cable';

export function ConnectionManager() {
    const connections = useGameStore((state) => state.connections);
    const nodes = useGameStore((state) => state.nodes);

    return (
        <group>
            {connections.map((conn) => {
                const sourceNode = nodes.find(n => n.id === conn.sourceId);
                const targetNode = nodes.find(n => n.id === conn.targetId);

                if (!sourceNode || !targetNode) return null;

                return (
                    <Cable
                        key={conn.id}
                        start={sourceNode.position}
                        end={targetNode.position}
                    />
                );
            })}
        </group>
    );
}
