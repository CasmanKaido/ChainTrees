import { dailyLoginSystem } from '../utils/dailyLoginSystem.js';
import { DAILY_REWARDS } from '../utils/gamificationConstants.js';

export class DailyRewardModal {
    constructor() {
        this.createModal();
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'daily-reward-modal';
        modal.id = 'daily-reward-modal';

        modal.innerHTML = `
      <div class="daily-reward-content">
        <h2>📅 Daily Login Rewards</h2>
        <p>Come back every day to build your streak!</p>
        
        <div class="daily-grid" id="daily-grid">
          <!-- Days injected here -->
        </div>

        <button class="claim-daily-btn" id="claim-daily-btn">Claim Reward</button>
      </div>
    `;

        document.body.appendChild(modal);

        // Event Listeners
        modal.querySelector('#claim-daily-btn').addEventListener('click', () => {
            this.handleClaim();
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.close();
        });
    }

    renderGrid() {
        const grid = document.getElementById('daily-grid');
        const data = dailyLoginSystem.getData();
        const currentDay = dailyLoginSystem.canClaim() ? data.currentDay + 1 : data.currentDay;

        grid.innerHTML = DAILY_REWARDS.map((reward, index) => {
            const dayNum = index + 1;
            let statusClass = '';

            if (dayNum < currentDay) statusClass = 'claimed';
            else if (dayNum === currentDay) statusClass = 'active';

            if (dayNum === 7) statusClass += ' big-reward';

            return `
        <div class="daily-day ${statusClass}">
          <div class="day-number">Day ${dayNum}</div>
          <div class="day-reward">+${reward} XP</div>
          ${statusClass === 'claimed' ? '<div>✅</div>' : ''}
        </div>
      `;
        }).join('');

        const btn = document.getElementById('claim-daily-btn');
        if (dailyLoginSystem.canClaim()) {
            btn.disabled = false;
            btn.textContent = 'Claim Reward';
        } else {
            btn.disabled = true;
            btn.textContent = 'Come Back Tomorrow';
        }
    }

    handleClaim() {
        try {
            const result = dailyLoginSystem.claim();
            this.renderGrid();

            // Show success animation or toast here
            const btn = document.getElementById('claim-daily-btn');
            btn.textContent = 'Claimed!';
            btn.disabled = true;

            setTimeout(() => this.close(), 1500);
        } catch (error) {
            console.error(error);
        }
    }

    open() {
        this.renderGrid();
        document.getElementById('daily-reward-modal').classList.add('active');
    }

    close() {
        document.getElementById('daily-reward-modal').classList.remove('active');
    }
}
