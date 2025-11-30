import { streakSystem } from '../utils/streakSystem.js';

export class StreakIndicator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render() {
        if (!this.container) return;

        const streak = streakSystem.getStreak();
        const multiplier = streakSystem.getMultiplier();
        const isAtRisk = streakSystem.isAtRisk();

        this.container.innerHTML = `
      <div class="streak-badge ${isAtRisk ? 'risk' : ''}" title="Current Login Streak">
        <div class="streak-icon">🔥</div>
        <div class="streak-count">${streak}</div>
        ${multiplier > 1 ? `<div class="streak-multiplier">x${multiplier} XP</div>` : ''}
      </div>
    `;
    }
}
