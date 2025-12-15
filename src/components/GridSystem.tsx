'use client';

import { Grid } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import { useGameStore } from '@/store/GameStore';
import { Text } from '@react-three/drei';


export function GridSystem() {
    const { draggedItem, updateCursorPosition, addNode, cursorPosition, nodes } = useGameStore();

    // Raycast Handler
    const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
        // Round to nearest integer for grid snap
        const x = Math.round(e.point.x);
        const z = Math.round(e.point.z);

        // Y is always 0.5 (sitting on floor)
        updateCursorPosition([x, 0.5, z]);
    };

    const handlePointerUp = () => {
        if (draggedItem) {
            // Check for overlap
            const isOccupied = nodes.some(n =>
                n.position[0] === cursorPosition[0] &&
                n.position[2] === cursorPosition[2]
            );

            if (!isOccupied) {
                // Prices matching Sidebar
                const COSTS: Record<string, number> = {
                    'web-server': 100,
                    'database': 200,
                    'load-balancer': 200,
                    'gateway': 500
                };

                const cost = COSTS[draggedItem] || 0;

                // Double check funds (validation also happened in UI, but good for safety)
                const currentCash = useGameStore.getState().cash;
                if (currentCash - cost >= -1000) {
                    useGameStore.getState().updateCash(-cost);
                    addNode({
                        id: crypto.randomUUID(),
                        type: draggedItem,
                        position: cursorPosition,
                        status: 'active',
                        health: 100,
                    });
                }
            }

            // We rely on the global mouseUp listener in Sidebar to clear draggedItem,
            // but we can also do it here if needed. 
            // Ideally, the placement logic is here.
        }
    };

    return (
        <group>
            {/* Visual Grid Helper - Made brighter/white for contrast */}
            <Grid
                infiniteGrid
                cellSize={1}
                sectionSize={10}
                fadeDistance={100}
                sectionColor="#ffffff" // White major lines
                cellColor="#aaaaaa"    // Light gray minor lines
                sectionThickness={1.5}
                cellThickness={1}
            />

            {/* Zone A (Blue) */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[-25, -0.05, 0]} // Pushed lower to avoid z-fighting with grid
            >
                <planeGeometry args={[50, 100]} />
                <meshBasicMaterial color="#3b82f6" transparent opacity={0.15} />
            </mesh>
            <Text
                position={[-25, 0.1, -40]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={4}
                color="#60a5fa" // Lighter blue for text
                fillOpacity={0.8}
            >
                ZONE A (us-east-1a)
            </Text>

            {/* Zone B (Orange) */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[25, -0.05, 0]} // Pushed lower
            >
                <planeGeometry args={[50, 100]} />
                <meshBasicMaterial color="#f97316" transparent opacity={0.15} />
            </mesh>
            <Text
                position={[25, 0.1, -40]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={4}
                color="#fb923c" // Lighter orange for text
                fillOpacity={0.8}
            >
                ZONE B (us-east-1b)
            </Text>

            {/* Invisible Floor Plane for Raycasting */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -0.01, 0]}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            >
                <planeGeometry args={[1000, 1000]} />
                <meshBasicMaterial visible={false} />
            </mesh>
        </group>
    );
}
