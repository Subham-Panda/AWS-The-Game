'use client';

import { Scene } from '@/components/Scene';
import { Toolbar } from '@/components/UI/Cockpit/Toolbar';
import { StatsPanel } from '@/components/UI/Cockpit/StatsPanel';
import { InspectorPanel } from '@/components/UI/Cockpit/InspectorPanel';
import { TopControls } from '@/components/UI/Cockpit/TopControls';
import { ChaosControl } from '@/components/UI/ChaosControl';
import { TrafficLegend } from '@/components/UI/TrafficLegend';
import { TrafficControlPanel } from '@/components/UI/Cockpit/TrafficControlPanel';
import { ServiceDashboard } from '@/components/UI/Cockpit/ServiceDashboard';
import { useGameStore } from '@/store/GameStore';

export default function Home() {
  const showDashboard = useGameStore((state) => state.showDashboard);
  const setShowDashboard = useGameStore((state) => state.setShowDashboard);

  return (
    <main className="w-full h-full relative bg-slate-950 overflow-hidden">
      {/* UI Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none w-full h-full">
        <div className="pointer-events-auto">
          <StatsPanel />
        </div>

        <div className="pointer-events-auto">
          <Toolbar />
        </div>

        <div className="pointer-events-auto">
          <InspectorPanel />
        </div>

        <div className="pointer-events-auto">
          <TrafficLegend />
        </div>

        {/* Top Left Toolbar Row: Controls -> Settings */}
        <div className="absolute top-[70px] left-4 z-50 flex flex-col items-start gap-3 pointer-events-none">
          <TopControls />
          <TrafficControlPanel />
        </div>

        <div className="pointer-events-auto">
          <ChaosControl />
        </div>
      </div>

      <Scene />

      {/* Dashboard Overlay - Rendered Last for Z-Index Priority */}
      {showDashboard && (
        <ServiceDashboard onClose={() => setShowDashboard(false)} />
      )}
    </main>
  );
}
