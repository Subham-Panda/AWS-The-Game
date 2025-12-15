'use client';

import { useGameStore } from '@/store/GameStore';
import { X } from 'lucide-react';
import { ManualContent } from './ManualContent';

export function HelpManual() {
    const showManual = useGameStore((state) => state.showManual);
    const setShowManual = useGameStore((state) => state.setShowManual);

    if (!showManual) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowManual(false)} />

            <div className="relative w-[900px] h-[700px] bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={() => setShowManual(false)}
                    className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full shadow-lg"
                >
                    <X size={20} />
                </button>

                <ManualContent />
            </div>
        </div>
    );
}
