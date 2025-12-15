import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleChaosMonkey, resetScenarioStates } from '../components/Logic/ScenarioEngine';

describe('Scenario: Chaos Monkey', () => {
    let killRandomNodeMock: any;
    let addLogMock: any;

    beforeEach(() => {
        killRandomNodeMock = vi.fn();
        addLogMock = vi.fn();
        resetScenarioStates();
    });

    it('stays calm until 20s', () => {
        handleChaosMonkey(10, killRandomNodeMock, addLogMock);
        expect(killRandomNodeMock).not.toHaveBeenCalled();
        expect(addLogMock).not.toHaveBeenCalled();
    });

    it('triggers First Blood at 20s', () => {
        handleChaosMonkey(20, killRandomNodeMock, addLogMock);
        expect(killRandomNodeMock).toHaveBeenCalledTimes(1);
        expect(addLogMock).toHaveBeenCalledWith('warning', expect.stringContaining('Chaos Monkey appeared'));
    });

    it('kills every 10s during Rampage (45s+)', () => {
        // First trigger at 45s
        handleChaosMonkey(45, killRandomNodeMock, addLogMock);
        expect(killRandomNodeMock).toHaveBeenCalledTimes(1);
        expect(addLogMock).toHaveBeenCalledWith('error', expect.stringContaining('destroying infrastructure'));

        killRandomNodeMock.mockClear();

        // 5s later (Total 50s) - Should NOT kill (Interval 10s)
        handleChaosMonkey(50, killRandomNodeMock, addLogMock);
        expect(killRandomNodeMock).not.toHaveBeenCalled();

        // 10s later (Total 55s) - Should trigger
        handleChaosMonkey(55, killRandomNodeMock, addLogMock);
        expect(killRandomNodeMock).toHaveBeenCalledTimes(1);
    });

    it('kills every 5s during Total Chaos (90s+)', () => {
        // Trigger 90s
        handleChaosMonkey(90, killRandomNodeMock, addLogMock);
        expect(killRandomNodeMock).toHaveBeenCalledTimes(1);
        expect(addLogMock).toHaveBeenCalledWith('error', expect.stringContaining('MAXIMUM CHAOS'));

        killRandomNodeMock.mockClear();

        // 5s later (95s) - Should trigger
        handleChaosMonkey(95, killRandomNodeMock, addLogMock);
        expect(killRandomNodeMock).toHaveBeenCalledTimes(1);
    });
});
