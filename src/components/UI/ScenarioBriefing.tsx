'use client';

import { useGameStore, SCENARIOS } from '@/store/GameStore';
import { clsx } from 'clsx';
import { Play, Rocket, AlertCircle, Info } from 'lucide-react';

export function ScenarioBriefing() {
    const activeScenario = useGameStore((state) => state.activeScenario);
    const showBriefing = useGameStore((state) => state.showBriefing);
    const setShowBriefing = useGameStore((state) => state.setShowBriefing);
    const setPaused = useGameStore((state) => state.setPaused);
    const setTimeScale = useGameStore((state) => state.setTimeScale);

    if (!activeScenario || !showBriefing) return null;

    const scenario = SCENARIOS[activeScenario];
    if (!scenario) return null;

    const handleStart = () => {
        setShowBriefing(false);
        // User stays paused until they are ready to click Play
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-[600px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">

                {/* Header */}
                <div className="h-40 bg-gradient-to-br from-blue-900 to-slate-900 p-8 flex flex-col justify-end relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-20">
                        <Rocket size={120} className="text-white" />
                    </div>
                    <div className="text-blue-400 font-bold tracking-widest uppercase mb-2 text-xs">Mission Briefing</div>
                    <h1 className="text-4xl font-bold text-white mb-2">{scenario.name}</h1>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    <div className="flex gap-4">
                        <div className="bg-slate-800 p-2 rounded-lg h-fit">
                            <Info className="text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Situation</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {scenario.description}
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                        <h3 className="text-sm font-bold text-slate-300 uppercase mb-3 flex items-center gap-2">
                            <AlertCircle size={14} className="text-yellow-500" />
                            Primary Objectives
                        </h3>
                        <ul className="space-y-2">
                            {scenario.goals.length > 0 ? scenario.goals.map((g, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-slate-200">
                                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold border border-blue-500/50">
                                        {i + 1}
                                    </span>
                                    {g.label}
                                </li>
                            )) : (
                                <li className="text-sm text-slate-400 italic">No specific targets. Just survive.</li>
                            )}
                        </ul>
                    </div>

                    <button
                        onClick={handleStart}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg shadow-blue-900/20"
                    >
                        <Play size={20} fill="currentColor" />
                        Start Mission
                    </button>
                    <p className="text-center text-slate-500 text-xs">
                        Time will start automatically when you click Start.
                    </p>
                </div>

            </div>
        </div>
    );
}
