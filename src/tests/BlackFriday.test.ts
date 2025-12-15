import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleBlackFriday, resetBlackFridayState } from '../components/Logic/ScenarioEngine';

describe('Scenario: Black Friday', () => {
    let setTrafficMock: any;
    let addLogMock: any;

    beforeEach(() => {
        setTrafficMock = vi.fn();
        addLogMock = vi.fn();
        resetBlackFridayState();
    });

    it('starts with calm traffic (5 RPS)', () => {
        handleBlackFriday(0, setTrafficMock, addLogMock);
        expect(setTrafficMock).toHaveBeenCalledWith({ totalRate: 5 });
    });

    it('ramps up to 20 RPS at 30 seconds', () => {
        handleBlackFriday(30, setTrafficMock, addLogMock);
        expect(setTrafficMock).toHaveBeenCalledWith({ totalRate: 20 });
        expect(addLogMock).toHaveBeenCalledWith('warning', expect.stringContaining('ramping up'));
    });

    it('triggers massive spike (100 RPS) at 60 seconds', () => {
        handleBlackFriday(60, setTrafficMock, addLogMock);
        expect(setTrafficMock).toHaveBeenCalledWith({ totalRate: 100 });
        expect(addLogMock).toHaveBeenCalledWith('error', expect.stringContaining('BLACK FRIDAY SALE STARTED'));
    });

    it('cools down to 50 RPS at 120 seconds', () => {
        handleBlackFriday(120, setTrafficMock, addLogMock);
        expect(setTrafficMock).toHaveBeenCalledWith({ totalRate: 50 });
        expect(addLogMock).toHaveBeenCalledWith('info', expect.stringContaining('stabilizing'));
    });

    it('does not re-trigger if state is preserved', () => {
        // First trigger
        handleBlackFriday(0, setTrafficMock, addLogMock);
        setTrafficMock.mockClear();

        // Second trigger same time - should be no-op (state is 'calm')
        handleBlackFriday(10, setTrafficMock, addLogMock);
        expect(setTrafficMock).not.toHaveBeenCalled();
    });
});
