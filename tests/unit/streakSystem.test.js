import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StreakSystem } from '../../src/utils/streakSystem.js';
import { dailyLoginSystem } from '../../src/utils/dailyLoginSystem.js';

// Mock dailyLoginSystem
vi.mock('../../src/utils/dailyLoginSystem.js', () => ({
    dailyLoginSystem: {
        getData: vi.fn()
    }
}));

describe('StreakSystem', () => {
    let streakSystem;

    beforeEach(() => {
        streakSystem = new StreakSystem();
        vi.clearAllMocks();
    });

    describe('getStreak', () => {
        it('should return current streak from dailyLoginSystem', () => {
            dailyLoginSystem.getData.mockReturnValue({ streak: 5 });
            expect(streakSystem.getStreak()).toBe(5);
        });
    });

    describe('getMultiplier', () => {
        it('should return 1.0 for streak less than 3', () => {
            dailyLoginSystem.getData.mockReturnValue({ streak: 2 });
            expect(streakSystem.getMultiplier()).toBe(1.0);
        });

        it('should return 1.1 for streak of 3-6', () => {
            dailyLoginSystem.getData.mockReturnValue({ streak: 5 });
            expect(streakSystem.getMultiplier()).toBe(1.1);
        });

        it('should return 1.25 for streak of 7-13', () => {
            dailyLoginSystem.getData.mockReturnValue({ streak: 10 });
            expect(streakSystem.getMultiplier()).toBe(1.25);
        });

        it('should return 1.5 for streak of 14-29', () => {
            dailyLoginSystem.getData.mockReturnValue({ streak: 20 });
            expect(streakSystem.getMultiplier()).toBe(1.5);
        });

        it('should return 2.0 for streak of 30+', () => {
            dailyLoginSystem.getData.mockReturnValue({ streak: 30 });
            expect(streakSystem.getMultiplier()).toBe(2.0);
        });
    });

    describe('isAtRisk', () => {
        it('should return false if last claim was recent', () => {
            const now = new Date();
            dailyLoginSystem.getData.mockReturnValue({
                lastClaimDate: now.toISOString()
            });
            expect(streakSystem.isAtRisk()).toBe(false);
        });

        it('should return true if last claim was 25 hours ago', () => {
            const twentyFiveHoursAgo = new Date(Date.now() - 25 * 60 * 60 * 1000);
            dailyLoginSystem.getData.mockReturnValue({
                lastClaimDate: twentyFiveHoursAgo.toISOString()
            });
            expect(streakSystem.isAtRisk()).toBe(true);
        });

        it('should return false if last claim was over 48 hours ago', () => {
            const fiftyHoursAgo = new Date(Date.now() - 50 * 60 * 60 * 1000);
            dailyLoginSystem.getData.mockReturnValue({
                lastClaimDate: fiftyHoursAgo.toISOString()
            });
            expect(streakSystem.isAtRisk()).toBe(false);
        });
    });

    describe('buyFreeze', () => {
        it('should return true when freeze is purchased', () => {
            expect(streakSystem.buyFreeze()).toBe(true);
        });
    });
});
