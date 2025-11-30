import { activityFeedSystem } from '../utils/activityFeedSystem.js';
import { friendSystem } from '../utils/friendSystem.js';

export class FriendFeed {
    constructor(containerId) {
        this.containerId = containerId;
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const friends = friendSystem.getFriends();
        const allActivities = activityFeedSystem.getFeed();

        // Filter activities to only show friends
        const friendActivities = allActivities.filter(activity =>
            friends.some(f => f.address === activity.userAddress)
        );

        if (friendActivities.length === 0) {
            container.innerHTML = `
        <div class="feed-container">
          <h2 style="margin-bottom:1.5rem">👥 Friend Activity</h2>
          <div style="text-align:center; padding:2rem; color:#64748b; background:rgba(255,255,255,0.03); border-radius:12px;">
            <p>No recent activity from friends.</p>
            <button class="add-btn" onclick="document.getElementById('friends-modal').classList.add('active')" style="margin-top:1rem">
              Find Friends
            </button>
          </div>
        </div>
      `;
            return;
        }

        // Reuse ActivityFeed render logic (simplified here)
        // In a real app, we'd inherit or compose ActivityFeed
        container.innerHTML = `
      <div class="feed-container">
        <h2 style="margin-bottom:1.5rem">👥 Friend Activity</h2>
        ${friendActivities.map(activity => this.renderItem(activity)).join('')}
      </div>
    `;
    }

    renderItem(activity) {
        // ... (Same as ActivityFeed.renderItem, duplicated for now to keep files separate)
        // Ideally this should be a shared utility or component
        return `
      <div class="feed-item" style="border-color: rgba(59, 130, 246, 0.3)">
        <div class="feed-avatar">👤</div>
        <div class="feed-content">
          <div class="feed-header">
            <span class="feed-user">${activity.userAddress.substr(0, 6)}...</span>
            <span class="feed-time">${new Date(activity.timestamp).toLocaleTimeString()}</span>
          </div>
          <div class="feed-body">
            ${activity.type}: ${JSON.stringify(activity.data)}
          </div>
        </div>
      </div>
    `;
    }
}
