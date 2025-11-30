export class CreateProposalModal {
    constructor(onSubmit) {
        this.onSubmit = onSubmit;
        this.isOpen = false;
    }

    render() {
        if (!document.getElementById('proposal-modal')) {
            const modal = document.createElement('div');
            modal.id = 'proposal-modal';
            modal.className = 'modal-overlay';
            document.body.appendChild(modal);
        }

        const modal = document.getElementById('proposal-modal');
        modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Create Proposal</h2>
          <button class="close-modal">&times;</button>
        </div>
        
        <div class="form-group">
          <label class="form-label">Title</label>
          <input type="text" id="prop-title" class="form-input" placeholder="e.g., Increase Staking Rewards">
        </div>
        
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea id="prop-desc" class="form-input" rows="5" placeholder="Describe your proposal..."></textarea>
        </div>
        
        <button class="create-prop-btn" style="width: 100%;" id="submit-prop-btn">Submit Proposal</button>
      </div>
    `;

        this.attachListeners(modal);
    }

    open() {
        this.render();
        const modal = document.getElementById('proposal-modal');
        modal.classList.add('open');
        this.isOpen = true;
    }

    close() {
        const modal = document.getElementById('proposal-modal');
        if (modal) {
            modal.classList.remove('open');
            this.isOpen = false;
        }
    }

    attachListeners(modal) {
        modal.querySelector('.close-modal').addEventListener('click', () => this.close());

        modal.querySelector('#submit-prop-btn').addEventListener('click', () => {
            const title = document.getElementById('prop-title').value;
            const desc = document.getElementById('prop-desc').value;

            if (!title || !desc) {
                alert('Please fill in all fields');
                return;
            }

            this.onSubmit({ title, description: desc });
            this.close();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.close();
        });
    }
}
