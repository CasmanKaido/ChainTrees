export class FriendSystem {
    constructor() {
        this.storageKey = 'chaintrees_friends';
        this.friends = this.loadFriends();
        this.blocked = this.loadBlocked();
    }

    loadFriends() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    loadBlocked() {
        const stored = localStorage.getItem('chaintrees_blocked');
        return stored ? JSON.parse(stored) : [];
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.friends));
        localStorage.setItem('chaintrees_blocked', JSON.stringify(this.blocked));
    }

    /**
     * Add a friend by address
     * @param {string} address Wallet address
     * @param {string} name Optional nickname
     */
    addFriend(address, name = '') {
        if (this.isFriend(address)) throw new Error('Already friends');
        if (this.isBlocked(address)) throw new Error('User is blocked');

        this.friends.push({
            address,
            name: name || `Planter ${address.substr(0, 6)}`,
            addedAt: new Date().toISOString()
        });
        this.save();
    }

    removeFriend(address) {
        this.friends = this.friends.filter(f => f.address !== address);
        this.save();
    }

    blockUser(address) {
        if (!this.isBlocked(address)) {
            this.blocked.push(address);
            this.removeFriend(address); // Auto-remove if friend
            this.save();
        }
    }

    unblockUser(address) {
        this.blocked = this.blocked.filter(a => a !== address);
        this.save();
    }

    isFriend(address) {
        return this.friends.some(f => f.address === address);
    }

    isBlocked(address) {
        return this.blocked.includes(address);
    }

    getFriends() {
        return this.friends;
    }
}

export const friendSystem = new FriendSystem();
