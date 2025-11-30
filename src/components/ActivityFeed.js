import { activityFeedSystem } from '../utils/activityFeedSystem.js';
import { walletState } from '../utils/walletState.js';

export class ActivityFeed {
    constructor(containerId) {
        this.containerId = containerId;
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        // Generate mock data if empty
        if (activityFeedSystem.getFeed().length === 0) {
            this.generateMockData();
        }

        const activities = activityFeedSystem.getFeed();

        container.innerHTML = `
      <div class="feed-container">
        <h2 style="margin-bottom:1.5rem">🌐 Global Activity</h2>
        ${activities.map(activity => this.renderItem(activity)).join('')}
      </div>
    `;
    }

    renderItem(activity) {
        const account = walletState.getAccount();
        const isLiked = activity.likedBy.includes(account.address);

        let content = '';
        let icon = '';

        switch (activity.type) {
            case 'MINT':
                content = `Planted a <strong>${activity.data.species}</strong> tree! 🌱`;
                icon = '🌱';
                break;
            case 'LEVEL_UP':
                content = `Reached <strong>Level ${activity.data.level}</strong>! 🎉`;
                icon = '⬆️';
                break;
            case 'ACHIEVEMENT':
                content = `Unlocked badge: <strong>${activity.data.badge}</strong> 🏆`;
                icon = '🏆';
                break;
            default:
                content = 'Performed an action';
                icon = '⚡';
        }

        return `
      <div class="feed-item">
        <div class="feed-avatar">${icon}</div>
        <div class="feed-content">
          <div class="feed-header">
            <span class="feed-user" onclick="window.viewProfile('${activity.userAddress}')">
              ${activity.userAddress.substr(0, 6)}...${activity.userAddress.substr(-4)}
            </span>
            <span class="feed-time">${new Date(activity.timestamp).toLocaleTimeString()}</span>
          </div>
          <div class="feed-body">
            ${content}
          </div>
          <div class="feed-actions">
            <button class="feed-action-btn ${isLiked ? 'liked' : ''}" 
              onclick="window.likeActivity('${activity.id}')">
              ${isLiked ? '❤️' : '🤍'} ${activity.likes}
            </button>
          </div>
        </div>
      </div>
    `;
    }

    generateMockData() {
        // Helper to generate mock data
        const types = ['MINT', 'LEVEL_UP', 'ACHIEVEMENT'];
        for (let i = 0; i < 5; i++) {
            activityFeedSystem.logActivity(
                types[Math.floor(Math.random() * types.length)],
                { species: 'Oak', level: 5, badge: 'Early Adopter' },
                `0x${Math.random().toString(16).substr(2, 40)}`
            );
        }
    }
}
