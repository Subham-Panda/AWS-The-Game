import { create } from 'zustand';

export type NodeType = 'web-server' | 'database' | 'gateway' | 'load-balancer' | 'waf' | 'sqs' | 'cache' | 's3';
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
    recordFailure: () => void;
    chaosEnabled: boolean;
    autoRepairEnabled: boolean;
    setChaosEnabled: (enabled: boolean) => void;
    setAutoRepairEnabled: (enabled: boolean) => void;
    // V2 State
    reputation: number; // 0-100
    timeScale: number; // 0 (paused), 1 (normal), 3 (fast)
    isPaused: boolean;
    selectedTool: SelectedTool;
    showDashboard: boolean;
    setShowDashboard: (show: boolean) => void;
    setTimeScale: (scale: number) => void;
    setPaused: (paused: boolean) => void;
    updateReputation: (amount: number) => void;
    setSelectedTool: (tool: SelectedTool) => void;
    resetToEmpty: () => void;

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

    // Flags
    chaosEnabled: false, // Default to false (User Request)

    // V2 Init
    reputation: 100,
    timeScale: 0, // Paused initially (speed 0)
    isPaused: true, // Paused initially
    selectedTool: 'select',
    showDashboard: false,
    setShowDashboard: (show: boolean) => set({ showDashboard: show }),

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
        draggedItem: null
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

        return {
            cash: currentCash,
            nodes: updatedNodes
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
        const { nodes, cash, updateCash } = get();
        const node = nodes.find(n => n.id === id);
        if (!node || node.tier >= 5) return;

        // Next tier index is node.tier (since tiers are 1-based, index 1 is Tier 2 config)
        // Wait, TIER_CONFIG arrays are 0-indexed.
        // TIER_CONFIG['web-server'][0] is Tier 1 capacity/cost.
        // So TIER_CONFIG['web-server'][1] is Tier 2.
        // So to upgrade FROM Tier 1 TO Tier 2, we need cost at index 1.

        const nextTier = node.tier + 1;
        const upgradeConfig = TIER_CONFIG[node.type][node.tier]; // Index = current tier (e.g. 1) = 2nd item

        if (!upgradeConfig) return; // No next tier

        if (cash >= upgradeConfig.cost) {
            updateCash(-upgradeConfig.cost);
            set((state) => ({
                nodes: state.nodes.map(n => n.id === id ? { ...n, tier: nextTier, health: 100 } : n)
            }));
        }
    },

    updateNodeLoad: (id, load) => set((state) => ({
        nodes: state.nodes.map(n => n.id === id ? { ...n, currentLoad: load } : n)
    })),

    // Stats
    recordFailure: () => set((state) => ({
        failures: state.failures + 1,
        cash: state.cash - 10
    })),

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

    // V2 Actions
    setTimeScale: (scale) => set({ timeScale: scale }),
    setPaused: (paused) => set({ isPaused: paused }),
    updateReputation: (amount) => set(state => ({
        reputation: Math.max(0, Math.min(100, state.reputation + amount))
    })),
    setSelectedTool: (tool) => set({ selectedTool: tool })
}));
