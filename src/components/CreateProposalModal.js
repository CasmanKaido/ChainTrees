import { governanceSystem } from '../utils/governanceSystem.js';

export class CreateProposalModal {
    constructor() {
        this.createModal();
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'gift-modal'; // Reuse modal base
        modal.id = 'create-prop-modal';

        modal.innerHTML = `
      <div class="gift-content" style="max-width:600px">
        <h2>📜 Create Proposal</h2>
        <p style="color:#94a3b8; margin-bottom:1.5rem">Submit a proposal for community voting.</p>
        
        <div class="create-prop-form">
          <div>
            <label class="gift-label">Title</label>
            <input type="text" class="prop-input" id="prop-title" placeholder="e.g. Increase Tree Planting Rewards">
          </div>

          <div>
            <label class="gift-label">Description</label>
            <textarea class="prop-textarea" id="prop-desc" placeholder="Describe your proposal in detail..."></textarea>
          </div>

          <div>
            <label class="gift-label">Duration (Days)</label>
            <select class="prop-input" id="prop-duration">
              <option value="3">3 Days</option>
              <option value="7">7 Days</option>
              <option value="14">14 Days</option>
            </select>
          </div>

          <button class="send-gift-btn" id="submit-prop-btn">Submit Proposal</button>
          <button class="close-install-btn" id="cancel-prop-btn" style="margin-top:0.5rem; width:100%">Cancel</button>
        </div>
      </div>
    `;

        document.body.appendChild(modal);

        // Listeners
        modal.querySelector('#submit-prop-btn').addEventListener('click', () => this.handleSubmit());
        modal.querySelector('#cancel-prop-btn').addEventListener('click', () => this.close());
    }

    open() {
        document.getElementById('create-prop-modal').classList.add('active');
    }

    close() {
        document.getElementById('create-prop-modal').classList.remove('active');
        document.getElementById('prop-title').value = '';
        document.getElementById('prop-desc').value = '';
    }

    async handleSubmit() {
        const title = document.getElementById('prop-title').value;
        const desc = document.getElementById('prop-desc').value;
        const duration = parseInt(document.getElementById('prop-duration').value);

        if (!title || !desc) {
            alert('Please fill in all fields');
            return;
        }

        try {
            governanceSystem.createProposal(title, desc, '0xUserWallet', duration);
            alert('Proposal created successfully! 🗳️');
            this.close();
            // Trigger refresh if on governance page
            if (window.refreshGovernance) window.refreshGovernance();
        } catch (e) {
            alert(e.message);
        }
    }
}
