'use client';

import { useGameStore } from '@/store/GameStore';
import { ArrowDown } from 'lucide-react';

export function TutorialHint() {
    const activeScenario = useGameStore((state) => state.activeScenario);
    const nodes = useGameStore((state) => state.nodes);
    const showBriefing = useGameStore((state) => state.showBriefing);

    // Only show for Startup scenario when grid is empty and briefing is closed
    if (activeScenario !== 'startup' || nodes.length > 0 || showBriefing) return null;

    return (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center animate-bounce pointer-events-none">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/50 mb-2">
                Start here! Place a Gateway.
            </div>
            <ArrowDown size={32} className="text-blue-500 fill-current" />
        </div>
    );
}
