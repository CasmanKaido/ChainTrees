import { marketplaceService } from '../services/marketplaceService.js'
import { auctionSystem } from '../utils/auctionSystem.js'
import { offerSystem } from '../utils/offerSystem.js'

export class TransactionHistory {
  constructor() {
    this.storageKey = 'chaintrees_transactions'
    this.transactions = this.loadTransactions()
  }

  loadTransactions() {
    const stored = localStorage.getItem(this.storageKey)
    return stored ? JSON.parse(stored) : []
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.transactions))
  }

  /**
   * Log a new transaction
   */
  logTransaction(type, item, price, from, to) {
    const tx = {
      id: `tx_${Date.now()}`,
      type, // 'SALE', 'AUCTION_WIN', 'OFFER_ACCEPTED'
      item,
      price,
      from,
      to,
      timestamp: new Date().toISOString(),
      txHash: '0x' + Math.random().toString(16).substr(2, 64) // Mock hash
    }

    this.transactions.unshift(tx)
    this.save()
    return tx
  }

  getHistory(userAddress = null) {
    if (userAddress) {
      return this.transactions.filter(tx => tx.from === userAddress || tx.to === userAddress)
    }
    return this.transactions
  }
}

export const transactionHistory = new TransactionHistory()
