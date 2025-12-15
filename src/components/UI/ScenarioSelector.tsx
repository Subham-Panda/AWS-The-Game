'use client';

import { useGameStore, SCENARIOS, ScenarioId, Scenario } from '@/store/GameStore';
import { clsx } from 'clsx';
import { Trophy, Zap, Shield, Activity, Skull, RefreshCw, Box, Play } from 'lucide-react';

const SCENARIO_ICONS: Record<ScenarioId, any> = {
    'sandbox': Box,
    'startup': Zap,
    'black-friday': Activity,
    'ddos': Shield,
    'high-throughput': RefreshCw,
    'chaos': Skull,
    'legacy': RefreshCw,
};

const DIFFICULTY_COLORS = {
    'Easy': 'text-green-400',
    'Medium': 'text-yellow-400',
    'Hard': 'text-red-400',
};

export function ScenarioSelector() {
    const startScenario = useGameStore((state) => state.startScenario);
    const activeScenario = useGameStore((state) => state.activeScenario);
    const setShowDashboard = useGameStore((state) => state.setShowDashboard);

    // If a scenario is already active, we don't show this.
    // Wait, we need a way to open this menu?
    // Let's assume this is the "Main Menu" if activeScenario is null?
    // Or we overlay it.

    // Logic: If activeScenario is null, we show this fullscreen? 
    // But GameStore defaults activeScenario to null on load? 
    // Actually, we initialized activeScenario to null in store.
    // So on first load, we should see this.

    if (activeScenario) return null;

    const handleStart = (id: ScenarioId) => {
        startScenario(id);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm">
            <div className="w-[1000px] h-[700px] max-h-[90vh] bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="p-8 border-b border-slate-800 bg-slate-950/50">
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Trophy className="text-yellow-500" />
                        Select Scenario
                    </h1>
                    <p className="text-slate-400">Choose your challenge. Build your legacy.</p>
                </div>

                {/* Grid */}
                <div className="flex-1 p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.values(SCENARIOS).map((scenario) => {
                        const Icon = SCENARIO_ICONS[scenario.id] || Box;
                        return (
                            <button
                                key={scenario.id}
                                onClick={() => handleStart(scenario.id)}
                                className="group relative flex flex-col items-start p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-slate-800 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300 text-left"
                            >
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Play className="text-blue-400 fill-blue-400/20" size={24} />
                                </div>

                                <div className="p-3 bg-slate-900 rounded-lg mb-4 border border-slate-700 group-hover:border-blue-500/30 group-hover:bg-blue-950/20 transition-colors">
                                    <Icon size={24} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                                </div>

                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{scenario.name}</h3>

                                <div className={clsx("text-xs font-bold uppercase tracking-wider mb-3", DIFFICULTY_COLORS[scenario.difficulty])}>
                                    {scenario.difficulty}
                                </div>

                                <p className="text-sm text-slate-400 mb-6 leading-relaxed flex-1">
                                    {scenario.description}
                                </p>

                                <div className="w-full pt-4 border-t border-slate-700/50">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">Goals</div>
                                    {scenario.goals.length > 0 ? (
                                        <div className="space-y-1">
                                            {scenario.goals.map((g, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                    {g.label}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-xs text-slate-500 italic">Open Ended</div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}
