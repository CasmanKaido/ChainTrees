import { contractService } from '../services/contractService.js'
import { ipfsService } from '../services/ipfsService.js'
import { walletState } from '../utils/walletState.js'
import { treeGenerator } from '../generators/treeGenerator.js'

export class MetadataPage {
    constructor(containerId) {
        this.container = document.getElementById(containerId)
        this.trees = []
        this.uploadResults = []
    }

    async render() {
        if (!this.container) return

        const account = walletState.getAccount()

        if (!account.isConnected) {
            this.renderConnectWallet()
            return
        }

        if (!ipfsService.isConfigured()) {
            this.renderIPFSNotConfigured()
            return
        }

        this.renderLoading()
        await this.fetchTrees(account.address)
        this.renderMetadataManager()
    }

    renderConnectWallet() {
        this.container.innerHTML = `
      <div class="metadata-container">
        <div class="empty-state">
          <span class="empty-icon">👛</span>
          <h2>Connect Wallet</h2>
          <p class="empty-text">Connect your wallet to manage tree metadata.</p>
        </div>
      </div>
    `
    }

    renderIPFSNotConfigured() {
        this.container.innerHTML = `
      <div class="metadata-container">
        <div class="empty-state warning">
          <span class="empty-icon">⚠️</span>
          <h2>IPFS Not Configured</h2>
          <p class="empty-text">Please add your Pinata API keys to .env file:</p>
          <pre class="config-hint">VITE_PINATA_API_KEY=your_key_here
VITE_PINATA_SECRET_KEY=your_secret_here</pre>
          <p class="empty-text">Get your keys at <a href="https://pinata.cloud" target="_blank">pinata.cloud</a></p>
        </div>
      </div>
    `
    }

    renderLoading() {
        this.container.innerHTML = `
      <div class="metadata-container">
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading your trees...</p>
        </div>
      </div>
    `
    }

    async fetchTrees(address) {
        try {
            this.trees = await contractService.getUserTrees(address)
        } catch (error) {
            console.error('Error fetching trees:', error)
            this.trees = []
        }
    }

    renderMetadataManager() {
        this.container.innerHTML = `
      <div class="metadata-container">
        <div class="metadata-header">
          <div>
            <h1 class="metadata-title">IPFS Metadata Manager</h1>
            <p>Upload your tree metadata to IPFS for marketplace compatibility</p>
          </div>
          
          <div class="upload-stats">
            <div class="stat-item">
              <span class="stat-value">${this.trees.length}</span>
              <span class="stat-label">Total Trees</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">${this.uploadResults.filter(r => r.success).length}</span>
              <span class="stat-label">Uploaded</span>
            </div>
          </div>
        </div>

        ${this.trees.length === 0 ? this.renderEmptyState() : this.renderTreeList()}
      </div>
    `

        this.attachEventListeners()
    }

    renderEmptyState() {
        return `
      <div class="empty-state">
        <span class="empty-icon">🌱</span>
        <h2>No Trees Yet</h2>
        <p class="empty-text">Plant some trees first to upload metadata.</p>
      </div>
    `
    }

    renderTreeList() {
        return `
      <div class="action-bar">
        <button class="upload-all-btn" onclick="window.uploadAllMetadata()">
          📦 Upload All to IPFS
        </button>
        <p class="action-hint">This will upload metadata and images for all your trees</p>
      </div>

      <div class="tree-list">
        ${this.trees.map(tree => this.renderTreeItem(tree)).join('')}
      </div>

      ${this.uploadResults.length > 0 ? this.renderUploadResults() : ''}
    `
    }

