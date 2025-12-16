'use client';

import { useGameStore, NodeType, SelectedTool } from '@/store/GameStore';
import { Server, Database, Globe, Network, Shield, Layers, HardDrive, Zap, MousePointer2, Scissors, Trash2, ChevronLeft, ChevronRight, Hammer, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { soundManager } from '@/systems/SoundManager';

export function Toolbar() {
    const setDraggedItem = useGameStore((state) => state.setDraggedItem);
    const draggedItem = useGameStore((state) => state.draggedItem);
    const cash = useGameStore((state) => state.cash);
    const selectedTool = useGameStore((state) => state.selectedTool);
    const setSelectedTool = useGameStore((state) => state.setSelectedTool);

    // Global mouse up to cancel drag if dropped outside/anywhere
    useEffect(() => {
        const handleMouseUp = () => setDraggedItem(null);
        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }, [setDraggedItem]);

    const [showTools, setShowTools] = useState(true);
    const [showBuild, setShowBuild] = useState(true);

    const BUILD_ITEMS: { type: NodeType; label: string; cost: number; icon: any; color: string }[] = [
        { type: 'gateway', label: 'Gateway', cost: 500, icon: Globe, color: 'text-purple-400' },
        { type: 'waf', label: 'WAF', cost: 300, icon: Shield, color: 'text-red-400' },
        { type: 'load-balancer', label: 'LB', cost: 200, icon: Network, color: 'text-orange-400' },
        { type: 'web-server', label: 'Compute', cost: 100, icon: Server, color: 'text-green-400' },
        { type: 'sqs', label: 'Queue', cost: 150, icon: Layers, color: 'text-yellow-400' },
        { type: 'database', label: 'DB', cost: 200, icon: Database, color: 'text-blue-400' },
        { type: 'cache', label: 'Cache', cost: 150, icon: Zap, color: 'text-yellow-400' },
        { type: 's3', label: 'Storage', cost: 50, icon: HardDrive, color: 'text-cyan-400' },
    ];

    const TOOL_ITEMS: { id: SelectedTool; label: string; icon: any; color: string }[] = [
        { id: 'select', label: 'Select', icon: MousePointer2, color: 'text-blue-400' },
        { id: 'link', label: 'Connect', icon: Network, color: 'text-green-400' },
        { id: 'unlink', label: 'Disconnect', icon: Scissors, color: 'text-yellow-400' },
        { id: 'demolish', label: 'Destroy', icon: Trash2, color: 'text-red-400' },
    ];

    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
            <div className="bg-slate-950/80 backdrop-blur-md border border-slate-700/50 rounded-lg shadow-2xl flex flex-row items-center p-1.5 transition-all duration-300">

                {/* --- TOOLS SECTION --- */}
                <div className="flex flex-row items-center gap-2">
                    {/* Toggle */}
                    <button
                        onClick={() => { setShowTools(!showTools); soundManager.playUiClick(); }}
                        className={clsx(
                            "w-8 h-8 flex items-center justify-center rounded hover:bg-slate-800 text-slate-500 hover:text-white transition-colors",
                            !showTools && "bg-slate-900 text-blue-400"
                        )}
                        title={showTools ? "Collapse" : "Tools"}
                    >
                        {showTools ? <ChevronLeft size={14} /> : <MousePointer2 size={16} />}
                    </button>

                    {/* Items */}
                    <div className={clsx(
                        "flex flex-row gap-2 overflow-hidden transition-all duration-300",
                        showTools ? "max-w-[300px] opacity-100" : "max-w-0 opacity-0"
                    )}>
                        {TOOL_ITEMS.map((item) => {
                            const isActive = selectedTool === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => { setSelectedTool(item.id); soundManager.playUiClick(); }}
                                    className={clsx(
                                        "relative group flex items-center justify-center w-10 h-10 rounded-lg transition-all border",
                                        isActive ? "bg-slate-800 border-white/40 shadow-lg scale-105" : "bg-transparent border-transparent hover:bg-slate-800/50",
                                    )}
                                    title={item.label}
                                >
                                    <item.icon className={clsx("w-5 h-5", isActive ? item.color : "text-slate-400 group-hover:text-white")} />
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-50 pointer-events-none">
                                        <div className="text-[10px] font-bold text-white">{item.label}</div>
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-700" />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* --- DIVIDER --- */}
                <div className="w-px h-8 bg-slate-800 mx-2" />

                {/* --- BUILD SECTION --- */}
                <div className="flex flex-row items-center gap-2">

                    {/* Items */}
                    <div className={clsx(
                        "flex flex-row gap-2 overflow-hidden transition-all duration-300",
                        showBuild ? "max-w-[500px] opacity-100" : "max-w-0 opacity-0"
                    )}>
                        {BUILD_ITEMS.map((item) => {
                            const canAfford = cash - item.cost >= -1000;
                            const isActive = draggedItem === item.type;

                            return (
                                <button
                                    key={item.type}
                                    onMouseDown={() => canAfford && setDraggedItem(item.type)}
                                    className={clsx(
                                        "relative group flex items-center justify-center w-10 h-10 rounded-lg transition-all border",
                                        isActive ? "bg-slate-800 border-white/40 shadow-lg scale-105" : "bg-transparent border-transparent hover:bg-slate-800/50",
                                        !canAfford && "opacity-40 cursor-not-allowed grayscale"
                                    )}
                                    title={`${item.label} ($${item.cost})`}
                                >
                                    <item.icon className={clsx("w-5 h-5", item.color)} />

                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 px-2 py-1 rounded hidden group-hover:block w-[100px] z-50 pointer-events-none text-center">
                                        <div className="text-[10px] font-bold text-white mb-0.5">{item.label}</div>
                                        <div className="text-[9px] text-slate-400">Cost: <span className="text-white">${item.cost}</span></div>
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-700" />
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Toggle */}
                    <button
                        onClick={() => { setShowBuild(!showBuild); soundManager.playUiClick(); }}
                        className={clsx(
                            "w-8 h-8 flex items-center justify-center rounded hover:bg-slate-800 text-slate-500 hover:text-white transition-colors",
                            !showBuild && "bg-slate-900 text-purple-400"
                        )}
                        title={showBuild ? "Collapse" : "Build"}
                    >
                        {showBuild ? <ChevronRight size={14} /> : <Hammer size={16} />}
                    </button>

                </div>

                {/* --- DIVIDER --- */}
                <div className="w-px h-8 bg-slate-800 mx-2" />

                {/* --- HELP --- */}
                <button
                    onClick={() => { useGameStore.getState().setShowManual(true); soundManager.playUiClick(); }}
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-800 text-slate-500 hover:text-white transition-colors"
                    title="Help Manual"
                >
                    <HelpCircle size={18} />
                </button>

            </div>
        </div>
    );
}
