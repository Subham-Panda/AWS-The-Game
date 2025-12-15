'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/GameStore';

export function ScenarioEngine() {
    const activeScenario = useGameStore((state) => state.activeScenario);
    const appState = useGameStore((state) => state.appState);
    const isPaused = useGameStore((state) => state.isPaused);
    const timeScale = useGameStore((state) => state.timeScale);
    const scenarioElapsedTime = useGameStore((state) => state.scenarioElapsedTime);
    const tickScenario = useGameStore((state) => state.tickScenario);
    const setTrafficConfig = useGameStore((state) => state.setTrafficConfig);
    const addLog = useGameStore((state) => state.addLog);
    const killRandomNode = useGameStore((state) => state.killRandomNode);

    // Tick Scenario Time
    useEffect(() => {
        if (appState !== 'playing' || isPaused || timeScale === 0) return;

        const interval = setInterval(() => {
            tickScenario();
        }, 1000 / (timeScale || 1)); // Adjust for timeScale? Or just real-time seconds? 
        // Logic: Usually scenarios are based on "Simulated Time" (Game Time), not Real Time. 
        // If timeScale is 3x, 1 real second = 3 game seconds.
        // But `tickScenario()` just adds +1. 
        // So we should fire this interval based on Game Speed. 
        // Actually, existing economy tick runs at 1000ms. 
        // Let's attach to the main game loop instead of a separate interval to ensure sync?
        // But main game loop is in page.tsx.
        // Let's just run this at 1s interval for now, as "Real Time Seconds" for the user to experience the stress.
        // Scenario time should probably be "Real Time playing the game".

        return () => clearInterval(interval);
    }, [appState, isPaused, tickScenario, timeScale]);

    // Scenario Logic Director
    useEffect(() => {
        if (!activeScenario) return;

        // BLACK FRIDAY LOGIC
        if (activeScenario === 'black-friday') {
            handleBlackFriday(scenarioElapsedTime, setTrafficConfig, addLog);
        } else if (activeScenario === 'ddos') {
            handleDDoS(scenarioElapsedTime, setTrafficConfig, addLog);
        } else if (activeScenario === 'high-throughput') {
            handleHighThroughput(scenarioElapsedTime, setTrafficConfig, addLog);
        } else if (activeScenario === 'chaos') {
            handleChaosMonkey(scenarioElapsedTime, killRandomNode, addLog);
        }

        // Add other scenarios here...

    }, [activeScenario, scenarioElapsedTime, setTrafficConfig, addLog, killRandomNode]);

    return null; // Headless component
}

// --- Specific Scenario Scripts ---

export let blackFridayState = 'init'; // Simple state tracker
export let ddosState = 'init';
export let highThroughputState = 'init';
export let chaosMonkeyState = 'init';

export function resetScenarioStates() {
    blackFridayState = 'init';
    ddosState = 'init';
    highThroughputState = 'init';
    chaosMonkeyState = 'init';
    lastKillTime = 0;
}

export function resetBlackFridayState() { // Keep for backward compatibility if tests use it
    blackFridayState = 'init';
}

export function handleBlackFriday(
    time: number,
    setTraffic: (config: any) => void,
    log: (severity: any, msg: string) => void
) {
    // 0s - 30s: Calm (5 RPS)
    if (time < 30) {
        if (blackFridayState !== 'calm') {
            setTraffic({ totalRate: 5 });
            blackFridayState = 'calm';
        }
    }
    // 30s - 60s: Ramping (20 RPS)
    else if (time >= 30 && time < 60) {
        if (blackFridayState !== 'ramping') {
            setTraffic({ totalRate: 20 });
            log('warning', '⚠️ Traffic is ramping up! Prepare for impact!');
            blackFridayState = 'ramping';
        }
    }
    // 60s - 120s: THE SPIKE (100 RPS)
    else if (time >= 60 && time < 120) {
        if (blackFridayState !== 'spike') {
            setTraffic({ totalRate: 100 });
            log('error', '🚨 BLACK FRIDAY SALE STARTED! TRAFFIC SURGE DETECTED!');
            blackFridayState = 'spike';
        }
    }
    // 120s+: Cooldown (50 RPS)
    else if (time >= 120) {
        if (blackFridayState !== 'cooldown') {
            setTraffic({ totalRate: 50 });
            log('info', 'Traffic stabilizing. Sale frenzy ending.');
            blackFridayState = 'cooldown';
        }
    }
}

