'use client';

import { useGameStore } from '@/store/GameStore';
import { useEffect } from 'react';

export function HUD() {
    const cash = useGameStore((state) => state.cash);
    const score = useGameStore((state) => state.score);
    const nodes = useGameStore((state) => state.nodes);
    const tickEconomy = useGameStore((state) => state.tickEconomy);

    // Economy Tick: Run every second
    useEffect(() => {
        const interval = setInterval(() => {
            tickEconomy();
        }, 1000);
        return () => clearInterval(interval);
    }, [tickEconomy]);

    const serverCount = nodes.filter(n => n.type === 'web-server').length;
    const dbCount = nodes.filter(n => n.type === 'database').length;

    return (
        <div className="absolute top-4 right-4 z-50 flex flex-col gap-4 pointer-events-none items-end">
            {/* Main Stats Card */}
            <div className="bg-slate-800/90 backdrop-blur border border-slate-700 p-4 rounded-xl shadow-2xl min-w-[200px]">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Cash</span>
                    <span className={`text-xl font-mono font-bold ${cash < 0 ? 'text-red-500' : 'text-green-400'}`}>
                        ${cash.toLocaleString()}
                    </span>
                </div>

                {cash <= -1000 && (
                    <div className="bg-red-500/20 border border-red-500 text-red-100 px-2 py-1 rounded text-xs text-center mb-2 font-bold animate-pulse">
                        BANKRUPT!
                    </div>
                )}

                <div className="h-px bg-slate-700 my-2" />

                <div className="flex justify-between text-sm text-slate-300">
                    <span>Request Score:</span>
                    <span className="font-bold text-white">{score}</span>
                </div>
            </div>

            {/* Infrastructure Counts */}
            <div className="flex gap-2">
                <div className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300">
                    Servers: <span className="text-white font-bold">{serverCount}</span>
                </div>
                <div className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300">
                    DBs: <span className="text-white font-bold">{dbCount}</span>
                </div>
            </div>
        </div>
    );
}
