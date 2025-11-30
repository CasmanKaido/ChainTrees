# 🚨 MAINNET DEPLOYMENT CHECKLIST

## ⚠️ CRITICAL WARNING

**Deploying to mainnet involves REAL MONEY and IRREVERSIBLE transactions.**

Before proceeding, ensure you have:
- ✅ Thoroughly tested on testnet
- ✅ Sufficient ETH/MATIC for deployment gas fees
- ✅ Smart contract audit completed (HIGHLY RECOMMENDED)
- ✅ Security review passed
- ✅ All team members approve deployment

---

## 📋 Pre-Deployment Checklist

### 1. Smart Contract Audit
- [ ] **CRITICAL**: Get professional smart contract audit
  - Recommended: OpenZeppelin, CertiK, Trail of Bits, Quantstamp
  - Cost: $5,000 - $50,000+ depending on complexity
  - Timeline: 2-4 weeks
- [ ] Fix all critical and high-severity issues
- [ ] Address medium and low-severity issues
- [ ] Document audit results

### 2. Testing Verification
- [ ] All contract tests pass (100% coverage)
- [ ] Deployed and tested on testnet (Sepolia/Mumbai)
- [ ] Frontend tested with testnet contracts
- [ ] All features work end-to-end
- [ ] Gas optimization completed
- [ ] No console errors in production build
- [ ] Cross-browser testing completed
- [ ] Mobile testing completed

### 3. Security Review
- [ ] No private keys in code
- [ ] Environment variables properly configured
- [ ] Access control properly implemented
- [ ] Reentrancy guards in place
- [ ] Integer overflow/underflow protection
- [ ] Front-running protection considered
- [ ] Emergency pause mechanism (if applicable)
- [ ] Upgrade mechanism reviewed (if applicable)

### 4. Financial Preparation
- [ ] Deployment wallet funded with sufficient ETH/MATIC
  - Ethereum Mainnet: ~0.5-1 ETH recommended
  - Polygon Mainnet: ~50-100 MATIC recommended
  - Base Mainnet: ~0.1-0.2 ETH recommended
- [ ] Gas price strategy determined
- [ ] Backup funds available for verification
- [ ] Multi-sig wallet setup (recommended for production)

### 5. Documentation
- [ ] README updated with mainnet addresses
- [ ] API documentation complete
- [ ] User guide created
- [ ] Terms of service prepared
- [ ] Privacy policy prepared
- [ ] Disclaimer added

### 6. Infrastructure
- [ ] Production RPC endpoints configured
- [ ] IPFS/Pinata production plan ready
- [ ] Monitoring tools setup (Tenderly, Defender)
- [ ] Error tracking configured (Sentry)
- [ ] Analytics configured
- [ ] Backup systems in place

### 7. Legal & Compliance
- [ ] Legal review completed
- [ ] Regulatory compliance checked
- [ ] Token classification reviewed
- [ ] Tax implications understood
- [ ] Insurance considered

### 8. Team Readiness
- [ ] Deployment team identified
- [ ] Communication plan established
- [ ] Rollback plan prepared
- [ ] Post-deployment monitoring plan
- [ ] Customer support ready

---

## 💰 Estimated Deployment Costs

### Ethereum Mainnet
- ChainTree NFT: ~0.15-0.25 ETH ($300-$500)
- TreeToken: ~0.08-0.12 ETH ($160-$240)
- RewardSystem: ~0.12-0.18 ETH ($240-$360)
- Achievements: ~0.10-0.15 ETH ($200-$300)
- Verification: ~0.02 ETH per contract ($40 each)
- **Total: ~0.5-0.75 ETH ($1,000-$1,500)**

### Polygon Mainnet (Cheaper Alternative)
- All contracts: ~20-50 MATIC ($15-$40)
- Verification: Minimal
- **Total: ~50-100 MATIC ($40-$80)**

### Base Mainnet (L2 - Recommended for Launch)
- All contracts: ~0.05-0.1 ETH ($100-$200)
- Lower fees, faster transactions
- **Total: ~0.1-0.15 ETH ($200-$300)**

---

## 🚀 Deployment Process

### Step 1: Final Testing
```bash
# Run all tests
npm run test:contracts

# Build production frontend
npm run build

# Test production build
npm run preview
```

