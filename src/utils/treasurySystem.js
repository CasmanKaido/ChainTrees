export class TreasurySystem {
    constructor() {
        this.storageKey = 'chaintrees_treasury';
        this.state = this.loadState();
    }

    loadState() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : {
            balance: 50000, // ETH or tokens
            transactions: []
        };
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    }

    /**
     * Get treasury balance
     */
    getBalance() {
        return this.state.balance;
    }

    /**
     * Execute a treasury transaction (from executed proposal)
     */
    executeTransaction(type, amount, recipient, description) {
        const tx = {
            id: `tx_${Date.now()}`,
            type, // 'TRANSFER', 'GRANT', 'BURN'
            amount,
            recipient,
            description,
            timestamp: new Date().toISOString()
        };

        if (type === 'TRANSFER' || type === 'GRANT') {
            if (this.state.balance < amount) {
                throw new Error('Insufficient treasury balance');
            }
            this.state.balance -= amount;
        } else if (type === 'BURN') {
            this.state.balance -= amount;
        }

        this.state.transactions.unshift(tx);
        this.save();
        return tx;
    }

    getTransactions(limit = 10) {
        return this.state.transactions.slice(0, limit);
    }
}

export const treasurySystem = new TreasurySystem();
