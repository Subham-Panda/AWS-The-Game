'use client';

import { useGameStore } from '@/store/GameStore';
import { X, BookOpen, MousePointer2, ShieldAlert, Cpu, Network, Zap } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

const TABS = [
    { id: 'basics', label: 'Basics', icon: BookOpen },
    { id: 'controls', label: 'Controls', icon: MousePointer2 },
    { id: 'components', label: 'Nodes', icon: Cpu },
    { id: 'advanced', label: 'Advanced', icon: Zap },
];

export function HelpManual() {
    const showManual = useGameStore((state) => state.showManual);
    const setShowManual = useGameStore((state) => state.setShowManual);
    const [activeTab, setActiveTab] = useState('basics');

    if (!showManual) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowManual(false)} />

            <div className="relative w-[800px] h-[600px] bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl flex overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Sidebar */}
                <div className="w-64 bg-slate-950/50 border-r border-slate-800 p-6 flex flex-col gap-2">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <BookOpen className="text-blue-500" />
                        Manual
                    </h2>

                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={clsx(
                                "w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors",
                                activeTab === tab.id
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <tab.icon size={18} />
                            <span className="font-medium">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 p-8 overflow-y-auto bg-slate-900">
                    <button
                        onClick={() => setShowManual(false)}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full"
                    >
                        <X size={20} />
                    </button>

                    {activeTab === 'basics' && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-white">Welcome to Cloud Tycoon</h3>
                            <p className="text-slate-300 leading-relaxed">
                                Your goal is to build a resilient cloud architecture capable of serving requests while withstanding traffic spikes and cyber attacks.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                                    <div className="text-green-400 font-bold mb-1">Make Money</div>
                                    <p className="text-sm text-slate-400">Earn Cash by successfully processing requests (Blue Packets). Use Cash to buy more servers.</p>
                                </div>
                                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                                    <div className="text-blue-400 font-bold mb-1">Research Tech</div>
                                    <p className="text-sm text-slate-400">Earn Research Points (RP) to unlock advanced tech like Auto-Scaling and CDNs.</p>
                                </div>
                            </div>

                            <div className="bg-red-950/30 border border-red-900/50 p-4 rounded-xl">
                                <h4 className="flex items-center gap-2 text-red-400 font-bold mb-2">
                                    <ShieldAlert size={18} />
                                    Don't Fail!
                                </h4>
                                <p className="text-sm text-red-200/70">
                                    Failed requests drop your <b>Reputation</b>. If Reputation hits 0, you lose. Avoid dead-ends and overloaded servers!
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'controls' && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-white">Controls</h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                                    <span className="text-slate-200">Select / Interact</span>
                                    <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-400 text-xs">Left Click</kbd>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                                    <span className="text-slate-200">Pan Camera</span>
                                    <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-400 text-xs">Right Click + Drag</kbd>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                                    <span className="text-slate-200">Zoom</span>
                                    <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-400 text-xs">Scroll Wheel</kbd>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h4 className="text-lg font-bold text-white mb-3">Toolbar Modes</h4>
                                <ul className="space-y-2 text-slate-400 text-sm">
                                    <li><strong className="text-blue-400">Link Tool</strong>: Click visible Source, then Target to connect cables.</li>
                                    <li><strong className="text-red-400">Demolish</strong>: Click any node to Refund 50% of its cost.</li>
                                    <li><strong className="text-green-400">Repair</strong>: Manually fix broken nodes ($50 cost).</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === 'components' && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-white">Infrastructure Nodes</h3>

                            <div className="space-y-4">
                                <NodeCard title="Gateway" color="text-purple-400" desc="Entry point for all traffic. Connects to WAF or Load Balancers." />
                                <NodeCard title="WAF (Firewall)" color="text-red-400" desc="Filters malicious traffic. Essential for preventing security breaches." />
                                <NodeCard title="Load Balancer" color="text-orange-400" desc="Distributes traffic evenly to connected Web Servers. Prevents overload." />
                                <NodeCard title="Web Server" color="text-green-400" desc="Processes requests. Needs CPU capacity and a connection to a Database." />
                                <NodeCard title="Database" color="text-blue-400" desc="Stores data. High upkeep cost but essential for dynamic requests." />
                                <NodeCard title="Redis Cache" color="text-yellow-400" desc="Caches queries. Reduces load on the Database significantly." />
                            </div>
                        </div>
                    )}

                    {activeTab === 'advanced' && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-white">Advanced Mechanics</h3>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-blue-400 font-bold">Auto-Scaling</h4>
                                    <p className="text-slate-400 text-sm">
                                        Once researched, your system will automatically purchase and deploy new Web Servers when load exceeds 80%, and decommission them when load drops below 30%.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-purple-400 font-bold">Multi-AZ Resilience</h4>
                                    <p className="text-slate-400 text-sm">
                                        Distribute your nodes across Zone A and B. Unlocking the Multi-AZ tech reduces the reputation penalty for failures by 50%.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-orange-400 font-bold">Chaos Mode</h4>
                                    <p className="text-slate-400 text-sm">
                                        Enable Chaos Mode in the top bar to randomly destroy nodes. Use this to test if your redundancy works!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function NodeCard({ title, color, desc }: { title: string, color: string, desc: string }) {
    return (
        <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-lg flex flex-col">
            <span className={clsx("font-bold text-sm", color)}>{title}</span>
            <span className="text-slate-400 text-xs">{desc}</span>
        </div>
    );
}
