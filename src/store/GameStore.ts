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
    killRandomNode: () => void;
    getOperatingCost: () => number;
    // Stats
    requestsServed: number;
    incrementRequestsServed: () => void;

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
    scenarioElapsedTime: number;
    startScenario: (id: ScenarioId) => void;
    tickScenario: () => void;
    checkScenarioGoals: () => void;

    // UI Helpers
    showBriefing: boolean;
    setShowBriefing: (show: boolean) => void;
    scenarioComplete: boolean;
    setScenarioComplete: (complete: boolean) => void;
    appState: 'landing' | 'scenario-selection' | 'playing';
    setAppState: (state: 'landing' | 'scenario-selection' | 'playing') => void;
    isOverlayOpen: () => boolean;
}

// Helper to generate a "Cyber City" background
const generateHeroScene = (): { nodes: Node[], connections: Connection[] } => {
    const nodes: Node[] = [];
    const connections: Connection[] = [];
    const gridSize = 6;
    const spacing = 4;

    for (let x = -gridSize; x <= gridSize; x++) {
        for (let z = -gridSize; z <= gridSize; z++) {
            // Skip gathering center for the "void" look
            if (Math.abs(x) < 2 && Math.abs(z) < 2) continue;

            const id = `hero-${x}-${z}`;
            const isDb = Math.random() > 0.8;
            const isLb = Math.random() > 0.9;

            nodes.push({
                id,
                type: isDb ? 'database' : (isLb ? 'load-balancer' : 'web-server'),
                position: [x * spacing, 0, z * spacing],
                status: 'active',
                health: 100,
                tier: Math.floor(Math.random() * 3) + 1,
                currentLoad: Math.random() * 100
            });

            // Random connections to neighbors
            if (Math.random() > 0.7) {
                const targetX = x + (Math.random() > 0.5 ? 1 : -1);
                const targetZ = z;
                const targetId = `hero-${targetX}-${targetZ}`;
                // We don't check if target exists, just simple visual noise. 
                // Actually, let's just connect to previous node in row for simplicity if it exists
                if (nodes.length > 1 && Math.random() > 0.5) {
                    connections.push({
                        id: `conn-${id}`,
                        sourceId: id,
                        targetId: nodes[nodes.length - 2].id
                    });
                }
            }
        }
    }
    return { nodes, connections };
};

const HERO_SCENE = generateHeroScene();
const INITIAL_NODES: Node[] = HERO_SCENE.nodes;
const INITIAL_CONNECTIONS: Connection[] = HERO_SCENE.connections;

