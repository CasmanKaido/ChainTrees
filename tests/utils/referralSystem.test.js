import { describe, it, expect, beforeEach } from 'vitest';
import { ReferralSystem } from '../../src/utils/referralSystem.js';

describe('ReferralSystem', () => {
    let referralSystem;

    beforeEach(() => {
        referralSystem = new ReferralSystem();
    });

    it('should generate a valid referral code', () => {
        const address = '0x1234567890abcdef1234567890abcdef12345678';
        const code = referralSystem.generateCode(address);

        expect(code).toBeDefined();
        expect(code.length).toBeGreaterThan(6);
        expect(code).toContain('5678'); // Last 4 chars of address (simplified logic check)
    });

    it('should generate correct referral link', () => {
        const code = 'ABC-123';
        // Mock window.location.origin
        Object.defineProperty(window, 'location', {
            value: { origin: 'http://localhost:3000' },
            writable: true
        });

        // Re-instantiate to pick up new origin
        referralSystem = new ReferralSystem();

        const link = referralSystem.getReferralLink(code);
        expect(link).toBe('http://localhost:3000?ref=ABC-123');
    });
});
