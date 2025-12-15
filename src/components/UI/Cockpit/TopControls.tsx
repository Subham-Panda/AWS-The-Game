'use client';

import { useGameStore } from '@/store/GameStore';
import { Play, Pause, FastForward, RotateCcw, Wrench, BarChart3 } from 'lucide-react';
import { clsx } from 'clsx';

export function TopControls() {
    const isPaused = useGameStore((state) => state.isPaused);
    const timeScale = useGameStore((state) => state.timeScale);
    const setPaused = useGameStore((state) => state.setPaused);
    const setTimeScale = useGameStore((state) => state.setTimeScale);
    const autoRepairEnabled = useGameStore((state) => state.autoRepairEnabled);
    const setAutoRepairEnabled = useGameStore((state) => state.setAutoRepairEnabled);
    const resetToEmpty = useGameStore((state) => state.resetToEmpty);
    const showDashboard = useGameStore((state) => state.showDashboard);
    const setShowDashboard = useGameStore((state) => state.setShowDashboard);

    return (
        <div className="z-50 pointer-events-auto">
            <div className="bg-slate-950/80 backdrop-blur-md border border-slate-700/50 p-1.5 rounded-lg shadow-xl flex items-center gap-1">
                <button
                    onClick={() => {
                        resetToEmpty();
                        // window.location.reload(); // Do NOT reload
                    }}
                    className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded transition-colors"
                    title="Reset Game"
                >
                    <RotateCcw size={16} />
                </button>

                <div className="w-px h-4 bg-slate-800 mx-1" />

                <button
                    onClick={() => { setPaused(true); setTimeScale(0); }}
                    className={clsx(
                        "p-2 rounded transition-all",
                        isPaused ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/50" : "text-slate-400 hover:text-white hover:bg-slate-800"
                    )}
                    title="Pause"
                >
                    <Pause size={18} fill={isPaused ? "currentColor" : "none"} />
                </button>

                <button
                    onClick={() => { setPaused(false); setTimeScale(1); }}
                    className={clsx(
                        "p-2 rounded transition-all",
                        !isPaused && timeScale === 1 ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/50" : "text-slate-400 hover:text-white hover:bg-slate-800"
                    )}
                    title="Play"
                >
                    <Play size={18} fill={!isPaused && timeScale === 1 ? "currentColor" : "none"} />
                </button>

                <button
                    onClick={() => { setPaused(false); setTimeScale(3); }}
                    className={clsx(
                        "p-2 rounded transition-all",
                        !isPaused && timeScale === 3 ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/50" : "text-slate-400 hover:text-white hover:bg-slate-800"
                    )}
                    title="Fast Speed"
                >
                    <FastForward size={18} fill={!isPaused && timeScale === 3 ? "currentColor" : "none"} />
                </button>

                <div className="w-px h-4 bg-slate-800 mx-1" />

                {/* Dashboard Toggle */}
                <button
                    onClick={() => setShowDashboard(!showDashboard)}
                    className={clsx(
                        "p-2 rounded transition-all flex items-center gap-2",
                        showDashboard ? "bg-purple-900/50 text-purple-400 border border-purple-700/50" : "text-slate-500 hover:text-slate-300"
                    )}
                    title="Dashboard"
                >
                    <BarChart3 size={16} />
                </button>

                <div className="w-px h-4 bg-slate-800 mx-1" />

                {/* Auto Repair Toggle */}
                <button
                    onClick={() => setAutoRepairEnabled(!autoRepairEnabled)}
                    className={clsx(
                        "p-2 rounded transition-all flex items-center gap-2",
                        autoRepairEnabled ? "bg-cyan-900/50 text-cyan-400 border border-cyan-700/50" : "text-slate-500 hover:text-slate-300"
                    )}
                    title="Auto Repair ($60)"
                >
                    <Wrench size={14} className={autoRepairEnabled ? "animate-spin-slow" : ""} />
                    <div className={clsx("w-2 h-2 rounded-full", autoRepairEnabled ? "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "bg-slate-800")} />
                </button>
            </div >
        </div >
    );
}
