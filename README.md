# ChainTrees - Project Summary

## 🌳 What is ChainTrees?

ChainTrees is a **Web3 environmental impact platform** that gamifies reforestation by allowing users to:
- 🌱 Mint unique tree NFTs on multiple blockchains
- 📊 Track their carbon offset contributions
- 🏆 Compete on global leaderboards
- 💧 Interact with their trees through watering mechanics
- 🎨 Own procedurally generated, unique tree artwork

---

## 🎯 Why ChainTrees?

### Problem
- Climate change requires immediate action
- Traditional carbon offset programs lack transparency
- Web3 adoption needs compelling use cases
- Environmental initiatives need better engagement

### Solution
ChainTrees combines blockchain transparency with environmental impact, creating an engaging platform where users can:
- Make a real difference through verified carbon offsets
- Own their environmental contribution as NFTs
- Participate in a global community
- Track their impact with on-chain data

---

## 🏗️ Technical Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Landing    │  │   Dashboard  │  │  Leaderboard │          │
│  │     Page     │  │   & Gallery  │  │  & Analytics │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │     Mint     │  │    Social    │  │   Settings   │          │
│  │     Tree     │  │   Features   │  │   & Profile  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    WALLETCONNECT (REOWN SDK)                     │
│  • Multi-chain support (Ethereum, Polygon, Arbitrum, Base)      │
│  • 600+ wallet compatibility                                    │
│  • Email & social login options                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                      BLOCKCHAIN LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Ethereum   │  │   Polygon    │  │   Arbitrum   │          │
│  │   Mainnet    │  │   Mainnet    │  │     One      │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────┐                                               │
│  │     Base     │                                               │
│  │   Mainnet    │                                               │
│  └──────────────┘                                               │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                      SMART CONTRACTS                             │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  ChainTree.sol (ERC-721)                               │    │
│  │  • Mint tree NFTs with metadata                        │    │
│  │  • Track tree attributes (species, age, carbon)        │    │
│  │  • Watering mechanism                                  │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  TreeToken.sol (ERC-20)                                │    │
│  │  • Native TREE token                                   │    │
│  │  • Used for minting and rewards                        │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  RewardSystem.sol                                      │    │
│  │  • Staking mechanism                                   │    │
│  │  • Reward distribution                                 │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Achievements.sol                                      │    │
│  │  • Badge system                                        │    │
│  │  • Milestone tracking                                  │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    DECENTRALIZED STORAGE                         │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  IPFS (via Pinata)                                     │    │
│  │  • NFT metadata storage                                │    │
│  │  • Tree SVG images                                     │    │
│  │  • Immutable data                                      │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Core Features

### 1. **Multi-Chain Wallet Connection** 🔐
- Seamless connection via WalletConnect (Reown SDK)
- Support for 600+ wallets
- Multi-chain support (Ethereum, Polygon, Arbitrum, Base)
- Email & social login options
- Network switching

### 2. **Tree NFT Minting** 🌱
- Mint unique tree NFTs
- Choose from multiple species (Oak, Maple, Pine, etc.)
- Each tree has unique attributes
- Procedurally generated SVG artwork
- Metadata stored on IPFS

### 3. **Procedural Tree Generation** 🎨
- 50+ unique tree variations
- Seasonal themes (Spring, Summer, Fall, Winter)
- Growth stages (Sapling → Ancient)
- Seed-based randomization
- Optimized SVG output

### 4. **User Dashboard** 📊
- View your tree collection
- Tree gallery with filtering/sorting
- Individual tree details
- Growth visualization
- Watering interface

### 5. **Carbon Offset Tracking** 🌍
- Calculate CO2 offset per tree
- Track total environmental impact
- Historical data visualization
- Interactive charts and graphs
- Export impact reports

### 6. **Leaderboard System** 🏆
- Global rankings
- Filter by chain and timeframe
- User profiles
- Achievement showcase
- Real-time updates

