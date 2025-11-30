# ChainTrees Testing Guide

## 🧪 Testing Strategy

This guide covers end-to-end testing of the ChainTrees application.

## Prerequisites

- ✅ Wallet installed (MetaMask recommended)
- ✅ Test ETH on desired network
- ✅ WalletConnect Project ID configured
- ✅ Pinata API keys configured (for IPFS)

## Test Networks

### Recommended Testnets
- **Sepolia** (Ethereum testnet)
- **Mumbai** (Polygon testnet)
- **Base Sepolia** (Base testnet)

Get test ETH from faucets:
- Sepolia: https://sepoliafaucet.com/
- Mumbai: https://faucet.polygon.technology/
- Base Sepolia: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

## Testing Checklist

### 1. Smart Contract Tests

```bash
# Run all contract tests
npm run test:contracts

# Run with coverage
npm run test:coverage
```

**Expected Results:**
- ✅ All ChainTree tests pass (minting, watering, growth)
- ✅ All TokenSystem tests pass (staking, rewards, achievements)
- ✅ 100% contract coverage

### 2. Contract Deployment

```bash
# Deploy to testnet (e.g., Sepolia)
npm run deploy:sepolia

# Verify contracts
npm run verify:sepolia
```

**Expected Results:**
- ✅ All 4 contracts deployed successfully
- ✅ Deployment info saved to `contracts/deployments/sepolia.json`
- ✅ ABIs exported to `src/contracts/abis/`
- ✅ Addresses saved to `src/contracts/addresses.json`

### 3. Frontend Development Server

```bash
# Start dev server
npm run dev
```

**Expected Results:**
- ✅ Server starts on http://localhost:5173
- ✅ No console errors
- ✅ All pages load correctly

### 4. Wallet Connection

**Steps:**
1. Open app in browser
2. Click "Connect Wallet" button
3. Select wallet provider
4. Approve connection

**Expected Results:**
- ✅ Wallet connects successfully
- ✅ Address displayed in header
- ✅ Balance shown
- ✅ Network displayed correctly

### 5. Tree Minting

**Steps:**
1. Navigate to "Plant" page
2. Select a tree species (e.g., Oak)
3. Click "Mint Tree"
4. Approve transaction in wallet
5. Wait for confirmation

**Expected Results:**
- ✅ Transaction modal appears
- ✅ Transaction succeeds
- ✅ Success message shown
- ✅ Tree appears in "My Forest"

### 6. Tree Watering

**Steps:**
1. Navigate to "My Forest"
2. Find a tree card
3. Click "💧 Water Tree"
4. Approve transaction
5. Wait for confirmation

**Expected Results:**
- ✅ Transaction succeeds
- ✅ Water count increments
- ✅ Cooldown timer appears (24h)
- ✅ Growth progress updates
- ✅ Tree visual may change (if stage threshold reached)

### 7. Tree Growth Stages

**Test Progression:**
- Water tree 5 times → Should reach Sapling (Stage 1)
- Water tree 10 more times → Should reach Mature (Stage 2)
- Water tree 15 more times → Should reach Ancient (Stage 3)

**Expected Results:**
- ✅ Stage badge updates
- ✅ Tree SVG changes visually (size, branches, leaves)
- ✅ Ancient trees show sparkle effects ✨
- ✅ Progress bar shows 100% when fully grown

### 8. Staking & Rewards

**Steps:**
1. Navigate to "Rewards" page
2. Click "Stake" on a tree
3. Approve NFT transfer
4. Approve staking transaction
5. Wait for rewards to accumulate
6. Click "Claim Rewards"

**Expected Results:**
- ✅ Tree moves to "Staked" section
- ✅ Pending rewards shown
- ✅ TREE token balance increases after claim
- ✅ Can unstake tree

### 9. Achievements

**Steps:**
1. Navigate to "Badges" page
2. View achievement progress
3. Click "Mint Badge" on unlocked achievement
4. Approve transaction

**Expected Results:**
- ✅ Progress bar shows X/5 unlocked
- ✅ Locked badges are grayed out
- ✅ Unlocked badges are colorful
- ✅ Minting succeeds
- ✅ Badge marked as "Unlocked"

### 10. IPFS Metadata Upload

**Steps:**
1. Configure Pinata API keys in `.env`
2. Navigate to "IPFS" page
3. Click "Upload to IPFS" on a tree
4. Wait for upload
5. Click IPFS links to verify

**Expected Results:**
- ✅ Upload succeeds
- ✅ Metadata link works
- ✅ Image link shows SVG
- ✅ Metadata is ERC-721 compliant
- ✅ Batch upload works for multiple trees

### 11. Leaderboard

**Steps:**
1. Navigate to "Leaderboard" page
2. View global stats
3. Check ranking table

**Expected Results:**
- ✅ Total trees count shown
- ✅ Total CO2 offset shown
- ✅ Top planters listed (simulated for now)

### 12. Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

**Expected Results:**
- ✅ Build completes without errors
- ✅ All assets optimized
- ✅ Preview server works
- ✅ No console errors in production mode

## Common Issues & Solutions

### Issue: "Insufficient funds"
**Solution:** Get test ETH from faucet

### Issue: "User rejected transaction"
**Solution:** Approve transaction in wallet

### Issue: "Contract not deployed"
**Solution:** Run deployment script for your network

### Issue: "IPFS upload failed"
**Solution:** Check Pinata API keys in `.env`

### Issue: "Watering on cooldown"
**Solution:** Wait 24 hours or test with different tree

### Issue: "Network mismatch"
**Solution:** Switch wallet to correct network

## Performance Benchmarks

### Expected Load Times
- Initial page load: < 2s
- Tree rendering: < 100ms per tree
- Transaction confirmation: 5-30s (network dependent)
- IPFS upload: 2-10s per tree

### Gas Estimates (Sepolia)
- Mint Tree: ~150,000 gas
- Water Tree: ~80,000 gas
- Stake Tree: ~120,000 gas
- Claim Rewards: ~90,000 gas
- Mint Badge: ~100,000 gas

## Success Criteria

✅ **All contract tests pass**  
✅ **Deployment succeeds on testnet**  
✅ **All pages load without errors**  
✅ **Wallet connection works**  
✅ **Can mint, water, and grow trees**  
✅ **Staking and rewards functional**  
✅ **Achievements can be earned**  
✅ **IPFS uploads work**  
✅ **Production build succeeds**  

## Next Steps After Testing

1. **Mainnet Deployment** (if all tests pass)
2. **Smart Contract Audit** (recommended for production)
3. **User Acceptance Testing**
4. **Marketing & Launch**

---

**Happy Testing! 🧪🌳**
