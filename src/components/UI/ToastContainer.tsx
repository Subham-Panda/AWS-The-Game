'use client';

import { useEffect, useState } from 'react';
import { useGameStore, SystemLog } from '@/store/GameStore';
import { AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { clsx } from 'clsx';

export function ToastContainer() {
    const logs = useGameStore((state) => state.logs);
    const selectedNodeId = useGameStore((state) => state.selectedNodeId);
    const [visibleToasts, setVisibleToasts] = useState<SystemLog[]>([]);

    useEffect(() => {
        // When logs change, grab the latest one if it's new
        if (logs.length > 0) {
            const latest = logs[0];
            // Prevent duplicate triggers
            setVisibleToasts((prev) => {
                if (prev.find(t => t.id === latest.id)) return prev;
                return [latest, ...prev].slice(0, 3); // Keep max 3
            });

            // Auto-dismiss after 3s
            const timer = setTimeout(() => {
                setVisibleToasts((prev) => prev.filter(t => t.id !== latest.id));
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [logs]);

    return (
        <div
            className={clsx(
                "fixed bottom-40 z-50 flex flex-col gap-2 pointer-events-none transition-all duration-300",
                selectedNodeId ? "right-[340px]" : "right-6"
            )}
        >
            {visibleToasts.map((toast) => (
                <div
                    key={toast.id}
                    className={clsx(
                        "pointer-events-auto flex items-start gap-3 p-3 rounded-lg shadow-xl border backdrop-blur-md transition-all duration-500 animate-in fade-in slide-in-from-right-10 w-[300px]",
                        toast.severity === 'error' ? "bg-red-950/90 border-red-500/50 text-red-100" :
                            toast.severity === 'warning' ? "bg-yellow-950/90 border-yellow-500/50 text-yellow-100" :
                                "bg-blue-950/90 border-blue-500/50 text-blue-100"
                    )}
                >
                    <div className="mt-0.5">
                        {toast.severity === 'error' && <AlertCircle size={18} className="text-red-500" />}
                        {toast.severity === 'warning' && <AlertTriangle size={18} className="text-yellow-500" />}
                        {toast.severity === 'info' && <Info size={18} className="text-blue-500" />}
                    </div>
                    <div className="flex-1 max-w-xs text-sm font-medium leading-tight">
                        {toast.message}
                    </div>

                    {/* Manual Dismiss */}
                    <button
                        onClick={() => setVisibleToasts(prev => prev.filter(t => t.id !== toast.id))}
                        className="text-white/50 hover:text-white"
                    >
                        <X size={14} />
                    </button>
                </div>
            ))}
        </div>
    );
}
