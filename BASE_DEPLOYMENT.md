# 🚀 Base Deployment - Quick Start (Bun/Node Compatible)

## ✅ Deployment Commands for Your Setup

Since you're using Bun, here are the **correct commands**:

---

## 📋 Step-by-Step Deployment to Base

### Step 1: Compile Contracts

```powershell
# Navigate to contracts folder
cd contracts

# Compile using npx (works without npm installed)
npx hardhat compile

# Go back to root
cd ..
```

### Step 2: Run Tests

```powershell
cd contracts
npx hardhat test
cd ..
```

### Step 3: Deploy to Base Sepolia (Testnet)

```powershell
cd contracts
npx hardhat run scripts/deployAll.js --network baseSepolia
cd ..
```

### Step 4: Deploy to Base Mainnet (Production)

```powershell
cd contracts
npx hardhat run scripts/deployAll.js --network base
cd ..
```

### Step 5: Verify Contracts

```powershell
cd contracts

# Verify each contract (replace addresses with your deployed addresses)
npx hardhat verify --network base YOUR_CHAINTREE_ADDRESS
npx hardhat verify --network base YOUR_TREETOKEN_ADDRESS
npx hardhat verify --network base YOUR_REWARDSYSTEM_ADDRESS YOUR_CHAINTREE_ADDRESS YOUR_TREETOKEN_ADDRESS
npx hardhat verify --network base YOUR_ACHIEVEMENTS_ADDRESS

cd ..
```

---

## 🔧 Alternative: Using Node Directly

If npx doesn't work, use node directly:

```powershell
cd contracts
node node_modules/hardhat/internal/cli/cli.js compile
node node_modules/hardhat/internal/cli/cli.js test
node node_modules/hardhat/internal/cli/cli.js run scripts/deployAll.js --network baseSepolia
cd ..
```

---

## 📝 Pre-Deployment Checklist

Before running deployment:

### 1. Check Your .env File

Make sure `contracts/.env` or root `.env` has:

```env
PRIVATE_KEY=your_wallet_private_key_here
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASE_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=your_basescan_api_key_optional
```

### 2. Get Test ETH (for Base Sepolia)

- **Coinbase Faucet**: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
- **Bridge from Sepolia**: https://bridge.base.org/

### 3. Check Wallet Balance

Make sure your deployment wallet has:
- **Base Sepolia**: 0.1 test ETH (free from faucet)
- **Base Mainnet**: 0.2 ETH (~$400-600)

---

## 🎯 Recommended Deployment Path

### Option A: Base Sepolia (Testnet) - START HERE ✅

**Cost**: FREE  
**Command**:
```powershell
cd contracts
npx hardhat run scripts/deployAll.js --network baseSepolia
```

### Option B: Base Mainnet (Production) - AFTER TESTING

**Cost**: ~$150-200  
**Command**:
```powershell
cd contracts
npx hardhat run scripts/deployAll.js --network base
```

---

## 🐛 Troubleshooting

### "npx not found"
Install Node.js from https://nodejs.org/

### "Network not found"
Check `contracts/hardhat.config.cjs` has Base networks configured

### "Insufficient funds"
Get more ETH:
- Testnet: Use faucet
- Mainnet: Bridge from Ethereum at https://bridge.base.org/

### "Private key error"
Make sure `.env` file has `PRIVATE_KEY=0x...` (with 0x prefix)

---

## ✅ What Happens During Deployment?

You'll see:
```
🌳 ChainTrees Deployment Starting...

📍 Network: baseSepolia
👤 Deployer: 0x...
💰 Balance: 0.1 ETH

1️⃣  Deploying ChainTree NFT...
   ✅ ChainTree deployed to: 0x...

2️⃣  Deploying TreeToken...
   ✅ TreeToken deployed to: 0x...

3️⃣  Deploying RewardSystem...
   ✅ RewardSystem deployed to: 0x...

4️⃣  Deploying Achievements...
   ✅ Achievements deployed to: 0x...

5️⃣  Setting up permissions...
   ✅ Granted MINTER_ROLE to RewardSystem

6️⃣  Saving deployment info...
   ✅ Saved to: deployments/baseSepolia.json
   ✅ Saved ABIs to src/contracts/abis/
   ✅ Saved addresses to src/contracts/addresses.json

✅ Deployment Complete!
```

---

## 📁 After Deployment

Your contract addresses will be saved in:
- `contracts/deployments/baseSepolia.json` (or `base.json`)
- `src/contracts/addresses.json`
- `src/contracts/abis/` (ABIs for frontend)

---

## 🚀 Ready to Deploy?

**For Base Sepolia (Testnet)**:
```powershell
cd contracts
npx hardhat run scripts/deployAll.js --network baseSepolia
```

**For Base Mainnet (Production)**:
```powershell
cd contracts
npx hardhat run scripts/deployAll.js --network base
```

---

**Which network do you want to deploy to?**

1. **Base Sepolia** (testnet - free, safe) ✅ RECOMMENDED
2. **Base Mainnet** (production - costs $150-200)

Let me know and I'll help you through it! 🌳
