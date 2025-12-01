import { describe, it, expect, beforeEach } from 'vitest';
import { LevelingSystem } from '../../src/utils/levelingSystem.js';

describe('LevelingSystem', () => {
    let levelingSystem;

    beforeEach(() => {
        levelingSystem = new LevelingSystem();
    });

    describe('getLevel', () => {
        it('should return level 1 for 0 XP', () => {
            expect(levelingSystem.getLevel(0)).toBe(1);
        });

        it('should return level 2 for 100 XP', () => {
            expect(levelingSystem.getLevel(100)).toBe(2);
        });

        it('should return level 5 for 1500 XP', () => {
            expect(levelingSystem.getLevel(1500)).toBe(5);
        });

        it('should return level 10 for max XP', () => {
            expect(levelingSystem.getLevel(32000)).toBe(10);
        });
    });

    describe('getNextLevelXP', () => {
        it('should return 100 for level 1', () => {
            expect(levelingSystem.getNextLevelXP(1)).toBe(100);
        });

        it('should return Infinity for max level', () => {
            expect(levelingSystem.getNextLevelXP(10)).toBe(Infinity);
        });
    });

    describe('getProgress', () => {
        it('should return 0 for 0 XP at level 1', () => {
            expect(levelingSystem.getProgress(0)).toBe(0);
        });

        it('should return 50 for halfway to next level', () => {
            expect(levelingSystem.getProgress(50)).toBe(50);
        });

        it('should return 100 for max level', () => {
            expect(levelingSystem.getProgress(32000)).toBe(100);
        });
    });

    describe('getTitle', () => {
        it('should return correct title for level 1', () => {
            expect(levelingSystem.getTitle(1)).toBe('Novice Planter');
        });

        it('should return correct title for level 10', () => {
            expect(levelingSystem.getTitle(10)).toBe("Gaia's Champion");
        });

        it('should return default for unknown level', () => {
            expect(levelingSystem.getTitle(99)).toBe('Unknown Wanderer');
        });
    });

    describe('addXP', () => {
        it('should add XP correctly', () => {
            levelingSystem.addXP(50);
            expect(levelingSystem.currentXP).toBe(50);
        });

        it('should detect level up', () => {
            const result = levelingSystem.addXP(100);
            expect(result.leveledUp).toBe(true);
            expect(result.newLevel).toBe(2);
        });

        it('should not level up if XP is insufficient', () => {
            const result = levelingSystem.addXP(50);
            expect(result.leveledUp).toBe(false);
            expect(result.newLevel).toBe(1);
        });
    });
});
