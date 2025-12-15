'use client';

import { useGameStore } from '@/store/GameStore';
import { DollarSign, Users, Activity, XCircle } from 'lucide-react';
import { clsx } from 'clsx';

export function StatsPanel() {
    const cash = useGameStore((state) => state.cash);
    const score = useGameStore((state) => state.score);
    const failures = useGameStore((state) => state.failures);
    const reputation = useGameStore((state) => state.reputation);
    const chaosEnabled = useGameStore((state) => state.chaosEnabled);
    const setChaosEnabled = useGameStore((state) => state.setChaosEnabled);

    return (
        <div className="absolute top-0 left-0 w-full z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 py-3 shadow-2xl">
            {/* Left: Brand & Time */}
            <div className="flex items-center gap-6">
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

                <div className="h-4 w-px bg-slate-800" />

                <div className="flex gap-4 text-xs font-mono text-slate-400">
                    <div>REQ: <span className="text-white">{score}</span></div>
                    <div>TIME: <span className="text-white">00:00</span></div>
                </div>
            </div>

            {/* Middle: Reputation Bar */}
            <div className="absolute left-1/2 -translate-x-1/2 w-1/3 max-w-[400px]">
                <div className="flex justify-between text-[10px] mb-1 uppercase tracking-wider text-slate-500 font-bold">
                    <span>System Integrity</span>
                    <span className={reputation < 50 ? 'text-red-400' : 'text-cyan-400'}>{reputation}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                        className={`h-full transition-all duration-500 ${reputation < 50 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]'}`}
                        style={{ width: `${reputation}%` }}
                    />
                </div>
            </div>

            {/* Right: Budget */}
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Available Funds</div>
                    <div className={`text-lg font-mono font-bold leading-none ${cash < 0 ? 'text-red-500' : 'text-green-400'}`}>
                        ${cash.toLocaleString()}
                    </div>
                </div>
                <div className="bg-slate-800 p-2 rounded-lg text-slate-400">
                    <DollarSign size={16} />
                </div>
            </div>
        </div>
    );
}
