'use client';

import { useGameStore, SCENARIOS, ScenarioId, Scenario } from '@/store/GameStore';
import { clsx } from 'clsx';
import { Trophy, Zap, Shield, Activity, Skull, RefreshCw, Box, Play, Book, HardHat, GraduationCap, Filter } from 'lucide-react';
import { ManualContent } from './ManualContent';
import { useState } from 'react';

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
    'Easy': 'text-green-400 bg-green-400/10 border-green-400/20',
    'Medium': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    'Hard': 'text-red-400 bg-red-400/10 border-red-400/20',
};

type Tab = 'training' | 'challenges' | 'manual';
type DifficultyFilter = 'All' | 'Easy' | 'Medium' | 'Hard';

const TAB_DETAILS: Record<Tab, { title: string; description: string }> = {
    'training': { title: 'Training Simulation', description: 'Master the basics of cloud architecture in a controlled environment.' },
    'challenges': { title: 'Active Challenges', description: 'Test your skills against real-world scenarios and traffic spikes.' },
    'manual': { title: 'System Archives', description: 'Reference documentation for all nodes and protocols.' },
};

export function ScenarioSelector() {
    const startScenario = useGameStore((state) => state.startScenario);
    const activeScenario = useGameStore((state) => state.activeScenario);
    const setShowManual = useGameStore((state) => state.setShowManual);

    const [activeTab, setActiveTab] = useState<Tab>('training');
    const [difficulty, setDifficulty] = useState<DifficultyFilter>('All');

    if (activeScenario) return null;

    const handleStart = (id: ScenarioId) => {
        startScenario(id);
    };

    const handleOpenManual = () => {
        setShowManual(true);
    };

    // Filter Scenarios
    const scenarios = Object.values(SCENARIOS);
    const trainingScenarios = scenarios.filter(s => s.id === 'startup');
    const challengeScenarios = scenarios.filter(s => s.id !== 'startup' && (difficulty === 'All' || s.difficulty === difficulty));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-8 pointer-events-none">
            <div className="w-full max-w-6xl h-[80vh] bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex overflow-hidden animate-in fade-in zoom-in-95 duration-500 pointer-events-auto ring-1 ring-white/5">

                {/* Sidebar */}
                <div className="w-64 bg-slate-950/50 border-r border-white/5 flex flex-col backdrop-blur-md">
                    <div className="p-6 border-b border-white/5">
                        <div className="flex items-center gap-2 text-white font-black tracking-wider text-xl uppercase">
                            <Activity className="text-blue-500" />
                            Mission Control
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-1">V 2.1.0 // ONLINE</div>
                    </div>

                    <div className="flex-1 py-6 px-3 space-y-2">
                        <SidebarButton
                            active={activeTab === 'training'}
                            onClick={() => setActiveTab('training')}
                            icon={GraduationCap}
                            label="Training"
                            description="Learn the basics"
                        />
                        <SidebarButton
                            active={activeTab === 'challenges'}
                            onClick={() => setActiveTab('challenges')}
                            icon={Trophy}
                            label="Challenges"
                            description="Test your skills"
                        />
                        <SidebarButton
                            active={activeTab === 'manual'}
                            onClick={() => setActiveTab('manual')}
                            icon={Book}
                            label="Manual"
                            description="System Archives"
                        />
                    </div>

                    <div className="p-6 border-t border-white/5">
                        <div className="text-xs text-slate-600 font-mono text-center">
                            AWS ARCHITECTURE SIMULATION
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col bg-slate-900/30">

                    {/* Header */}
                    <div className="h-20 border-b border-slate-800 flex items-center justify-between px-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white capitalize">{TAB_DETAILS[activeTab].title}</h2>
                            <p className="text-slate-400 text-sm">{TAB_DETAILS[activeTab].description}</p>
                        </div>

                        {activeTab === 'challenges' && (
                            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
                                <Filter size={14} className="text-slate-500 ml-2" />
                                {(['All', 'Easy', 'Medium', 'Hard'] as const).map((d) => (
                                    <button
                                        key={d}
                                        onClick={() => setDifficulty(d)}
                                        className={clsx(
                                            "px-3 py-1 text-xs font-bold rounded-md transition-all",
                                            difficulty === d
                                                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                                                : "text-slate-400 hover:text-white hover:bg-slate-800"
                                        )}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-8">

                        {activeTab === 'manual' && (
                            <div className="h-full">
                                <ManualContent />
                            </div>
                        )}

                        {(activeTab === 'training' || activeTab === 'challenges') && (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {(activeTab === 'training' ? trainingScenarios : challengeScenarios).map((scenario) => (
                                    <ScenarioCard
                                        key={scenario.id}
                                        scenario={scenario}
                                        onStart={() => handleStart(scenario.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SidebarButton({ active, onClick, icon: Icon, label, description }: any) {
    return (
        <button
            onClick={onClick}
            className={clsx(
                "w-full p-4 rounded-xl flex items-center gap-4 transition-all duration-300 text-left group border border-transparent",
                active
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-900/20 border-blue-500/50"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-800"
            )}
        >
            <div className={clsx(
                "p-2 rounded-lg transition-colors",
                active ? "bg-white/20" : "bg-slate-800 group-hover:bg-slate-700"
            )}>
                <Icon size={20} className={active ? "text-white" : "text-slate-400 group-hover:text-white"} />
            </div>
            <div>
                <div className="font-bold text-sm tracking-wide">{label}</div>
                <div className={clsx("text-xs mt-0.5", active ? "text-blue-200" : "text-slate-600 group-hover:text-slate-500")}>
                    {description}
                </div>
            </div>
        </button>
    )
}

function ScenarioCard({ scenario, onStart }: { scenario: Scenario, onStart: () => void }) {
    const Icon = SCENARIO_ICONS[scenario.id] || Box;
    const difficultyColor = DIFFICULTY_COLORS[scenario.difficulty];

    return (
        <button
            onClick={onStart}
            className="group relative flex flex-col items-start p-6 bg-slate-800/40 border border-slate-700/50 rounded-2xl hover:bg-slate-800/80 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 text-left overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex w-full justify-between items-start mb-4 relative z-10">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 group-hover:border-blue-500/30 group-hover:bg-blue-950/30 transition-colors">
                    <Icon size={24} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                </div>
                <div className={clsx("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border", difficultyColor)}>
                    {scenario.difficulty}
                </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors relative z-10">
                {scenario.name}
            </h3>

            <p className="text-sm text-slate-400 mb-6 leading-relaxed min-h-[40px] relative z-10">
                {scenario.description}
            </p>

            <div className="w-full pt-4 border-t border-slate-700/50 mt-auto relative z-10">
                <div className="flex items-center justify-between">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">
                        {scenario.goals.length} Objective{scenario.goals.length !== 1 && 's'}
                    </div>
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-xs opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                        Launch <Play size={12} className="fill-current" />
                    </div>
                </div>
            </div>
        </button>
    );
}
