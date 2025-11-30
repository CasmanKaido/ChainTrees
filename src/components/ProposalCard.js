export class ProposalCard {
  constructor(proposal, onVote) {
    this.proposal = proposal;
    this.onVote = onVote;
  }

  render() {
    const totalVotes = this.proposal.forVotes + this.proposal.againstVotes + this.proposal.abstainVotes;
    const forPercent = totalVotes > 0 ? (this.proposal.forVotes / totalVotes) * 100 : 0;
    const againstPercent = totalVotes > 0 ? (this.proposal.againstVotes / totalVotes) * 100 : 0;

    const timeLeft = new Date(this.proposal.endTime) - new Date();
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
    const isClosed = timeLeft <= 0 || this.proposal.status !== 'ACTIVE';

    return `
      <div class="proposal-card" id="prop-${this.proposal.id}">
        <div class="proposal-header">
          <span class="proposal-status ${isClosed ? 'status-closed' : 'status-active'}">
            ${isClosed ? 'Closed' : 'Active'}
          </span>
          <span style="color:#94a3b8; font-size:0.85rem">
            ${isClosed ? 'Ended' : `Ends in ${daysLeft} days`}
          </span>
        </div>

        <div class="proposal-title">${this.proposal.title}</div>
        <div class="proposal-desc">${this.proposal.description}</div>

        <div class="vote-bar-container">
          <div class="vote-bar-for" style="width: ${forPercent}%"></div>
          <div class="vote-bar-against" style="width: ${againstPercent}%"></div>
        </div>

        <div class="vote-stats">
          <span style="color:#10b981">For: ${this.proposal.forVotes.toLocaleString()}</span>
          <span style="color:#ef4444">Against: ${this.proposal.againstVotes.toLocaleString()}</span>
        </div>

        ${!isClosed ? `
          <div style="display:flex; gap:1rem; margin-top:1.5rem">
            <button class="vote-btn vote-for" data-id="${this.proposal.id}" data-choice="FOR">
              Vote For
            </button>
            <button class="vote-btn vote-against" data-id="${this.proposal.id}" data-choice="AGAINST">
              Vote Against
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }

  attachListeners(container) {
    const card = container.querySelector(`#prop-${this.proposal.id}`);
    if (!card) return;

    const forBtn = card.querySelector('.vote-for');
    const againstBtn = card.querySelector('.vote-against');

    if (forBtn) {
      forBtn.addEventListener('click', () => this.onVote(this.proposal.id, 'FOR'));
    }
    if (againstBtn) {
      againstBtn.addEventListener('click', () => this.onVote(this.proposal.id, 'AGAINST'));
    }
  }
}
