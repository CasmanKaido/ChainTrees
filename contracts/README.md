# ChainTree Smart Contract

## Overview

The ChainTree contract is an ERC-721 NFT that represents planted trees on the blockchain. Each tree has unique attributes, growth stages, and tracks carbon offset contributions.

## Features

### Tree Attributes
- **Species**: 10 different tree species (Oak, Maple, Pine, Birch, Willow, Cherry, Redwood, Sequoia, Spruce, Cedar)
- **Growth Stages**: Sapling → Young → Mature → Ancient
- **Carbon Offset**: Tracks CO2 sequestration in grams
- **Watering Mechanism**: Interactive engagement system
- **Seasonal Themes**: Dynamic season assignment
- **Procedural Generation**: Unique seed for each tree

### Core Functions

#### Minting
```solidity
function mintTree(TreeSpecies species, string memory tokenURI) public payable returns (uint256)
```
- Mint a new tree NFT
- Assigns initial carbon offset based on species
- Generates unique seed for procedural generation
- Emits `TreeMinted` event

#### Watering
```solidity
function waterTree(uint256 tokenId) public
```
- Water a tree to promote growth
- Can only water once per 24 hours
- Increases water count
- Triggers growth check
- Emits `TreeWatered` event

#### Growth System
- **Sapling**: Initial stage
- **Young**: 30 days old + 10 waterings
- **Mature**: 60 days old + 20 waterings
- **Ancient**: 90 days old + 30 waterings

Each growth stage increases carbon offset.

### Carbon Offset Values

**Initial Offset (grams CO2/year)**:
- Oak: 22,000g
- Maple: 20,000g
- Pine: 18,000g
- Birch: 16,000g
- Willow: 19,000g
- Cherry: 17,000g
- Redwood: 35,000g
- Sequoia: 40,000g (highest)
- Spruce: 21,000g
- Cedar: 23,000g

**Growth Bonuses**:
- Young: +10,000g
- Mature: +20,000g
- Ancient: +30,000g

## Deployment

### Compile Contracts
```bash
npx hardhat compile
```

### Run Tests
```bash
npx hardhat test
```

### Deploy to Testnet
```bash
# Sepolia
npx hardhat run contracts/scripts/deploy.js --network sepolia

# Mumbai
npx hardhat run contracts/scripts/deploy.js --network mumbai

# Arbitrum Sepolia
npx hardhat run contracts/scripts/deploy.js --network arbitrumSepolia

# Base Sepolia
npx hardhat run contracts/scripts/deploy.js --network baseSepolia
```

### Verify Contract
```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

## Testing

The contract includes comprehensive tests covering:
- ✅ Deployment and initialization
- ✅ Tree minting with different species
- ✅ Watering mechanism and cooldown
- ✅ Growth stage progression
- ✅ Carbon offset calculations
- ✅ Owner functions (mint price, withdraw)
- ✅ Query functions (get trees by owner)

Run tests with coverage:
```bash
npx hardhat coverage
```

## Security Considerations

- ✅ Uses OpenZeppelin audited contracts
- ✅ Owner-only functions for admin operations
- ✅ Reentrancy protection via OpenZeppelin
- ✅ Input validation on all public functions
- ✅ Safe math operations (Solidity 0.8.20+)

## Gas Optimization

- Efficient storage packing
- Minimal storage writes
- Optimized loops in query functions
- Compiler optimization enabled (200 runs)

## Events

```solidity
event TreeMinted(address indexed owner, uint256 indexed tokenId, TreeSpecies species, uint256 carbonOffset);
event TreeWatered(uint256 indexed tokenId, address indexed waterer, uint256 waterCount);
event TreeGrown(uint256 indexed tokenId, GrowthStage newStage);
```

## License

MIT
