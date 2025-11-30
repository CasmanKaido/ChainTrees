---
description: ChainTrees - WalletConnect & Reown SDK Implementation Plan
---

# ChainTrees 🌳 - Multi-Chain Environmental Impact Platform

## Project Overview

**ChainTrees** is a Web3 application that gamifies environmental impact by allowing users to plant virtual trees on-chain, track their carbon offset contributions, and participate in a global reforestation initiative. Built with WalletConnect (Reown SDK), it provides seamless multi-chain wallet integration and real-time blockchain interactions.

### Core Features
- 🔐 **Multi-Chain Wallet Authentication** via Reown AppKit
- 🌳 **NFT Tree Minting** - Each tree is a unique NFT with metadata
- 🌍 **Carbon Offset Tracking** - Track environmental impact on-chain
- 🏆 **Leaderboard System** - Compete globally for most trees planted
- 💧 **Tree Watering Mechanism** - Interactive engagement system
- 📊 **Analytics Dashboard** - Personal and global statistics
- 🎨 **Procedural Tree Generation** - Unique SVG trees with variations
- 🌐 **Multi-Chain Support** - Ethereum, Polygon, Arbitrum, Base
- 💰 **Token Integration** - Native token for tree planting
- 🎁 **Achievement System** - Unlock badges and rewards

---

## Technology Stack

### Frontend
- **Framework**: Vanilla HTML/CSS/JavaScript (or Next.js for advanced features)
- **Styling**: Modern CSS with glassmorphism and animations
- **Package Manager**: Bun

### Web3 Integration
- **WalletConnect**: Reown AppKit SDK
- **Blockchain Libraries**: ethers.js / viem
- **Chains**: Ethereum, Polygon, Arbitrum, Base
- **Smart Contracts**: Solidity (ERC-721 for NFTs, custom logic)

### Backend (Optional)
- **API**: Node.js/Bun server for metadata and analytics
- **Database**: PostgreSQL or MongoDB for leaderboard
- **IPFS**: For decentralized NFT metadata storage

---

## 15-Commit Implementation Plan

### Phase 1: Foundation & Setup (Commits 1-3)

#### **Commit 1: Project Initialization & Configuration**
- Initialize project with Bun
- Set up project structure (src/, public/, contracts/, etc.)
- Create package.json with all dependencies
- Add .gitignore, README.md, and LICENSE
- Configure ESLint and Prettier
- Set up environment variables template (.env.example)

**Files Created:**
- `package.json`
- `bun.lockb`
- `.gitignore`
- `README.md`
- `.env.example`
- `eslint.config.js`
- Directory structure

---

#### **Commit 2: Reown AppKit Integration & Wallet Connection**
- Install Reown AppKit SDK packages
- Create WalletConnect configuration
- Implement wallet connection UI component
- Add multi-chain support (Ethereum, Polygon, Arbitrum, Base)
- Create wallet state management
- Add connect/disconnect functionality
- Implement network switching

**Files Created/Modified:**
- `src/config/walletConfig.js` - WalletConnect configuration
- `src/components/WalletConnect.js` - Connection component
- `src/utils/walletState.js` - State management
- `index.html` - Add wallet connect button

---

#### **Commit 3: Design System & Core UI Components**
- Create CSS design system with variables
- Implement glassmorphism and gradient styles
- Build navigation component
- Create footer with social links
- Add responsive layout system
- Implement dark mode toggle
- Create loading and error states

**Files Created:**
- `src/styles/design-system.css` - CSS variables and tokens
- `src/styles/components.css` - Reusable components
- `src/components/Navigation.js`
- `src/components/Footer.js`
- `src/components/LoadingSpinner.js`

---

### Phase 2: Smart Contracts & Blockchain (Commits 4-6)

#### **Commit 4: Smart Contract Development - Tree NFT**
- Create ERC-721 contract for Tree NFTs
- Implement minting logic with metadata
- Add tree attributes (species, age, carbon offset)
- Create tree watering mechanism
- Add ownership and transfer functions
- Write contract tests
- Add deployment scripts

**Files Created:**
- `contracts/ChainTree.sol` - Main NFT contract
- `contracts/TreeMetadata.sol` - Metadata library
- `test/ChainTree.test.js` - Contract tests
- `scripts/deploy.js` - Deployment script
- `hardhat.config.js` - Hardhat configuration

