const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("🪙 Deploying Token & Reward System...");

    // 1. Deploy TreeToken
    const TreeToken = await hre.ethers.getContractFactory("TreeToken");
    const treeToken = await TreeToken.deploy();
    await treeToken.waitForDeployment();
    const tokenAddress = await treeToken.getAddress();
    console.log(`✅ TreeToken deployed to: ${tokenAddress}`);

    // 2. Get ChainTree address (from previous deployment or deploy new)
    let chainTreeAddress;
    const network = await hre.ethers.provider.getNetwork();
    const deploymentsDir = path.join(__dirname, "..", "..", "deployments");
    const deploymentFile = path.join(deploymentsDir, `${network.name}.json`);

    if (fs.existsSync(deploymentFile)) {
        const deployments = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
        if (deployments.ChainTree) {
            chainTreeAddress = deployments.ChainTree.address;
            console.log(`ℹ️ Using existing ChainTree at: ${chainTreeAddress}`);
        }
    }

    if (!chainTreeAddress) {
        console.log("⚠️ ChainTree not found, deploying new one...");
        const ChainTree = await hre.ethers.getContractFactory("ChainTree");
        const chainTree = await ChainTree.deploy();
        await chainTree.waitForDeployment();
        chainTreeAddress = await chainTree.getAddress();
        console.log(`✅ ChainTree deployed to: ${chainTreeAddress}`);
    }

    // 3. Deploy RewardSystem
    const RewardSystem = await hre.ethers.getContractFactory("RewardSystem");
    const rewardSystem = await RewardSystem.deploy(tokenAddress, chainTreeAddress);
    await rewardSystem.waitForDeployment();
    const rewardAddress = await rewardSystem.getAddress();
    console.log(`✅ RewardSystem deployed to: ${rewardAddress}`);

    // 4. Deploy Achievements
    const Achievements = await hre.ethers.getContractFactory("Achievements");
    const achievements = await Achievements.deploy();
    await achievements.waitForDeployment();
    const achievementsAddress = await achievements.getAddress();
    console.log(`✅ Achievements deployed to: ${achievementsAddress}`);

    // 5. Setup Permissions
    console.log("🔐 Setting up permissions...");
    await treeToken.setMinter(rewardAddress, true);
    console.log("  - RewardSystem authorized to mint TreeToken");

    // 6. Save Deployment Info
    const deploymentInfo = {
        TreeToken: {
            address: tokenAddress,
            deployedAt: new Date().toISOString()
        },
        RewardSystem: {
            address: rewardAddress,
            deployedAt: new Date().toISOString()
        },
        Achievements: {
            address: achievementsAddress,
            deployedAt: new Date().toISOString()
        }
    };

    // Merge with existing deployments
    let deployments = {};
    if (fs.existsSync(deploymentFile)) {
        deployments = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
    }

    Object.assign(deployments, deploymentInfo);

    fs.writeFileSync(
        deploymentFile,
        JSON.stringify(deployments, null, 2)
    );
    console.log(`💾 Deployment info updated in: ${deploymentFile}`);

    // 7. Export ABIs
    const artifacts = [
        { name: "TreeToken", path: "contracts/TreeToken.sol/TreeToken.json" },
        { name: "RewardSystem", path: "contracts/RewardSystem.sol/RewardSystem.json" },
        { name: "Achievements", path: "contracts/Achievements.sol/Achievements.json" }
    ];

    const abiDir = path.join(__dirname, "..", "..", "src", "contracts", "abis");
    if (!fs.existsSync(abiDir)) {
        fs.mkdirSync(abiDir, { recursive: true });
    }

    for (const artifact of artifacts) {
        const artifactPath = path.join(__dirname, "..", "..", "artifacts", artifact.path);
        if (fs.existsSync(artifactPath)) {
            const data = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
            fs.writeFileSync(
                path.join(abiDir, `${artifact.name}.json`),
                JSON.stringify(data.abi, null, 2)
            );
            console.log(`📄 Exported ABI for ${artifact.name}`);
        }
    }

    console.log("✅ Token & Reward System deployment complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