export function handleDDoS(
    time: number,
    setTraffic: (config: any) => void,
    log: (severity: any, msg: string) => void
) {
    // T+0s: Normal Traffic
    if (time < 20) {
        if (ddosState !== 'clean') {
            setTraffic({
                totalRate: 10,
                distribution: { static: 40, read: 40, write: 10, search: 10, upload: 0, malicious: 0 }
            });
            ddosState = 'clean';
        }
    }
    // T+20s: Probe (Small Malicious Spike)
    else if (time >= 20 && time < 45) {
        if (ddosState !== 'probe') {
            setTraffic({
                totalRate: 15,
                distribution: { static: 40, read: 40, write: 0, search: 0, upload: 0, malicious: 20 }
            });
            log('warning', '⚠️ Suspicious traffic patterns detected. Potential Probe.');
            ddosState = 'probe';
        }
    }
    // T+45s: Attack Wave 1
    else if (time >= 45 && time < 90) {
        if (ddosState !== 'attack-1') {
            setTraffic({
                totalRate: 30,
                distribution: { static: 20, read: 20, write: 0, search: 0, upload: 0, malicious: 60 }
            });
            log('error', '🚨 DDoS Attack Detected! Deploy WAFs immediately!');
            ddosState = 'attack-1';
        }
    }
    // T+90s: The Flood
    else if (time >= 90) {
        if (ddosState !== 'flood') {
            setTraffic({
                totalRate: 80,
                distribution: { static: 10, read: 10, write: 0, search: 0, upload: 0, malicious: 80 }
            });
            log('error', '🚨 MASSIVE ATTACK SIGNATURE INCOMING!');
            ddosState = 'flood';
        }
    }
}

export function handleHighThroughput(
    time: number,
    setTraffic: (config: any) => void,
    log: (severity: any, msg: string) => void
) {
    // T+0s: Warmup (10 RPS)
    if (time < 30) {
        if (highThroughputState !== 'warmup') {
            setTraffic({
                totalRate: 10,
                distribution: { static: 50, read: 40, write: 10, search: 0, upload: 0, malicious: 0 }
            });
            highThroughputState = 'warmup';
        }
    }
    // T+30s: Stress Test (30 RPS)
    else if (time >= 30 && time < 60) {
        if (highThroughputState !== 'stress') {
            setTraffic({ totalRate: 30 });
            log('warning', '⚠️ Traffic rising. Database load increasing.');
            highThroughputState = 'stress';
        }
    }
    // T+60s: High Load (60 RPS)
    else if (time >= 60 && time < 90) {
        if (highThroughputState !== 'high') {
            setTraffic({ totalRate: 60 });
            log('error', '🚨 Heavy Traffic Detected! Caching is required to survive.');
            highThroughputState = 'high';
        }
    }
    // T+90s: Peak (80 RPS)
    else if (time >= 90) {
        if (highThroughputState !== 'peak') {
            setTraffic({ totalRate: 80 });
            log('error', '🚨 Peak Traffic Reached!');
            highThroughputState = 'peak';
        }
    }
}

let lastKillTime = 0;

export function handleChaosMonkey(
    time: number,
    killRandomNode: () => void,
    log: (severity: any, msg: string) => void
) {
    // T+20s: First Blood
    if (time >= 20 && time < 45) {
        if (chaosMonkeyState !== 'active') {
            log('warning', '🐒 A wild Chaos Monkey appeared!');
            chaosMonkeyState = 'active';
        }
        // Kill once at 20s (approx)
        if (time === 20 && lastKillTime === 0) {
            killRandomNode();
            lastKillTime = time;
        }
    }
    // T+45s: Rampage (Kill every 10s)
    else if (time >= 45 && time < 90) {
        if (chaosMonkeyState !== 'rampage') {
            log('error', '🔥 The Chaos Monkey is destroying infrastructure!');
            chaosMonkeyState = 'rampage';
        }
        if (time - lastKillTime >= 10) {
            killRandomNode();
            lastKillTime = time;
        }
    }
    // T+90s: Total Chaos (Kill every 5s)
    else if (time >= 90) {
        if (chaosMonkeyState !== 'chaos') {
            log('error', '💀 MAXIMUM CHAOS! SURVIVE IF YOU CAN!');
            chaosMonkeyState = 'chaos';
        }
        if (time - lastKillTime >= 5) {
            killRandomNode();
            lastKillTime = time;
        }
    }
}