---

#### **Commit 5: Smart Contract - Token & Rewards System**
- Create ERC-20 token contract (TREE token)
- Implement staking mechanism
- Add reward distribution logic
- Create achievement/badge system
- Implement carbon credit tracking
- Write comprehensive tests
- Add token deployment scripts

**Files Created:**
- `contracts/TreeToken.sol` - ERC-20 token
- `contracts/RewardSystem.sol` - Rewards logic
- `contracts/Achievements.sol` - Badge system
- `test/TokenSystem.test.js`
- `scripts/deployToken.js`

---

#### **Commit 6: Contract Deployment & Verification**
- Deploy contracts to testnets (Sepolia, Mumbai, etc.)
- Verify contracts on block explorers
- Create contract interaction utilities
- Add contract ABIs to frontend
- Implement contract event listeners
- Create transaction helper functions
- Add gas optimization utilities

**Files Created:**
- `src/contracts/abis/` - Contract ABIs
- `src/utils/contractInteraction.js` - Contract helpers
- `src/utils/eventListeners.js` - Event handling
- `deployments/` - Deployment addresses
- `DEPLOYMENT.md` - Deployment documentation

---

### Phase 3: Core Features (Commits 7-10)

#### **Commit 7: Tree Minting Interface**
- Create tree minting page/modal
- Implement species selection UI
- Add minting transaction flow
- Create transaction status notifications
- Implement error handling
- Add minting animation
- Create success confirmation screen

**Files Created:**
- `src/pages/MintTree.js` - Minting interface
- `src/components/SpeciesSelector.js`
- `src/components/TransactionStatus.js`
- `src/utils/mintingLogic.js`
- `src/styles/minting.css`

---

#### **Commit 8: Procedural Tree SVG Generator**
- Create SVG tree generation algorithm
- Implement 50+ tree variations
- Add seasonal variations (spring, summer, fall, winter)
- Create tree growth stages
- Add randomization with seed-based generation
- Implement tree preview system
- Optimize SVG output

**Files Created:**
- `src/generators/TreeGenerator.js` - Main generator
- `src/generators/TreeVariations.js` - Variation logic
- `src/generators/SeasonalThemes.js`
- `src/utils/svgOptimizer.js`
- `src/components/TreePreview.js`

---

#### **Commit 9: User Dashboard & Tree Gallery**
- Create user dashboard page
- Implement tree gallery/collection view
- Add individual tree detail view
- Display tree statistics and metadata
- Create tree watering interface
- Add tree growth visualization
- Implement filtering and sorting

**Files Created:**
- `src/pages/Dashboard.js`
- `src/components/TreeGallery.js`
- `src/components/TreeCard.js`
- `src/components/TreeDetail.js`
- `src/components/WateringInterface.js`
- `src/styles/dashboard.css`

---

#### **Commit 10: Leaderboard & Global Statistics**
- Create leaderboard page
- Implement ranking system
- Add global statistics dashboard
- Create user profile cards
- Implement real-time updates
- Add filtering by chain/timeframe
- Create achievement showcase

**Files Created:**
- `src/pages/Leaderboard.js`
- `src/components/RankingTable.js`
- `src/components/GlobalStats.js`
- `src/components/UserProfile.js`
- `src/utils/leaderboardData.js`
- `src/styles/leaderboard.css`

---

### Phase 4: Advanced Features (Commits 11-13)

#### **Commit 11: IPFS Integration & Metadata Storage**
- Set up IPFS/Pinata integration
- Create metadata upload system
- Implement decentralized storage for tree images
- Add metadata retrieval functions
- Create backup storage system
- Implement caching layer
- Add IPFS gateway configuration

**Files Created:**
- `src/services/ipfsService.js`
- `src/utils/metadataUploader.js`
- `src/utils/ipfsCache.js`
- `src/config/ipfsConfig.js`

---

#### **Commit 12: Analytics & Carbon Offset Tracking**
- Create analytics dashboard
- Implement carbon offset calculator
- Add environmental impact visualization
- Create charts and graphs (Chart.js)
- Implement historical data tracking
- Add export functionality
- Create impact reports

