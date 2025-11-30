import { ProposalCard } from '../components/ProposalCard.js';
import { CreateProposalModal } from '../components/CreateProposalModal.js';
import { governanceSystem } from '../utils/governanceSystem.js';
import { walletState } from '../utils/walletState.js';
import '../styles/governance.css';

export class GovernancePage {
    constructor(containerId) {
        this.containerId = containerId;
        this.modal = new CreateProposalModal();
        // Expose refresh for modal
        window.refreshGovernance = () => this.render();
    }

    async render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        // Generate mock proposals if empty
        if (governanceSystem.getProposals().length === 0) {
            this.generateMockProposals();
        }

        const proposals = governanceSystem.getProposals();

        container.innerHTML = `
      <div class="governance-container">
        <div class="gov-header">
          <div>
            <h1 style="margin:0; font-size:2rem; background:linear-gradient(45deg, #fbbf24, #f59e0b); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">
              DAO Governance
            </h1>
            <p style="color:#94a3b8; margin-top:0.5rem">Vote on the future of ChainTrees.</p>
          </div>
          
          <div style="text-align:right">
            <div style="font-size:0.9rem; color:#94a3b8">Your Voting Power</div>
            <div style="font-size:1.5rem; font-weight:800; color:#e2e8f0">1,250 VP</div>
            <button class="add-btn" id="new-prop-btn" style="margin-top:0.5rem">
              + New Proposal
            </button>
          </div>
        </div>

        <div class="gov-stats">
          <div class="gov-stat-item">
            <span class="gov-stat-value">${proposals.filter(p => p.status === 'ACTIVE').length}</span>
            <span class="gov-stat-label">Active Proposals</span>
          </div>
          <div class="gov-stat-item">
            <span class="gov-stat-value">${proposals.length}</span>
            <span class="gov-stat-label">Total Proposals</span>
          </div>
        </div>

        <h2 style="margin:2rem 0 1rem; color:#e2e8f0">Proposals</h2>
        <div id="proposals-list"></div>
      </div>
    `;

        this.renderProposals(proposals);
        this.attachListeners();
    }

    renderProposals(proposals) {
        const list = document.getElementById('proposals-list');
        if (!list) return;

        list.innerHTML = proposals.map(prop => {
            const component = new ProposalCard(prop, (id, choice) => this.handleVote(id, choice));
            return component.render();
        }).join('');

        proposals.forEach(prop => {
            const component = new ProposalCard(prop, (id, choice) => this.handleVote(id, choice));
            component.attachListeners(list);
        });
    }

    attachListeners() {
        const btn = document.getElementById('new-prop-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                const account = walletState.getAccount();
                /*
                if (!account.isConnected) {
                  alert('Please connect your wallet');
                  return;
                }
                */
                this.modal.open();
            });
        }
    }

    async handleVote(id, choice) {
        /*
        const account = walletState.getAccount();
        if (!account.isConnected) {
          alert('Please connect your wallet');
          return;
        }
        */
        const account = { address: '0xUserWallet' }; // Mock for now

        if (!confirm(`Vote ${choice} on proposal?`)) return;

        try {
            governanceSystem.vote(id, account.address, choice, 1250); // Mock 1250 VP
            alert('Vote cast successfully! 🗳️');
            this.render(); // Refresh
        } catch (error) {
            alert('Voting failed: ' + error.message);
        }
    }

    generateMockProposals() {
        governanceSystem.createProposal(
            'Increase Staking APY to 8%',
            'Proposal to increase the base staking APY from 5% to 8% to attract more long-term holders.',
            '0xDaoMember1',
            7
        );
        governanceSystem.createProposal(
            'Add Redwood Species',
            'Introduce the Redwood tree species as a Legendary rarity item.',
            '0xDaoMember2',
            3
        );
    }
}
