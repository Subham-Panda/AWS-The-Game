'use client';

import { useGameStore, SelectedTool } from '@/store/GameStore';
import { MousePointer2, Network, Trash2, Scissors } from 'lucide-react';
import { clsx } from 'clsx';

export function ToolsMenu() {
    const selectedTool = useGameStore((state) => state.selectedTool);
    const setTool = useGameStore((state) => state.setSelectedTool);

    const TOOLS: { id: SelectedTool; label: string; icon: any; color: string }[] = [
        { id: 'select', label: 'Select', icon: MousePointer2, color: 'text-blue-400' },
        { id: 'link', label: 'Connect', icon: Network, color: 'text-green-400' },
        { id: 'unlink', label: 'Disconnect', icon: Scissors, color: 'text-yellow-400' },
        { id: 'demolish', label: 'Destroy', icon: Trash2, color: 'text-red-400' },
    ];

    return (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 flex flex-row items-center gap-2 bg-slate-950/90 backdrop-blur-md border border-slate-700/50 p-2 rounded-xl shadow-2xl">
            {TOOLS.map((tool) => {
                const isActive = selectedTool === tool.id;

                return (
                    <button
                        key={tool.id}
                        onClick={() => setTool(tool.id)}
                        className={clsx(
                            "relative group flex items-center justify-center w-12 h-12 rounded-lg transition-all border",
                            isActive
                                ? "bg-slate-800 border-white/40 text-white shadow-lg scale-105"
                                : "bg-transparent border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-white"
                        )}
                    >
                        <tool.icon className={clsx("w-6 h-6", isActive ? tool.color : "currentColor")} />

                        {/* Tooltip (Bottom) */}
                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded hidden group-hover:block whitespace-nowrap z-50 pointer-events-none shadow-xl">
                            <div className="text-[10px] font-bold text-slate-200 uppercase tracking-widest">{tool.label}</div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
