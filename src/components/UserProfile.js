export class UserProfile {
    constructor() {
        this.modal = null;
    }

    render(userData) {
        // Remove existing modal if any
        const existing = document.querySelector('.user-profile-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.className = 'user-profile-modal open';
        modal.innerHTML = `
      <div class="profile-panel">
        <div class="profile-header">
          <button class="modal-close" style="position: absolute; top: 1rem; left: 1rem; background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer;">&times;</button>
          <div class="profile-avatar-lg">👤</div>
          <h2>${userData.address.slice(0, 6)}...${userData.address.slice(-4)}</h2>
          <p class="text-secondary">Joined Nov 2024</p>
        </div>

        <div class="profile-stats">
          <div class="stat-item">
            <span class="stat-label">Total Trees</span>
            <span class="stat-value">${userData.trees}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Carbon Offset</span>
            <span class="stat-value">${(userData.carbon / 1000).toFixed(1)}t</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Water Count</span>
            <span class="stat-value">${userData.waterCount || 0}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Rank</span>
            <span class="stat-value">#${userData.rank}</span>
          </div>
        </div>

        <div class="profile-badges">
          <h3>Achievements</h3>
          <div class="badge-grid">
            ${this.renderBadges(userData.badges)}
          </div>
        </div>
      </div>
    `;

        document.body.appendChild(modal);
        this.modal = modal;

        // Close handlers
        modal.querySelector('.modal-close').addEventListener('click', () => this.close());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.close();
        });
    }

    renderBadges(badges) {
        if (!badges || badges.length === 0) return '<p class="text-secondary">No badges yet</p>';

        // Mock badge icons mapping
        const badgeIcons = {
            'Forest Keeper': '🌲',
            'Green Thumb': '👍',
            'Early Adopter': '🚀',
            'Carbon Neutral': '⚖️'
        };

        return badges.map(badge => `
      <div class="badge-item" title="${badge}">
        ${badgeIcons[badge] || '🏅'}
      </div>
    `).join('');
    }

    close() {
        if (this.modal) {
            this.modal.classList.remove('open');
            setTimeout(() => this.modal.remove(), 300);
        }
    }
}
