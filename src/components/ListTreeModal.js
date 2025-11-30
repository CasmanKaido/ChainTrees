export class ListTreeModal {
    constructor(onList) {
        this.onList = onList;
        this.isOpen = false;
    }

    render() {
        // Create modal container if it doesn't exist
        if (!document.getElementById('list-modal')) {
            const modal = document.createElement('div');
            modal.id = 'list-modal';
            modal.className = 'modal-overlay';
            document.body.appendChild(modal);
        }

        const modal = document.getElementById('list-modal');
        modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>List Tree for Sale</h2>
          <button class="close-modal">&times;</button>
        </div>
        
        <div class="form-group">
          <label class="form-label">Select Tree</label>
          <select id="tree-select" class="form-input">
            <option value="">Select a tree...</option>
            <!-- Options populated dynamically -->
          </select>
        </div>
        
        <div class="form-group">
          <label class="form-label">Price (ETH)</label>
          <input type="number" id="listing-price" class="form-input" placeholder="0.05" step="0.01">
        </div>
        
        <button class="buy-btn" id="confirm-list-btn">List Item</button>
      </div>
    `;

        this.attachListeners(modal);
    }

    open(userTrees) {
        this.render();
        const modal = document.getElementById('list-modal');
        const select = document.getElementById('tree-select');

        // Populate select
        select.innerHTML = userTrees.map(tree =>
            `<option value="${tree.id}">Tree #${tree.id} (${tree.species})</option>`
        ).join('');

        modal.classList.add('open');
        this.isOpen = true;
    }

    close() {
        const modal = document.getElementById('list-modal');
        if (modal) {
            modal.classList.remove('open');
            this.isOpen = false;
        }
    }

    attachListeners(modal) {
        modal.querySelector('.close-modal').addEventListener('click', () => this.close());

        modal.querySelector('#confirm-list-btn').addEventListener('click', () => {
            const treeId = document.getElementById('tree-select').value;
            const price = document.getElementById('listing-price').value;

            if (!treeId || !price) {
                alert('Please select a tree and set a price');
                return;
            }

            this.onList(treeId, price);
            this.close();
        });

        // Close on click outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.close();
        });
    }
}
