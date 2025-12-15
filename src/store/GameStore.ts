import { create } from 'zustand';

export type NodeType = 'web-server' | 'database' | 'gateway' | 'load-balancer' | 'waf' | 'sqs' | 'cache' | 's3';
export type LogSeverity = 'info' | 'warning' | 'error';

export interface SystemLog {
    id: string;
    timestamp: number;
    severity: LogSeverity;
    message: string;
    sourceId?: string;
}
export type SelectedTool = NodeType | 'select' | 'link' | 'demolish' | 'unlink';

// Tier Configuration
export const TIER_CONFIG: Record<NodeType, { capacity: number; cost: number }[]> = {
    'gateway': [{ capacity: 50, cost: 0 }, { capacity: 100, cost: 1000 }, { capacity: 250, cost: 2500 }, { capacity: 500, cost: 6000 }, { capacity: 1000, cost: 15000 }],
    'waf': [{ capacity: 30, cost: 0 }, { capacity: 60, cost: 600 }, { capacity: 150, cost: 1500 }, { capacity: 400, cost: 4000 }, { capacity: 1000, cost: 10000 }],
    'load-balancer': [{ capacity: 40, cost: 0 }, { capacity: 100, cost: 800 }, { capacity: 300, cost: 2000 }, { capacity: 800, cost: 5000 }, { capacity: 2000, cost: 12000 }],
    'web-server': [{ capacity: 10, cost: 0 }, { capacity: 25, cost: 400 }, { capacity: 60, cost: 1000 }, { capacity: 150, cost: 2500 }, { capacity: 400, cost: 6000 }],
    'database': [{ capacity: 15, cost: 0 }, { capacity: 40, cost: 600 }, { capacity: 100, cost: 1500 }, { capacity: 250, cost: 4000 }, { capacity: 600, cost: 10000 }],
    'cache': [{ capacity: 50, cost: 0 }, { capacity: 150, cost: 500 }, { capacity: 400, cost: 1200 }, { capacity: 1000, cost: 3000 }, { capacity: 2500, cost: 8000 }],
    's3': [{ capacity: 100, cost: 0 }, { capacity: 300, cost: 600 }, { capacity: 800, cost: 1500 }, { capacity: 2000, cost: 4000 }, { capacity: 5000, cost: 10000 }],
    'sqs': [{ capacity: 100, cost: 0 }, { capacity: 300, cost: 500 }, { capacity: 800, cost: 1200 }, { capacity: 2000, cost: 3000 }, { capacity: 5000, cost: 8000 }],
};

export type TechId = 'server-opt-1' | 'db-sharding-1' | 'auto-scaling' | 'multi-az' | 'blue-green' | 'global-cdn';

export interface TechNode {
    id: TechId;
    label: string;
    description: string;
    cost: number;
    requirements: TechId[];
    position: [number, number]; // For UI layout
}

export const TECH_TREE: TechNode[] = [
    // Tier 1
    { id: 'server-opt-1', label: 'Server Optimization I', description: 'Unlock Tier 2 Web Servers', cost: 100, requirements: [], position: [0, 0] },
    { id: 'db-sharding-1', label: 'DB Sharding I', description: 'Unlock Tier 2 Databases', cost: 150, requirements: [], position: [0, 1] },

    // Tier 2
    { id: 'auto-scaling', label: 'Auto-Scaling', description: 'Automatically manage server capacity', cost: 500, requirements: ['server-opt-1'], position: [1, 0] },
    { id: 'multi-az', label: 'Multi-AZ Deployment', description: 'Resilience against zone failures', cost: 800, requirements: ['server-opt-1', 'db-sharding-1'], position: [1, 1] },

    // Tier 3
    { id: 'global-cdn', label: 'Global CDN', description: 'Reduce static traffic load by 50%', cost: 2000, requirements: ['auto-scaling'], position: [2, 0] },
];

export interface Node {
    id: string;
    type: NodeType;
    position: [number, number, number];
    status: 'active' | 'down' | 'rebooting';
    health: number; // 0-100
    tier: number; // 1-5
    currentLoad: number; // Requests per Second (Real-time)
}

export interface Connection {
    id: string;
    sourceId: string;
    targetId: string;
}

interface GameState {
    nodes: Node[];
    connections: Connection[];
    draggedItem: NodeType | null;
    cursorPosition: [number, number, number];
    selectedNodeId: string | null;
    cash: number;
    score: number;

