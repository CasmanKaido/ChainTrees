import { TreeVisualization } from './TreeVisualization.js';
import '../styles/tree-visualization.css';

export class TreeDetailModal {
    constructor() {
        this.modal = null;
    }

    render(treeData) {
        // Remove existing modal if any
        const existing = document.querySelector('.tree-detail-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.className = 'tree-detail-modal open';
        modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>${treeData.species} #${treeData.id}</h2>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div id="modal-tree-viz"></div>
          <div class="tree-details-panel">
            <h3>Tree Statistics</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <label>Growth Stage</label>
                <span>${treeData.stage}</span>
              </div>
              <div class="detail-item">
                <label>Carbon Offset</label>
                <span>${treeData.carbonOffset} kg</span>
              </div>
              <div class="detail-item">
                <label>Water Count</label>
                <span>${treeData.waterCount}</span>
              </div>
              <div class="detail-item">
                <label>Planted</label>
                <span>Nov 30, 2025</span>
              </div>
            </div>
            
            <div class="action-buttons">
              <button class="btn-primary" id="modal-water-btn">Water Tree (+10 XP)</button>
              <button class="btn-secondary">View on OpenSea</button>
            </div>
          </div>
        </div>
      </div>
    `;

        document.body.appendChild(modal);
        this.modal = modal;

        // Initialize visualization
        const viz = new TreeVisualization('modal-tree-viz', treeData);
        viz.render();

        // Close handlers
        modal.querySelector('.modal-close').addEventListener('click', () => this.close());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.close();
        });

        // Water handler
        modal.querySelector('#modal-water-btn').addEventListener('click', () => {
            viz.waterTree();
            // TODO: Call contract
        });
    }

    close() {
        if (this.modal) {
            this.modal.classList.remove('open');
            setTimeout(() => this.modal.remove(), 300);
        }
    }
}
