import { useGameStore } from '@/store/GameStore';
import { AlertTriangle, Zap, Globe, X } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

export function ChaosControl() {
    const nodes = useGameStore((state) => state.nodes);
    const setNodeStatus = useGameStore((state) => state.setNodeStatus);
    const chaosEnabled = useGameStore((state) => state.chaosEnabled);
    const setChaosEnabled = useGameStore((state) => state.setChaosEnabled);

    const [isOpen, setIsOpen] = useState(false);

    // Manual Trigger Logic
    const triggerFailure = () => {
        const activeNodes = nodes.filter(n => n.status === 'active' && n.type !== 'gateway');
        if (activeNodes.length > 0) {
            const victim = activeNodes[Math.floor(Math.random() * activeNodes.length)];
            setNodeStatus(victim.id, 'down');
        }
    };

    const triggerZoneOutage = (zone: 'A' | 'B') => {
        const activeNodes = nodes.filter(n => n.status === 'active' && n.type !== 'gateway');
        const zoneNodes = activeNodes.filter(n =>
            zone === 'A' ? n.position[0] < 0 : n.position[0] > 0
        );
        zoneNodes.forEach(n => setNodeStatus(n.id, 'down'));
    };

    return (
        <div className="absolute bottom-20 right-6 z-50 flex flex-row-reverse items-end gap-2 pointer-events-auto">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 shadow-lg transition-all"
                title="Chaos Control"
            >
                {isOpen ? <X size={20} /> : <AlertTriangle size={20} className="text-red-400" />}
            </button>

            {/* Panel */}
            <div className={clsx(
                "bg-slate-950/90 backdrop-blur border border-red-900/50 p-3 rounded-xl shadow-xl w-[220px] transition-all duration-300 origin-right",
                isOpen ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-95 translate-x-8 pointer-events-none w-0 p-0 overflow-hidden border-0"
            )}>
                <div className="flex items-center justify-between mb-3 border-b border-red-900/30 pb-2">
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Chaos Settings</span>
                    {/* Chaos Toggle Switch */}
                    <button
                        onClick={() => setChaosEnabled(!chaosEnabled)}
                        className={`w-8 h-4 rounded-full transition-colors relative ${chaosEnabled ? 'bg-green-500' : 'bg-slate-700'}`}
                        title="Master Switch"
                    >
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${chaosEnabled ? 'left-4.5' : 'left-0.5'}`} />
                    </button>
                </div>

                <div className="space-y-2">
                    <button
                        onClick={triggerFailure}
                        className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-200 text-xs py-2 rounded border border-red-500/20 flex items-center justify-center gap-2 transition-colors"
                    >
                        <Zap size={12} />
                        Kill Random Server
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => triggerZoneOutage('A')}
                            className="bg-red-900/40 hover:bg-red-900/60 text-red-200 text-[10px] py-2 rounded border border-red-800/30 flex flex-col items-center gap-1 transition-colors"
                        >
                            <Globe size={12} />
                            Kill Zone A
                        </button>
                        <button
                            onClick={() => triggerZoneOutage('B')}
                            className="bg-orange-900/40 hover:bg-orange-900/60 text-orange-200 text-[10px] py-2 rounded border border-orange-800/30 flex flex-col items-center gap-1 transition-colors"
                        >
                            <Globe size={12} />
                            Kill Zone B
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