### Step 2: Prepare Environment
Create `.env.production`:
```env
# Mainnet RPC Endpoints
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
POLYGON_RPC_URL=https://polygon-mainnet.infura.io/v3/YOUR_KEY
BASE_RPC_URL=https://mainnet.base.org

# Deployment Wallet (KEEP SECURE!)
PRIVATE_KEY=your_private_key_here

# Etherscan API Keys
ETHERSCAN_API_KEY=your_etherscan_key
POLYGONSCAN_API_KEY=your_polygonscan_key
BASESCAN_API_KEY=your_basescan_key

# Production Settings
NODE_ENV=production
```

### Step 3: Deploy Contracts

**Option A: Ethereum Mainnet**
```bash
npm run deploy:mainnet
```

**Option B: Polygon Mainnet (Recommended for lower costs)**
```bash
npm run deploy:polygon
```

**Option C: Base Mainnet (Recommended for L2 benefits)**
```bash
npm run deploy:base
```

### Step 4: Verify Contracts
```bash
# Ethereum
npm run verify:mainnet

# Polygon
npm run verify:polygon

# Base
npm run verify:base
```

### Step 5: Update Frontend
1. Update contract addresses in `src/contracts/addresses.json`
2. Update network configuration
3. Rebuild: `npm run build`
4. Deploy to Vercel: `vercel --prod`

### Step 6: Post-Deployment Verification
- [ ] All contracts verified on block explorer
- [ ] Contract ownership transferred to multi-sig (if applicable)
- [ ] Minter roles granted correctly
- [ ] Test minting on mainnet (small amount)
- [ ] Test staking on mainnet
- [ ] Test rewards claiming
- [ ] Monitor gas usage
- [ ] Check for any errors

---

## 🔒 Security Best Practices

### 1. Private Key Management
- ✅ Use hardware wallet for deployment
- ✅ Never commit private keys to git
- ✅ Use environment variables
- ✅ Consider using a deployment service (Defender, Tenderly)

### 2. Multi-Signature Wallet
- ✅ Transfer contract ownership to multi-sig
- ✅ Require 2-of-3 or 3-of-5 signatures
- ✅ Use Gnosis Safe or similar

### 3. Emergency Procedures
- ✅ Pause mechanism (if implemented)
- ✅ Emergency contact list
- ✅ Incident response plan
- ✅ Bug bounty program (consider)

---

## 📊 Monitoring & Maintenance

### Tools to Setup
1. **Tenderly** - Transaction monitoring and alerting
2. **Defender** - Security monitoring and automation
3. **Dune Analytics** - On-chain analytics dashboard
4. **Sentry** - Frontend error tracking
5. **Google Analytics** - User behavior tracking

### Metrics to Monitor
- Transaction success rate
- Gas usage trends
- User adoption rate
- TVL (Total Value Locked)
- Active users
- Error rates

---

## 🚨 Emergency Contacts

Prepare a list of:
- [ ] Smart contract auditor contact
- [ ] Blockchain security expert
- [ ] Legal counsel
- [ ] Community manager
- [ ] Technical support team

---

## ⚠️ FINAL WARNING

**DO NOT DEPLOY TO MAINNET UNLESS:**
1. ✅ Smart contracts have been professionally audited
2. ✅ All tests pass with 100% coverage
3. ✅ Thoroughly tested on testnet for at least 1 week
4. ✅ Security review completed
5. ✅ Team is ready for 24/7 monitoring
6. ✅ Legal compliance verified
7. ✅ Sufficient funds for deployment and operations
8. ✅ Rollback/emergency plan in place

**Recommended Approach:**
1. Deploy to testnet first (Sepolia, Mumbai, Base Sepolia)
2. Run for 2-4 weeks with real users
3. Get smart contract audit
4. Fix all issues
5. Deploy to L2 mainnet first (Polygon or Base)
6. Monitor for 1-2 weeks
7. Then consider Ethereum mainnet if needed

---

## 📞 Need Help?

**Before deploying to mainnet, consider:**
- Hiring a blockchain consultant
- Getting a professional audit
- Joining a Web3 accelerator
- Consulting with experienced DeFi developers

**This is a serious step. Take your time and do it right! 🌳**

---

**Are you absolutely sure you want to proceed with mainnet deployment?**

If yes, continue to the deployment scripts below.
If no, deploy to testnet first for thorough testing.
