import { useGameStore, TIER_CONFIG, SystemLog, Node } from '@/store/GameStore';
import { Activity, X, ChevronRight, Trash2, CheckCircle2, Search, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { useState } from 'react';

export function ServiceDashboard({ onClose }: { onClose: () => void }) {
    const nodes = useGameStore((state) => state.nodes);
    const selectNode = useGameStore((state) => state.selectNode); // To focus
    const logs = useGameStore((state) => state.logs);
    const clearLogs = useGameStore((state) => state.clearLogs);

    // Grouping
    const [filter, setFilter] = useState<string>('all');
    const [activeTab, setActiveTab] = useState<'services' | 'logs'>('services');

    const nodeTypes = Array.from(new Set(nodes.map(n => n.type)));

    const filteredNodes = filter === 'all'
        ? nodes
        : nodes.filter(n => n.type === filter);

    const getNodeLoadParams = (node: Node) => {
        const config = TIER_CONFIG[node.type];
        if (!config) return { capacity: 100 };
        const stats = config[(node.tier || 1) - 1];
        return { capacity: stats?.capacity || 100 };
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'error': return 'text-red-400';
            case 'warning': return 'text-yellow-400';
            case 'info': return 'text-blue-400';
            default: return 'text-slate-400';
        }
    };

    return (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-slate-950/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden text-slate-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <Activity className="text-purple-400" size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white tracking-wide">SERVICE MONITOR</h2>
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                            {nodes.length} Active Units • {nodes.filter(n => n.health < 100).length} Degrading
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="flex bg-slate-800 rounded-lg p-1 mr-4">
                        <button
                            onClick={() => setActiveTab('services')}
                            className={clsx("px-4 py-1.5 rounded-md text-sm font-medium transition-all", activeTab === 'services' ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-slate-200")}
                        >
                            Services
                        </button>
                        <button
                            onClick={() => setActiveTab('logs')}
                            className={clsx("px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2", activeTab === 'logs' ? "bg-red-600 text-white shadow" : "text-slate-400 hover:text-slate-200")}
                        >
                            Logs
                            {logs.length > 0 && <span className="text-[10px] bg-white/20 px-1.5 rounded-full">{logs.length}</span>}
                        </button>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Content */}
            {activeTab === 'services' && (
                <>
                    {/* Filter Bar */}
                    <div className="p-3 border-b border-slate-800 flex gap-2 overflow-x-auto">
                        <button
                            onClick={() => setFilter('all')}
                            className={clsx(
                                "px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all whitespace-nowrap",
                                filter === 'all' ? "bg-slate-700 text-white" : "text-slate-500 hover:bg-slate-800"
                            )}
                        >
                            ALL SYSTEMS
                        </button>
                        {nodeTypes.map(type => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={clsx(
                                    "px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all whitespace-nowrap",
                                    filter === type ? "bg-cyan-900/50 text-cyan-400 border border-cyan-800" : "text-slate-500 hover:bg-slate-800"
                                )}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                        {filteredNodes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-600">
                                <Search size={48} className="mb-4 opacity-50" />
                                <p className="font-bold uppercase tracking-widest text-sm">No Active Services</p>
                            </div>
                        ) : (
                            filteredNodes.map(node => {
                                const tierConfig = TIER_CONFIG[node.type];
                                const currentStats = tierConfig ? tierConfig[node.tier - 1] : { capacity: 100 };
                                const loadPct = Math.min(100, (node.currentLoad / currentStats.capacity) * 100);
                                const isOverloaded = node.currentLoad > currentStats.capacity;

                                return (
                                    <div
                                        key={node.id}
                                        onClick={() => {
                                            selectNode(node.id); // Triggers highlighting in scene
                                        }}
                                        className={clsx(
                                            "group flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer",
                                            "bg-slate-900/40 border-slate-800/50 hover:bg-slate-800 hover:border-cyan-700/50",
                                            isOverloaded && "border-red-900/50 bg-red-950/10"
                                        )}
                                    >
                                        {/* Left: ID & Type */}
                                        <div className="flex items-center gap-4 w-[250px]">
                                            <div className={clsx(
                                                "w-2 h-2 rounded-full",
                                                node.status === 'active' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" :
                                                    node.status === 'down' ? "bg-red-500" : "bg-yellow-500 animate-pulse"
                                            )} />
                                            <div>
                                                <div className="font-mono text-sm font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">
                                                    {node.id}
                                                </div>
                                                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                                                    {node.type}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tier Badge */}
                                        <div className="w-[100px] flex justify-center">
                                            <span className="px-2 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-bold font-mono">
                                                TIER {node.tier}
                                            </span>
                                        </div>

                                        {/* Metrics */}
                                        <div className="flex-1 grid grid-cols-2 gap-8 px-4">
                                            {/* Integrity */}
                                            <div className="flex flex-col gap-1">
                                                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
                                                    <span>Integrity</span>
                                                    <span className={node.health < 40 ? "text-red-400" : "text-slate-400"}>{Math.round(node.health)}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={clsx("h-full transition-all duration-500",
                                                            node.health > 70 ? "bg-green-500" : node.health > 30 ? "bg-yellow-500" : "bg-red-500"
                                                        )}
                                                        style={{ width: `${node.health}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Load */}
                                            <div className="flex flex-col gap-1">
                                                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
                                                    <span>Load {isOverloaded && <AlertTriangle size={10} className="inline text-red-500 ml-1" />}</span>
                                                    <span className={isOverloaded ? "text-red-400 animate-pulse" : "text-slate-400"}>
                                                        {node.currentLoad} / {currentStats.capacity} RPS
                                                    </span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={clsx("h-full transition-all duration-300",
                                                            isOverloaded ? "bg-red-500" : loadPct > 80 ? "bg-orange-500" : "bg-cyan-500"
                                                        )}
                                                        style={{ width: `${Math.min(100, loadPct)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-[40px] flex justify-end text-slate-600 group-hover:text-white">
                                            <Search size={16} />
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </>
            )}

            {/* LOGS TAB */}
            {activeTab === 'logs' && (
                <div className="flex-1 flex flex-col">
                    <div className="p-3 bg-slate-900/30 flex justify-end border-b border-slate-800">
                        <button
                            onClick={clearLogs}
                            className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
                        >
                            <Trash2 size={12} /> Clear Logs
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-xs">
                        {logs.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500">
                                <CheckCircle2 size={40} className="mb-2 opacity-20" />
                                <p>No incidents recorded.</p>
                            </div>
                        ) : (
                            logs.map((log: SystemLog) => (
                                <div key={log.id} className="flex gap-4 p-2 rounded hover:bg-slate-800/50 border-b border-slate-800/30">
                                    <span className="text-slate-500 w-16 shrink-0">
                                        {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </span>
                                    <span className={clsx("uppercase font-bold w-16 shrink-0", getSeverityColor(log.severity))}>
                                        {log.severity}
                                    </span>
                                    <span className="text-cyan-600 w-24 shrink-0 truncate" title={log.sourceId}>
                                        {log.sourceId || 'System'}
                                    </span>
                                    <span className="text-slate-300 flex-1">
                                        {log.message}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
