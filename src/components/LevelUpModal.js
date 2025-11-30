import { levelingSystem } from '../utils/levelingSystem.js';

export class LevelUpModal {
    constructor() {
        this.createModal();
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'level-up-modal';
        modal.id = 'level-up-modal';

        modal.innerHTML = `
      <div class="level-up-content">
        <div class="level-badge" id="new-level-badge">5</div>
        <h2 class="level-up-title">Level Up!</h2>
        <p class="level-up-subtitle" id="level-title">Grove Keeper</p>
        
        <div class="level-rewards">
          <div class="reward-item">
            <span>🎁</span>
            <span>+100 TREE Tokens</span>
          </div>
        </div>

        <button class="claim-btn" id="claim-level-btn">Claim Rewards</button>
      </div>
    `;

        document.body.appendChild(modal);

        // Event Listeners
        modal.querySelector('#claim-level-btn').addEventListener('click', () => {
            this.close();
        });
    }

    show(level) {
        const modal = document.getElementById('level-up-modal');
        const badge = document.getElementById('new-level-badge');
        const title = document.getElementById('level-title');

        badge.textContent = level;
        title.textContent = levelingSystem.getTitle(level);

        modal.classList.add('active');
        this.spawnConfetti();
    }

    close() {
        const modal = document.getElementById('level-up-modal');
        modal.classList.remove('active');
    }

    spawnConfetti() {
        const colors = ['#fbbf24', '#ef4444', '#3b82f6', '#10b981', '#a855f7'];
        const modal = document.querySelector('.level-up-content');

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = -10 + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (Math.random() * 2 + 1) + 's';

            modal.appendChild(confetti);

            setTimeout(() => confetti.remove(), 3000);
        }
    }
}
