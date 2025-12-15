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
import { LandingPage } from '@/components/UI/LandingPage';
import { ScenarioComplete } from '@/components/UI/ScenarioComplete';
import { ScenarioEngine } from '@/components/Logic/ScenarioEngine'; // Added import
import { useGameStore } from '@/store/GameStore';
import { useEffect } from 'react';

export default function Home() {
  const showDashboard = useGameStore((state) => state.showDashboard);
  const setShowDashboard = useGameStore((state) => state.setShowDashboard);
  const tickEconomy = useGameStore((state) => state.tickEconomy);
  const checkScenarioGoals = useGameStore((state) => state.checkScenarioGoals);
  const isPaused = useGameStore((state) => state.isPaused);
  const appState = useGameStore((state) => state.appState); // Added

  // Global Game Loop (Economy)
  useEffect(() => {
    if (isPaused || appState !== 'playing') return; // Only tick if playing
    const interval = setInterval(() => {
      tickEconomy();
      checkScenarioGoals();
    }, 1000);
    return () => clearInterval(interval);
  }, [tickEconomy, checkScenarioGoals, isPaused, appState]);

  return (
    <main className="w-full h-full relative bg-slate-950 overflow-hidden">

      <ScenarioEngine /> {/* Headless Logic */}
      <Scene />

      {/* App State Management */}
      {appState === 'landing' && <LandingPage />}

      {appState === 'scenario-selection' && (
        <ScenarioSelector />
      )}

      {/* Global Overlays */}
      <HelpManual />

      {/* Game UI Layer - Only visible when playing */}
      {appState === 'playing' && (
        <>
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

            {/* Top Left Toolbar Row */}
            <div className="absolute top-[70px] left-4 z-50 flex flex-col items-start gap-3 pointer-events-none">
              <TopControls />
              <TrafficControlPanel />
            </div>

            <div className="pointer-events-auto">
              <ChaosControl />
            </div>
          </div>

          {/* Full Screen Overlays */}
          {showDashboard && (
            <ServiceDashboard onClose={() => setShowDashboard(false)} />
          )}

          <TechTree />

          {/* Scenario UX */}
          <ScenarioHUD />
          <ScenarioBriefing />
          <TutorialHint />
          <ScenarioComplete />
        </>
      )}
    </main>
  );
}