    // Actions
    addNode: (node: Omit<Node, 'tier' | 'currentLoad'>) => void;
    removeNode: (id: string) => void;
    selectNode: (id: string | null) => void;
    addConnection: (sourceId: string, targetId: string) => void;
    removeConnection: (sourceId: string, targetId: string) => void;
    validateConnection: (sourceId: string, targetId: string) => boolean;
    setDraggedItem: (item: NodeType | null) => void;
    updateCursorPosition: (pos: [number, number, number]) => void;
    updateCash: (amount: number) => void;
    tickEconomy: () => void;
    setNodeStatus: (id: string, status: Node['status']) => void;
    repairNode: (id: string) => void;
    damageNode: (id: string, amount: number) => void;
    upgradeNode: (id: string) => void;
    updateNodeLoad: (id: string, load: number) => void;
    failures: number;
    recordFailure: (sourceId?: string, reason?: string) => void;
    chaosEnabled: boolean;
    autoRepairEnabled: boolean;
    setChaosEnabled: (enabled: boolean) => void;
    setAutoRepairEnabled: (enabled: boolean) => void;
    // Logs
    logs: SystemLog[];
    addLog: (severity: LogSeverity, message: string, sourceId?: string) => void;
    clearLogs: () => void;
    // V2 State
    reputation: number; // 0-100
    timeScale: number; // 0 (paused), 1 (normal), 3 (fast)
    isPaused: boolean;
    selectedTool: SelectedTool;
    showDashboard: boolean;
    showManual: boolean;
    setShowDashboard: (show: boolean) => void;
    setShowManual: (show: boolean) => void;
    setTimeScale: (scale: number) => void;
    setPaused: (paused: boolean) => void;
    updateReputation: (amount: number) => void;
    setSelectedTool: (tool: SelectedTool) => void;
    resetToEmpty: () => void;

    // Phase 14: R&D
    researchPoints: number;
    unlockedTechs: TechId[];
    showTechTree: boolean;
    setShowTechTree: (show: boolean) => void;
    addResearchPoints: (amount: number) => void;
    unlockTech: (id: TechId) => void;

    // Phase 6: Traffic Control
    trafficConfig: {
        mode: 'aggregate' | 'granular';
        totalRate: number; // Requests per Second (Aggregate)
        distribution: {
            static: number;
            read: number;
            write: number;
            search: number;
            upload: number;
            malicious: number;
        };
        granularRates: {
            static: number;
            read: number;
            write: number;
            search: number;
            upload: number;
            malicious: number;
        }
    };
    setTrafficConfig: (config: Partial<GameState['trafficConfig']>) => void;
    // Phase 16: Scenarios
    activeScenario: ScenarioId | null;
    startScenario: (id: ScenarioId) => void;
    checkScenarioGoals: () => void;

    // UI Helpers
    showBriefing: boolean;
    setShowBriefing: (show: boolean) => void;
    scenarioComplete: boolean;
    setScenarioComplete: (complete: boolean) => void;
    isOverlayOpen: () => boolean;
}

// Initial Scenaro
const INITIAL_NODES: Node[] = [
    { id: 'gw-1', type: 'gateway', position: [0, 6, 0], status: 'active', health: 100, tier: 1, currentLoad: 0 },
    { id: 'waf-1', type: 'waf', position: [0, 2, 0], status: 'active', health: 100, tier: 1, currentLoad: 0 },
    { id: 'lb-1', type: 'load-balancer', position: [0, -2, 0], status: 'active', health: 100, tier: 1, currentLoad: 0 },

    // AZ A
    { id: 'ws-1', type: 'web-server', position: [-4, -6, 0], status: 'active', health: 100, tier: 1, currentLoad: 0 },
    { id: 'db-1', type: 'database', position: [-4, -10, 0], status: 'active', health: 100, tier: 1, currentLoad: 0 },

    // AZ B
    { id: 'ws-2', type: 'web-server', position: [4, -6, 0], status: 'active', health: 100, tier: 1, currentLoad: 0 },

    // Shared
    { id: 's3-1', type: 's3', position: [4, -10, 0], status: 'active', health: 100, tier: 1, currentLoad: 0 },
];

