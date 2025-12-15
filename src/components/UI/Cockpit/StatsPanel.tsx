'use client';

import { useGameStore } from '@/store/GameStore';
import { DollarSign, Users, Activity, XCircle, BarChart3, FlaskConical } from 'lucide-react';
import { clsx } from 'clsx';

export function StatsPanel() {
    const cash = useGameStore((state) => state.cash);
    const score = useGameStore((state) => state.score);
    const failures = useGameStore((state) => state.failures);
    const reputation = useGameStore((state) => state.reputation);
    const nodes = useGameStore((state) => state.nodes);
    const showDashboard = useGameStore((state) => state.showDashboard);
    const setShowDashboard = useGameStore((state) => state.setShowDashboard);
    const researchPoints = useGameStore((state) => state.researchPoints);
    const setShowTechTree = useGameStore((state) => state.setShowTechTree);

    // Derived Metrics
    const totalLoad = nodes.reduce((acc, n) => acc + (n.currentLoad || 0), 0);
    const avgHealth = nodes.length > 0
        ? Math.round(nodes.reduce((acc, n) => acc + n.health, 0) / nodes.length)
        : 100;

    return (
        <div className="absolute top-0 left-0 w-full z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 py-3 shadow-2xl pointer-events-auto">
            {/* Left: Brand & Time */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-cyan-500/10 p-2 rounded-lg text-cyan-400 border border-cyan-500/20">
                        <Users size={18} />
                    </div>
                    <div>
                        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Requests</div>
                        <div className="text-xl font-mono text-white leading-none">{score.toLocaleString()}</div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-red-500/10 p-2 rounded-lg text-red-400 border border-red-500/20">
                        <XCircle size={18} />
                    </div>
                    <div>
                        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Failures</div>
                        <div className="text-xl font-mono text-red-500 leading-none">-{failures.toLocaleString()}</div>
                    </div>
                </div>

                {/* Monitor Button (Moved from TopControls) */}
                <button
                    onClick={() => setShowDashboard(!showDashboard)}
                    className={clsx(
                        "ml-2 p-2 rounded-lg transition-all border",
                        showDashboard
                            ? "bg-purple-500 text-white border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                            : "bg-slate-800 text-slate-400 border-slate-700 hover:text-purple-400 hover:border-purple-500/50"
                    )}
                    title="Open Service Monitor"
                >
                    <BarChart3 size={20} />
                </button>

                <div className="h-8 w-px bg-slate-800 mx-2" />

                {/* Live Metrics */}
                <div className="flex flex-col gap-0.5 text-xs font-mono text-slate-400">
                    <div className="flex justify-between w-[120px]">
                        <span>LOAD:</span>
                        <span className={clsx("font-bold", totalLoad > 500 ? "text-yellow-400" : "text-white")}>
                            {totalLoad} RPS
                        </span>
                    </div>
                    <div className="flex justify-between w-[120px]">
                        <span>HEALTH:</span>
                        <span className={clsx("font-bold", avgHealth < 80 ? "text-red-400" : "text-cyan-400")}>
                            {avgHealth}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Middle: Reputation Bar */}
            <div className="absolute left-1/2 -translate-x-1/2 w-1/4 max-w-[300px]">
                <div className="flex justify-between text-[10px] mb-1 uppercase tracking-wider text-slate-500 font-bold">
                    <span>User Satisfaction</span>
                    <span className={reputation < 50 ? 'text-red-400' : 'text-cyan-400'}>{Math.round(reputation)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                        className={`h-full transition-all duration-500 ${reputation < 50 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]'}`}
                        style={{ width: `${reputation}%` }}
                    />
                </div>
            </div>

            {/* Right: Budget & Research */}
            <div className="flex items-center gap-6">
                {/* Research Points */}
                <button
                    onClick={() => setShowTechTree(true)}
                    className="flex items-center gap-2 group cursor-pointer hover:bg-slate-800/50 p-1 rounded-lg transition-all"
                    title="Click to Open Research Lab"
                >
                    <div className="text-right">
                        <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider group-hover:text-blue-300">Research</div>
                        <div className="text-lg font-mono font-bold leading-none text-blue-400 group-hover:text-blue-300">
                            {Math.floor(researchPoints).toLocaleString()}
                        </div>
                    </div>
                    <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400 border border-blue-500/20 group-hover:bg-blue-500/20 group-hover:border-blue-400 transition-colors">
                        <FlaskConical size={16} />
                    </div>
                </button>

                <div className="h-8 w-px bg-slate-800" />

                {/* Cash */}
                <div className="flex items-center gap-2">
                    <div className="text-right">
                        <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Available Funds</div>
                        <div className={`text-lg font-mono font-bold leading-none ${cash < 0 ? 'text-red-500' : 'text-green-400'}`}>
                            ${cash.toLocaleString()}
                        </div>
                    </div>
                    <div className="bg-green-500/10 p-2 rounded-lg text-green-400 border border-green-500/20">
                        <DollarSign size={16} />
                    </div>
                </div>
            </div>
        </div>
    );
}
