'use client';

import { useGameStore, TIER_CONFIG } from '@/store/GameStore';
import { Activity, Cpu, Trash2, Wrench, ChevronUp, Zap } from 'lucide-react';
import { clsx } from 'clsx';

export function InspectorPanel() {
    const selectedNodeId = useGameStore((state) => state.selectedNodeId);
    const nodes = useGameStore((state) => state.nodes);
    const cash = useGameStore((state) => state.cash);
    const removeNode = useGameStore((state) => state.removeNode);
    const selectNode = useGameStore((state) => state.selectNode); // To deselect
    const upgradeNode = useGameStore((state) => state.upgradeNode);

    const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : null;

    if (!selectedNode) {
        // Empty State (Keep existing)
        return (
            <div className="absolute top-[70px] right-4 z-40 flex flex-col gap-4 pointer-events-none opacity-50">
                <div className="bg-slate-950/80 backdrop-blur border border-slate-700/50 p-4 rounded-lg w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-slate-500" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">No Selection</span>
                    </div>
                </div>
            </div>
        );
    }

    // Tier Info
    // TIER_CONFIG is [Tier 1, Tier 2, ...] i.e. Index 0 = Tier 1.
    // selectedNode.tier is 1-based (1..5).
    // So current capacity = TIER_CONFIG[type][tier - 1].capacity
    const tierConfig = TIER_CONFIG[selectedNode.type];
    const currentStats = tierConfig ? tierConfig[selectedNode.tier - 1] : { capacity: 100, cost: 0 };
    const maxLoad = currentStats.capacity;
    const currentLoad = selectedNode.currentLoad || 0; // Handled by updated interface

    // Upgrade Info
    const nextTierIndex = selectedNode.tier; // e.g. Tier 1 -> Index 1 (Tier 2 config)
    const nextTierStats = tierConfig && selectedNode.tier < 5 ? tierConfig[nextTierIndex] : null;
    const canAffordUpgrade = nextTierStats && cash >= nextTierStats.cost;

    return (
        <div className="absolute top-[70px] right-4 z-40 flex flex-col gap-4">
            <div className="bg-slate-950/90 backdrop-blur-xl border-l-2 border-l-cyan-500 border-y border-r border-y-slate-800 border-r-slate-800 p-5 rounded-r-lg rounded-bl-lg shadow-2xl w-[280px]">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="text-[10px] text-cyan-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                            <Cpu size={12} />
                            {selectedNode.type}
                        </div>
                        <div className="text-white font-mono font-bold text-lg truncate w-[140px]">{selectedNode.id.slice(0, 8)}...</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${selectedNode.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                            selectedNode.status === 'rebooting' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 animate-pulse' :
                                'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse'
                            }`}>
                            {selectedNode.status}
                        </div>
                        <div className="text-[10px] font-mono text-purple-400 font-bold border border-purple-500/30 bg-purple-500/10 px-1.5 rounded">
                            T{selectedNode.tier}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Health Bar */}
                    <div>
                        <div className="flex justify-between text-[10px] mb-1.5 uppercase font-bold text-slate-500">
                            <span>Integrity</span>
                            <span className={clsx(
                                selectedNode.health > 80 ? "text-green-400" :
                                    selectedNode.health > 40 ? "text-yellow-400" : "text-red-400"
                            )}>{Math.round(selectedNode.health)}%</span>
                        </div>
                        <div className="h-1 w-full bg-slate-800">
                            <div
                                className={clsx(
                                    "h-full transition-all duration-300 shadow-[0_0_8px_rgba(6,182,212,0.6)]",
                                    selectedNode.health > 80 ? "bg-green-500" :
                                        selectedNode.health > 40 ? "bg-yellow-500" : "bg-red-500"
                                )}
                                style={{ width: `${selectedNode.health}%` }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-900 border border-slate-800 p-2 rounded">
                            <div className="text-slate-500 mb-0.5 text-[9px] uppercase">Traffic Load</div>
                            <div className={clsx("font-mono font-bold", currentLoad > maxLoad ? "text-red-500 animate-pulse" : "text-white")}>
                                {currentLoad} <span className="text-slate-500 text-[10px]">/ {maxLoad}</span>
                            </div>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-2 rounded">
                            <div className="text-slate-500 mb-0.5 text-[9px] uppercase">Upkeep Cost</div>
                            <div className="text-red-400 font-mono font-bold">-${selectedNode.type === 'database' ? (2 * selectedNode.tier).toFixed(2) : (1 * selectedNode.tier).toFixed(2)}/s</div>
                        </div>
                    </div>

                    {/* UPGRADE SECTION */}
                    {nextTierStats ? (
                        <div className="bg-purple-950/20 border border-purple-500/20 p-3 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-purple-300 uppercase">Upgrade to Tier {selectedNode.tier + 1}</span>
                                <span className="text-[10px] font-mono text-purple-200">Cap: {nextTierStats.capacity} req/s</span>
                            </div>
                            <button
                                onClick={() => upgradeNode(selectedNode.id)}
                                disabled={!canAffordUpgrade}
                                className={clsx(
                                    "w-full py-1.5 rounded textxs font-bold flex items-center justify-center gap-2 transition-all border",
                                    canAffordUpgrade
                                        ? "bg-purple-600 hover:bg-purple-500 text-white border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                                        : "bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed"
                                )}
                            >
                                <ChevronUp size={14} />
                                {canAffordUpgrade ? `UPGRADE ($${nextTierStats.cost})` : `NEED $${nextTierStats.cost}`}
                            </button>
                        </div>
                    ) : (
                        <div className="text-center p-2 text-[10px] text-slate-500 font-bold uppercase border border-slate-800 rounded bg-slate-900/50">
                            Max Tier Reached
                        </div>
                    )}
                </div>

                {/* Repair Action */}
                {/* ... Rest of existing ... (Actually we are replacing until line 105, which is mostly the end) */}
                {selectedNode.health < 100 && selectedNode.status !== 'down' && (
                    <div className="mt-4">
                        <button
                            onClick={() => useGameStore.getState().repairNode(selectedNode.id)}
                            className="w-full bg-cyan-950/50 hover:bg-cyan-900/50 text-cyan-400 border border-cyan-800 rounded py-2 text-xs font-bold transition-all flex items-center justify-center gap-2 group mb-2"
                        >
                            <Wrench size={14} className="group-hover:animate-spin-slow" />
                            REPAIR UNIT ($50)
                        </button>
                    </div>
                )}

                <div className="border-t border-slate-800 mt-5 pt-4">
                    <button
                        onClick={() => {
                            removeNode(selectedNode.id);
                            selectNode(null);
                        }}
                        className="w-full bg-slate-900 hover:bg-red-950/30 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-900/50 rounded py-2 text-xs font-bold transition-all flex items-center justify-center gap-2 group"
                    >
                        <Trash2 size={14} className="group-hover:text-red-500" />
                        DECOMMISSION UNIT
                    </button>
                </div>
            </div>
        </div>
    );
}
