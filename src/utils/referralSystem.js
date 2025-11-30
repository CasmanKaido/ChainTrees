export class ReferralSystem {
    constructor() {
        this.baseUrl = window.location.origin;
    }

    generateCode(address) {
        // Simple encoding: take last 6 chars of address + random string
        const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
        const prefix = address.slice(-6).toUpperCase();
        return `${prefix}-${suffix}`;
    }

    getReferralLink(code) {
        return `${this.baseUrl}?ref=${code}`;
    }

    async trackReferral(code) {
        // In a real app, this would call an API to register the referral click
        console.log(`Referral tracked: ${code}`);
        localStorage.setItem('referrer_code', code);
    }

    async claimReferralReward(address) {
        // Call smart contract to claim rewards
        console.log(`Claiming rewards for ${address}`);
        return true;
    }
}

export const referralSystem = new ReferralSystem();
