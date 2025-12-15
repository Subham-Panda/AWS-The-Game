'use client';

import { useGameStore } from '@/store/GameStore';
import { useEffect } from 'react';
import { Server, Database, Globe, Network } from 'lucide-react';

export function Sidebar() {
    const setDraggedItem = useGameStore((state) => state.setDraggedItem);
    const addNode = useGameStore((state) => state.addNode); // Optional direct add for debug
    const cash = useGameStore((state) => state.cash);

    // Prices
    const COSTS = {
        'web-server': 100,
        'database': 200,
        'load-balancer': 200,
        'gateway': 500
    };

    // Global mouse up to cancel drag if dropped outside/anywhere
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            setDraggedItem(null);
        };
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, [setDraggedItem]);

    return (
        <div className="absolute left-0 top-0 bottom-0 w-64 bg-slate-800 text-white p-4 shadow-xl z-10 flex flex-col gap-4">
            <h1 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Cloud Tycoon
            </h1>

            <div className="space-y-4">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    Infrastructure
                </p>

                {/* Draggable Items */}
                <div
                    className={`p-3 rounded-lg flex items-center gap-3 transition-colors ${cash - COSTS['gateway'] >= -1000 ? 'bg-slate-700 cursor-grab active:cursor-grabbing hover:bg-slate-600' : 'bg-slate-800 opacity-50 cursor-not-allowed'
                        }`}
                    onMouseDown={() => cash - COSTS['gateway'] >= -1000 && setDraggedItem('gateway')}
                >
                    <div className="w-8 h-8 rounded bg-purple-500 flex items-center justify-center">
                        <Globe size={18} />
                    </div>
                    <div>
                        <div className="font-medium">Internet Gateway</div>
                        <div className="text-xs text-slate-400">Traffic Source (${COSTS.gateway})</div>
                    </div>
                </div>

                <div
                    className={`p-3 rounded-lg flex items-center gap-3 transition-colors ${cash - COSTS['load-balancer'] >= -1000 ? 'bg-slate-700 cursor-grab active:cursor-grabbing hover:bg-slate-600' : 'bg-slate-800 opacity-50 cursor-not-allowed'
                        }`}
                    onMouseDown={() => cash - COSTS['load-balancer'] >= -1000 && setDraggedItem('load-balancer')}
                >
                    <div className="w-8 h-8 rounded bg-orange-500 flex items-center justify-center">
                        <Network size={18} />
                    </div>
                    <div>
                        <div className="font-medium">Load Balancer</div>
                        <div className="text-xs text-slate-400">Distribute Traffic (${COSTS['load-balancer']})</div>
                    </div>
                </div>

                <div
                    className={`p-3 rounded-lg flex items-center gap-3 transition-colors ${cash - COSTS['web-server'] >= -1000 ? 'bg-slate-700 cursor-grab active:cursor-grabbing hover:bg-slate-600' : 'bg-slate-800 opacity-50 cursor-not-allowed'
                        }`}
                    onMouseDown={() => cash - COSTS['web-server'] >= -1000 && setDraggedItem('web-server')}
                >
                    <div className="w-8 h-8 rounded bg-green-500 flex items-center justify-center">
                        <Server size={18} />
                    </div>
                    <div>
                        <div className="font-medium">Web Server</div>
                        <div className="text-xs text-slate-400">Handle Traffic (${COSTS['web-server']})</div>
                    </div>
                </div>

                <div
                    className={`p-3 rounded-lg flex items-center gap-3 transition-colors ${cash - COSTS['database'] >= -1000 ? 'bg-slate-700 cursor-grab active:cursor-grabbing hover:bg-slate-600' : 'bg-slate-800 opacity-50 cursor-not-allowed'
                        }`}
                    onMouseDown={() => cash - COSTS['database'] >= -1000 && setDraggedItem('database')}
                >
                    <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center">
                        <Database size={18} />
                    </div>
                    <div>
                        <div className="font-medium">Database</div>
                        <div className="text-xs text-slate-400">Store Data (${COSTS.database})</div>
                    </div>
                </div>
            </div>

            <div className="mt-auto">
                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                    <p className="text-xs text-slate-400">Drag items onto the grid to build your cloud.</p>
                </div>
            </div>
        </div>
    );
}
