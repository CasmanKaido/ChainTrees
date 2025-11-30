import { treeGiftingSystem } from '../utils/treeGiftingSystem.js';
import { friendSystem } from '../utils/friendSystem.js';

export class GiftModal {
    constructor() {
        this.createModal();
        this.selectedTree = null;
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'gift-modal';
        modal.id = 'gift-modal';

        modal.innerHTML = `
      <div class="gift-content">
        <h2>🎁 Gift a Tree</h2>
        <p style="color:#94a3b8">Send a tree to a friend or any wallet address.</p>
        
        <div class="gift-preview" id="gift-preview">
          <!-- Tree details injected here -->
        </div>

        <div class="gift-form">
          <div>
            <label class="gift-label">Recipient</label>
            <select class="gift-select" id="gift-friend-select">
              <option value="">Select a friend...</option>
            </select>
            <div style="text-align:center; margin:0.5rem 0; color:#64748b">- OR -</div>
            <input type="text" class="gift-input" id="gift-address-input" placeholder="Enter wallet address (0x...)">
          </div>

          <div>
            <label class="gift-label">Message (Optional)</label>
            <textarea class="gift-message" id="gift-message" placeholder="Write a nice note..."></textarea>
          </div>

          <button class="send-gift-btn" id="send-gift-btn">Send Gift 🎁</button>
          <button class="close-install-btn" id="cancel-gift-btn" style="margin-top:0.5rem; width:100%">Cancel</button>
        </div>
      </div>
    `;

        document.body.appendChild(modal);

        // Listeners
        modal.querySelector('#send-gift-btn').addEventListener('click', () => this.handleSend());
        modal.querySelector('#cancel-gift-btn').addEventListener('click', () => this.close());

        // Friend select handler
        const select = modal.querySelector('#gift-friend-select');
        select.addEventListener('change', (e) => {
            if (e.target.value) {
                document.getElementById('gift-address-input').value = e.target.value;
            }
        });
    }

    open(treeData) {
        this.selectedTree = treeData;
        const modal = document.getElementById('gift-modal');
        const preview = document.getElementById('gift-preview');
        const select = document.getElementById('gift-friend-select');

        // Update preview
        preview.innerHTML = `
      <span class="gift-icon">🌲</span>
      <div class="gift-tree-name">${treeData.name || 'Unknown Tree'}</div>
      <div style="color:#94a3b8">ID: #${treeData.id}</div>
    `;

        // Populate friends
        const friends = friendSystem.getFriends();
        select.innerHTML = '<option value="">Select a friend...</option>' +
            friends.map(f => `<option value="${f.address}">${f.name}</option>`).join('');

        modal.classList.add('active');
    }

    close() {
        document.getElementById('gift-modal').classList.remove('active');
        document.getElementById('gift-address-input').value = '';
        document.getElementById('gift-message').value = '';
        this.selectedTree = null;
    }

    async handleSend() {
        const addressInput = document.getElementById('gift-address-input');
        const toAddress = addressInput.value.trim();
        const btn = document.getElementById('send-gift-btn');

        if (!toAddress) {
            alert('Please enter a recipient address');
            return;
        }

        try {
            btn.disabled = true;
            btn.textContent = 'Sending...';

            await treeGiftingSystem.giftTree(this.selectedTree.id, toAddress);

            alert('Gift sent successfully! 🎁');
            this.close();
        } catch (e) {
            alert('Error sending gift: ' + e.message);
        } finally {
            btn.disabled = false;
            btn.textContent = 'Send Gift 🎁';
        }
    }
}