const INITIAL_CONNECTIONS: Connection[] = [
    { id: 'c1', sourceId: 'gw-1', targetId: 'waf-1' },
    { id: 'c2', sourceId: 'waf-1', targetId: 'lb-1' },
    { id: 'c3', sourceId: 'lb-1', targetId: 'ws-1' },
    { id: 'c4', sourceId: 'lb-1', targetId: 'ws-2' },
    { id: 'c5', sourceId: 'ws-1', targetId: 'db-1' },
    { id: 'c6', sourceId: 'ws-2', targetId: 's3-1' },
    { id: 'c7', sourceId: 'ws-2', targetId: 'db-1' }, // Redundancy
];

// Phase 16: Scenarios
export type ScenarioId = 'sandbox' | 'startup' | 'black-friday' | 'ddos' | 'high-throughput' | 'chaos' | 'legacy';

export interface Scenario {
    id: ScenarioId;
    name: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    initialCash: number;
    initialNodes: Node[];
    initialConnections: Connection[];
    lockedTechs?: TechId[];
    trafficConfig: GameState['trafficConfig'];
    goals: {
        type: 'cash' | 'reputation' | 'requests' | 'uptime';
        target: number;
        label: string;
    }[];
}

export const SCENARIOS: Record<ScenarioId, Scenario> = {
    'sandbox': {
        id: 'sandbox',
        name: 'Sandbox Mode',
        description: 'Build freely with no limits or specific goals.',
        difficulty: 'Easy',
        initialCash: 1000,
        initialNodes: INITIAL_NODES,
        initialConnections: INITIAL_CONNECTIONS,
        trafficConfig: {
            mode: 'aggregate', totalRate: 5,
            distribution: { static: 30, read: 25, write: 10, search: 10, upload: 5, malicious: 20 },
            granularRates: { static: 2, read: 2, write: 1, search: 1, upload: 0.5, malicious: 1 }
        },
        goals: []
    },
    'startup': {
        id: 'startup',
        name: 'The Startup',
        description: 'You have limited seed funding. Build a basic architecture (Gateway -> WAF -> LB -> Server -> DB) and reach $2000 in cash.',
        difficulty: 'Easy',
        initialCash: 1500,
        initialNodes: [],
        initialConnections: [],
        trafficConfig: {
            mode: 'aggregate', totalRate: 2, // Slow start
            distribution: { static: 40, read: 40, write: 10, search: 10, upload: 0, malicious: 0 },
            granularRates: { static: 1, read: 1, write: 0.5, search: 0.5, upload: 0, malicious: 0 }
        },
        goals: [
            { type: 'cash', target: 2000, label: 'Accumulate $2,000 Cash' }
        ]
    },
    'black-friday': { id: 'black-friday', name: 'Black Friday', description: 'Survive the spike!', difficulty: 'Hard', initialCash: 5000, initialNodes: [], initialConnections: [], trafficConfig: { mode: 'aggregate', totalRate: 5, distribution: { static: 30, read: 30, write: 20, search: 10, upload: 10, malicious: 0 }, granularRates: { static: 1, read: 1, write: 1, search: 1, upload: 1, malicious: 0 } }, goals: [] },
    'ddos': { id: 'ddos', name: 'DDoS Defense', description: 'Malicious traffic incoming.', difficulty: 'Hard', initialCash: 2000, initialNodes: [], initialConnections: [], trafficConfig: { mode: 'aggregate', totalRate: 10, distribution: { static: 10, read: 10, write: 0, search: 0, upload: 0, malicious: 80 }, granularRates: { static: 0, read: 0, write: 0, search: 0, upload: 0, malicious: 8 } }, goals: [] },
    'high-throughput': { id: 'high-throughput', name: 'High Throughput', description: 'Caching is key.', difficulty: 'Medium', initialCash: 3000, initialNodes: [], initialConnections: [], trafficConfig: { mode: 'aggregate', totalRate: 20, distribution: { static: 5, read: 90, write: 5, search: 0, upload: 0, malicious: 0 }, granularRates: { static: 0, read: 18, write: 1, search: 0, upload: 0, malicious: 0 } }, goals: [] },
    'chaos': { id: 'chaos', name: 'Chaos Monkey', description: 'Things will break.', difficulty: 'Hard', initialCash: 5000, initialNodes: [], initialConnections: [], trafficConfig: { mode: 'aggregate', totalRate: 5, distribution: { static: 20, read: 20, write: 20, search: 20, upload: 10, malicious: 10 }, granularRates: { static: 1, read: 1, write: 1, search: 1, upload: 1, malicious: 1 } }, goals: [] },
    'legacy': { id: 'legacy', name: 'Legacy Migration', description: 'Fix the mess.', difficulty: 'Medium', initialCash: 1000, initialNodes: [], initialConnections: [], trafficConfig: { mode: 'aggregate', totalRate: 5, distribution: { static: 30, read: 30, write: 10, search: 10, upload: 10, malicious: 10 }, granularRates: { static: 1, read: 1, write: 1, search: 1, upload: 1, malicious: 1 } }, goals: [] },

};



