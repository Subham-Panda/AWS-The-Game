'use client';

import { useGameStore, NodeType } from '@/store/GameStore';
import { useRef } from 'react';
import { Mesh } from 'three';
import { Html } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';

interface InfrastructureNodeProps {
    id: string;
    type: NodeType;
    position: [number, number, number];
    status: 'active' | 'down' | 'rebooting';
}

export function InfrastructureNode({ id, type, position, status, health }: InfrastructureNodeProps & { health: number }) {
    const selectedNodeId = useGameStore((state) => state.selectedNodeId);
    const selectNode = useGameStore((state) => state.selectNode);
    const addConnection = useGameStore((state) => state.addConnection);
    const repairNode = useGameStore((state) => state.repairNode);
    const selectedTool = useGameStore((state) => state.selectedTool);
    const removeNode = useGameStore((state) => state.removeNode);
    const validateConnection = useGameStore((state) => state.validateConnection);
    const removeConnection = useGameStore((state) => state.removeConnection);

    const isSelected = selectedNodeId === id;

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();

        if (selectedTool === 'demolish') {
            removeNode(id);
            return;
        }

        if (selectedTool === 'link') {
            if (!selectedNodeId) {
                // Step 1: Select Source
                selectNode(id);
            } else {
                if (selectedNodeId === id) {
                    // Deselect if clicking self
                    selectNode(null);
                    return;
                }

                // Step 2: Try to Connect
                if (validateConnection(selectedNodeId, id)) {
                    addConnection(selectedNodeId, id);
                    selectNode(null); // Reset after connection
                } else {
                    console.warn("Invalid Connection");
                }
            }
            return;
        }

        if (selectedTool === 'unlink') {
            if (!selectedNodeId) {
                // Step 1: Select Source for disconnection
                selectNode(id);
            } else {
                if (selectedNodeId === id) {
                    selectNode(null);
                    return;
                }
                // Step 2: Remove Connection
                removeConnection(selectedNodeId, id); // Removes connection between A and B
                selectNode(null);
            }
            return;
        }

        // Default: Select
        // If Down, click to Repair (takes precedence over select if not linking/demolishing)
        if (status === 'down') {
            repairNode(id);
            return;
        }

        selectNode(isSelected ? null : id);
    };

    const getMaterial = () => {
        // Status overrides
        if (status === 'down') return <meshStandardMaterial color="#1a1a1a" emissive="#ff0000" emissiveIntensity={0.5} />;
        if (status === 'rebooting') return <meshStandardMaterial color="#fbbf24" />;

        // Type colors
        switch (type) {
            case 'gateway': return <meshStandardMaterial color="#a855f7" />;
            case 'load-balancer': return <meshStandardMaterial color="#f97316" />;
            case 'web-server': return <meshStandardMaterial color="#22c55e" />;
            case 'database': return <meshStandardMaterial color="#3b82f6" />;
            case 'waf': return <meshStandardMaterial color="#ef4444" />;
            case 'sqs': return <meshStandardMaterial color="#eab308" />;
            case 'cache': return <meshStandardMaterial color="#fcd34d" />;
            case 's3': return <meshStandardMaterial color="#06b6d4" />;
            default: return <meshStandardMaterial color="#ffffff" />;
        }
    };

    const getGeometry = () => {
        switch (type) {
            case 'load-balancer':
            case 'database':
            case 'cache':
            case 's3':
            case 'gateway': // Gateway is also cylinder-ish usually
                return <cylinderGeometry args={[0.5, 0.5, 0.5, 32]} />;
            default: // web-server, waf, sqs
                return <boxGeometry args={[1, 0.5, 1]} />;
        }
    };

    const getLabel = () => {
        if (status === 'down') return "OFFLINE";
        if (status === 'rebooting') return "BOOTING";

        switch (type) {
            case 'gateway': return "Gateway";
            case 'load-balancer': return "LB";
            case 'web-server': return "Server";
            case 'database': return "DB";
            case 'waf': return "WAF";
            case 'sqs': return "SQS";
            case 'cache': return "Redis";
            case 's3': return "S3";
            default: return "Node";
        }
    };

    return (
        <group position={position}>
            {/* Selection Glow/Ring */}
            {isSelected && (
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
                    <ringGeometry args={[0.8, 1, 32]} />
                    <meshBasicMaterial color="#facc15" />
                </mesh>
            )}

            {/* The Node Block */}
            <mesh onClick={handleClick} castShadow receiveShadow>
                {getGeometry()}
                {getMaterial()}
            </mesh>

            {/* Label & Health Bar */}
            <Html position={[0, 1.4, 0]} center>
                <div className="flex flex-col items-center gap-1 transition-all select-none">
                    {/* Health Bar (Only show if not perfect or selected) */}
                    {(health < 100 || isSelected) && status !== 'down' && (
                        <div className="w-12 h-1 bg-slate-900/80 rounded-full overflow-hidden border border-slate-700/50 backdrop-blur-sm">
                            <div
                                className={`h-full transition-all duration-300 ${health > 50 ? 'bg-green-500' :
                                    health > 20 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                style={{ width: `${health}%` }}
                            />
                        </div>
                    )}

                    {/* Label Badge */}
                    <div className={`px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap backdrop-blur-md shadow-lg ${status === 'down' ? 'bg-red-950/90 text-red-200 border-red-500 animate-pulse' :
                        status === 'rebooting' ? 'bg-yellow-950/90 text-yellow-200 border-yellow-500 animate-pulse' :
                            isSelected ? 'bg-slate-800/90 text-white border-white scale-105 z-10' :
                                'bg-slate-900/60 text-slate-300 border-slate-700/50 hover:bg-slate-800/80'
                        }`}>
                        {getLabel()}
                    </div>
                </div>
            </Html>
        </group>
    );
}
