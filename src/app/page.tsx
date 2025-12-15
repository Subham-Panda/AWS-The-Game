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
import { TechTree } from '@/components/UI/Cockpit/TechTree'; // Added import
import { ScenarioSelector } from '@/components/UI/ScenarioSelector'; // Added import
import { ScenarioHUD } from '@/components/UI/ScenarioHUD';
import { ScenarioBriefing } from '@/components/UI/ScenarioBriefing';
import { HelpManual } from '@/components/UI/HelpManual';
import { TutorialHint } from '@/components/UI/TutorialHint'; // Added import
import { ScenarioComplete } from '@/components/UI/ScenarioComplete'; // Added import
import { useGameStore } from '@/store/GameStore';
import { useEffect } from 'react';

export default function Home() {
  const showDashboard = useGameStore((state) => state.showDashboard);
  const setShowDashboard = useGameStore((state) => state.setShowDashboard);
  const tickEconomy = useGameStore((state) => state.tickEconomy);
  const checkScenarioGoals = useGameStore((state) => state.checkScenarioGoals); // Added
  const isPaused = useGameStore((state) => state.isPaused);

  // Global Game Loop (Economy)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      tickEconomy();
      checkScenarioGoals(); // Check for victory every tick
    }, 1000);
    return () => clearInterval(interval);
  }, [tickEconomy, checkScenarioGoals, isPaused]);

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

      {/* Full Screen Overlays */}
      {showDashboard && (
        <ServiceDashboard onClose={() => setShowDashboard(false)} />
      )}

      <TechTree />
      <HelpManual />
      {/* Phase 16: Scenario Selector (Modal) */}
      <ScenarioSelector /> {/* Will only render if activeScenario is null */}

      {/* Scenario UX */}
      <ScenarioHUD />
      <ScenarioBriefing />
      <TutorialHint />
      <ScenarioComplete />
    </main>
  );
}
