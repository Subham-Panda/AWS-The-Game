'use client';

import React, { useState } from 'react';
import { BookOpen, X } from 'lucide-react';
import { clsx } from 'clsx';

const LEGEND_ITEMS = [
    { label: 'Static (Images/JS)', color: 'bg-cyan-500', desc: 'Cached (90% Hit)' },
    { label: 'Read (API)', color: 'bg-blue-500', desc: 'Cached (40% Hit)' },
    { label: 'Search (Query)', color: 'bg-pink-500', desc: 'Cached (15% Hit)' },
    { label: 'Write (DB)', color: 'bg-orange-500', desc: 'Direct-to-DB' },
    { label: 'Upload (S3)', color: 'bg-purple-500', desc: 'Direct-to-S3' },
    { label: 'Malicious', color: 'bg-red-500', desc: 'Blocked by WAF' },
];

export function TrafficLegend() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="absolute bottom-6 left-24 z-50 flex flex-col items-start gap-2">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 shadow-lg transition-all"
                title="Traffic Guide"
            >
                {isOpen ? <X size={20} /> : <BookOpen size={20} />}
            </button>

            {/* Panel */}
            <div className={clsx(
                "bg-slate-950/90 backdrop-blur-md border border-slate-700/50 p-4 rounded-xl shadow-2xl w-64 transition-all origin-bottom-left",
                isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4 pointer-events-none absolute bottom-12"
            )}>
                <h3 className="text-slate-200 text-xs font-bold uppercase tracking-widest mb-3 border-b border-slate-700 pb-2">
                    Traffic Types
                </h3>
                <div className="space-y-2">
                    {LEGEND_ITEMS.map((item) => (
                        <div key={item.label} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <div className={`w-2.5 h-2.5 rounded-full ${item.color} shadow-[0_0_8px_rgba(255,255,255,0.3)]`} />
                                <span className="text-slate-300 font-medium">{item.label}</span>
                            </div>
                            <span className="text-slate-500 text-[10px]">{item.desc}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
