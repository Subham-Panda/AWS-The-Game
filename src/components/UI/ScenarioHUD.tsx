'use client';

import { useGameStore, SCENARIOS } from '@/store/GameStore';
import { Trophy, Target, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

export function ScenarioHUD() {
    const activeScenario = useGameStore((state) => state.activeScenario);
    const cash = useGameStore((state) => state.cash);
    const reputation = useGameStore((state) => state.reputation);
    // Add other trackers like requests/score if needed later

    if (!activeScenario) return null; // Don't show in Sandbox/Menu

    const scenario = SCENARIOS[activeScenario];
    if (!scenario) return null;

    return (
        <div className="absolute top-[70px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-10">

            {/* Scenario Header Tag */}
            <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur border border-slate-700/50 px-4 py-1.5 rounded-full shadow-lg">
                <Trophy size={14} className="text-yellow-500" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">{scenario.name}</span>
                <div className="w-px h-3 bg-slate-700 mx-1" />
                <span className={clsx("text-[10px] font-bold px-1.5 py-0.5 rounded",
                    scenario.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                        scenario.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                )}>
                    {scenario.difficulty}
                </span>
            </div>

            {/* Goals Tracker */}
            <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-lg p-3 min-w-[300px] shadow-xl pointer-events-auto">
                <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <Target size={12} />
                    Mission Objectives
                </div>

                <div className="flex flex-col gap-2">
                    {scenario.goals.map((goal, i) => {
                        let isMet = false;
                        let current = 0;
                        let target = goal.target;

                        if (goal.type === 'cash') {
                            current = cash;
                            isMet = cash >= target;
                        } else if (goal.type === 'reputation') {
                            current = reputation;
                            isMet = reputation >= target;
                        }
                        // Add other types later

                        return (
                            <div key={i} className="flex flex-col gap-1">
                                <div className="flex justify-between items-center text-xs">
                                    <span className={isMet ? 'text-green-400 line-through opacity-70' : 'text-slate-200'}>
                                        {goal.label}
                                    </span>
                                    {isMet && <CheckCircle2 size={12} className="text-green-500" />}
                                </div>
                                {/* Progress Bar */}
                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className={clsx("h-full transition-all duration-500", isMet ? "bg-green-500" : "bg-blue-500")}
                                        style={{ width: `${Math.min(100, (current / target) * 100)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[9px] text-slate-500">
                                    <span>{current.toFixed(0)}</span>
                                    <span>{target.toFixed(0)}</span>
                                </div>
                            </div>
                        );
                    })}

                    {scenario.goals.length === 0 && (
                        <div className="text-xs text-slate-500 italic">Survival Mode - Keep the system running.</div>
                    )}
                </div>
            </div>

        </div>
    );
}
