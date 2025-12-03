import { describe, it, expect, beforeEach, vi } from 'vitest'
import { governanceSystem } from '../../../src/utils/governanceSystem.js'

describe('Governance System', () => {
    beforeEach(() => {
        // Reset governance state before each test
        governanceSystem.proposals = []
        governanceSystem.votes = new Map()
        governanceSystem.delegations = new Map()

        // Mock localStorage
        global.localStorage = {
            getItem: vi.fn(),
            setItem: vi.fn(),
            removeItem: vi.fn()
        }
    })

    describe('Proposal Creation', () => {
        it('should create a new proposal', () => {
            const proposal = {
                title: 'Increase tree planting rewards',
                description: 'Proposal to increase rewards by 20%',
                proposer: '0x1234567890123456789012345678901234567890',
                type: 'parameter'
            }

            const created = governanceSystem.createProposal(proposal)

            expect(created).toBeDefined()
            expect(created.id).toBeDefined()
            expect(created.title).toBe(proposal.title)
            expect(created.status).toBe('active')
        })

        it('should require minimum token balance to create proposal', () => {
            const proposal = {
                title: 'Test Proposal',
                description: 'Test',
                proposer: '0x1234567890123456789012345678901234567890',
                type: 'parameter'
            }

            governanceSystem.getTokenBalance = vi.fn().mockReturnValue(100)
            governanceSystem.minimumProposalTokens = 1000

            expect(() => governanceSystem.createProposal(proposal))
                .toThrow('Insufficient tokens to create proposal')
        })

        it('should assign unique IDs to proposals', () => {
            const proposal1 = governanceSystem.createProposal({
                title: 'Proposal 1',
                description: 'First',
                proposer: '0x1111111111111111111111111111111111111111',
                type: 'parameter'
            })

            const proposal2 = governanceSystem.createProposal({
                title: 'Proposal 2',
                description: 'Second',
                proposer: '0x2222222222222222222222222222222222222222',
                type: 'parameter'
            })

            expect(proposal1.id).not.toBe(proposal2.id)
        })

        it('should set voting period for new proposals', () => {
            const proposal = governanceSystem.createProposal({
                title: 'Test',
                description: 'Test',
                proposer: '0x1234567890123456789012345678901234567890',
                type: 'parameter'
            })

            expect(proposal.votingStart).toBeDefined()
            expect(proposal.votingEnd).toBeDefined()
            expect(proposal.votingEnd).toBeGreaterThan(proposal.votingStart)
        })
    })

    describe('Voting', () => {
        let proposal

        beforeEach(() => {
            proposal = governanceSystem.createProposal({
                title: 'Test Proposal',
                description: 'Test',
                proposer: '0x1234567890123456789012345678901234567890',
                type: 'parameter'
            })
        })

        it('should cast vote for proposal', () => {
            const voter = '0x9876543210987654321098765432109876543210'
            const vote = governanceSystem.vote(proposal.id, voter, 'for', 100)

            expect(vote).toBeDefined()
            expect(vote.support).toBe('for')
            expect(vote.weight).toBe(100)
        })

        it('should prevent double voting', () => {
            const voter = '0x9876543210987654321098765432109876543210'

            governanceSystem.vote(proposal.id, voter, 'for', 100)

            expect(() => governanceSystem.vote(proposal.id, voter, 'against', 50))
                .toThrow('Already voted on this proposal')
        })

        it('should calculate vote weight based on token balance', () => {
            const voter = '0x9876543210987654321098765432109876543210'
            governanceSystem.getTokenBalance = vi.fn().mockReturnValue(500)

            const vote = governanceSystem.vote(proposal.id, voter, 'for')

            expect(vote.weight).toBe(500)
        })

        it('should track votes for, against, and abstain', () => {
            governanceSystem.vote(proposal.id, '0x1111111111111111111111111111111111111111', 'for', 100)
            governanceSystem.vote(proposal.id, '0x2222222222222222222222222222222222222222', 'against', 50)
            governanceSystem.vote(proposal.id, '0x3333333333333333333333333333333333333333', 'abstain', 25)

            const tally = governanceSystem.getTally(proposal.id)

            expect(tally.for).toBe(100)
            expect(tally.against).toBe(50)
            expect(tally.abstain).toBe(25)
        })

        it('should not allow voting after voting period ends', () => {
            proposal.votingEnd = Date.now() - 1000 // Ended 1 second ago
            const voter = '0x9876543210987654321098765432109876543210'

            expect(() => governanceSystem.vote(proposal.id, voter, 'for', 100))
                .toThrow('Voting period has ended')
        })

        it('should not allow voting before voting period starts', () => {
            proposal.votingStart = Date.now() + 10000 // Starts in 10 seconds
            const voter = '0x9876543210987654321098765432109876543210'

            expect(() => governanceSystem.vote(proposal.id, voter, 'for', 100))
                .toThrow('Voting period has not started')
        })
    })

    describe('Vote Delegation', () => {
        it('should delegate voting power', () => {
            const delegator = '0x1111111111111111111111111111111111111111'
            const delegate = '0x2222222222222222222222222222222222222222'

            governanceSystem.delegate(delegator, delegate)

            expect(governanceSystem.getDelegation(delegator)).toBe(delegate)
        })

        it('should remove previous delegation when delegating to new address', () => {
            const delegator = '0x1111111111111111111111111111111111111111'
            const delegate1 = '0x2222222222222222222222222222222222222222'
            const delegate2 = '0x3333333333333333333333333333333333333333'

            governanceSystem.delegate(delegator, delegate1)
            governanceSystem.delegate(delegator, delegate2)

            expect(governanceSystem.getDelegation(delegator)).toBe(delegate2)
        })

        it('should undelegate voting power', () => {
            const delegator = '0x1111111111111111111111111111111111111111'
            const delegate = '0x2222222222222222222222222222222222222222'

            governanceSystem.delegate(delegator, delegate)
            governanceSystem.undelegate(delegator)

            expect(governanceSystem.getDelegation(delegator)).toBeNull()
        })

        it('should calculate delegated voting power', () => {
            const delegate = '0x2222222222222222222222222222222222222222'

            governanceSystem.delegate('0x1111111111111111111111111111111111111111', delegate)
            governanceSystem.delegate('0x3333333333333333333333333333333333333333', delegate)

            governanceSystem.getTokenBalance = vi.fn((address) => {
                if (address === '0x1111111111111111111111111111111111111111') {
                    return 100
                }
                if (address === '0x3333333333333333333333333333333333333333') {
                    return 200
                }
                return 0
            })

            const power = governanceSystem.getDelegatedPower(delegate)

            expect(power).toBe(300)
        })
    })

    describe('Proposal Execution', () => {
        let proposal

        beforeEach(() => {
            proposal = governanceSystem.createProposal({
                title: 'Test Proposal',
                description: 'Test',
                proposer: '0x1234567890123456789012345678901234567890',
                type: 'parameter'
            })
        })

        it('should execute proposal if quorum is met and majority votes for', () => {
            governanceSystem.vote(proposal.id, '0x1111111111111111111111111111111111111111', 'for', 600)
            governanceSystem.vote(proposal.id, '0x2222222222222222222222222222222222222222', 'against', 400)

            proposal.votingEnd = Date.now() - 1000 // Voting ended
            governanceSystem.quorum = 500

            const result = governanceSystem.executeProposal(proposal.id)

            expect(result.executed).toBe(true)
            expect(result.passed).toBe(true)
        })

        it('should not execute if quorum is not met', () => {
            governanceSystem.vote(proposal.id, '0x1111111111111111111111111111111111111111', 'for', 100)

            proposal.votingEnd = Date.now() - 1000
            governanceSystem.quorum = 500

            const result = governanceSystem.executeProposal(proposal.id)

            expect(result.executed).toBe(false)
            expect(result.reason).toContain('quorum')
        })

        it('should not execute if majority votes against', () => {
            governanceSystem.vote(proposal.id, '0x1111111111111111111111111111111111111111', 'for', 400)
            governanceSystem.vote(proposal.id, '0x2222222222222222222222222222222222222222', 'against', 600)

            proposal.votingEnd = Date.now() - 1000
            governanceSystem.quorum = 500

            const result = governanceSystem.executeProposal(proposal.id)

            expect(result.executed).toBe(false)
            expect(result.passed).toBe(false)
        })

        it('should not execute before voting period ends', () => {
            governanceSystem.vote(proposal.id, '0x1111111111111111111111111111111111111111', 'for', 1000)

            expect(() => governanceSystem.executeProposal(proposal.id))
                .toThrow('Voting period has not ended')
        })

        it('should mark proposal as executed', () => {
            governanceSystem.vote(proposal.id, '0x1111111111111111111111111111111111111111', 'for', 1000)
            proposal.votingEnd = Date.now() - 1000
            governanceSystem.quorum = 500

            governanceSystem.executeProposal(proposal.id)

            const updated = governanceSystem.getProposal(proposal.id)
            expect(updated.status).toBe('executed')
        })
    })

    describe('Proposal Queries', () => {
        beforeEach(() => {
            governanceSystem.createProposal({
                title: 'Active Proposal',
                description: 'Test',
                proposer: '0x1111111111111111111111111111111111111111',
                type: 'parameter'
            })

            const executed = governanceSystem.createProposal({
                title: 'Executed Proposal',
                description: 'Test',
                proposer: '0x2222222222222222222222222222222222222222',
                type: 'parameter'
            })
            executed.status = 'executed'
        })

        it('should get all proposals', () => {
            const all = governanceSystem.getAllProposals()
            expect(all.length).toBe(2)
        })

        it('should filter proposals by status', () => {
            const active = governanceSystem.getProposalsByStatus('active')
            expect(active.length).toBe(1)
            expect(active[0].title).toBe('Active Proposal')
        })

        it('should get proposal by ID', () => {
            const all = governanceSystem.getAllProposals()
            const proposal = governanceSystem.getProposal(all[0].id)

            expect(proposal).toBeDefined()
            expect(proposal.id).toBe(all[0].id)
        })

        it('should return null for non-existent proposal', () => {
            const proposal = governanceSystem.getProposal('non-existent-id')
            expect(proposal).toBeNull()
        })
    })

    describe('Treasury Management', () => {
        it('should track treasury balance', () => {
            governanceSystem.treasury.balance = 1000

            expect(governanceSystem.getTreasuryBalance()).toBe(1000)
        })

        it('should add funds to treasury', () => {
            governanceSystem.addToTreasury(500)

            expect(governanceSystem.getTreasuryBalance()).toBe(500)
        })

        it('should withdraw from treasury with approved proposal', () => {
            governanceSystem.treasury.balance = 1000

            const proposal = governanceSystem.createProposal({
                title: 'Treasury Withdrawal',
                description: 'Withdraw 300 for development',
                proposer: '0x1111111111111111111111111111111111111111',
                type: 'treasury',
                amount: 300
            })

            proposal.status = 'executed'
            proposal.passed = true

            governanceSystem.withdrawFromTreasury(proposal.id, 300)

            expect(governanceSystem.getTreasuryBalance()).toBe(700)
        })

        it('should not withdraw without approved proposal', () => {
            governanceSystem.treasury.balance = 1000

            expect(() => governanceSystem.withdrawFromTreasury('invalid-id', 300))
                .toThrow('Proposal not approved')
        })
    })

    describe('Persistence', () => {
        it('should save proposals to localStorage', () => {
            governanceSystem.createProposal({
                title: 'Test',
                description: 'Test',
                proposer: '0x1111111111111111111111111111111111111111',
                type: 'parameter'
            })

            governanceSystem.save()

            expect(localStorage.setItem).toHaveBeenCalled()
        })

        it('should load proposals from localStorage', () => {
            const mockData = JSON.stringify({
                proposals: [{
                    id: 'test-1',
                    title: 'Loaded Proposal',
                    status: 'active'
                }]
            })

            localStorage.getItem = vi.fn().mockReturnValue(mockData)

            governanceSystem.load()

            expect(governanceSystem.proposals.length).toBe(1)
            expect(governanceSystem.proposals[0].title).toBe('Loaded Proposal')
        })
    })
})
