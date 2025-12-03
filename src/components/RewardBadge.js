export function RewardBadge({ label, earned }) {
    return `
        <div class="reward-badge ${earned ? 'earned' : 'locked'}">
            <span class="badge-label">${label}</span>
            ${earned ? '<svg class="badge-check" viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M9 16.2l-3.5-3.5L4 14.2l5 5 12-12-1.4-1.4z"/></svg>' : ''}
        </div>
    `;
}