export const useGameStore = create<GameState>((set, get) => ({
    // Initial State
    nodes: INITIAL_NODES,
    connections: INITIAL_CONNECTIONS,
    draggedItem: null,
    cursorPosition: [0, 0, 0],
    selectedNodeId: null,

    // Economy
    cash: 1000,
    score: 0,
    failures: 0,

    // Logs
    logs: [],

    // Flags
    chaosEnabled: false, // Default to false (User Request)

    // V2 Init
    reputation: 100,
    timeScale: 0, // Paused initially (speed 0)
    isPaused: true, // Paused initially
    selectedTool: 'select',
    showDashboard: false,
    showManual: false,
    setShowDashboard: (show: boolean) => set({ showDashboard: show }),
    setShowManual: (show: boolean) => set({ showManual: show }),

    resetToEmpty: () => set({
        nodes: [],
        connections: [],
        cash: 1000,
        score: 0,
        failures: 0,
        reputation: 100,
        timeScale: 0,
        isPaused: true,
        selectedNodeId: null,
        draggedItem: null,
        researchPoints: 0,
        unlockedTechs: [],
        showTechTree: false,

        // Reset Scenario State
        activeScenario: null,
        scenarioComplete: false,
        showBriefing: false
    }),

    // Phase 6 Init
    trafficConfig: {
        mode: 'aggregate',
        totalRate: 5, // Default low rate
        distribution: {
            static: 30,
            read: 25,
            write: 10,
            search: 10,
            upload: 5,
            malicious: 20
        },
        granularRates: {
            static: 2,
            read: 2,
            write: 1,
            search: 1,
            upload: 0.5,
            malicious: 1
        }
    },
    setTrafficConfig: (config) => set((state) => ({
        trafficConfig: { ...state.trafficConfig, ...config }
    })),

    addNode: (node) => set((state) => ({
        nodes: [...state.nodes, { ...node, health: 100, tier: 1, currentLoad: 0 }]
    })),

    removeNode: (id) => set((state) => ({ nodes: state.nodes.filter((n) => n.id !== id) })),
    selectNode: (id) => set({ selectedNodeId: id }),

    addConnection: (sourceId, targetId) => set((state) => {
        // Validation: No self-connections
        if (sourceId === targetId) return state;

        // Validation: Connection already exists?
        const exists = state.connections.some(
            (c) => (c.sourceId === sourceId && c.targetId === targetId) ||
                (c.sourceId === targetId && c.targetId === sourceId)
        );
        if (exists) return state;

        return {
            connections: [...state.connections, {
                id: `${sourceId}-${targetId}`,
                sourceId,
                targetId
            }]
        };
    }),

    removeConnection: (sourceId, targetId) => set((state) => ({
        connections: state.connections.filter(
            (c) => !(c.sourceId === sourceId && c.targetId === targetId) &&
                !(c.sourceId === targetId && c.targetId === sourceId)
        )
    })),

    validateConnection: (sourceId, targetId) => {
        const { connections } = get();
        if (sourceId === targetId) return false;
        return !connections.some(
            (c) => (c.sourceId === sourceId && c.targetId === targetId) ||
                (c.sourceId === targetId && c.targetId === sourceId)
        );
    },

    setDraggedItem: (item) => set({ draggedItem: item }),
    updateCursorPosition: (pos) => set({ cursorPosition: pos }),
    updateCash: (amount) => set((state) => ({ cash: state.cash + amount })),
    tickEconomy: () => set((state) => {
        let currentCash = state.cash;

        // 1. Upkeep Costs
        const upkeep = state.nodes.reduce((acc, node) => {
            if (node.type === 'gateway') return acc;
            const baseUpkeep = node.type === 'database' ? 2 : 1;
            return acc + (baseUpkeep * node.tier); // Higher tier = higher upkeep
        }, 0);
        currentCash -= upkeep;

        // 2. Auto-Repair Logic
        let updatedNodes = state.nodes;
        if (state.autoRepairEnabled) {
            const AUTO_REPAIR_THRESHOLD = 50;
            const AUTO_REPAIR_COST = 60; // slightly more expensive than manual

            updatedNodes = state.nodes.map(node => {
                if (node.health < AUTO_REPAIR_THRESHOLD && currentCash >= AUTO_REPAIR_COST) {
                    currentCash -= AUTO_REPAIR_COST;
                    return { ...node, health: 100, status: 'active' }; // Instant fix
                }
                return node;
            });
        }

        // 3. Reputation Recovery (Slowly regain trust if system is running)
        // Recover 0.5 per tick (1% every 2 seconds)
        // Cap at 100.
        let newReputation = state.reputation;
        if (newReputation < 100) {
            newReputation = Math.min(100, newReputation + 0.5);
        }

        return {
            cash: currentCash,
            nodes: updatedNodes,
            reputation: newReputation
        };
    }),

    setNodeStatus: (id, status) => set((state) => ({
        nodes: state.nodes.map(n => n.id === id ? { ...n, status } : n)
    })),

    damageNode: (id, amount) => set((state) => {
        const node = state.nodes.find(n => n.id === id);
        if (!node || node.status === 'down') return {};

        const newHealth = Math.max(0, node.health - amount);
        const newStatus = newHealth <= 0 ? 'down' : node.status;

        return {
            nodes: state.nodes.map(n => n.id === id ? { ...n, health: newHealth, status: newStatus } : n)
        };
    }),

    upgradeNode: (id) => {
        const { nodes, cash, updateCash, unlockedTechs, addLog } = get();
        const node = nodes.find(n => n.id === id);
        if (!node || node.tier >= 5) return;

        const nextTier = node.tier + 1;

        // Upgrade Gating Logic (Phase 15)
        if (nextTier === 2) {
            if (node.type === 'web-server' && !unlockedTechs.includes('server-opt-1')) {
                addLog('warning', 'Research "Server Optimization I" to unlock Tier 2 Servers.');
                return;
            }
            if (node.type === 'database' && !unlockedTechs.includes('db-sharding-1')) {
                addLog('warning', 'Research "DB Sharding I" to unlock Tier 2 Databases.');
                return;
            }
        }

        const upgradeConfig = TIER_CONFIG[node.type][node.tier]; // Index = current tier (e.g. 1) = 2nd item

        if (!upgradeConfig) return; // No next tier

        if (cash >= upgradeConfig.cost) {
            updateCash(-upgradeConfig.cost);
            set((state) => ({
                nodes: state.nodes.map(n => n.id === id ? { ...n, tier: nextTier, health: 100 } : n)
            }));
            addLog('info', `Upgraded ${node.type} to Tier ${nextTier}`);
        } else {
            addLog('warning', `Not enough cash to upgrade. Need $${upgradeConfig.cost}.`);
        }
    },

    updateNodeLoad: (id, load) => set((state) => ({
        nodes: state.nodes.map(n => n.id === id ? { ...n, currentLoad: load } : n)
    })),

    // Stats
    recordFailure: (sourceId, reason) => {
        const state = get();
        state.addLog('error', reason || 'Request Failed', sourceId);

        // Phase 15: Multi-AZ Resilience Buff
        const hasMultiAZ = state.unlockedTechs.includes('multi-az');
        const cashPenalty = hasMultiAZ ? 5 : 10;
        const repPenalty = hasMultiAZ ? 1 : 2;

        const newReputation = Math.max(0, state.reputation - repPenalty);
        set({ failures: state.failures + 1, cash: state.cash - cashPenalty, reputation: newReputation });
    },

    repairNode: (id) => {
        const { cash, updateCash, setNodeStatus } = get();
        // Fixed Repair Cost
        const REPAIR_COST = 50;

        if (cash >= REPAIR_COST) {
            updateCash(-REPAIR_COST);
            set((state) => ({
                nodes: state.nodes.map(n => n.id === id ? { ...n, health: 100, status: 'active' } : n)
            }));
        }
    },

    autoRepairEnabled: false,
    setAutoRepairEnabled: (enabled) => set({ autoRepairEnabled: enabled }),

    setChaosEnabled: (enabled) => set({ chaosEnabled: enabled }),

    // Logging Implementation
    addLog: (severity, message, sourceId) => set((state) => {
        const newLog: SystemLog = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
            severity,
            message,
            sourceId
        };
        // Keep last 50 logs to prevent memory bloat
        return { logs: [newLog, ...state.logs].slice(0, 50) };
    }),

    clearLogs: () => set({ logs: [] }),

    // V2 Actions
    setTimeScale: (scale) => set({ timeScale: scale }),
    setPaused: (paused) => set({ isPaused: paused }),
    updateReputation: (amount) => set(state => ({
        reputation: Math.max(0, Math.min(100, state.reputation + amount))
    })),
    setSelectedTool: (tool) => set({ selectedTool: tool }),

    // Phase 14: Research & Development
    researchPoints: 0,
    unlockedTechs: [], // Initialize as empty array
    showTechTree: false, // Initialize as false
    addResearchPoints: (amount) => set((state) => ({
        researchPoints: state.researchPoints + amount
    })),
    setShowTechTree: (show) => set({ showTechTree: show }),
    unlockTech: (id: TechId) => {
        const { researchPoints, unlockedTechs, addLog } = get();
        const tech = TECH_TREE.find(t => t.id === id);

        if (!tech) {
            addLog('error', `Attempted to unlock unknown tech: ${id}`);
            return;
        }
        if (unlockedTechs.includes(id)) {
            addLog('info', `Tech '${tech.label}' already unlocked.`);
            return;
        }
        if (researchPoints < tech.cost) {
            addLog('warning', `Not enough research points to unlock '${tech.label}'. Cost: ${tech.cost}, Have: ${Math.floor(researchPoints)}`);
            return;
        }

        // Check prerequisites
        const missingPrereqs = tech.requirements.filter(reqId => !unlockedTechs.includes(reqId));
        if (missingPrereqs.length > 0) {
            const missingLabels = missingPrereqs.map(reqId => TECH_TREE.find(t => t.id === reqId)?.label || reqId).join(', ');
            addLog('warning', `Missing prerequisites for '${tech.label}': ${missingLabels}`);
            return;
        }

        set((state) => ({
            researchPoints: state.researchPoints - tech.cost,
            unlockedTechs: [...state.unlockedTechs, id]
        }));
        addLog('info', `Researched: ${tech.label}`);
        addLog('info', `Researched: ${tech.label}`);
    },

    // Phase 16: Scenarios
    activeScenario: null, // Default
    startScenario: (id) => {
        const scenario = SCENARIOS[id];
        if (!scenario) return;

        set({
            isPaused: true,
            nodes: scenario.initialNodes,
            connections: scenario.initialConnections,
            cash: scenario.initialCash,
            activeScenario: id,
            trafficConfig: scenario.trafficConfig,
            timeScale: 0,
            reputation: 100,
            failures: 0,
            logs: [],
            researchPoints: 0,
            unlockedTechs: [],
            showBriefing: true,
            scenarioComplete: false
        });
        get().addLog('info', `Started Scenario: ${scenario.name}`);
        get().addLog('info', scenario.description);
    },
    checkScenarioGoals: () => {
        const { activeScenario, cash, reputation } = get();
        if (!activeScenario) return;

        const scenario = SCENARIOS[activeScenario];
        scenario.goals.forEach(goal => {
            let met = false;

            if (goal.type === 'cash' && cash >= goal.target) met = true;
            // Add other goal types here as needed

            if (met) {
                // Goal Met!
                get().addLog('info', `GOAL MET: ${goal.label}!`);
                set({ scenarioComplete: true, isPaused: true, timeScale: 0 });
            }
        });
    },

    showBriefing: false, // Default
    setShowBriefing: (show) => set({ showBriefing: show }),

    scenarioComplete: false,
    setScenarioComplete: (complete) => set({ scenarioComplete: complete }),

    isOverlayOpen: () => {
        const { showDashboard, showTechTree, showManual, activeScenario, showBriefing, scenarioComplete } = get();
        // If scenario is null, selector is open.
        return showDashboard || showTechTree || showManual || activeScenario === null || showBriefing || scenarioComplete;
    }
}));
