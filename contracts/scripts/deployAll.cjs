/**
 * Complete Deployment Script for ChainTrees
 * Deploys all contracts in the correct order and saves deployment info
 */

const hre = require('hardhat')
const fs = require('fs')
const path = require('path')

async function main() {
    console.log('🌳 ChainTrees Deployment Starting...\n')

    try {
        console.log('DEBUG: Getting signers...')
        const [deployer] = await hre.ethers.getSigners()
        console.log('DEBUG: Got signer:', deployer ? deployer.address : 'undefined')

        console.log('DEBUG: Getting network info...')
        const network = hre.network.name
        console.log('DEBUG: Network:', network)

        console.log('📍 Network:', network)
        console.log('👤 Deployer:', deployer.address)
        console.log('DEBUG: Getting balance... skipped')
        // const balance = await hre.ethers.provider.getBalance(deployer.address)
        // console.log('💰 Balance:', hre.ethers.formatEther(balance), 'ETH\n')

        const deploymentInfo = {
            network: network,
            deployer: deployer.address,
            timestamp: new Date().toISOString(),
            contracts: {}
        }

        // 1. Deploy ChainTree NFT
        console.log('1️⃣  Deploying ChainTree NFT...')
        const ChainTree = await hre.ethers.getContractFactory('ChainTree')
        const chainTree = await ChainTree.deploy()
        await chainTree.waitForDeployment()
        const chainTreeAddress = await chainTree.getAddress()
        console.log('   ✅ ChainTree deployed to:', chainTreeAddress)
        deploymentInfo.contracts.ChainTree = chainTreeAddress

        // 2. Deploy TreeToken (ERC-20)
        console.log('\n2️⃣  Deploying TreeToken...')
        const TreeToken = await hre.ethers.getContractFactory('TreeToken')
        const treeToken = await TreeToken.deploy()
        await treeToken.waitForDeployment()
        const treeTokenAddress = await treeToken.getAddress()
        console.log('   ✅ TreeToken deployed to:', treeTokenAddress)
        deploymentInfo.contracts.TreeToken = treeTokenAddress

        // 3. Deploy RewardSystem
        console.log('\n3️⃣  Deploying RewardSystem...')
        const RewardSystem = await hre.ethers.getContractFactory('RewardSystem')
        const rewardSystem = await RewardSystem.deploy(chainTreeAddress, treeTokenAddress)
        await rewardSystem.waitForDeployment()
        const rewardSystemAddress = await rewardSystem.getAddress()
        console.log('   ✅ RewardSystem deployed to:', rewardSystemAddress)
        deploymentInfo.contracts.RewardSystem = rewardSystemAddress

        // 4. Deploy Achievements (ERC-1155)
        console.log('\n4️⃣  Deploying Achievements...')
        const Achievements = await hre.ethers.getContractFactory('Achievements')
        const achievements = await Achievements.deploy()
        await achievements.waitForDeployment()
        const achievementsAddress = await achievements.getAddress()
        console.log('   ✅ Achievements deployed to:', achievementsAddress)
        deploymentInfo.contracts.Achievements = achievementsAddress

        // 5. Grant Minter Role to RewardSystem
        console.log('\n5️⃣  Setting up permissions...')
        // TreeToken uses setMinter instead of AccessControl
        const grantTx = await treeToken.setMinter(rewardSystemAddress, true)
        await grantTx.wait()
        console.log('   ✅ Granted minter status to RewardSystem')

        // 6. Save deployment info
        console.log('\n6️⃣  Saving deployment info...')

        // Save to deployments directory
        const deploymentsDir = path.join(__dirname, '../deployments')
        if (!fs.existsSync(deploymentsDir)) {
            fs.mkdirSync(deploymentsDir, { recursive: true })
        }

        const deploymentFile = path.join(deploymentsDir, `${network}.json`)
        fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2))
        console.log('   ✅ Saved to:', deploymentFile)

        // Save ABIs for frontend
        const abiDir = path.join(__dirname, '../../src/contracts/abis')
        if (!fs.existsSync(abiDir)) {
            fs.mkdirSync(abiDir, { recursive: true })
        }

        const contracts = {
            ChainTree: chainTree,
            TreeToken: treeToken,
            RewardSystem: rewardSystem,
            Achievements: achievements
        }

        for (const [name, contract] of Object.entries(contracts)) {
            const artifact = await hre.artifacts.readArtifact(name)
            fs.writeFileSync(
                path.join(abiDir, `${name}.json`),
                JSON.stringify(artifact.abi, null, 2)
            )
        }
        console.log('   ✅ Saved ABIs to src/contracts/abis/')

        // Save addresses for frontend
        const addressesFile = path.join(__dirname, '../../src/contracts/addresses.json')
        const addresses = {
            [network]: deploymentInfo.contracts
        }

        // Merge with existing addresses if file exists
        if (fs.existsSync(addressesFile)) {
            const existing = JSON.parse(fs.readFileSync(addressesFile, 'utf8'))
            Object.assign(existing, addresses)
            fs.writeFileSync(addressesFile, JSON.stringify(existing, null, 2))
        } else {
            fs.writeFileSync(addressesFile, JSON.stringify(addresses, null, 2))
        }
        console.log('   ✅ Saved addresses to src/contracts/addresses.json')

        // 7. Verification info
        console.log('\n7️⃣  Verification Commands:')
        console.log('\n   To verify contracts on Etherscan, run:')
        console.log(`   npx hardhat verify --network ${network} ${chainTreeAddress}`)
        console.log(`   npx hardhat verify --network ${network} ${treeTokenAddress}`)
        console.log(`   npx hardhat verify --network ${network} ${rewardSystemAddress} ${chainTreeAddress} ${treeTokenAddress}`)
        console.log(`   npx hardhat verify --network ${network} ${achievementsAddress}`)

        console.log('\n✅ Deployment Complete!\n')
        console.log('📋 Summary:')
        console.log('   ChainTree:', chainTreeAddress)
        console.log('   TreeToken:', treeTokenAddress)
        console.log('   RewardSystem:', rewardSystemAddress)
        console.log('   Achievements:', achievementsAddress)
        console.log('\n🌳 ChainTrees is ready to grow! 🌱\n')
    } catch (error) {
        console.error('\n❌ FATAL DEPLOYMENT ERROR ❌')
        console.error(error)
        throw error
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
