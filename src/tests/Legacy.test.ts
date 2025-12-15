import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleLegacy, resetScenarioStates } from '../components/Logic/ScenarioEngine';

describe('Scenario: Legacy Migration', () => {
    let addLogMock: any;

    beforeEach(() => {
        addLogMock = vi.fn();
        resetScenarioStates();
    });

    it('stays silent at T=0', () => {
        handleLegacy(0, addLogMock);
        expect(addLogMock).not.toHaveBeenCalled();
    });

    it('logs start message at T=1', () => {
        handleLegacy(1, addLogMock);
        expect(addLogMock).toHaveBeenCalledWith('info', expect.stringContaining('Legacy System Online'));

        addLogMock.mockClear();
        // Should not log again at T=1 (state check)
        handleLegacy(1, addLogMock);
        expect(addLogMock).not.toHaveBeenCalled();
    });

    it('logs warning at T=60', () => {
        handleLegacy(60, addLogMock);
        expect(addLogMock).toHaveBeenCalledWith('warning', expect.stringContaining('Management is asking'));
    });

    it('logs audit message at T=150', () => {
        handleLegacy(150, addLogMock);
        expect(addLogMock).toHaveBeenCalledWith('info', expect.stringContaining('Final audit'));
    });
});
