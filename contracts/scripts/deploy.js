const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("🌳 Deploying ChainTree contract...");

    // Get the contract factory
    const ChainTree = await hre.ethers.getContractFactory("ChainTree");

    // Deploy the contract
    console.log("📦 Deploying...");
    const chainTree = await ChainTree.deploy();

    await chainTree.waitForDeployment();

    const address = await chainTree.getAddress();
    console.log(`✅ ChainTree deployed to: ${address}`);

    // Get network info
    const network = await hre.ethers.provider.getNetwork();
    console.log(`📡 Network: ${network.name} (Chain ID: ${network.chainId})`);

    // Save deployment info
    const deploymentInfo = {
        network: network.name,
        chainId: Number(network.chainId),
        address: address,
        deployedAt: new Date().toISOString(),
        deployer: (await hre.ethers.getSigners())[0].address
    };

    // Create deployments directory if it doesn't exist
    const deploymentsDir = path.join(__dirname, "..", "deployments");
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    // Save deployment info to file
    const deploymentFile = path.join(deploymentsDir, `${network.name}.json`);
    let deployments = {};

    if (fs.existsSync(deploymentFile)) {
        deployments = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
    }

    deployments.ChainTree = deploymentInfo;

    fs.writeFileSync(
        deploymentFile,
        JSON.stringify(deployments, null, 2)
    );

    console.log(`💾 Deployment info saved to: ${deploymentFile}`);

    // Export ABI
    const artifactPath = path.join(
        __dirname,
        "..",
        "artifacts",
        "contracts",
        "ChainTree.sol",
        "ChainTree.json"
    );

    if (fs.existsSync(artifactPath)) {
        const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
        const abiPath = path.join(__dirname, "..", "src", "contracts", "abis", "ChainTree.json");

        // Ensure directory exists
        const abiDir = path.dirname(abiPath);
        if (!fs.existsSync(abiDir)) {
            fs.mkdirSync(abiDir, { recursive: true });
        }

        fs.writeFileSync(abiPath, JSON.stringify(artifact.abi, null, 2));
        console.log(`📄 ABI exported to: ${abiPath}`);
    }

    // Wait for a few block confirmations
    console.log("⏳ Waiting for block confirmations...");
    await chainTree.deploymentTransaction().wait(5);

    console.log("✅ Deployment complete!");
    console.log("\n📋 Next steps:");
    console.log("1. Verify the contract on block explorer");
    console.log(`   npx hardhat verify --network ${network.name} ${address}`);
    console.log("2. Update frontend with contract address");
    console.log("3. Test minting functionality");

    return address;
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
