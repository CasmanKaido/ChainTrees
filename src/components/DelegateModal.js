import { tokenSystem } from '../utils/tokenSystem.js';

export class DelegateModal {
    constructor() {
        this.createModal();
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'gift-modal'; // Reuse modal base
        modal.id = 'delegate-modal';

        modal.innerHTML = `
      <div class="gift-content" style="max-width:500px">
        <h2>🗳️ Delegate Voting Power</h2>
        <p style="color:#94a3b8; margin-bottom:1.5rem">Delegate your voting power to another address.</p>
        
        <div style="background:rgba(255,255,255,0.05); padding:1rem; border-radius:8px; margin-bottom:1.5rem">
          <div style="font-size:0.9rem; color:#94a3b8">Your Current Voting Power</div>
          <div style="font-size:1.5rem; font-weight:800; color:#e2e8f0" id="delegate-vp-display">0 VP</div>
          <div style="font-size:0.85rem; color:#64748b; margin-top:0.5rem" id="delegate-status">Not delegated</div>
        </div>

        <div class="create-prop-form">
          <div>
            <label class="gift-label">Delegate To</label>
            <input type="text" class="prop-input" id="delegate-address" placeholder="0x... or leave empty to undelegate">
          </div>

          <button class="send-gift-btn" id="submit-delegate-btn">Delegate</button>
          <button class="close-install-btn" id="cancel-delegate-btn" style="margin-top:0.5rem; width:100%">Cancel</button>
        </div>
      </div>
    `;

        document.body.appendChild(modal);

        // Listeners
        modal.querySelector('#submit-delegate-btn').addEventListener('click', () => this.handleDelegate());
        modal.querySelector('#cancel-delegate-btn').addEventListener('click', () => this.close());
    }

    open(userAddress) {
        this.userAddress = userAddress;

        const vp = tokenSystem.getVotes(userAddress);
        const balance = tokenSystem.balanceOf(userAddress);
        const currentDelegate = tokenSystem.getDelegate(userAddress);

        document.getElementById('delegate-vp-display').textContent = `${vp} VP`;

        if (currentDelegate !== userAddress) {
            document.getElementById('delegate-status').textContent = `Delegated to ${currentDelegate.substr(0, 10)}...`;
            document.getElementById('delegate-address').value = currentDelegate;
        } else {
            document.getElementById('delegate-status').textContent = `Not delegated (${balance} tokens)`;
        }

        document.getElementById('delegate-modal').classList.add('active');
    }

    close() {
        document.getElementById('delegate-modal').classList.remove('active');
        document.getElementById('delegate-address').value = '';
    }

    async handleDelegate() {
        const address = document.getElementById('delegate-address').value.trim();

        if (!address) {
            // Undelegate (self-delegate)
            tokenSystem.delegate(this.userAddress, this.userAddress);
            alert('Voting power undelegated! You can now vote directly.');
            this.close();
            if (window.refreshGovernance) window.refreshGovernance();
            return;
        }

        if (!address.startsWith('0x') || address.length !== 42) {
            alert('Invalid address');
            return;
        }

        try {
            tokenSystem.delegate(this.userAddress, address);
            alert('Voting power delegated successfully! 🗳️');
            this.close();
            if (window.refreshGovernance) window.refreshGovernance();
        } catch (e) {
            alert(e.message);
        }
    }
}
