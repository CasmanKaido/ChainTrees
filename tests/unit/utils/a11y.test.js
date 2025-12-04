import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { a11y } from '../../src/utils/a11y.js';

describe('Accessibility Utility', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('should create an announcer element', () => {
        a11y.announce('Test message');
        const announcer = document.getElementById('a11y-announcer');
        expect(announcer).toBeTruthy();
        expect(announcer.textContent).toBe('Test message');
        expect(announcer.getAttribute('aria-live')).toBe('polite');
    });

    it('should update existing announcer', () => {
        a11y.announce('First');
        a11y.announce('Second', 'assertive');
        const announcer = document.getElementById('a11y-announcer');
        expect(announcer.textContent).toBe('Second');
        expect(announcer.getAttribute('aria-live')).toBe('assertive');
    });
});
