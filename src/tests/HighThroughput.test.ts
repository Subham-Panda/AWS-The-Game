import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleHighThroughput, resetScenarioStates } from '../components/Logic/ScenarioEngine';

describe('Scenario: High Throughput', () => {
    let setTrafficMock: any;
    let addLogMock: any;

    beforeEach(() => {
        setTrafficMock = vi.fn();
        addLogMock = vi.fn();
        resetScenarioStates();
    });

    it('starts with warmup traffic (10 RPS) at 0s', () => {
        handleHighThroughput(0, setTrafficMock, addLogMock);
        expect(setTrafficMock).toHaveBeenCalledWith(expect.objectContaining({
            totalRate: 10,
            distribution: expect.objectContaining({ static: 50, read: 40 })
        }));
    });

    it('ramps to Stress Test (30 RPS) at 30s', () => {
        handleHighThroughput(30, setTrafficMock, addLogMock);
        expect(setTrafficMock).toHaveBeenCalledWith(expect.objectContaining({ totalRate: 30 }));
        expect(addLogMock).toHaveBeenCalledWith('warning', expect.stringContaining('load increasing'));
    });

    it('hits High Load (60 RPS) at 60s', () => {
        handleHighThroughput(60, setTrafficMock, addLogMock);
        expect(setTrafficMock).toHaveBeenCalledWith(expect.objectContaining({ totalRate: 60 }));
        expect(addLogMock).toHaveBeenCalledWith('error', expect.stringContaining('Caching is required'));
    });

    it('reaches Peak Traffic (80 RPS) at 90s', () => {
        handleHighThroughput(90, setTrafficMock, addLogMock);
        expect(setTrafficMock).toHaveBeenCalledWith(expect.objectContaining({ totalRate: 80 }));
        expect(addLogMock).toHaveBeenCalledWith('error', expect.stringContaining('Peak'));
    });
});
