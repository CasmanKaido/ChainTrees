import { friendSystem } from '../utils/friendSystem.js';

export class FriendsModal {
    constructor() {
        this.createModal();
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'friends-modal';
        modal.id = 'friends-modal';

        modal.innerHTML = `
      <div class="friends-content">
        <div class="friends-header">
          <h2>👥 Friends List</h2>
          <button class="close-friends-btn" id="close-friends-btn">×</button>
        </div>
        
        <div class="friends-body">
          <div class="add-friend-form">
            <input type="text" class="friend-input" id="friend-address-input" placeholder="Enter wallet address (0x...)">
            <button class="add-btn" id="add-friend-btn">Add</button>
          </div>

          <div class="friends-list" id="friends-list">
            <!-- Friends injected here -->
          </div>
        </div>
      </div>
    `;

        document.body.appendChild(modal);

        // Listeners
        modal.querySelector('#close-friends-btn').addEventListener('click', () => this.close());
        modal.querySelector('#add-friend-btn').addEventListener('click', () => this.handleAdd());

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.close();
        });
    }

    renderList() {
        const list = document.getElementById('friends-list');
        const friends = friendSystem.getFriends();

        if (friends.length === 0) {
            list.innerHTML = `<div style="text-align:center; color:#64748b; padding:1rem;">No friends added yet</div>`;
            return;
        }

        list.innerHTML = friends.map(friend => `
      <div class="friend-item">
        <div class="friend-info">
          <div class="friend-avatar">${friend.name.charAt(0)}</div>
          <div>
            <div class="friend-name">${friend.name}</div>
            <div class="friend-address">${friend.address.substr(0, 6)}...${friend.address.substr(-4)}</div>
          </div>
        </div>
        <div class="friend-actions">
          <button class="icon-btn" title="View Profile">👁️</button>
          <button class="icon-btn delete" onclick="window.removeFriend('${friend.address}')" title="Remove">🗑️</button>
        </div>
      </div>
    `).join('');

        // Global handler for remove
        window.removeFriend = (address) => {
            if (confirm('Remove this friend?')) {
                friendSystem.removeFriend(address);
                this.renderList();
            }
        };
    }

    handleAdd() {
        const input = document.getElementById('friend-address-input');
        const address = input.value.trim();

        if (!address.startsWith('0x') || address.length < 42) {
            alert('Invalid address format');
            return;
        }

        try {
            friendSystem.addFriend(address);
            input.value = '';
            this.renderList();
        } catch (e) {
            alert(e.message);
        }
    }

    open() {
        this.renderList();
        document.getElementById('friends-modal').classList.add('active');
    }

    close() {
        document.getElementById('friends-modal').classList.remove('active');
    }
}
