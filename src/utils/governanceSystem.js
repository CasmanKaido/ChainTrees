export class GovernanceSystem {
    constructor() {
        this.storageKey = 'chaintrees_proposals';
        this.proposals = this.loadProposals();
    }

    loadProposals() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.proposals));
    }

    /**
     * Create a new governance proposal
     * @param {string} title Title of the proposal
     * @param {string} description Detailed description
     * @param {string} creator Address of the creator
     * @param {number} durationDays Duration in days
     */
    createProposal(title, description, creator, durationDays = 3) {
        const endTime = new Date();
        endTime.setDate(endTime.getDate() + durationDays);

        const proposal = {
            id: `prop_${Date.now()}`,
            title,
            description,
            creator,
            createdAt: new Date().toISOString(),
            endTime: endTime.toISOString(),
            status: 'ACTIVE', // ACTIVE, PASSED, REJECTED, EXECUTED
            forVotes: 0,
            againstVotes: 0,
            abstainVotes: 0,
            voters: {} // Map address -> vote choice
        };

        this.proposals.unshift(proposal);
        this.save();
        return proposal;
    }

    /**
   * Cast a vote on a proposal
   * @param {string} proposalId ID of the proposal
   * @param {string} voter Address of the voter
   * @param {string} choice 'FOR', 'AGAINST', 'ABSTAIN'
   * @param {number} weight Voting power (default 1)
   */
    vote(proposalId, voter, choice, weight = 1) {
        const proposal = this.proposals.find(p => p.id === proposalId);
        if (!proposal) throw new Error('Proposal not found');
        if (proposal.status !== 'ACTIVE') throw new Error('Proposal is not active');
        if (new Date(proposal.endTime) < new Date()) throw new Error('Voting period ended');
        if (proposal.voters[voter]) throw new Error('Already voted');

        proposal.voters[voter] = choice;
        return this.proposals;
    }

    getProposalById(id) {
        return this.proposals.find(p => p.id === id);
    }
}

export const governanceSystem = new GovernanceSystem();
