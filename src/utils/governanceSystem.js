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
     */
    vote(proposalId, voter, choice, weight = 1) {
        const proposal = this.proposals.find(p => p.id === proposalId);
        if (!proposal) throw new Error('Proposal not found');
        if (proposal.status !== 'ACTIVE') throw new Error('Proposal is not active');
        if (new Date(proposal.endTime) < new Date()) throw new Error('Voting period ended');
        if (proposal.voters[voter]) throw new Error('Already voted');

        proposal.voters[voter] = choice;

        if (choice === 'FOR') proposal.forVotes += weight;
        else if (choice === 'AGAINST') proposal.againstVotes += weight;
        else if (choice === 'ABSTAIN') proposal.abstainVotes += weight;

        this.save();
        return proposal;
    }

    /**
     * Execute a proposal if it has passed
     */
    executeProposal(proposalId) {
        const proposal = this.proposals.find(p => p.id === proposalId);
        if (!proposal) throw new Error('Proposal not found');

        if (proposal.status === 'EXECUTED') throw new Error('Already executed');
        if (proposal.status === 'REJECTED') throw new Error('Proposal was rejected');

        // Check if voting period ended
        if (new Date(proposal.endTime) > new Date()) {
            throw new Error('Voting period not ended');
        }

        const totalVotes = proposal.forVotes + proposal.againstVotes + proposal.abstainVotes;
        if (totalVotes === 0) {
            proposal.status = 'REJECTED'; // No quorum
            this.save();
            return proposal;
        }

        // Simple majority check
        if (proposal.forVotes > proposal.againstVotes) {
            proposal.status = 'EXECUTED';
            // In real app, trigger on-chain action here
        } else {
            proposal.status = 'REJECTED';
        }

        this.save();
        return proposal;
    }

    /**
     * Check and update status of all proposals
     */
    updateStatuses() {
        const now = new Date();
        let changed = false;

        this.proposals.forEach(p => {
            if (p.status === 'ACTIVE' && new Date(p.endTime) <= now) {
                // Auto-close/execute logic
                if (p.forVotes > p.againstVotes) {
                    p.status = 'PASSED'; // Ready for execution
                } else {
                    p.status = 'REJECTED';
                }
                changed = true;
            }
        });

        if (changed) this.save();
    }

    getProposals(filter = 'ALL') {
        this.updateStatuses(); // Ensure statuses are up to date

        if (filter === 'ACTIVE') {
            return this.proposals.filter(p => p.status === 'ACTIVE');
        }
        if (filter === 'CLOSED') {
            return this.proposals.filter(p => p.status !== 'ACTIVE');
        }
        return this.proposals;
    }

    getProposalById(id) {
        return this.proposals.find(p => p.id === id);
    }
}

export const governanceSystem = new GovernanceSystem();
