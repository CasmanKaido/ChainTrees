import { describe, it, expect, beforeEach, vi } from 'vitest'
import { MarketplaceGrid } from '../../../src/components/MarketplaceGrid.js'

describe('MarketplaceGrid Component', () => {
    let marketplaceGrid
    let mockListings

    beforeEach(() => {
        mockListings = [
            {
                id: 1,
                tokenId: 101,
                price: '0.5',
                seller: '0x1234567890123456789012345678901234567890',
                species: 'Oak',
                rarity: 'common',
                image: 'ipfs://oak1.png',
                listed: Date.now() - 86400000 // 1 day ago
            },
            {
                id: 2,
                tokenId: 102,
                price: '1.2',
                seller: '0x9876543210987654321098765432109876543210',
                species: 'Maple',
                rarity: 'rare',
                image: 'ipfs://maple1.png',
                listed: Date.now() - 3600000 // 1 hour ago
            },
            {
                id: 3,
                tokenId: 103,
                price: '0.3',
                seller: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
                species: 'Pine',
                rarity: 'common',
                image: 'ipfs://pine1.png',
                listed: Date.now() - 7200000 // 2 hours ago
            }
        ]

        marketplaceGrid = new MarketplaceGrid(mockListings)
    })

    describe('Initialization', () => {
        it('should create a MarketplaceGrid instance', () => {
            expect(marketplaceGrid).toBeDefined()
        })

        it('should initialize with listings', () => {
            expect(marketplaceGrid.listings).toEqual(mockListings)
            expect(marketplaceGrid.listings.length).toBe(3)
        })

        it('should initialize with default filters', () => {
            expect(marketplaceGrid.filters).toBeDefined()
            expect(marketplaceGrid.filters.species).toBeUndefined()
            expect(marketplaceGrid.filters.rarity).toBeUndefined()
        })
    })

    describe('Rendering', () => {
        it('should render all listings', () => {
            const html = marketplaceGrid.render()

            expect(html).toContain('Oak')
            expect(html).toContain('Maple')
            expect(html).toContain('Pine')
        })

        it('should render listing prices', () => {
            const html = marketplaceGrid.render()

            expect(html).toContain('0.5')
            expect(html).toContain('1.2')
            expect(html).toContain('0.3')
        })

        it('should render rarity badges', () => {
            const html = marketplaceGrid.render()

            expect(html).toContain('common')
            expect(html).toContain('rare')
        })

        it('should render empty state when no listings', () => {
            const emptyGrid = new MarketplaceGrid([])
            const html = emptyGrid.render()

            expect(html).toContain('No listings found')
        })
    })

    describe('Filtering', () => {
        it('should filter by species', () => {
            marketplaceGrid.applyFilter({ species: 'Oak' })
            const filtered = marketplaceGrid.getFilteredListings()

            expect(filtered.length).toBe(1)
            expect(filtered[0].species).toBe('Oak')
        })

        it('should filter by rarity', () => {
            marketplaceGrid.applyFilter({ rarity: 'rare' })
            const filtered = marketplaceGrid.getFilteredListings()

            expect(filtered.length).toBe(1)
            expect(filtered[0].rarity).toBe('rare')
        })

        it('should filter by price range', () => {
            marketplaceGrid.applyFilter({ minPrice: '0.4', maxPrice: '1.0' })
            const filtered = marketplaceGrid.getFilteredListings()

            expect(filtered.length).toBe(1)
            expect(filtered[0].price).toBe('0.5')
        })

        it('should apply multiple filters', () => {
            marketplaceGrid.applyFilter({
                species: 'Oak',
                rarity: 'common'
            })
            const filtered = marketplaceGrid.getFilteredListings()

            expect(filtered.length).toBe(1)
            expect(filtered[0].species).toBe('Oak')
            expect(filtered[0].rarity).toBe('common')
        })

        it('should clear filters', () => {
            marketplaceGrid.applyFilter({ species: 'Oak' })
            marketplaceGrid.clearFilters()
            const filtered = marketplaceGrid.getFilteredListings()

            expect(filtered.length).toBe(3)
        })
    })

    describe('Sorting', () => {
        it('should sort by price ascending', () => {
            marketplaceGrid.sort('price', 'asc')
            const sorted = marketplaceGrid.getSortedListings()

            expect(sorted[0].price).toBe('0.3')
            expect(sorted[1].price).toBe('0.5')
            expect(sorted[2].price).toBe('1.2')
        })

        it('should sort by price descending', () => {
            marketplaceGrid.sort('price', 'desc')
            const sorted = marketplaceGrid.getSortedListings()

            expect(sorted[0].price).toBe('1.2')
            expect(sorted[1].price).toBe('0.5')
            expect(sorted[2].price).toBe('0.3')
        })

        it('should sort by listing date (newest first)', () => {
            marketplaceGrid.sort('date', 'desc')
            const sorted = marketplaceGrid.getSortedListings()

            expect(sorted[0].tokenId).toBe(102) // Most recent
        })

        it('should sort by rarity', () => {
            marketplaceGrid.sort('rarity', 'desc')
            const sorted = marketplaceGrid.getSortedListings()

            expect(sorted[0].rarity).toBe('rare')
        })
    })

    describe('Pagination', () => {
        beforeEach(() => {
            // Create more listings for pagination testing
            const manyListings = Array.from({ length: 25 }, (_, i) => ({
                id: i + 1,
                tokenId: i + 100,
                price: `${(i * 0.1).toFixed(1)}`,
                seller: `0x${i.toString().padStart(40, '0')}`,
                species: 'Oak',
                rarity: 'common',
                image: `ipfs://tree${i}.png`,
                listed: Date.now()
            }))

            marketplaceGrid = new MarketplaceGrid(manyListings)
            marketplaceGrid.itemsPerPage = 10
        })

        it('should paginate listings', () => {
            const page1 = marketplaceGrid.getPage(1)

            expect(page1.length).toBe(10)
        })

        it('should get correct page', () => {
            const page2 = marketplaceGrid.getPage(2)

            expect(page2.length).toBe(10)
            expect(page2[0].id).toBe(11)
        })

        it('should handle last page correctly', () => {
            const page3 = marketplaceGrid.getPage(3)

            expect(page3.length).toBe(5) // Remaining items
        })

        it('should calculate total pages', () => {
            const totalPages = marketplaceGrid.getTotalPages()

            expect(totalPages).toBe(3)
        })

        it('should handle empty page', () => {
            const page10 = marketplaceGrid.getPage(10)

            expect(page10.length).toBe(0)
        })
    })

    describe('Search', () => {
        it('should search by species name', () => {
            const results = marketplaceGrid.search('Oak')

            expect(results.length).toBe(1)
            expect(results[0].species).toBe('Oak')
        })

        it('should search by token ID', () => {
            const results = marketplaceGrid.search('101')

            expect(results.length).toBe(1)
            expect(results[0].tokenId).toBe(101)
        })

        it('should be case insensitive', () => {
            const results = marketplaceGrid.search('maple')

            expect(results.length).toBe(1)
            expect(results[0].species).toBe('Maple')
        })

        it('should return empty array for no matches', () => {
            const results = marketplaceGrid.search('Birch')

            expect(results.length).toBe(0)
        })
    })

    describe('Event Handling', () => {
        it('should handle buy button click', () => {
            const buyCallback = vi.fn()
            marketplaceGrid.onBuy = buyCallback

            marketplaceGrid.handleBuy(1)

            expect(buyCallback).toHaveBeenCalledWith(1)
        })

        it('should handle make offer button click', () => {
            const offerCallback = vi.fn()
            marketplaceGrid.onMakeOffer = offerCallback

            marketplaceGrid.handleMakeOffer(2)

            expect(offerCallback).toHaveBeenCalledWith(2)
        })

        it('should handle view details click', () => {
            const detailsCallback = vi.fn()
            marketplaceGrid.onViewDetails = detailsCallback

            marketplaceGrid.handleViewDetails(3)

            expect(detailsCallback).toHaveBeenCalledWith(3)
        })
    })

    describe('Loading States', () => {
        it('should show loading skeleton', () => {
            marketplaceGrid.isLoading = true
            const html = marketplaceGrid.render()

            expect(html).toContain('skeleton')
        })

        it('should hide loading after data loads', () => {
            marketplaceGrid.isLoading = false
            const html = marketplaceGrid.render()

            expect(html).not.toContain('skeleton')
        })
    })

    describe('Error Handling', () => {
        it('should display error message', () => {
            marketplaceGrid.error = 'Failed to load listings'
            const html = marketplaceGrid.render()

            expect(html).toContain('Failed to load listings')
        })

        it('should clear error on retry', () => {
            marketplaceGrid.error = 'Some error'
            marketplaceGrid.clearError()

            expect(marketplaceGrid.error).toBeNull()
        })
    })

    describe('Data Updates', () => {
        it('should update listings', () => {
            const newListings = [
                {
                    id: 4,
                    tokenId: 104,
                    price: '2.0',
                    seller: '0x1111111111111111111111111111111111111111',
                    species: 'Birch',
                    rarity: 'legendary',
                    image: 'ipfs://birch1.png',
                    listed: Date.now()
                }
            ]

            marketplaceGrid.updateListings(newListings)

            expect(marketplaceGrid.listings.length).toBe(1)
            expect(marketplaceGrid.listings[0].species).toBe('Birch')
        })

        it('should add new listing', () => {
            const newListing = {
                id: 4,
                tokenId: 104,
                price: '1.5',
                seller: '0x2222222222222222222222222222222222222222',
                species: 'Willow',
                rarity: 'uncommon',
                image: 'ipfs://willow1.png',
                listed: Date.now()
            }

            marketplaceGrid.addListing(newListing)

            expect(marketplaceGrid.listings.length).toBe(4)
        })

        it('should remove listing', () => {
            marketplaceGrid.removeListing(1)

            expect(marketplaceGrid.listings.length).toBe(2)
            expect(marketplaceGrid.listings.find(l => l.id === 1)).toBeUndefined()
        })
    })
})
