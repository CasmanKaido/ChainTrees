import { levelingSystem } from '../utils/levelingSystem.js';
import { friendSystem } from '../utils/friendSystem.js';
import '../styles/profile.css';

export class PublicProfilePage {
    constructor(containerId) {
        this.containerId = containerId;
        this.currentAddress = null;
    }

    async render(address) {
        this.currentAddress = address;
        const container = document.getElementById(this.containerId);
        if (!container) return;

        // Mock data for now - in real app, fetch from contract/backend
        const userData = {
            address: address,
            xp: 12500,
            trees: 42,
            carbonOffset: 850,
            joinDate: '2023-09-15'
        };

        const level = levelingSystem.getLevel(userData.xp);
        const title = levelingSystem.getTitle(level);
        const isFriend = friendSystem.isFriend(address);

        container.innerHTML = `
      <div class="profile-container">
        <div class="profile-header-card">
          <div class="profile-avatar-large">
            ${address.substr(2, 2)}
          </div>
          <div class="profile-info-main">
            <div class="profile-name">
              Planter ${address.substr(0, 6)}
              <span class="profile-badge">Lvl ${level} ${title}</span>
            </div>
            <div class="profile-address">${address}</div>
            
            <div class="profile-stats-grid">
              <div class="stat-box">
                <div class="stat-value">${userData.trees}</div>
                <div class="stat-label">Trees Planted</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">${userData.carbonOffset}kg</div>
                <div class="stat-label">CO2 Offset</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">${userData.xp}</div>
                <div class="stat-label">Total XP</div>
              </div>
            </div>
          </div>
          <div class="profile-actions">
            ${!isFriend
                ? `<button class="add-btn" onclick="window.addFriend('${address}')">Add Friend</button>`
                : `<button class="add-btn" style="background:#475569" disabled>Friends</button>`
            }
          </div>
        </div>

        <div class="profile-tabs">
          <button class="profile-tab active">Forest</button>
          <button class="profile-tab">Badges</button>
          <button class="profile-tab">Activity</button>
        </div>

        <div class="forest-grid">
          <!-- Mock Trees -->
          ${Array(8).fill(0).map((_, i) => `
            <div class="forest-item">
              <div class="forest-img">🌲</div>
              <div style="font-weight:600; font-size:0.9rem">Tree #${1000 + i}</div>
              <div style="font-size:0.8rem; color:#94a3b8">Level ${Math.floor(Math.random() * 5) + 1}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

        window.addFriend = (addr) => {
            try {
                friendSystem.addFriend(addr);
                this.render(addr); // Re-render to update button
            } catch (e) {
                alert(e.message);
            }
        };
    }
}
