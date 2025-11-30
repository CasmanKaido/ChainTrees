export class ProposalCard {
    constructor(proposal, onVote) {
        this.proposal = proposal;
        this.onVote = onVote;
    }

    render() {
        const { id, title, description, status, votesFor, votesAgainst, endDate } = this.proposal;
        const totalVotes = votesFor + votesAgainst;
        const percentFor = totalVotes > 0 ? (votesFor / totalVotes) * 100 : 0;
        const percentAgainst = totalVotes > 0 ? (votesAgainst / totalVotes) * 100 : 0;

        const isActive = status === 'active';

        return `
      <div class="proposal-card">
        <div class="proposal-header">
          <div>
            <span class="proposal-status status-${status.toLowerCase()}">${status}</span>
            <span style="color: var(--text-secondary); font-size: 0.8rem; margin-left: 1rem;">Ends: ${endDate}</span>
          </div>
          <span style="color: var(--text-secondary);">#${id}</span>
        </div>

        <h3 class="proposal-title">${title}</h3>
        <p class="proposal-desc">${description}</p>

        <div class="vote-bars">
          <div class="vote-row">
            <div class="vote-label">
              <span>For</span>
              <span>${votesFor.toLocaleString()} VP (${percentFor.toFixed(1)}%)</span>
            </div>
            <div class="vote-progress-bg">
              <div class="vote-progress-fill fill-for" style="width: ${percentFor}%"></div>
            </div>
          </div>

          <div class="vote-row">
            <div class="vote-label">
              <span>Against</span>
              <span>${votesAgainst.toLocaleString()} VP (${percentAgainst.toFixed(1)}%)</span>
            </div>
            <div class="vote-progress-bg">
              <div class="vote-progress-fill fill-against" style="width: ${percentAgainst}%"></div>
            </div>
          </div>
        </div>

        ${isActive ? `
          <div class="vote-actions">
            <button class="vote-btn btn-for" data-id="${id}" data-vote="for">Vote For</button>
            <button class="vote-btn btn-against" data-id="${id}" data-vote="against">Vote Against</button>
          </div>
        ` : ''}
      </div>
    `;
    }

    attachListeners(container) {
        const forBtn = container.querySelector(`.btn-for[data-id="${this.proposal.id}"]`);
        const againstBtn = container.querySelector(`.btn-against[data-id="${this.proposal.id}"]`);

        if (forBtn) {
            forBtn.addEventListener('click', () => this.onVote(this.proposal.id, true));
        }
        if (againstBtn) {
            againstBtn.addEventListener('click', () => this.onVote(this.proposal.id, false));
        }
    }
}
