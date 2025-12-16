'use client';

import { useGameStore } from '@/store/GameStore';
import { X, DollarSign, PieChart, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { useEffect, useState } from 'react';

export function FinOpsDashboard() {
    const showFinOps = useGameStore((state) => state.showFinOps);
    const setShowFinOps = useGameStore((state) => state.setShowFinOps);
    const getCostBreakdown = useGameStore((state) => state.getCostBreakdown);
    const cash = useGameStore((state) => state.cash);
    const nodes = useGameStore((state) => state.nodes);

    // We need to trigger re-render to update costs as simulation runs
    // Since getCostBreakdown is a getter, it computes on the fly.
    // We can use a hook to force update or just rely on nodes changing.
    // Zustand subscribes to nodes, so it should re-render.

    // Calculate Breakdown
    const breakdown = getCostBreakdown();
    const totalCost = breakdown.total;

    // Estimate Income (Hard to get precise rate without tracking it over time in store, 
    // but we can estimate based on load or just show "Burn Rate" for now).
    // Let's assume average revenue per request is approx $0.1 (or whatever logic is).
    // Actually, let's just focus on COST first as per FinOps.

    if (!showFinOps) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-[800px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-500/10 p-2 rounded-lg text-green-400 border border-green-500/20">
                            <DollarSign size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Financial Operations</h2>
                            <p className="text-xs text-slate-400">Cloud Cost Management & Budgeting</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowFinOps(false)}
                        className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 grid grid-cols-3 gap-6">
                    {/* Left Column: Metrics */}
                    <div className="col-span-1 space-y-4">
                        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                            <div className="text-xs text-slate-500 font-bold uppercase mb-1">Total Funds</div>
                            <div className={clsx("text-2xl font-mono font-bold", cash < 0 ? "text-red-500" : "text-green-400")}>
                                ${cash.toLocaleString()}
                            </div>
                        </div>

                        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                            <div className="text-xs text-slate-500 font-bold uppercase mb-1">Current Burn Rate</div>
                            <div className="text-xl font-mono font-bold text-red-400 flex items-center gap-2">
                                <TrendingDown size={18} />
                                ${totalCost}/s
                            </div>
                            <div className="text-[10px] text-slate-600 mt-2">
                                Operational Expenditure (OpEx) based on active resources.
                            </div>
                        </div>

                        {/* Budget Alert (Mockup for now) */}
                        <div className="bg-yellow-950/20 p-4 rounded-xl border border-yellow-900/30">
                            <div className="flex items-center gap-2 text-yellow-500 mb-2">
                                <AlertTriangle size={16} />
                                <span className="text-xs font-bold uppercase">Budget Health</span>
                            </div>
                            {totalCost > 50 ? (
                                <div className="text-xs text-yellow-200">
                                    High Spend! Consider rightsizing DBs or removing unused instances.
                                </div>
                            ) : (
                                <div className="text-xs text-green-400">
                                    Spend is within healthy limits.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Breakdown Chart */}
                    <div className="col-span-2 space-y-6">
                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                            <PieChart size={16} /> Cost Breakdown by Service
                        </h3>

                        <div className="space-y-4">
                            {/* Compute */}
                            <CostBar
                                label="Compute (EC2/LB)"
                                value={breakdown.compute}
                                total={totalCost}
                                color="bg-purple-500"
                                textColor="text-purple-400"
                            />
                            {/* Database */}
                            <CostBar
                                label="Database (RDS)"
                                value={breakdown.database}
                                total={totalCost}
                                color="bg-blue-500"
                                textColor="text-blue-400"
                            />
                            {/* Storage */}
                            <CostBar
                                label="Storage (S3)"
                                value={breakdown.storage}
                                total={totalCost}
                                color="bg-cyan-500"
                                textColor="text-cyan-400"
                            />
                            {/* Security */}
                            <CostBar
                                label="Security (WAF/Gateway)"
                                value={breakdown.security}
                                total={totalCost}
                                color="bg-red-500"
                                textColor="text-red-400"
                            />
                        </div>

                        <div className="mt-8 p-4 bg-slate-800/30 rounded-lg">
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Cost Optimization Tips</h4>
                            <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
                                {breakdown.database > breakdown.compute && (
                                    <li>Databases are your biggest expense. Ensure you aren't over-provisioning tiers.</li>
                                )}
                                {breakdown.security > 20 && (
                                    <li>Security costs are high. Are you under attack?</li>
                                )}
                                {cash < 500 && (
                                    <li>Funds running low. Pause non-critical services.</li>
                                )}
                                <li>Use Auto-Scaling (R&D) to optimize compute costs automatically.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CostBar({ label, value, total, color, textColor }: { label: string, value: number, total: number, color: string, textColor: string }) {
    const percentage = total > 0 ? (value / total) * 100 : 0;

    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400 font-medium">{label}</span>
                <span className={clsx("font-mono font-bold", textColor)}>${value}/s ({percentage.toFixed(1)}%)</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                    className={clsx("h-full transition-all duration-500", color)}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