### 7. **Social Features** 🤝
- Share trees on social media
- Referral system
- Community feed
- Tree gifting
- Social notifications

### 8. **Token Economy** 💰
- TREE token (ERC-20)
- Staking mechanism
- Reward distribution
- Achievement badges
- Carbon credits

---

## 🛠️ Technology Stack

| Category | Technology |
|----------|-----------|
| **Runtime** | Bun |
| **Frontend** | Vanilla JS / HTML / CSS |
| **Styling** | Modern CSS with Glassmorphism |
| **Web3** | Reown AppKit, Wagmi, Viem |
| **Smart Contracts** | Solidity, Hardhat, OpenZeppelin |
| **Storage** | IPFS (Pinata) |
| **Chains** | Ethereum, Polygon, Arbitrum, Base |
| **Testing** | Vitest, Playwright |
| **Deployment** | Vercel/Netlify |
| **CI/CD** | GitHub Actions |

---


## 🚀 Getting Started

### Quick Setup
```bash
# 1. Clone repository
git clone https://github.com/CasmanKaido/ChainTrees.git
cd ChainTrees

# 2. Install dependencies with Bun
bun install

# 3. Set up environment
cp .env.example .env
# Add your WalletConnect Project ID and API keys

# 4. Run development server
bun run dev

# 5. Open browser
# http://localhost:3000
```

### Required API Keys
1. **WalletConnect Project ID** - [Get from Reown Cloud](https://cloud.reown.com)
2. **Infura/Alchemy API Key** - For RPC endpoints
3. **Pinata API Key** - For IPFS storage
4. **Etherscan API Key** - For contract verification

---



## 🌟 Future Enhancements

### Version 2.0
- 📱 Mobile app (React Native)
- 🌲 Real-world tree planting partnerships
- 🗳️ DAO governance
- 🌉 Cross-chain bridging
- 🛒 NFT marketplace

### Version 3.0
- 📱 AR tree viewing
- 🌍 Carbon credit registry integration
- 🏢 Corporate partnerships
- 📚 Educational platform

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

---

## 📞 Support & Community

- **GitHub**: [github.com/CasmanKaido/ChainTrees](https://github.com/CasmanKaido/ChainTrees)
- **Documentation**: Coming soon
- **Discord**: Coming soon
- **Twitter**: Coming soon

---

## 🎯 Key Differentiators

| Feature | ChainTrees | Traditional Carbon Offset |
|---------|-----------|---------------------------|
| **Transparency** | ✅ On-chain verification | ❌ Opaque processes |
| **Ownership** | ✅ NFT ownership | ❌ No proof of contribution |
| **Engagement** | ✅ Gamified experience | ❌ One-time donation |
| **Community** | ✅ Global leaderboard | ❌ Individual action |
| **Verification** | ✅ Blockchain immutability | ❌ Trust-based |
| **Rewards** | ✅ Token rewards | ❌ No incentives |

---

## 💡 Innovation Highlights

1. **First-of-its-kind**: Gamified environmental impact on blockchain
2. **Multi-chain**: Support for 4+ major chains
3. **Procedural Art**: Unique SVG generation for each tree
4. **Social Impact**: Real-world environmental partnerships
5. **Token Economy**: Sustainable reward system
6. **Community-Driven**: DAO governance (future)

---

## 🔒 Security

- ✅ Smart contract audits (planned)
- ✅ OpenZeppelin battle-tested contracts
- ✅ Secure key management
- ✅ Input validation
- ✅ Rate limiting
- ✅ Regular security updates

---

## 📈 Roadmap

| Quarter | Milestone |
|---------|-----------|
| **Q1 2025** | Launch on testnets, community building |
| **Q2 2025** | Mainnet launch, first 1,000 trees |
| **Q3 2025** | Real-world partnerships, mobile app |
| **Q4 2025** | DAO governance, marketplace launch |

---

**Let's make a difference, one tree at a time! 🌳💚**


---

**Built with 💚 for the planet by the ChainTrees team**
