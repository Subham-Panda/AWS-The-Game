import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleDDoS, resetScenarioStates } from '../components/Logic/ScenarioEngine';

describe('Scenario: DDoS Defense', () => {
    let setTrafficMock: any;
    let addLogMock: any;

    beforeEach(() => {
        setTrafficMock = vi.fn();
        addLogMock = vi.fn();
        resetScenarioStates();
    });

    it('starts with normal traffic (0% malicious) at 0s', () => {
        handleDDoS(0, setTrafficMock, addLogMock);
        expect(setTrafficMock).toHaveBeenCalledWith(expect.objectContaining({
            totalRate: 10,
            distribution: expect.objectContaining({ malicious: 0 })
        }));
    });

    it('deploys probe traffic (20% malicious) at 20s', () => {
        handleDDoS(20, setTrafficMock, addLogMock);
        expect(setTrafficMock).toHaveBeenCalledWith(expect.objectContaining({
            totalRate: 15,
            distribution: expect.objectContaining({ malicious: 20 })
        }));
        expect(addLogMock).toHaveBeenCalledWith('warning', expect.stringContaining('Suspicious'));
    });

    it('launches Attack Wave 1 (60% malicious) at 45s', () => {
        handleDDoS(45, setTrafficMock, addLogMock);
        expect(setTrafficMock).toHaveBeenCalledWith(expect.objectContaining({
            totalRate: 30,
            distribution: expect.objectContaining({ malicious: 60 })
        }));
        expect(addLogMock).toHaveBeenCalledWith('error', expect.stringContaining('DDoS Attack Detected'));
    });

    it('unleashes The Flood (80% malicious) at 90s', () => {
        handleDDoS(90, setTrafficMock, addLogMock);
        expect(setTrafficMock).toHaveBeenCalledWith(expect.objectContaining({
            totalRate: 80,
            distribution: expect.objectContaining({ malicious: 80 })
        }));
        expect(addLogMock).toHaveBeenCalledWith('error', expect.stringContaining('MASSIVE ATTACK'));
    });
});
