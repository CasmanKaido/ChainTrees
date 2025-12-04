export class GovernanceSystem {
  constructor() {
    this.storageKey = 'chaintrees_proposals'
    this.proposals = []
    this.votes = new Map()
    this.delegations = new Map()
    this.treasury = { balance: 0 }
    this.quorum = 500
    this.minimumProposalTokens = 0
  }

  load() {
    const stored = localStorage.getItem(this.storageKey)
    if (stored) {
      const data = JSON.parse(stored)
      this.proposals = data.proposals || []
      this.treasury = data.treasury || { balance: 0 }
    }
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify({
      proposals: this.proposals,
      treasury: this.treasury
    }))
  }

  getTokenBalance(address) {
    // Mock implementation - in real app, query blockchain
    return 1000
  }

  createProposal(proposalData) {
    if (this.minimumProposalTokens > 0) {
      const balance = this.getTokenBalance(proposalData.proposer)
      if (balance < this.minimumProposalTokens) {
        throw new Error('Insufficient tokens to create proposal')
      }
    }

    const proposal = {
      id: `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: proposalData.title,
      description: proposalData.description,
      proposer: proposalData.proposer,
      type: proposalData.type,
      amount: proposalData.amount,
      status: 'active',
      votingStart: Date.now(),
      votingEnd: Date.now() + (3 * 24 * 60 * 60 * 1000), // 3 days
      passed: false,
      createdAt: Date.now()
    }

    this.proposals.push(proposal)
    this.save()
    return proposal
  }

  vote(proposalId, voter, support, weight) {
    const proposal = this.proposals.find(p => p.id === proposalId)
    if (!proposal) throw new Error('Proposal not found')

    const now = Date.now()
    if (now < proposal.votingStart) throw new Error('Voting period has not started')
    if (now > proposal.votingEnd) throw new Error('Voting period has ended')

    const voteKey = `${proposalId}-${voter}`
    if (this.votes.has(voteKey)) throw new Error('Already voted on this proposal')

    const voteWeight = weight || this.getTokenBalance(voter)
    const vote = {
      proposalId,
      voter,
      support,
      weight: voteWeight,
      timestamp: now
    }

    this.votes.set(voteKey, vote)
    this.save()
    return vote
  }

  getTally(proposalId) {
    const tally = { for: 0, against: 0, abstain: 0 }

    for (const [key, vote] of this.votes.entries()) {
      if (vote.proposalId === proposalId) {
        if (vote.support === 'for') tally.for += vote.weight
        else if (vote.support === 'against') tally.against += vote.weight
        else if (vote.support === 'abstain') tally.abstain += vote.weight
      }
    }

    return tally
  }

  delegate(delegator, delegate) {
    this.delegations.set(delegator, delegate)
  }

  undelegate(delegator) {
    this.delegations.delete(delegator)
  }

  getDelegation(delegator) {
    return this.delegations.get(delegator) || null
  }

  getDelegatedPower(delegate) {
    let power = 0
    for (const [delegator, delegateTo] of this.delegations.entries()) {
      if (delegateTo === delegate) {
        power += this.getTokenBalance(delegator)
      }
    }
    return power
  }

  executeProposal(proposalId) {
    const proposal = this.proposals.find(p => p.id === proposalId)
    if (!proposal) throw new Error('Proposal not found')

    if (Date.now() < proposal.votingEnd) {
      throw new Error('Voting period has not ended')
    }

    const tally = this.getTally(proposalId)
    const totalVotes = tally.for + tally.against + tally.abstain

    if (totalVotes < this.quorum) {
      return {
        executed: false,
        passed: false,
        reason: 'Quorum not met'
      }
    }

    const passed = tally.for > tally.against
    proposal.status = 'executed'
    proposal.passed = passed

    this.save()

    return {
      executed: true,
      passed
    }
  }

  getAllProposals() {
    return this.proposals
  }

  getProposalsByStatus(status) {
    return this.proposals.filter(p => p.status === status)
  }

  getProposal(id) {
    return this.proposals.find(p => p.id === id) || null
  }

  getTreasuryBalance() {
    return this.treasury.balance
  }

  addToTreasury(amount) {
    this.treasury.balance += amount
    this.save()
  }

  withdrawFromTreasury(proposalId, amount) {
    const proposal = this.proposals.find(p => p.id === proposalId)
    if (!proposal || proposal.status !== 'executed' || !proposal.passed) {
      throw new Error('Proposal not approved')
    }

    this.treasury.balance -= amount
    this.save()
  }
}

export const governanceSystem = new GovernanceSystem()
