'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { BookOpen, MousePointer2, ShieldAlert, Cpu, Zap } from 'lucide-react';

const TABS = [
    { id: 'basics', label: 'Basics', icon: BookOpen },
    { id: 'controls', label: 'Controls', icon: MousePointer2 },
    { id: 'components', label: 'Nodes', icon: Cpu },
    { id: 'advanced', label: 'Advanced', icon: Zap },
];

export function ManualContent() {
    const [activeTab, setActiveTab] = useState('basics');

    return (
        <div className="flex flex-col h-full bg-slate-900/50 rounded-xl overflow-hidden">
            {/* Nav Bar */}
            <div className="flex items-center gap-2 p-4 border-b border-slate-700/50 bg-slate-950/30">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={clsx(
                            "px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all",
                            activeTab === tab.id
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        )}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {activeTab === 'basics' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="prose prose-invert max-w-none">
                            <h3 className="text-2xl font-bold text-white mb-4">Welcome to Cloud: The Game</h3>
                            <p className="text-slate-300 leading-relaxed text-lg">
                                Your goal is to build a resilient cloud architecture capable of serving requests while withstanding traffic spikes and cyber attacks.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                                <div className="text-green-400 font-bold mb-2 text-lg">Make Money</div>
                                <p className="text-sm text-slate-400 leading-relaxed">Earn Cash by successfully processing requests (Blue Packets). Use Cash to buy and upgrade servers.</p>
                            </div>
                            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                                <div className="text-blue-400 font-bold mb-2 text-lg">Research Tech</div>
                                <p className="text-sm text-slate-400 leading-relaxed">Earn Research Points (RP) to unlock advanced tech like Auto-Scaling and CDNs.</p>
                            </div>
                        </div>

                        <div className="bg-red-950/20 border border-red-900/30 p-6 rounded-xl">
                            <h4 className="flex items-center gap-2 text-red-400 font-bold mb-2 text-lg">
                                <ShieldAlert size={20} />
                                Don't Fail!
                            </h4>
                            <p className="text-sm text-red-200/70 leading-relaxed">
                                Failed requests drop your <b className="text-red-400">Reputation</b>. If Reputation hits 0, you lose. Avoid dead-ends, incorrectly routed traffic, and overloaded servers!
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'controls' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4">Mouse Controls</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <ControlCard label="Select / Interact" value="Left Click" />
                                <ControlCard label="Pan Camera" value="Right Click + Drag" />
                                <ControlCard label="Zoom" value="Scroll Wheel" />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-white mb-4">Toolbar Modes</h3>
                            <div className="space-y-3">
                                <ModeCard title="Link Tool" color="text-blue-400" desc="Click visible Source, then Target to connect cables. Cables confirm automatically." />
                                <ModeCard title="Demolish" color="text-red-400" desc="Click any node to destroy it and refund 50% of its cost." />
                                <ModeCard title="Repair" color="text-green-400" desc="Manually fix broken nodes for a fixed $50 cost." />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'components' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <h3 className="text-xl font-bold text-white mb-4">Infrastructure Nodes</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <NodeCard title="Gateway" color="text-purple-400" desc="Entry point for all traffic. Connects to WAF or Load Balancers. The only node that generates traffic." />
                            <NodeCard title="WAF (Firewall)" color="text-red-400" desc="Filters malicious (Red) traffic. Essential for preventing security breaches and reputation loss." />
                            <NodeCard title="Load Balancer" color="text-orange-400" desc="Distributes traffic evenly to connected Web Servers. Prevents single-server overload." />
                            <NodeCard title="Web Server" color="text-green-400" desc="Processes requests. Needs CPU capacity. Must connect to a Database to finalize requests." />
                            <NodeCard title="Database" color="text-blue-400" desc="Stores data. High upkeep cost but essential for dynamic requests. Can overflow if not sharded." />
                            <NodeCard title="Redis Cache" color="text-yellow-400" desc="Caches queries. Reduces load on the Database significantly for repeated requests." />
                        </div>
                    </div>
                )}

                {activeTab === 'advanced' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <h3 className="text-xl font-bold text-white mb-4">Advanced Mechanics</h3>
                        <div className="space-y-4">
                            <AdvancedCard
                                title="Auto-Scaling"
                                color="text-blue-400"
                                desc="Once researched, your system will automatically purchase and deploy new Web Servers when load exceeds 80%, and decommission them when load drops below 30%."
                            />
                            <AdvancedCard
                                title="Multi-AZ Resilience"
                                color="text-purple-400"
                                desc="Distribute your nodes across Zone A and B. Unlocking the Multi-AZ tech reduces the reputation penalty for failures by 50%."
                            />
                            <AdvancedCard
                                title="Chaos Mode"
                                color="text-orange-400"
                                desc="Enable Chaos Mode in the top bar to randomly destroy nodes. Use this to test if your redundancy works under pressure!"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function ControlCard({ label, value }: { label: string, value: string }) {
    return (
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex flex-col items-center text-center">
            <span className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-2">{label}</span>
            <kbd className="px-3 py-1.5 bg-slate-900 rounded-lg text-white font-mono text-sm border border-slate-700 shadow-sm">{value}</kbd>
        </div>
    );
}

function ModeCard({ title, color, desc }: { title: string, color: string, desc: string }) {
    return (
        <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/30 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <strong className={clsx("min-w-[100px]", color)}>{title}</strong>
            <span className="text-slate-400 text-sm">{desc}</span>
        </div>
    );
}

function NodeCard({ title, color, desc }: { title: string, color: string, desc: string }) {
    return (
        <div className="bg-slate-800/40 border border-slate-700/40 p-4 rounded-xl flex flex-col md:flex-row md:items-center gap-2 md:gap-4 hover:bg-slate-800/60 transition-colors">
            <span className={clsx("font-bold text-base min-w-[140px]", color)}>{title}</span>
            <span className="text-slate-300 text-sm leading-relaxed">{desc}</span>
        </div>
    );
}

function AdvancedCard({ title, color, desc }: { title: string, color: string, desc: string }) {
    return (
        <div className="bg-slate-800/20 p-5 rounded-xl border border-slate-700/30">
            <h4 className={clsx("font-bold mb-2", color)}>{title}</h4>
            <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}
