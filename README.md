# 🌳 ChainTrees

**Plant Trees On-Chain. Track Real-World Impact.**

ChainTrees is a decentralized application (dApp) that bridges the gap between digital collectibles and real-world reforestation. Mint unique tree NFTs, and we plant real trees in partnership with global reforestation organizations.

![ChainTrees Banner](/public/images/og-image.png)

## 🚀 Features

- **Mint & Plant**: Every NFT minted corresponds to a real tree planted.
- **Dynamic Growth**: Your NFT evolves as your real tree grows.
- **Impact Tracking**: Real-time dashboard showing CO2 offset and trees planted.
- **Marketplace**: Buy, sell, and trade tree NFTs with other eco-conscious collectors.
- **Governance**: DAO members vote on where to plant the next forest.
- **Gamification**: Earn badges, climb the leaderboard, and unlock rewards.

## 🛠️ Tech Stack

- **Frontend**: Vanilla JS (ES6+), Vite, Chart.js
- **Blockchain**: Ethereum / Polygon (Hardhat, Wagmi, Viem)
- **Storage**: IPFS (NFT Metadata)
- **Styling**: CSS3 (Variables, Flexbox, Grid), Animate.css
- **Testing**: Vitest, JSDOM
- **CI/CD**: GitHub Actions

## 📦 Getting Started

### Prerequisites

- Node.js v18+
- npm v9+
- MetaMask or WalletConnect compatible wallet

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CasmanKaido/ChainTrees.git
   cd ChainTrees
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env.example` to `.env` and fill in your keys:
   ```bash
   cp .env.example .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Run tests**
   ```bash
   npm test
   ```

## 🏗️ Architecture

The project follows a modular architecture:

- `src/components/`: Reusable UI components (e.g., `WalletConnect`, `TreeCard`).
- `src/pages/`: Page logic and layout (e.g., `MintPage`, `Dashboard`).
- `src/utils/`: Helper functions (e.g., `seo.js`, `performanceMonitor.js`).
- `src/styles/`: CSS modules and global styles.
- `contracts/`: Solidity smart contracts.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

Project Link: [https://github.com/CasmanKaido/ChainTrees](https://github.com/CasmanKaido/ChainTrees)
