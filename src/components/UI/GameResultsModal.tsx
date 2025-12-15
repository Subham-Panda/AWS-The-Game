'use client';

import { useGameStore, SCENARIOS } from '@/store/GameStore';
import { Trophy, AlertTriangle, Clock, RefreshCw, Home, XCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { useEffect, useState } from 'react';

export function GameResultsModal() {
    const activeScenario = useGameStore((state) => state.activeScenario);
    const scenarioComplete = useGameStore((state) => state.scenarioComplete);
    const isPaused = useGameStore((state) => state.isPaused);
    const reputation = useGameStore((state) => state.reputation);
    const scenarioElapsedTime = useGameStore((state) => state.scenarioElapsedTime);

    // Actions
    const resetToEmpty = useGameStore((state) => state.resetToEmpty);
    const startScenario = useGameStore((state) => state.startScenario);

    const [show, setShow] = useState(false);
    const [result, setResult] = useState<'win' | 'loss' | null>(null);

    // Detect Game End State
    useEffect(() => {
        if (!activeScenario) {
            setShow(false);
            return;
        }

        if (scenarioComplete) {
            setResult('win');
            setShow(true);
        } else if (isPaused && reputation <= 0) {
            setResult('loss');
            setShow(true);
        } else {
            setShow(false);
        }
    }, [activeScenario, scenarioComplete, isPaused, reputation]);

    if (!show || !activeScenario) return null;

    const scenario = SCENARIOS[activeScenario];
    const isWin = result === 'win';

    const handleRetry = () => {
        startScenario(activeScenario);
        setShow(false);
    };

    const handleMenu = () => {
        resetToEmpty();
        setShow(false);
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-500">
            <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-8 transform animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="flex flex-col items-center gap-4 text-center mb-8">
                    <div className={clsx(
                        "p-4 rounded-full border-4 shadow-[0_0_40px_-10px]",
                        isWin ? "bg-green-500/20 border-green-500 text-green-400 shadow-green-500/50"
                            : "bg-red-500/20 border-red-500 text-red-400 shadow-red-500/50"
                    )}>
                        {isWin ? <Trophy size={48} fill="currentColor" /> : <XCircle size={48} />}
                    </div>

                    <div>
                        <h2 className={clsx("text-3xl font-black uppercase tracking-wider", isWin ? "text-white" : "text-red-500")}>
                            {isWin ? "Mission Accomplished" : "System Failure"}
                        </h2>
                        <p className="text-slate-400 text-lg mt-1 font-medium">
                            {scenario.name}
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 flex flex-col items-center">
                        <span className="text-xs font-bold text-slate-500 uppercase">Duration</span>
                        <div className="text-xl font-mono font-bold text-white flex items-center gap-2">
                            <Clock size={16} /> {scenarioElapsedTime}s
                        </div>
                    </div>
                    <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 flex flex-col items-center">
                        <span className="text-xs font-bold text-slate-500 uppercase">Final Reputation</span>
                        <div className={clsx("text-xl font-mono font-bold flex items-center gap-2", reputation > 0 ? "text-blue-400" : "text-red-400")}>
                            {reputation}%
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-4">
                    <button
                        onClick={handleMenu}
                        className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all border border-transparent hover:border-slate-600 flex items-center justify-center gap-2"
                    >
                        <Home size={18} /> Menu
                    </button>
                    <button
                        onClick={handleRetry}
                        className={clsx(
                            "flex-1 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                            isWin
                                ? "bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20"
                                : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"
                        )}
                    >
                        <RefreshCw size={18} /> Retry
                    </button>
                </div>

            </div>
        </div>
    );
}