    renderTreeItem(tree) {
        const speciesNames = ['Oak', 'Maple', 'Pine', 'Birch', 'Willow', 'Cherry', 'Redwood', 'Sequoia']
        const speciesName = speciesNames[tree.species] || 'Unknown'
        const stageName = treeGenerator.getStageName(tree.growthStage)
        const svg = treeGenerator.generateSVG(tree.species, tree.generationSeed, tree.growthStage)

        const uploadResult = this.uploadResults.find(r => r.tokenId === tree.id)

        return `
      <div class="tree-item" data-tree-id="${tree.id}">
        <div class="tree-preview">
          ${svg}
        </div>
        <div class="tree-meta-info">
          <h3>${speciesName} #${tree.id}</h3>
          <div class="meta-details">
            <span class="meta-badge">${stageName}</span>
            <span class="meta-stat">💧 ${tree.waterCount}x</span>
            <span class="meta-stat">🌍 ${tree.carbonOffset}g</span>
          </div>
        </div>
        <div class="tree-actions">
          ${uploadResult ? this.renderUploadStatus(uploadResult) : `
            <button class="upload-btn" onclick="window.uploadTreeMetadata(${tree.id})">
              📤 Upload to IPFS
            </button>
          `}
        </div>
      </div>
    `
    }

    renderUploadStatus(result) {
        if (result.success) {
            return `
        <div class="upload-success">
          <span class="success-icon">✅</span>
          <div class="upload-links">
            <a href="${result.metadataUrl}" target="_blank" class="ipfs-link">
              📄 Metadata
            </a>
            <a href="${result.imageUrl}" target="_blank" class="ipfs-link">
              🖼️ Image
            </a>
          </div>
        </div>
      `
        } else {
            return `
        <div class="upload-error">
          <span class="error-icon">❌</span>
          <span class="error-text">${result.error}</span>
        </div>
      `
        }
    }

    renderUploadResults() {
        const successCount = this.uploadResults.filter(r => r.success).length
        const failCount = this.uploadResults.filter(r => !r.success).length

        return `
      <div class="upload-summary">
        <h3>Upload Results</h3>
        <div class="summary-stats">
          <div class="summary-item success">
            <span class="summary-icon">✅</span>
            <span>${successCount} Successful</span>
          </div>
          ${failCount > 0 ? `
            <div class="summary-item error">
              <span class="summary-icon">❌</span>
              <span>${failCount} Failed</span>
            </div>
          ` : ''}
        </div>
      </div>
    `
    }

    attachEventListeners() {
        window.uploadTreeMetadata = (id) => this.handleUploadTree(id)
        window.uploadAllMetadata = () => this.handleUploadAll()
    }

    async handleUploadTree(id) {
        const tree = this.trees.find(t => t.id === id)
        if (!tree) return

        try {
            const btn = document.querySelector(`[data-tree-id="${id}"] .upload-btn`)
            if (btn) {
                btn.disabled = true
                btn.innerHTML = '⏳ Uploading...'
            }

            const svg = treeGenerator.generateSVG(tree.species, tree.generationSeed, tree.growthStage)
            const result = await ipfsService.uploadTreeMetadata(tree, svg)

            this.uploadResults = this.uploadResults.filter(r => r.tokenId !== id)
            this.uploadResults.push({
                tokenId: id,
                success: true,
                ...result
            })

            this.renderMetadataManager()
        } catch (error) {
            console.error('Upload failed:', error)
            this.uploadResults.push({
                tokenId: id,
                success: false,
                error: error.message
            })
            this.renderMetadataManager()
        }
    }

    async handleUploadAll() {
        if (!confirm(`Upload metadata for all ${this.trees.length} trees to IPFS? This may take a few minutes.`)) {
            return
        }

        const btn = document.querySelector('.upload-all-btn')
        if (btn) {
            btn.disabled = true
            btn.innerHTML = '⏳ Uploading...'
        }

        try {
            const svgContents = this.trees.map(tree =>
                treeGenerator.generateSVG(tree.species, tree.generationSeed, tree.growthStage)
            )

            this.uploadResults = await ipfsService.uploadBatchMetadata(this.trees, svgContents)
            this.renderMetadataManager()
        } catch (error) {
            console.error('Batch upload failed:', error)
            alert('Batch upload failed: ' + error.message)
            if (btn) {
                btn.disabled = false
                btn.innerHTML = '📦 Upload All to IPFS'
            }
        }
    }
}
