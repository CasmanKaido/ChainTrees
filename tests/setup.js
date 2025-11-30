import { expect, afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
    document.body.innerHTML = '';
});

// Mock global objects if needed
global.fetch = vi.fn();
