'use client';

import { useGameStore, TECH_TREE, TechNode } from '@/store/GameStore';
import { X, Check, Lock, FlaskConical, ArrowRight, Zap } from 'lucide-react';
import { clsx } from 'clsx';

// CONSTANTS FOR LAYOUT
const CARD_WIDTH = 260;
const CARD_HEIGHT = 140;
const GRID_X_SPACING = 340; // Horizontal gap between columns
const GRID_Y_SPACING = 200; // Vertical gap between rows
const CANVAS_PADDING = 100;

export function TechTree() {
    const showTechTree = useGameStore((state) => state.showTechTree);
    const setShowTechTree = useGameStore((state) => state.setShowTechTree);
    const unlockedTechs = useGameStore((state) => state.unlockedTechs);
    const researchPoints = useGameStore((state) => state.researchPoints);
    const unlockTech = useGameStore((state) => state.unlockTech);

    if (!showTechTree) return null;

    // Helper: Calculate Node Position
    const getNodePos = (tech: TechNode) => {
        // position[0] = Row (Tier), position[1] = Col (Index)
        // Let's invert this mapping if needed, but GameStore says:
        // Tier 1: [0,0], [0,1]
        // Tier 2: [1,0], [1,1]
        // Tier 3: [2,0]

        // Let's assume Vertical Tree:
        // Y = Tier * SPACING
        // X = Col * SPACING + (Center check?)

        // Actually, let's keep it simple:
        // X = Col * GRID_X_SPACING + CANVAS_PADDING
        // Y = Row * GRID_Y_SPACING + CANVAS_PADDING

        return {
            x: tech.position[1] * GRID_X_SPACING + CANVAS_PADDING + 50, // +50 to center horizontally a bit?
            y: tech.position[0] * GRID_Y_SPACING + CANVAS_PADDING
        };
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
                onClick={() => setShowTechTree(false)}
            />

            {/* Modal Container */}
            <div className="relative w-[95%] max-w-6xl h-[90%] bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="h-20 px-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur pointer-events-auto z-20">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-600 p-3 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                            <FlaskConical size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">Research Lab</h2>
                            <p className="text-slate-400 text-sm">Unlock advanced cloud architecture.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="text-right">
                            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Available RP</div>
                            <div className="text-3xl font-mono font-bold text-blue-400 leading-none shadow-blue-500/20 drop-shadow-sm">
                                {Math.floor(researchPoints).toLocaleString()}
                            </div>
                        </div>
                        <button
                            onClick={() => setShowTechTree(false)}
                            className="bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition-colors text-slate-400 hover:text-white border border-slate-700"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Scrollable Canvas */}
                <div className="flex-1 overflow-auto bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-800 to-slate-950 relative">
                    {/* Grid Background */}
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none bg-repeat" />

                    <div className="relative w-full h-full min-w-[1000px] min-h-[800px]">

                        {/* 1. Connections Layer (SVG) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                            {TECH_TREE.map(tech =>
                                tech.requirements.map(reqId => {
                                    const reqNode = TECH_TREE.find(t => t.id === reqId);
                                    if (!reqNode) return null;

                                    const startPos = getNodePos(reqNode);
                                    const endPos = getNodePos(tech);

                                    // Bezier Curve Control Points
                                    // Start from Bottom Center of Req -> Top Center of Tech
                                    const x1 = startPos.x + CARD_WIDTH / 2;
                                    const y1 = startPos.y + CARD_HEIGHT; // Bottom of card

                                    const x2 = endPos.x + CARD_WIDTH / 2;
                                    const y2 = endPos.y; // Top of card

                                    // Curve handles vertical
                                    const midY = (y1 + y2) / 2;

                                    const pathD = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;

                                    const isUnlocked = unlockedTechs.includes(tech.id);
                                    const canUnlock = unlockedTechs.includes(reqId);
                                    const isNext = canUnlock && !isUnlocked;

                                    return (
                                        <path
                                            key={`${reqId}-${tech.id}`}
                                            d={pathD}
                                            fill="none"
                                            stroke={isUnlocked ? '#3b82f6' : isNext ? '#64748b' : '#334155'}
                                            strokeWidth={isUnlocked ? 3 : 2}
                                            strokeOpacity={isUnlocked ? 0.8 : 0.4}
                                            // Add dashed line if locked?
                                            strokeDasharray={isUnlocked ? "0" : "5 5"}
                                            className="transition-all duration-500"
                                        />
                                    );
                                })
                            )}
                        </svg>

                        {/* 2. Nodes Layer */}
                        {TECH_TREE.map(tech => {
                            const pos = getNodePos(tech);
                            const isUnlocked = unlockedTechs.includes(tech.id);
                            const requirementsMet = tech.requirements.every(r => unlockedTechs.includes(r));
                            const canAfford = researchPoints >= tech.cost;
                            const isUnlockable = requirementsMet && !isUnlocked;

                            return (
                                <div
                                    key={tech.id}
                                    className={clsx(
                                        "absolute flex flex-col justify-between p-5 rounded-xl border-2 transition-all duration-300 z-10",
                                        "w-[260px] h-[140px]",
                                        // Dynamic Styling
                                        isUnlocked
                                            ? "bg-slate-900 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/50"
                                            : isUnlockable
                                                ? "bg-slate-800 border-slate-600 hover:border-blue-400 hover:bg-slate-800 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
                                                : "bg-slate-900/90 border-slate-800 opacity-60 grayscale cursor-not-allowed"
                                    )}
                                    style={{
                                        left: pos.x,
                                        top: pos.y,
                                    }}
                                    onClick={() => isUnlockable && canAfford && unlockTech(tech.id)}
                                >
                                    {/* Header */}
                                    <div className="flex justify-between items-start">
                                        <div className={clsx(
                                            "p-2 rounded-lg transition-colors border",
                                            isUnlocked
                                                ? "bg-blue-500 text-white border-blue-400"
                                                : "bg-slate-700 text-slate-400 border-slate-600"
                                        )}>
                                            {isUnlocked ? <Check size={16} strokeWidth={3} /> : <Lock size={16} />}
                                        </div>

                                        {!isUnlocked && (
                                            <div className={clsx(
                                                "font-mono font-bold text-sm px-2 py-1 rounded bg-slate-950 border",
                                                canAfford ? "text-green-400 border-green-900/50" : "text-red-400 border-red-900/50"
                                            )}>
                                                {tech.cost} RP
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <h3 className={clsx(
                                            "font-bold text-base mb-1",
                                            isUnlocked ? "text-blue-100" : "text-slate-300 group-hover:text-white"
                                        )}>
                                            {tech.label}
                                        </h3>
                                        <p className="text-[11px] text-slate-400 leading-tight">
                                            {tech.description}
                                        </p>
                                    </div>

                                    {/* Call to Action (Only if unlockable) */}
                                    {isUnlockable && (
                                        <div className={clsx(
                                            "absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 transition-opacity",
                                            canAfford && "group-hover:opacity-100"
                                        )} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Animation variants could be added here later