const SANDBOX_SCENE = {
    nodes: [
        { id: 'sb-gw', type: 'gateway', position: [-6, 0, 0], status: 'active', health: 100, tier: 1, currentLoad: 0 },
        { id: 'sb-waf', type: 'waf', position: [-3, 0, 0], status: 'active', health: 100, tier: 1, currentLoad: 0 },
        { id: 'sb-lb', type: 'load-balancer', position: [0, 0, 0], status: 'active', health: 100, tier: 1, currentLoad: 0 },
        { id: 'sb-web1', type: 'web-server', position: [3, 0, -2], status: 'active', health: 100, tier: 1, currentLoad: 0 },
        { id: 'sb-web2', type: 'web-server', position: [3, 0, 2], status: 'active', health: 100, tier: 1, currentLoad: 0 },
        { id: 'sb-db', type: 'database', position: [6, 0, -2], status: 'active', health: 100, tier: 1, currentLoad: 0 },
        { id: 'sb-s3', type: 's3', position: [6, 0, 2], status: 'active', health: 100, tier: 1, currentLoad: 0 },
    ] as Node[],
    connections: [
        { id: 'c-sb-1', sourceId: 'sb-gw', targetId: 'sb-waf' },
        { id: 'c-sb-2', sourceId: 'sb-waf', targetId: 'sb-lb' },
        { id: 'c-sb-3', sourceId: 'sb-lb', targetId: 'sb-web1' },
        { id: 'c-sb-4', sourceId: 'sb-lb', targetId: 'sb-web2' },
        { id: 'c-sb-5', sourceId: 'sb-web1', targetId: 'sb-db' },
        { id: 'c-sb-6', sourceId: 'sb-web2', targetId: 'sb-db' },
        { id: 'c-sb-7', sourceId: 'sb-web1', targetId: 'sb-s3' },
        { id: 'c-sb-8', sourceId: 'sb-web2', targetId: 'sb-s3' },
    ] as Connection[]
};


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
        type: 'cash' | 'reputation' | 'requests' | 'uptime' | 'cost';
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
        initialNodes: SANDBOX_SCENE.nodes,
        initialConnections: SANDBOX_SCENE.connections,
        trafficConfig: {
            mode: 'aggregate', totalRate: 5,
            distribution: { static: 30, read: 30, write: 30, search: 10, upload: 0, malicious: 0 }, // No Uploads by default to avoid S3 error if user deletes it
            granularRates: { static: 2, read: 2, write: 1, search: 1, upload: 0, malicious: 0 }
        },
        goals: []
    },
    'startup': {
        id: 'startup',
        name: 'The Startup',
        description: 'You have limited seed funding. Build a basic architecture (Gateway -> WAF -> LB -> Server -> DB) and reach $2000 in cash.',
        difficulty: 'Easy',
        initialCash: 1500,
        initialNodes: [
            { id: 'gw-start', type: 'gateway', position: [-6, 0, 0], status: 'active', health: 100, tier: 1, currentLoad: 0 }
        ],
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
    'black-friday': {
        id: 'black-friday',
        name: 'Black Friday',
        description: 'Survive the massive traffic spike! Traffic will surge from 5 to 100 RPS within 60 seconds.',
        difficulty: 'Hard',
        initialCash: 5000,
        initialNodes: [
            { id: 'gw-bf', type: 'gateway', position: [-6, 0, 0], status: 'active', health: 100, tier: 1, currentLoad: 0 }
        ],
        initialConnections: [],
        trafficConfig: {
            mode: 'aggregate',
            totalRate: 5, // Starts calm
            distribution: { static: 20, read: 50, write: 30, search: 0, upload: 0, malicious: 0 },
            granularRates: { static: 1, read: 2.5, write: 1.5, search: 0, upload: 0, malicious: 0 }
        },
        goals: [
            { type: 'uptime', target: 120, label: 'Survive for 120 Seconds' }, // Using 'uptime' as time-survival for now, logic needs to be checked
            { type: 'reputation', target: 50, label: 'Maintain > 50% Reputation' },
            { type: 'cash', target: 8000, label: 'Reach $8,000 Profit' }
        ]
    },
    'ddos': {
        id: 'ddos',
        name: 'DDoS Defense',
        description: 'You are under attack! Filter malicious traffic with WAFs while keeping services online.',
        difficulty: 'Hard',
        initialCash: 2000,
        initialNodes: [
            { id: 'gw-ddos', type: 'gateway', position: [-6, 0, 0], status: 'active', health: 100, tier: 1, currentLoad: 0 }
        ],
        initialConnections: [],
        lockedTechs: ['auto-scaling'], // Lock auto-scaling to focus on security
        trafficConfig: {
            mode: 'aggregate',
            totalRate: 10,
            distribution: { static: 40, read: 40, write: 10, search: 10, upload: 0, malicious: 0 }, // Starts Clean
            granularRates: { static: 0, read: 0, write: 0, search: 0, upload: 0, malicious: 0 }
        },
        goals: [
            { type: 'uptime', target: 120, label: 'Survive for 120 Seconds' },
            { type: 'reputation', target: 20, label: 'Maintain > 20% Reputation' },
            { type: 'requests', target: 500, label: 'Serve 500 Legitimate Requests' }
        ]
    },
    'high-throughput': {
        id: 'high-throughput',
        name: 'High Throughput',
        description: 'Your database is the bottleneck. Use Caching to offload read traffic and survive the load.',
        difficulty: 'Medium',
        initialCash: 4000,
        initialNodes: [
            { id: 'gw-ht', type: 'gateway', position: [-6, 0, 0], status: 'active', health: 100, tier: 1, currentLoad: 0 }
        ],
        initialConnections: [],
        lockedTechs: ['auto-scaling', 'multi-az'], // Force Caching
        trafficConfig: {
            mode: 'aggregate',
            totalRate: 10,
            distribution: { static: 50, read: 40, write: 10, search: 0, upload: 0, malicious: 0 }, // High Read/Static
            granularRates: { static: 1, read: 1, write: 1, search: 0, upload: 0, malicious: 0 }
        },
        goals: [
            { type: 'requests', target: 2000, label: 'Serve 2,000 Requests' },
            { type: 'uptime', target: 120, label: 'Survive for 120 Seconds' },
            { type: 'reputation', target: 50, label: 'Maintain > 50% Reputation' }
        ]
    },
    'chaos': {
        id: 'chaos',
        name: 'Chaos Monkey',
        description: 'Resistance is futile? No. Resilience is key. Survive random infrastructure failures.',
        difficulty: 'Hard',
        initialCash: 6000,
        initialNodes: [
            { id: 'gw-chaos', type: 'gateway', position: [-6, 0, 0], status: 'active', health: 100, tier: 1, currentLoad: 0 }
        ],
        initialConnections: [],
        trafficConfig: {
            mode: 'aggregate',
            totalRate: 20,
            distribution: { static: 20, read: 20, write: 20, search: 20, upload: 10, malicious: 10 },
            granularRates: { static: 1, read: 1, write: 1, search: 1, upload: 1, malicious: 1 }
        },
        goals: [
            { type: 'uptime', target: 120, label: 'Survive for 120 Seconds' },
            { type: 'reputation', target: 40, label: 'Maintain > 40% Reputation' }
        ]
    },
    'legacy': {
        id: 'legacy',
        name: 'Legacy Migration',
        description: 'Inherited a mess? Fix it. Reduce operating costs by modernizing the architecture without downtime.',
        difficulty: 'Hard',
        initialCash: 5000,
        // The Legacy Mess: 6 Tier-1 Web Servers, 3 Tier-1 DBs, No Load Balancer (Direct Connect madness?? No, Traffic needs LB).
        // Let's assume a primitive LB pointing to inefficient chain.
        initialNodes: [
            { id: 'gw-legacy', type: 'gateway', position: [0, 0, 6], status: 'active', health: 100, tier: 1, currentLoad: 0 },
            { id: 'lb-legacy', type: 'load-balancer', position: [0, 0, 2], status: 'active', health: 100, tier: 1, currentLoad: 0 },
            { id: 'web-1', type: 'web-server', position: [-4, 0, 0], status: 'active', health: 80, tier: 1, currentLoad: 0 },
            { id: 'web-2', type: 'web-server', position: [-2, 0, 0], status: 'active', health: 75, tier: 1, currentLoad: 0 },
            { id: 'web-3', type: 'web-server', position: [0, 0, 0], status: 'active', health: 60, tier: 1, currentLoad: 0 },
            { id: 'web-4', type: 'web-server', position: [2, 0, 0], status: 'active', health: 90, tier: 1, currentLoad: 0 },
            { id: 'web-5', type: 'web-server', position: [4, 0, 0], status: 'active', health: 85, tier: 1, currentLoad: 0 },
            { id: 'db-1', type: 'database', position: [-2, 0, -3], status: 'active', health: 70, tier: 1, currentLoad: 0 },
            { id: 'db-2', type: 'database', position: [2, 0, -3], status: 'active', health: 65, tier: 1, currentLoad: 0 },
        ],
        initialConnections: [
            { id: 'c0', sourceId: 'gw-legacy', targetId: 'lb-legacy' },
            { id: 'c1', sourceId: 'lb-legacy', targetId: 'web-1' },
            { id: 'c2', sourceId: 'lb-legacy', targetId: 'web-2' },
            { id: 'c3', sourceId: 'lb-legacy', targetId: 'web-3' },
            { id: 'c4', sourceId: 'lb-legacy', targetId: 'web-4' },
            { id: 'c5', sourceId: 'lb-legacy', targetId: 'web-5' },
            { id: 'c6', sourceId: 'web-1', targetId: 'db-1' },
            { id: 'c7', sourceId: 'web-2', targetId: 'db-1' },
            { id: 'c8', sourceId: 'web-3', targetId: 'db-1' }, // Overloaded DB-1
            { id: 'c9', sourceId: 'web-4', targetId: 'db-2' },
            { id: 'c10', sourceId: 'web-5', targetId: 'db-2' },
        ],
        trafficConfig: {
            mode: 'aggregate',
            totalRate: 20,
            distribution: { static: 30, read: 50, write: 20, search: 0, upload: 0, malicious: 0 },
            granularRates: { static: 1, read: 1, write: 1, search: 1, upload: 1, malicious: 1 }
        },
        goals: [
            { type: 'cost', target: 50, label: 'Reduce OpEx to < $50/sec' },
            { type: 'uptime', target: 180, label: 'Survive for 180 Seconds' },
            { type: 'reputation', target: 60, label: 'Maintain > 60% Reputation' }
        ]
    },

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

    // App State
    appState: 'landing',
    setAppState: (state: 'landing' | 'scenario-selection' | 'playing') => set({ appState: state }),

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
        nodes: HERO_SCENE.nodes,
        connections: HERO_SCENE.connections,
        cash: 1000,
        score: 0,
        failures: 0,
        reputation: 100,
        requestsServed: 0,
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
        showBriefing: false,
        appState: 'scenario-selection'
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
        // Cap at 100. But if 0 (Dead), do not recover.
        let newReputation = state.reputation;
        if (newReputation > 0 && newReputation < 100) {
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
        const isGameEnding = newReputation <= 0 && !!state.activeScenario;

        set({
            failures: state.failures + 1,
            cash: state.cash - cashPenalty,
            reputation: newReputation,
            isPaused: isGameEnding ? true : state.isPaused, // Pause immediately on loss
            timeScale: isGameEnding ? 0 : state.timeScale
        });

        if (isGameEnding) {
            state.addLog('error', 'GAME OVER: Reputation hit 0%. The company has collapsed.');
        }
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
    },

    getOperatingCost: () => {
        const { nodes } = get();
        // Simple OpEx Model: $10 * Tier per node per second
        const activeNodes = nodes.filter(n => n.status !== 'down'); // 'failed' was removed, handled as 'down' or 'maintenance'
        // Wait, did I finalize 'down'? Yes.
        // Also 'rebooting'.
        // Only fully 'active' nodes cost money? Or all existing nodes?
        // Rent is due regardless of uptime!
        // But maybe 'down' nodes stop costing? That encourages killing them.
        // The goal is 'Migration' -> Delete them.
        // So yes, all nodes present in the list cost money?
        // No, 'down' (failed) nodes might still cost.
        // But if I delete them (remove from array), cost goes away.
        return nodes.reduce((total, node) => total + (node.tier * 10), 0);
    },

    // Chaos Monkey Util
    killRandomNode: () => set((state) => {
        const activeNodes = state.nodes.filter(n => n.status === 'active');
        if (activeNodes.length === 0) return {};

        const victimIndex = Math.floor(Math.random() * activeNodes.length);
        const victim = activeNodes[victimIndex];

        // Don't kill the last node of a type if possible? No, Chaos is ruthless.
        // Actually, maybe avoid killing the *only* node initially? No, scenario starts empty anyway.

        const newNodes = state.nodes.map(n =>
            n.id === victim.id ? { ...n, status: 'down' as const, health: 0 } : n
        );

        return {
            nodes: newNodes,
            logs: [{
                id: crypto.randomUUID(),
                timestamp: Date.now(),
                severity: 'error',
                message: `🔥 CHAOS MONKEY KILLED NODE: ${victim.type} (${victim.id})`,
                sourceId: victim.id
            }, ...state.logs.slice(0, 49)]
        };
    }),

    // Stats
    requestsServed: 0,
    incrementRequestsServed: () => set((state) => ({ requestsServed: state.requestsServed + 1 })),

    // Phase 16: Scenarios
    activeScenario: null, // Default
    scenarioElapsedTime: 0, // Track time in specific scenario
    startScenario: (id) => {
        const scenario = SCENARIOS[id];
        if (!scenario) return;

        set({
            isPaused: true,
            nodes: scenario.initialNodes,
            connections: scenario.initialConnections,
            cash: scenario.initialCash,
            activeScenario: id,
            appState: 'playing',
            trafficConfig: scenario.trafficConfig,
            timeScale: 0,
            reputation: 100,
            failures: 0,
            logs: [],
            researchPoints: 0,
            unlockedTechs: [],
            showBriefing: true,
            scenarioComplete: false,
            scenarioElapsedTime: 0
        });
        get().addLog('info', `Started Scenario: ${scenario.name}`);
        get().addLog('info', scenario.description);
    },
    tickScenario: () => set((state) => ({
        scenarioElapsedTime: state.scenarioElapsedTime + 1
    })),
    checkScenarioGoals: () => {
        const { activeScenario, cash, reputation, scenarioElapsedTime, requestsServed } = get();
        if (!activeScenario) return;

        const scenario = SCENARIOS[activeScenario];

        // Check if ALL goals are satisfied.
        // Sandbox has 0 goals, so we shouldn't complete it.
        const allMet = scenario.goals.length > 0 && scenario.goals.every(g => {
            if (g.type === 'cash') return cash >= g.target;
            if (g.type === 'reputation') return reputation >= g.target;
            if (g.type === 'uptime') return scenarioElapsedTime >= g.target;
            if (g.type === 'requests') return requestsServed >= g.target;
            if (g.type === 'cost') return get().getOperatingCost() <= g.target;
            return false;
        });

        if (allMet) {
            get().addLog('info', `SCENARIO COMPLETE: ${scenario.name}!`);
            set({ scenarioComplete: true, isPaused: true, timeScale: 0 });
        }

        // Loss Condition - Generic for all scenarios
        if (activeScenario && reputation <= 0) {
            set({ isPaused: true, timeScale: 0 });
            get().addLog('error', 'GAME OVER: Reputation hit 0%. The company has collapsed.');
            // Trigger generic failure state if needed, but GameResultsModal uses paused + rep<=0 check
        }
    },

    showBriefing: false, // Default
    setShowBriefing: (show) => set({ showBriefing: show }),

    scenarioComplete: false,
    setScenarioComplete: (complete) => set({ scenarioComplete: complete }),

    isOverlayOpen: () => {
        const s = get();
        // Check for Game Over condition matching GameResultsModal logic
        const isGameOver = (!!s.activeScenario && s.reputation <= 0) || s.scenarioComplete;
        return s.showDashboard || s.showBriefing || s.appState === 'landing' || s.appState === 'scenario-selection' || isGameOver;
    }
}));
