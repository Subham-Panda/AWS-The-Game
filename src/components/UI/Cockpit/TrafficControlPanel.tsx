'use client';

import { useGameStore } from '@/store/GameStore';
import { Settings, Sliders, BarChart3, AlertTriangle, CloudRain, Search, Database, HardDrive, FileCode, ShieldAlert } from 'lucide-react';
import { clsx } from 'clsx';
import { useState } from 'react';

export function TrafficControlPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const config = useGameStore((state) => state.trafficConfig);
    const setConfig = useGameStore((state) => state.setTrafficConfig);

    const toggleMode = () => {
        setConfig({ mode: config.mode === 'aggregate' ? 'granular' : 'aggregate' });
    };

    const updateDistribution = (type: keyof typeof config.distribution, value: number) => {
        setConfig({
            distribution: {
                ...config.distribution,
                [type]: value
            }
        });
    };

    const updateGranular = (type: keyof typeof config.granularRates, value: number) => {
        setConfig({
            granularRates: {
                ...config.granularRates,
                [type]: value
            }
        });
    };

    const TYPES = [
        { id: 'static', label: 'Static', icon: FileCode, color: 'text-cyan-400' },
        { id: 'read', label: 'Read', icon: Database, color: 'text-blue-400' },
        { id: 'write', label: 'Write', icon: Database, color: 'text-orange-400' },
        { id: 'search', label: 'Search', icon: Search, color: 'text-pink-400' },
        { id: 'upload', label: 'Upload', icon: HardDrive, color: 'text-purple-400' },
        { id: 'malicious', label: 'Attack', icon: ShieldAlert, color: 'text-red-500' },
    ] as const;

    return (
        <div className="z-40 pointer-events-auto">
            <div className={clsx(
                "bg-slate-950/90 backdrop-blur-xl border border-slate-700/50 rounded-lg shadow-2xl transition-all duration-300 overflow-hidden",
                isOpen ? "w-[300px]" : "w-[48px] h-[48px]"
            )}>
                {/* Header / Toggle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full h-[48px] flex items-center px-3 hover:bg-slate-800/50 transition-colors"
                    title="Traffic"
                >
                    <Settings className="w-6 h-6 text-slate-400 shrink-0" />
                    {isOpen && <span className="ml-3 font-bold text-slate-200 text-sm uppercase tracking-wider">Traffic Control</span>}
                </button>

                {isOpen && (
                    <div className="p-4 pt-0 space-y-6">
                        {/* Mode Switcher */}
                        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                            <button
                                onClick={() => setConfig({ mode: 'aggregate' })}
                                className={clsx(
                                    "flex-1 py-1.5 text-[10px] font-bold uppercase rounded flex items-center justify-center gap-2 transition-all",
                                    config.mode === 'aggregate' ? "bg-cyan-900/50 text-cyan-400 shadow" : "text-slate-500 hover:text-slate-300"
                                )}
                            >
                                <BarChart3 size={14} /> Total
                            </button>
                            <button
                                onClick={() => setConfig({ mode: 'granular' })}
                                className={clsx(
                                    "flex-1 py-1.5 text-[10px] font-bold uppercase rounded flex items-center justify-center gap-2 transition-all",
                                    config.mode === 'granular' ? "bg-purple-900/50 text-purple-400 shadow" : "text-slate-500 hover:text-slate-300"
                                )}
                            >
                                <Sliders size={14} /> Granular
                            </button>
                        </div>

                        {config.mode === 'aggregate' ? (
                            <div className="space-y-4">
                                {/* Total Rate Slider */}
                                <div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-slate-400 font-bold uppercase">Global Traffic Load</span>
                                        <span className="text-cyan-400 font-mono font-bold">{config.totalRate} req/s</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0" max="50" step="1"
                                        value={config.totalRate}
                                        onChange={(e) => setConfig({ totalRate: parseInt(e.target.value) })}
                                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                    />
                                </div>

                                <div className="h-px bg-slate-800" />

                                {/* Distribution Sliders */}
                                <div className="space-y-3">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Traffic Mix (%)</div>
                                    {TYPES.map(type => (
                                        <div key={type.id} className="flex items-center gap-3">
                                            <div className={clsx("p-1.5 rounded bg-slate-900", type.color)}>
                                                <type.icon size={12} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between text-[10px] mb-1">
                                                    <span className="text-slate-300">{type.label}</span>
                                                    <span className="text-slate-500 font-mono">{config.distribution[type.id]}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0" max="100" step="5"
                                                    value={config.distribution[type.id]}
                                                    onChange={(e) => updateDistribution(type.id, parseInt(e.target.value))}
                                                    className={clsx("w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer",
                                                        type.id === 'malicious' ? "accent-red-500" : "accent-slate-500"
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Specific Rates (Req/s)</div>
                                {TYPES.map(type => (
                                    <div key={type.id} className="flex items-center gap-3">
                                        <div className={clsx("p-1.5 rounded bg-slate-900", type.color)}>
                                            <type.icon size={12} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between text-[10px] mb-1">
                                                <span className="text-slate-300">{type.label}</span>
                                                <span className="text-slate-500 font-mono">{config.granularRates[type.id]} /s</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0" max="20" step="0.5"
                                                value={config.granularRates[type.id]}
                                                onChange={(e) => updateGranular(type.id, parseFloat(e.target.value))}
                                                className={clsx("w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer",
                                                    type.id === 'malicious' ? "accent-red-500" : "accent-slate-500"
                                                )}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded text-[10px] text-purple-300">
                                    Total Load: <span className="font-bold text-white">{
                                        Object.values(config.granularRates).reduce((a, b) => a + b, 0).toFixed(1)
                                    } req/s</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
