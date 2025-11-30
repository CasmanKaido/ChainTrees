# 🚀 ChainTrees Mainnet Deployment Guide (Remix)

## ⚠️ CRITICAL: Mainnet Deployment Checklist

Before proceeding, ensure you have:

- [ ] **Sufficient ETH on Base Mainnet** (~0.2-0.3 ETH for deployment)
- [ ] **MetaMask configured** with Base Mainnet network
- [ ] **Tested on Base Sepolia** (you already did this ✅)
- [ ] **Backed up your wallet** (seed phrase secure)
- [ ] **Double-checked all contract code**

### 💰 Estimated Costs (Base Mainnet)
- ChainTree: ~$40-60
- TreeToken: ~$20-30
- RewardSystem: ~$30-40
- Achievements: ~$25-35
- **Total: ~$115-165** (at current gas prices)

---

## 📁 Flattened Contracts Ready

I've created flattened versions of all your contracts:

1. ✅ `ChainTree_flattened.sol`
2. ✅ `TreeToken_flattened.sol`
3. ✅ `RewardSystem_flattened.sol`
4. ✅ `Achievements_flattened.sol`

These are in your project root directory.

---

## 🎯 Step-by-Step Deployment

### Step 1: Setup MetaMask for Base Mainnet

1. Open MetaMask
2. Click network dropdown
3. Add Base Mainnet if not already added:
   - **Network Name**: Base Mainnet
   - **RPC URL**: `https://mainnet.base.org`
   - **Chain ID**: `8453`
   - **Currency Symbol**: ETH
   - **Block Explorer**: `https://basescan.org`
4. Switch to Base Mainnet
5. **Verify you have 0.2-0.3 ETH**

### Step 2: Open Remix IDE

1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. Create a new workspace called `ChainTrees-Mainnet`

### Step 3: Upload Flattened Contracts

For each flattened contract file:

1. In Remix, click **"File Explorer"** (📁 icon)
2. Click **"+"** to create a new file
3. Name it (e.g., `ChainTree_flattened.sol`)
4. Open the flattened file from your project folder
5. Copy ALL the content
6. Paste into Remix
7. Repeat for all 4 contracts

**Files to upload:**
- ✅ `ChainTree_flattened.sol`
- ✅ `TreeToken_flattened.sol`
- ✅ `RewardSystem_flattened.sol`
- ✅ `Achievements_flattened.sol`

### Step 4: Compile Contracts

1. Click **"Solidity Compiler"** (📝 icon)
2. Select compiler version: **0.8.20**
3. Enable optimization: **200 runs**
4. Compile each contract:
   - Click on `ChainTree_flattened.sol` → Click "Compile"
   - Click on `TreeToken_flattened.sol` → Click "Compile"
   - Click on `RewardSystem_flattened.sol` → Click "Compile"
   - Click on `Achievements_flattened.sol` → Click "Compile"
5. **Verify all show green checkmarks** ✅

### Step 5: Connect MetaMask to Remix

1. Click **"Deploy & Run Transactions"** (🚀 icon)
2. In **"Environment"** dropdown, select:
   - **"Injected Provider - MetaMask"**
3. MetaMask will pop up
4. Click **"Next"** → **"Connect"**
5. **Verify it shows**:
   - Network: **Base Mainnet (8453)**
   - Account: Your address
   - Balance: Your ETH amount

---

## 🔥 DEPLOYMENT SEQUENCE (DO IN ORDER!)

### 1️⃣ Deploy ChainTree NFT

1. In **"Contract"** dropdown, select `ChainTree`
2. **DOUBLE CHECK**: You're on Base Mainnet (8453)
3. Click **"Deploy"** (orange button)
4. MetaMask pops up:
   - **Review gas fee** (should be ~$40-60)
   - Click **"Confirm"**
5. Wait for confirmation (10-30 seconds)
6. In "Deployed Contracts" section, you'll see your contract
7. **📝 COPY THE ADDRESS** (click copy icon)

**Save this address:**
```
ChainTree: 0x________________
```

### 2️⃣ Deploy TreeToken

1. Select `TreeToken` in dropdown
2. Click **"Deploy"**
3. Confirm in MetaMask (~$20-30)
4. Wait for confirmation
5. **📝 COPY THE ADDRESS**

**Save this address:**
```
TreeToken: 0x________________
```

### 3️⃣ Deploy RewardSystem

⚠️ **IMPORTANT**: This contract needs constructor parameters!

1. Select `RewardSystem` in dropdown
2. You'll see input fields appear:
   - **_chainTreeAddress**: Paste ChainTree address from Step 1
   - **_treeTokenAddress**: Paste TreeToken address from Step 2
3. **VERIFY ADDRESSES ARE CORRECT** (double-check!)
4. Click **"Deploy"**
5. Confirm in MetaMask (~$30-40)
6. Wait for confirmation
7. **📝 COPY THE ADDRESS**

**Save this address:**
```
RewardSystem: 0x________________
```

### 4️⃣ Deploy Achievements

1. Select `Achievements` in dropdown
2. Click **"Deploy"**
3. Confirm in MetaMask (~$25-35)
4. Wait for confirmation
5. **📝 COPY THE ADDRESS**

**Save this address:**
```
Achievements: 0x________________
```

---

## 🔐 Step 6: Set Permissions (CRITICAL!)

The RewardSystem needs permission to mint TreeTokens.

