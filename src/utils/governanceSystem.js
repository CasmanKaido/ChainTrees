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

    getProposals(filter = 'ALL') {
        if (filter === 'ACTIVE') {
            return this.proposals.filter(p => p.status === 'ACTIVE' && new Date(p.endTime) > new Date());
        }
        if (filter === 'CLOSED') {
            return this.proposals.filter(p => p.status !== 'ACTIVE' || new Date(p.endTime) <= new Date());
        }
        return this.proposals;
    }

    getProposalById(id) {
        return this.proposals.find(p => p.id === id);
    }
}

export const governanceSystem = new GovernanceSystem();
