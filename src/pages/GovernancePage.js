import { ProposalCard } from '../components/ProposalCard.js';
import { CreateProposalModal } from '../components/CreateProposalModal.js';
import { walletState } from '../utils/walletState.js';
import '../styles/governance.css';

export class GovernancePage {
    constructor(containerId) {
        this.containerId = containerId;
        this.proposals = [];
        this.modal = new CreateProposalModal((data) => this.handleCreate(data));
    }

    async render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        // Mock data
        this.proposals = [
            {
                id: 1,
                title: 'Increase Staking APY to 8%',
                description: 'Proposal to increase the base staking APY from 5% to 8% to attract more long-term holders.',
                status: 'active',
                votesFor: 15000,
                votesAgainst: 5000,
                endDate: '2023-12-01'
            },
            {
                id: 2,
                title: 'Add Redwood Species',
                description: 'Introduce the Redwood tree species as a Legendary rarity item.',
                status: 'passed',
                votesFor: 45000,
                votesAgainst: 2000,
                endDate: '2023-11-15'
            }
        ];

        container.innerHTML = `
      <div class="governance-page">
        <div class="governance-header">
          <div>
            <h1 class="governance-title">Governance</h1>
            <p style="color: var(--text-secondary)">Vote on the future of ChainTrees</p>
          </div>
          
          <div class="voting-power-card">
            <span class="vp-label">Your Voting Power</span>
            <span class="vp-value">1,250 VP</span>
            <button class="create-prop-btn" id="new-prop-btn" style="margin-top: 1rem; font-size: 0.9rem; padding: 0.5rem 1rem;">
              + New Proposal
            </button>
          </div>
        </div>

        <div id="proposals-list" class="proposals-list">
          <!-- Proposals injected here -->
        </div>
      </div>
    `;

        this.renderProposals();
        this.attachListeners();
    }

    renderProposals() {
        const list = document.getElementById('proposals-list');
        if (!list) return;

        list.innerHTML = this.proposals.map(prop => {
            const component = new ProposalCard(prop, (id, vote) => this.handleVote(id, vote));
            return component.render();
        }).join('');

        this.proposals.forEach(prop => {
            const component = new ProposalCard(prop, (id, vote) => this.handleVote(id, vote));
            component.attachListeners(list);
        });
    }

    attachListeners() {
        const btn = document.getElementById('new-prop-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                const account = walletState.getAccount();
                if (!account.isConnected) {
                    alert('Please connect your wallet');
                    return;
                }
                this.modal.open();
            });
        }
    }

    async handleVote(id, isFor) {
        const account = walletState.getAccount();
        if (!account.isConnected) {
            alert('Please connect your wallet');
            return;
        }

        if (!confirm(`Vote ${isFor ? 'FOR' : 'AGAINST'} proposal #${id}?`)) return;

        try {
            // await contractService.vote(id, isFor);
            alert('Vote cast successfully! (Mock)');

            // Update local state mock
            const prop = this.proposals.find(p => p.id === id);
            if (prop) {
                if (isFor) prop.votesFor += 1250;
                else prop.votesAgainst += 1250;
                this.renderProposals();
            }
        } catch (error) {
            alert('Voting failed: ' + error.message);
        }
    }

    async handleCreate(data) {
        try {
            // await contractService.createProposal(data);
            alert('Proposal created successfully! (Mock)');
            this.proposals.unshift({
                id: this.proposals.length + 1,
                title: data.title,
                description: data.description,
                status: 'active',
                votesFor: 0,
                votesAgainst: 0,
                endDate: '2023-12-30'
            });
            this.renderProposals();
        } catch (error) {
            alert('Creation failed: ' + error.message);
        }
    }
}
