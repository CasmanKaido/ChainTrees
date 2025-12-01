import { describe, it, expect } from 'vitest';
import { DataValidator } from '../../src/utils/dataValidator.js';

describe('DataValidator', () => {
    describe('isValidAddress', () => {
        it('should validate correct Ethereum address', () => {
            expect(DataValidator.isValidAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')).toBe(false);
            expect(DataValidator.isValidAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0')).toBe(true);
        });

        it('should reject invalid addresses', () => {
            expect(DataValidator.isValidAddress('invalid')).toBe(false);
            expect(DataValidator.isValidAddress('')).toBe(false);
            expect(DataValidator.isValidAddress(null)).toBe(false);
        });
    });

    describe('isValidEmail', () => {
        it('should validate correct email', () => {
            expect(DataValidator.isValidEmail('test@example.com')).toBe(true);
        });

        it('should reject invalid emails', () => {
            expect(DataValidator.isValidEmail('invalid')).toBe(false);
            expect(DataValidator.isValidEmail('test@')).toBe(false);
            expect(DataValidator.isValidEmail('')).toBe(false);
        });
    });

    describe('isInRange', () => {
        it('should validate numbers in range', () => {
            expect(DataValidator.isInRange(5, 1, 10)).toBe(true);
            expect(DataValidator.isInRange(1, 1, 10)).toBe(true);
            expect(DataValidator.isInRange(10, 1, 10)).toBe(true);
        });

        it('should reject numbers out of range', () => {
            expect(DataValidator.isInRange(0, 1, 10)).toBe(false);
            expect(DataValidator.isInRange(11, 1, 10)).toBe(false);
        });
    });

    describe('isValidLength', () => {
        it('should validate string length', () => {
            expect(DataValidator.isValidLength('hello', 1, 10)).toBe(true);
        });

        it('should reject invalid lengths', () => {
            expect(DataValidator.isValidLength('hi', 5, 10)).toBe(false);
            expect(DataValidator.isValidLength('hello world!', 1, 5)).toBe(false);
        });
    });

    describe('sanitizeHTML', () => {
        it('should escape HTML tags', () => {
            const result = DataValidator.sanitizeHTML('<script>alert("xss")</script>');
            expect(result).not.toContain('<script>');
        });
    });

    describe('isValidSpecies', () => {
        it('should validate correct species', () => {
            expect(DataValidator.isValidSpecies('Oak')).toBe(true);
            expect(DataValidator.isValidSpecies('Pine')).toBe(true);
        });

        it('should reject invalid species', () => {
            expect(DataValidator.isValidSpecies('InvalidTree')).toBe(false);
        });
    });

    describe('isValidRarity', () => {
        it('should validate correct rarity', () => {
            expect(DataValidator.isValidRarity('Common')).toBe(true);
            expect(DataValidator.isValidRarity('Legendary')).toBe(true);
        });

        it('should reject invalid rarity', () => {
            expect(DataValidator.isValidRarity('SuperRare')).toBe(false);
        });
    });

    describe('isValidPrice', () => {
        it('should validate correct prices', () => {
            expect(DataValidator.isValidPrice(100)).toBe(true);
            expect(DataValidator.isValidPrice('50.5')).toBe(true);
        });

        it('should reject invalid prices', () => {
            expect(DataValidator.isValidPrice(0)).toBe(false);
            expect(DataValidator.isValidPrice(-10)).toBe(false);
            expect(DataValidator.isValidPrice(2000000)).toBe(false);
        });
    });

    describe('validateProposal', () => {
        it('should validate correct proposal', () => {
            const result = DataValidator.validateProposal({
                title: 'Test Proposal',
                description: 'This is a test proposal description that is long enough',
                creator: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0'
            });
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should reject invalid proposal', () => {
            const result = DataValidator.validateProposal({
                title: 'Bad',
                description: 'Too short',
                creator: 'invalid'
            });
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });
    });

    describe('validateListing', () => {
        it('should validate correct listing', () => {
            const result = DataValidator.validateListing({
                treeId: 1,
                price: 100,
                seller: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0'
            });
            expect(result.valid).toBe(true);
        });

        it('should reject invalid listing', () => {
            const result = DataValidator.validateListing({
                treeId: null,
                price: -10,
                seller: 'invalid'
            });
            expect(result.valid).toBe(false);
        });
    });
});
