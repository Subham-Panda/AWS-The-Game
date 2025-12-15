'use client';

import { useEffect, useState } from 'react';
import { useGameStore, SystemLog } from '@/store/GameStore';
import { AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { clsx } from 'clsx';

export function ToastContainer() {
    const logs = useGameStore((state) => state.logs);
    const [visibleToasts, setVisibleToasts] = useState<SystemLog[]>([]);

    useEffect(() => {
        // When logs change, grab the latest one if it's new
        if (logs.length > 0) {
            const latest = logs[0];
            // Prevent duplicate triggers if feasible, but logs usually have unique IDs.
            // Check if already in visibleToasts
            setVisibleToasts((prev) => {
                if (prev.find(t => t.id === latest.id)) return prev;
                return [latest, ...prev].slice(0, 3); // Keep max 3
            });

            // Auto-dismiss after 5s
            const timer = setTimeout(() => {
                setVisibleToasts((prev) => prev.filter(t => t.id !== latest.id));
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [logs]);

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
            {visibleToasts.map((toast) => (
                <div
                    key={toast.id}
                    className={clsx(
                        "pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-500 animate-in fade-in slide-in-from-right-10",
                        toast.severity === 'error' ? "bg-red-950/80 border-red-500/50 text-red-100" :
                            toast.severity === 'warning' ? "bg-yellow-950/80 border-yellow-500/50 text-yellow-100" :
                                "bg-blue-950/80 border-blue-500/50 text-blue-100"
                    )}
                >
                    <div className="mt-0.5">
                        {toast.severity === 'error' && <AlertCircle size={18} className="text-red-500" />}
                        {toast.severity === 'warning' && <AlertTriangle size={18} className="text-yellow-500" />}
                        {toast.severity === 'info' && <Info size={18} className="text-blue-500" />}
                    </div>
                    <div className="flex-1 max-w-xs text-sm font-medium">
                        {toast.message}
                    </div>
                </div>
            ))}
        </div>
    );
}
