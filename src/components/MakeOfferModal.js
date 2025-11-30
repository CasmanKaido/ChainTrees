import { offerSystem } from '../utils/offerSystem.js';

export class MakeOfferModal {
    constructor() {
        this.createModal();
        this.targetTreeId = null;
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'offer-modal';
        modal.id = 'make-offer-modal';

        modal.innerHTML = `
      <div class="offer-content">
        <h2 style="text-align:center; margin-bottom:0.5rem">Make an Offer</h2>
        <p style="text-align:center; color:#94a3b8" id="offer-target-text">Tree #123</p>
        
        <div class="offer-input-group">
          <input type="number" step="0.01" class="offer-input" id="offer-amount-input" placeholder="0.00 ETH">
          <div class="offer-balance">Your Balance: 1.54 ETH</div>
        </div>

        <button class="submit-offer-btn" id="submit-offer-btn">Submit Offer</button>
        <button class="close-install-btn" id="cancel-offer-btn" style="margin-top:0.5rem; width:100%">Cancel</button>
      </div>
    `;

        document.body.appendChild(modal);

        // Listeners
        modal.querySelector('#submit-offer-btn').addEventListener('click', () => this.handleSubmit());
        modal.querySelector('#cancel-offer-btn').addEventListener('click', () => this.close());
    }

    open(treeId) {
        this.targetTreeId = treeId;
        document.getElementById('offer-target-text').textContent = `Tree #${treeId}`;
        document.getElementById('make-offer-modal').classList.add('active');
    }

    close() {
        document.getElementById('make-offer-modal').classList.remove('active');
        document.getElementById('offer-amount-input').value = '';
        this.targetTreeId = null;
    }

    async handleSubmit() {
        const input = document.getElementById('offer-amount-input');
        const amount = input.value;

        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        try {
            offerSystem.makeOffer(this.targetTreeId, amount, '0xUserWallet');
            alert('Offer submitted successfully!');
            this.close();
        } catch (e) {
            alert(e.message);
        }
    }
}
