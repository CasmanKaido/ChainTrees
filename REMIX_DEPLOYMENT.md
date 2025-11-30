# 🎨 Deploying ChainTrees with Remix IDE

## Why Use Remix?

- ✅ No private key needed in code
- ✅ Use MetaMask directly
- ✅ Visual interface for deployment
- ✅ Easy contract verification
- ✅ Built-in debugging tools

---

## 📋 Step-by-Step Deployment Guide

### Step 1: Open Remix IDE

1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. You'll see the Remix IDE interface

### Step 2: Create New Workspace

1. Click **"File Explorer"** (folder icon on the left)
2. Click **"Create New Workspace"**
3. Name it `ChainTrees`
4. Select **"Blank"** template

### Step 3: Upload Your Contracts

You have two options:

#### Option A: Copy Individual Files (Recommended)

1. In Remix, create a new folder called `contracts`
2. Create these files and copy the content from your local files:
   - `contracts/ChainTree.sol`
   - `contracts/TreeToken.sol`
   - `contracts/RewardSystem.sol`
   - `contracts/Achievements.sol`

#### Option B: Use Flattened Contract

1. Use the flattened file I just created: `ChainTree_flattened.sol`
2. Copy its contents into Remix
3. Repeat for other contracts

### Step 4: Install OpenZeppelin

Remix can automatically fetch OpenZeppelin contracts:

1. The imports in your contracts will be automatically resolved
2. If you see errors, click on the import statement
3. Remix will fetch the dependencies from GitHub

### Step 5: Compile Contracts

1. Click **"Solidity Compiler"** (second icon on the left)
2. Select compiler version: **0.8.20**
3. Enable **"Auto compile"** (optional)
4. Click **"Compile ChainTree.sol"**
5. Repeat for all contracts

### Step 6: Connect MetaMask

1. Click **"Deploy & Run Transactions"** (third icon on the left)
2. In **"Environment"** dropdown, select:
   - **"Injected Provider - MetaMask"** (for testnet/mainnet)
3. MetaMask will pop up asking to connect
4. Select your account and click **"Connect"**
5. Make sure MetaMask is on **Base Sepolia** network

### Step 7: Deploy Contracts (In Order!)

**Important**: Deploy in this specific order:

#### 1️⃣ Deploy ChainTree NFT

1. In **"Contract"** dropdown, select `ChainTree`
2. Click **"Deploy"**
3. MetaMask will pop up - confirm the transaction
4. Wait for confirmation
5. **Copy the deployed address** (you'll need it!)

#### 2️⃣ Deploy TreeToken

1. Select `TreeToken` in the dropdown
2. Click **"Deploy"**
3. Confirm in MetaMask
4. **Copy the deployed address**

#### 3️⃣ Deploy RewardSystem

1. Select `RewardSystem` in the dropdown
2. In the deploy section, you'll see input fields for constructor parameters
3. Enter:
   - `_chainTreeAddress`: [ChainTree address from step 1]
   - `_treeTokenAddress`: [TreeToken address from step 2]
4. Click **"Deploy"**
5. Confirm in MetaMask
6. **Copy the deployed address**

#### 4️⃣ Deploy Achievements

1. Select `Achievements` in the dropdown
2. Click **"Deploy"**
3. Confirm in MetaMask
4. **Copy the deployed address**

### Step 8: Set Permissions

After deploying, you need to grant the RewardSystem permission to mint TreeTokens:

1. In **"Deployed Contracts"** section, find your `TreeToken` contract
2. Expand it to see all functions
3. Find the `setMinter` function
4. Enter:
   - `minter`: [RewardSystem address from step 3]
   - `status`: `true`
5. Click **"transact"**
6. Confirm in MetaMask

### Step 9: Save Deployment Info

Create a file to save your deployed addresses:

```json
{
  "network": "baseSepolia",
  "chainId": 84532,
  "contracts": {
    "ChainTree": "0x...",
    "TreeToken": "0x...",
    "RewardSystem": "0x...",
    "Achievements": "0x..."
  },
  "deployer": "0x...",
  "timestamp": "2024-11-30T..."
}
```

### Step 10: Update Frontend

1. Update `src/contracts/addresses.json` with your new addresses
2. The ABIs are already in `src/contracts/abis/` from compilation

---

## 🔍 Verifying Contracts on BaseScan

After deployment, verify your contracts:

1. Go to [sepolia.basescan.org](https://sepolia.basescan.org)
2. Search for your contract address
3. Click **"Contract"** tab
4. Click **"Verify and Publish"**
5. Fill in:
   - Compiler Type: **Solidity (Single file)**
   - Compiler Version: **v0.8.20**
   - License: **MIT**
6. Copy your flattened contract code
7. Click **"Verify and Publish"**

---

## 💡 Tips & Tricks

### Gas Estimation
- Remix shows gas estimates before deploying
- Make sure you have enough ETH for gas

### Testing Functions
- After deployment, you can test functions directly in Remix
- Blue buttons = view functions (free)
- Orange buttons = transactions (cost gas)

### Debugging
- If deployment fails, check the console at the bottom
- Common issues:
  - Not enough gas
  - Wrong network
  - Constructor parameters incorrect

### Saving Your Work
- Remix auto-saves in browser
- Export your workspace: **File > Export Workspace**
- Import later: **File > Import Workspace**

---

## 📊 Deployment Checklist

Before deploying:
- [ ] MetaMask connected to Base Sepolia
- [ ] Have test ETH (~0.1 ETH recommended)
- [ ] All contracts compiled successfully
- [ ] Constructor parameters ready (for RewardSystem)

After deploying:
- [ ] All 4 contracts deployed
- [ ] Addresses saved
- [ ] Permissions set (setMinter called)
- [ ] Contracts verified on BaseScan
- [ ] Frontend updated with new addresses

---

## 🚀 Quick Deploy Commands

For reference, here's what happens behind the scenes:

```javascript
// 1. Deploy ChainTree
const chainTree = await ChainTree.deploy()

// 2. Deploy TreeToken
const treeToken = await TreeToken.deploy()

// 3. Deploy RewardSystem
const rewardSystem = await RewardSystem.deploy(
  chainTree.address,
  treeToken.address
)

// 4. Deploy Achievements
const achievements = await Achievements.deploy()

// 5. Set permissions
await treeToken.setMinter(rewardSystem.address, true)
```

---

## ❓ Troubleshooting

### "Transaction Failed"
- Check you have enough ETH for gas
- Verify you're on the correct network
- Check constructor parameters are correct

### "Contract Not Found"
- Make sure all imports are resolved
- Check OpenZeppelin version matches (v5.0+)

### "MetaMask Not Connecting"
- Refresh Remix page
- Disconnect and reconnect MetaMask
- Clear browser cache

---

## 🎉 You're Done!

Once deployed, your contracts are live on Base Sepolia!

**Next Steps:**
1. Test your contracts in Remix
2. Update your frontend with the new addresses
3. Deploy your frontend to Vercel
4. Share your dApp with the world! 🌳

---

**Need Help?**
- [Remix Documentation](https://remix-ide.readthedocs.io/)
- [Base Documentation](https://docs.base.org/)
- [MetaMask Support](https://support.metamask.io/)
