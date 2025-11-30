export class TokenSystem {
    constructor() {
        this.storageKey = 'chaintrees_token';
        this.state = this.loadState();
    }

    loadState() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : {
            balances: {
                '0xUserWallet': 1250,
                '0xDaoMember1': 5000,
                '0xDaoMember2': 3000
            },
            delegates: {} // delegator -> delegatee
        };
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    }

    /**
     * Get token balance
     */
    balanceOf(address) {
        return this.state.balances[address] || 0;
    }

    /**
     * Get voting power (balance + delegated)
     */
    getVotes(address) {
        // Base balance
        let votes = this.balanceOf(address);

        // Add delegated votes
        Object.entries(this.state.delegates).forEach(([delegator, delegatee]) => {
            if (delegatee === address) {
                votes += this.balanceOf(delegator);
            }
        });

        // If user delegated their votes, they have 0 voting power (unless they are their own delegate)
        // Simplified: if you delegate, you can't vote directly.
        if (this.state.delegates[address] && this.state.delegates[address] !== address) {
            return 0;
        }

        return votes;
    }

    /**
     * Delegate votes
     */
    delegate(delegator, delegatee) {
        if (delegator === delegatee) {
            delete this.state.delegates[delegator]; // Undelegate (self-delegate)
        } else {
            this.state.delegates[delegator] = delegatee;
        }
        this.save();
    }

    /**
     * Get current delegate
     */
    getDelegate(address) {
        return this.state.delegates[address] || address;
    }
}

export const tokenSystem = new TokenSystem();
