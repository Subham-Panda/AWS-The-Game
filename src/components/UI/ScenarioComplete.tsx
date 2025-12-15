'use client';

import { useGameStore, SCENARIOS } from '@/store/GameStore';
import { Trophy, Home, ArrowRight, BarChart3 } from 'lucide-react';

export function ScenarioComplete() {
    const activeScenario = useGameStore((state) => state.activeScenario);
    const scenarioComplete = useGameStore((state) => state.scenarioComplete);
    const resetToEmpty = useGameStore((state) => state.resetToEmpty);

    // Stats
    const cash = useGameStore((state) => state.cash);
    const failures = useGameStore((state) => state.failures);
    const reputation = useGameStore((state) => state.reputation);

    if (!activeScenario || !scenarioComplete) return null;

    const scenario = SCENARIOS[activeScenario];

    const handleReturnToMenu = () => {
        resetToEmpty(); // Clears everything and goes back to null scenario
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in zoom-in duration-500">
            <div className="w-[500px] bg-slate-900 border-2 border-yellow-500/50 rounded-2xl shadow-[0_0_50px_rgba(234,179,8,0.3)] overflow-hidden flex flex-col relative">

                {/* Decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />

                {/* Header */}
                <div className="p-8 pb-4 text-center">
                    <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                        <Trophy size={40} className="text-yellow-400" />
                    </div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-1">Scenario Complete!</h1>
                    <p className="text-yellow-500 font-bold text-sm tracking-widest">{scenario.name}</p>
                </div>

                {/* Stats Grid */}
                <div className="p-8 pt-4">
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-center">
                            <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Final Cash</div>
                            <div className="text-xl font-mono text-green-400 font-bold">${cash.toFixed(0)}</div>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-center">
                            <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Failures</div>
                            <div className="text-xl font-mono text-red-400 font-bold">{failures}</div>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-center">
                            <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Reputation</div>
                            <div className="text-xl font-mono text-cyan-400 font-bold">{reputation.toFixed(0)}%</div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleReturnToMenu}
                            className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black uppercase tracking-wider rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                        >
                            <Home size={18} />
                            Return to Menu
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
