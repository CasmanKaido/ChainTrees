export class TreeCard {
    constructor(treeData) {
        this.treeData = treeData;
    }

    render() {
        const { id, species, stage, carbonOffset, waterCount, image } = this.treeData;

        // Determine badge color based on stage
        let badgeColor = '#4ade80'; // Default green
        if (stage === 'Sapling') badgeColor = '#facc15';
        if (stage === 'Young') badgeColor = '#4ade80';
        if (stage === 'Mature') badgeColor = '#3b82f6';
        if (stage === 'Ancient') badgeColor = '#a855f7';

        return `
      <div class="tree-card" data-id="${id}">
        <div class="tree-image-container">
          <img src="${image || '/placeholder-tree.svg'}" alt="${species} Tree" class="tree-image">
          <div class="tree-badge" style="background: ${badgeColor}40; border: 1px solid ${badgeColor}">
            ${stage}
          </div>
        </div>
        <div class="tree-info">
          <div class="tree-header">
            <span class="tree-species">${species}</span>
            <span class="tree-id">#${id}</span>
          </div>
          <div class="tree-stats">
            <div class="stat-item">
              <span class="stat-label">CO2 Offset</span>
              <span class="stat-value">${carbonOffset}kg</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Watered</span>
              <span class="stat-value">${waterCount}x</span>
            </div>
          </div>
        </div>
      </div>
    `;
    }
}
