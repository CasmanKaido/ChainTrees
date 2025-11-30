import { contractService } from '../services/contractService.js'
import { walletState } from '../utils/walletState.js'

export class MintPage {
    constructor(containerId) {
        this.container = document.getElementById(containerId)
        this.species = [
            { id: 0, name: 'Oak', offset: '22kg', description: 'Strong and enduring' },
            { id: 1, name: 'Maple', offset: '20kg', description: 'Vibrant and colorful' },
            { id: 2, name: 'Pine', offset: '18kg', description: 'Evergreen resilience' },
            { id: 3, name: 'Birch', offset: '16kg', description: 'Elegant and graceful' },
            { id: 4, name: 'Willow', offset: '19kg', description: 'Flexible and adapting' },
            { id: 5, name: 'Cherry', offset: '17kg', description: 'Beautiful blossoms' },
            { id: 6, name: 'Redwood', offset: '35kg', description: 'Giant of the forest' },
            { id: 7, name: 'Sequoia', offset: '40kg', description: 'Ancient guardian' }
        ]
    }

    render() {
        if (!this.container) return

        this.container.innerHTML = `
      <div class="mint-container">
        <div class="mint-header">
          <h1 class="mint-title">Plant a Tree</h1>
          <p class="mint-subtitle">Choose your species and start your impact journey</p>
        </div>

        <div class="mint-grid" id="mint-grid">
          ${this.species.map(tree => this.renderMintCard(tree)).join('')}
        </div>

        <div id="tx-modal" class="tx-modal">
          <div class="tx-content" id="tx-content"></div>
        </div>
      </div>
    `

        this.attachEventListeners()
    }

    renderMintCard(tree) {
        return `
      <div class="mint-card" data-id="${tree.id}">
        <div class="tree-preview">
          <svg class="tree-icon" viewBox="0 0 100 100">
            <circle cx="50" cy="40" r="30" fill="var(--primary)" opacity="0.8"/>
            <rect x="45" y="60" width="10" height="30" fill="#8B4513" rx="2"/>
          </svg>
        </div>
        <div class="mint-content">
          <h3 class="tree-name">${tree.name}</h3>
          <div class="tree-stats">
            <span class="stat-badge">🌱 ${tree.offset} CO2/yr</span>
          </div>
          <p class="tree-desc">${tree.description}</p>
          <div class="mint-actions">
            <button class="mint-button" onclick="window.mintTree(${tree.id})">
              Plant ${tree.name}
            </button>
          </div>
        </div>
      </div>
    `
    }

    attachEventListeners() {
        // Global mint function for onclick handlers
        window.mintTree = (speciesId) => this.handleMint(speciesId)
    }

    async handleMint(speciesId) {
        const account = walletState.getAccount()

        if (!account.isConnected) {
            alert('Please connect your wallet first!')
            return
        }

        this.showModal('pending')

        try {
            // 1. Send transaction
            const hash = await contractService.mintTree(speciesId, `ipfs://tree-${speciesId}`)

            this.showModal('confirming', hash)

            // 2. Wait for confirmation
            await contractService.waitForTransaction(hash)

            this.showModal('success', hash)
        } catch (error) {
            console.error(error)
            this.showModal('error', error.message)
        }
    }

    showModal(status, data) {
        const modal = document.getElementById('tx-modal')
        const content = document.getElementById('tx-content')

        modal.classList.add('active')

        if (status === 'pending') {
            content.innerHTML = `
        <div class="tx-spinner"></div>
        <h3>Confirm in Wallet</h3>
        <p>Please sign the transaction in your wallet...</p>
      `
        } else if (status === 'confirming') {
            content.innerHTML = `
        <div class="tx-spinner"></div>
        <h3>Planting Tree...</h3>
        <p>Transaction submitted. Waiting for confirmation.</p>
        <a href="#" class="tx-hash">${data.slice(0, 10)}...${data.slice(-8)}</a>
      `
        } else if (status === 'success') {
            content.innerHTML = `
        <div class="tx-success-icon">🎉</div>
        <h3>Tree Planted!</h3>
        <p>Your tree has been successfully minted.</p>
        <button class="mint-button" onclick="document.getElementById('tx-modal').classList.remove('active')">
          View My Forest
        </button>
      `
        } else if (status === 'error') {
            content.innerHTML = `
        <div class="tx-error-icon">❌</div>
        <h3>Minting Failed</h3>
        <p>${data}</p>
        <button class="mint-button" onclick="document.getElementById('tx-modal').classList.remove('active')">
          Close
        </button>
      `
        }
    }
}