**Files Created:**
- `src/pages/Analytics.js`
- `src/components/CarbonCalculator.js`
- `src/components/ImpactCharts.js`
- `src/utils/analyticsEngine.js`
- `src/utils/carbonMetrics.js`
- `src/styles/analytics.css`

---

#### **Commit 13: Social Features & Sharing**
- Implement tree sharing functionality
- Add social media integration
- Create shareable tree cards
- Implement referral system
- Add community feed
- Create tree gifting feature
- Add social notifications

**Files Created:**
- `src/components/ShareModal.js`
- `src/components/SocialFeed.js`
- `src/components/ReferralSystem.js`
- `src/utils/socialSharing.js`
- `src/services/notificationService.js`
- `src/styles/social.css`

---

### Phase 5: Polish & Launch (Commits 14-15)

#### **Commit 14: Testing, Optimization & Bug Fixes**
- Write comprehensive unit tests
- Add integration tests
- Implement E2E testing
- Optimize bundle size
- Add performance monitoring
- Fix all known bugs
- Improve error handling
- Add loading states everywhere

**Files Created:**
- `tests/unit/` - Unit tests
- `tests/integration/` - Integration tests
- `tests/e2e/` - E2E tests
- `src/utils/errorBoundary.js`
- `src/utils/performanceMonitor.js`

---

#### **Commit 15: Documentation, Deployment & Launch Prep**
- Write comprehensive README
- Create user guide
- Add developer documentation
- Create API documentation
- Set up CI/CD pipeline
- Deploy to production
- Add monitoring and analytics
- Create launch announcement materials

**Files Created:**
- `README.md` (comprehensive update)
- `docs/USER_GUIDE.md`
- `docs/DEVELOPER_GUIDE.md`
- `docs/API.md`
- `.github/workflows/ci.yml`
- `CONTRIBUTING.md`
- `CHANGELOG.md`

---

## Development Workflow

### Setup Commands (Using Bun)
```bash
# Clone repository
git clone https://github.com/CasmanKaido/ChainTrees.git
cd ChainTrees

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your WalletConnect Project ID and other configs

# Run development server
bun run dev

# Run tests
bun test

# Build for production
bun run build

# Deploy contracts
bun run deploy:contracts
```

### Environment Variables Required
```env
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
VITE_INFURA_KEY=your_infura_key
VITE_ALCHEMY_KEY=your_alchemy_key
VITE_PINATA_API_KEY=your_pinata_key
VITE_PINATA_SECRET=your_pinata_secret
```

---

## Key Dependencies

```json
{
  "dependencies": {
    "@reown/appkit": "^1.0.0",
    "@reown/appkit-adapter-wagmi": "^1.0.0",
    "wagmi": "^2.0.0",
    "viem": "^2.0.0",
    "ethers": "^6.0.0",
    "@tanstack/react-query": "^5.0.0",
    "ipfs-http-client": "^60.0.0",
    "chart.js": "^4.0.0"
  },
  "devDependencies": {
    "hardhat": "^2.19.0",
    "@nomicfoundation/hardhat-toolbox": "^4.0.0",
    "vitest": "^1.0.0",
    "@playwright/test": "^1.40.0"
  }
}
```

---

## Success Metrics

- ✅ All 15 commits completed with meaningful changes
- ✅ Full WalletConnect integration across 4+ chains
- ✅ Smart contracts deployed and verified
- ✅ 50+ unique tree variations generated
- ✅ Comprehensive test coverage (>80%)
- ✅ Production-ready deployment
- ✅ Complete documentation

---

## Future Enhancements (Post-Launch)

- Mobile app (React Native)
- Real-world tree planting partnerships
- DAO governance for fund allocation
- Cross-chain bridging
- Marketplace for trading trees
- Augmented reality tree viewing
- Integration with carbon credit registries

---

## Resources

- [Reown Documentation](https://docs.reown.com/)
- [WalletConnect AppKit](https://docs.reown.com/appkit/overview)
- [Wagmi Documentation](https://wagmi.sh/)
- [Hardhat Documentation](https://hardhat.org/)
- [IPFS Documentation](https://docs.ipfs.tech/)

---

**Let's build something amazing! 🌳🚀**