1. In **"Deployed Contracts"**, find your **TreeToken** contract
2. Click to expand it
3. Scroll down to find **`setMinter`** function (orange button)
4. Enter:
   - **minter**: [Paste RewardSystem address from Step 3]
   - **status**: `true`
5. Click **"transact"**
6. Confirm in MetaMask
7. Wait for confirmation

**✅ Verify it worked:**
- Expand TreeToken contract
- Find **`minters`** function (blue button)
- Enter RewardSystem address
- Click "call"
- Should return: `true`

---

## 📋 Step 7: Save Deployment Info

Create a file `mainnet-deployment.json`:

```json
{
  "network": "base",
  "chainId": 8453,
  "deployer": "0xYOUR_ADDRESS_HERE",
  "timestamp": "2024-11-30T01:15:00Z",
  "contracts": {
    "ChainTree": "0x________________",
    "TreeToken": "0x________________",
    "RewardSystem": "0x________________",
    "Achievements": "0x________________"
  },
  "gasUsed": {
    "ChainTree": "~$50",
    "TreeToken": "~$25",
    "RewardSystem": "~$35",
    "Achievements": "~$30"
  }
}
```

---

## 🔍 Step 8: Verify Contracts on BaseScan

For each contract:

1. Go to [basescan.org](https://basescan.org)
2. Search for your contract address
3. Click **"Contract"** tab
4. Click **"Verify and Publish"**
5. Fill in:
   - **Compiler Type**: Solidity (Single file)
   - **Compiler Version**: v0.8.20+commit.a1b79de6
   - **Open Source License**: MIT
6. Copy the ENTIRE flattened contract code
7. Paste into "Enter the Solidity Contract Code"
8. For **RewardSystem**, add constructor arguments:
   - Click "Constructor Arguments ABI-encoded"
   - Enter the encoded arguments (Remix can help with this)
9. Click **"Verify and Publish"**
10. Wait for verification (30 seconds - 2 minutes)

**Repeat for all 4 contracts!**

---

## 🎨 Step 9: Update Frontend

1. Update `src/contracts/addresses.json`:

```json
{
  "baseSepolia": {
    "ChainTree": "0xADbe79538107df6cC8cE28C8faf0DB7397f3CD89",
    "TreeToken": "0x5a95d4A11b975e4d0E518a38b388302c433dC5cE",
    "RewardSystem": "0x280298D01194142B42463A9A69fB4e91490BC581",
    "Achievements": "0xfEBDD786A1Ba3CF8345FEbbFeEd2017429080F6b"
  },
  "base": {
    "ChainTree": "0x________________",
    "TreeToken": "0x________________",
    "RewardSystem": "0x________________",
    "Achievements": "0x________________"
  }
}
```

2. Update your frontend to detect and use Base Mainnet (chainId 8453)

---

## ✅ Step 10: Test Your Deployment

Before announcing:

1. **Test Minting**:
   - In Remix, expand ChainTree contract
   - Find `mintTree` function
   - Enter: species (0-9), tokenURI ("ipfs://...")
   - Click "transact"
   - Confirm in MetaMask

2. **Test Watering**:
   - Find `waterTree` function
   - Enter: tokenId (0 for first tree)
   - Click "transact"

3. **Test Staking**:
   - Expand RewardSystem contract
   - Find `stake` function
   - Enter: tokenId
   - Click "transact"

4. **Check on BaseScan**:
   - View your transactions
   - Verify everything worked

---

## 🎉 Step 11: Announce Your Launch!

Once everything is verified and tested:

1. **Update README.md** with mainnet addresses
2. **Deploy frontend** to Vercel (with mainnet config)
3. **Share on social media**:
   - Twitter/X
   - Discord
   - Reddit (r/ethereum, r/Base)
4. **Submit to directories**:
   - DappRadar
   - State of the DApps
   - Base ecosystem page

---

## 🚨 Emergency Procedures

If something goes wrong:

### Contract Has a Bug
- **DO NOT** deploy more contracts
- Contact a smart contract auditor
- Consider using a proxy pattern for upgrades

### Wrong Address Used
- If you deployed with wrong constructor args, you'll need to redeploy
- The old contract will remain on-chain but unused

### Out of Gas
- Increase gas limit in MetaMask
- Try again during lower network activity

---

## 📞 Support Resources

- **Base Discord**: [discord.gg/base](https://discord.gg/base)
- **Remix Documentation**: [remix-ide.readthedocs.io](https://remix-ide.readthedocs.io/)
- **BaseScan Support**: [basescan.org/contactus](https://basescan.org/contactus)

---

## 🎯 Final Checklist

Before going live:

- [ ] All 4 contracts deployed successfully
- [ ] All addresses saved and backed up
- [ ] Permissions set (setMinter called)
- [ ] All contracts verified on BaseScan
- [ ] Test transactions completed successfully
- [ ] Frontend updated with mainnet addresses
- [ ] Frontend deployed to production
- [ ] Social media announcements prepared
- [ ] Team ready for support

---

## 💎 You're Ready to Launch!

**Congratulations!** You're about to deploy ChainTrees to mainnet!

Take your time, double-check everything, and remember:
- Mainnet transactions are **irreversible**
- Gas fees are **real money**
- Test everything **before announcing**

**Good luck! 🌳🚀**

---

*Deployment Date: November 30, 2024*  
*Network: Base Mainnet (Chain ID: 8453)*  
*Deployer: [Your Address]*
