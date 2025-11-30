const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Token & Reward System", function () {
    let treeToken;
    let chainTree;
    let rewardSystem;
    let achievements;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy TreeToken
        const TreeToken = await ethers.getContractFactory("TreeToken");
        treeToken = await TreeToken.deploy();
        await treeToken.waitForDeployment();

        // Deploy ChainTree
        const ChainTree = await ethers.getContractFactory("ChainTree");
        chainTree = await ChainTree.deploy();
        await chainTree.waitForDeployment();

        // Deploy RewardSystem
        const RewardSystem = await ethers.getContractFactory("RewardSystem");
        rewardSystem = await RewardSystem.deploy(await treeToken.getAddress(), await chainTree.getAddress());
        await rewardSystem.waitForDeployment();

        // Deploy Achievements
        const Achievements = await ethers.getContractFactory("Achievements");
        achievements = await Achievements.deploy();
        await achievements.waitForDeployment();

        // Setup permissions
        await treeToken.setMinter(await rewardSystem.getAddress(), true);
    });

    describe("TreeToken", function () {
        it("Should have correct name and symbol", async function () {
            expect(await treeToken.name()).to.equal("TreeToken");
            expect(await treeToken.symbol()).to.equal("TREE");
        });

        it("Should mint initial supply to owner", async function () {
            const balance = await treeToken.balanceOf(owner.address);
            expect(balance).to.equal(ethers.parseEther("1000000"));
        });

        it("Should allow authorized minter to mint", async function () {
            await treeToken.setMinter(addr1.address, true);
            await treeToken.connect(addr1).mint(addr2.address, 100);
            expect(await treeToken.balanceOf(addr2.address)).to.equal(100);
        });

        it("Should fail if unauthorized minter tries to mint", async function () {
            await expect(
                treeToken.connect(addr1).mint(addr2.address, 100)
            ).to.be.revertedWith("Caller is not a minter");
        });
    });

    describe("RewardSystem Staking", function () {
        beforeEach(async function () {
            // Mint a tree for addr1
            await chainTree.mintTree(0, "ipfs://test"); // Oak
            await chainTree.transferFrom(owner.address, addr1.address, 0);
        });

        it("Should allow staking a tree", async function () {
            // Approve transfer
            await chainTree.connect(addr1).approve(await rewardSystem.getAddress(), 0);

            await expect(rewardSystem.connect(addr1).stake(0))
                .to.emit(rewardSystem, "Staked")
                .withArgs(addr1.address, 0);

            expect(await chainTree.ownerOf(0)).to.equal(await rewardSystem.getAddress());

            const stakedTokens = await rewardSystem.getStakedTokens(addr1.address);
            expect(stakedTokens.length).to.equal(1);
            expect(stakedTokens[0]).to.equal(0);
        });

        it("Should calculate rewards correctly", async function () {
            await chainTree.connect(addr1).approve(await rewardSystem.getAddress(), 0);
            await rewardSystem.connect(addr1).stake(0);

            // Fast forward 1 day
            await time.increase(86400);

            // Oak carbon offset is 22000
            // Reward rate is 0.001 (1e15)
            // Expected reward = 22000 * 1e15 * 1 = 22 * 1e18

            const reward = await rewardSystem.calculateReward(0);
            expect(reward).to.be.closeTo(ethers.parseEther("22"), ethers.parseEther("0.1"));
        });

        it("Should allow claiming rewards", async function () {
            await chainTree.connect(addr1).approve(await rewardSystem.getAddress(), 0);
            await rewardSystem.connect(addr1).stake(0);

            await time.increase(86400);

            await expect(rewardSystem.connect(addr1).claimReward(0))
                .to.emit(rewardSystem, "RewardClaimed");

            const balance = await treeToken.balanceOf(addr1.address);
            expect(balance).to.be.greaterThan(0);
        });

        it("Should allow unstaking", async function () {
            await chainTree.connect(addr1).approve(await rewardSystem.getAddress(), 0);
            await rewardSystem.connect(addr1).stake(0);

            await time.increase(86400);

            await expect(rewardSystem.connect(addr1).unstake(0))
                .to.emit(rewardSystem, "Unstaked");

            expect(await chainTree.ownerOf(0)).to.equal(addr1.address);

            const balance = await treeToken.balanceOf(addr1.address);
            expect(balance).to.be.greaterThan(0);
        });
    });

    describe("Achievements", function () {
        it("Should allow authorized minter to mint badges", async function () {
            await achievements.setMinter(addr1.address, true);

            await achievements.connect(addr1).mint(addr2.address, 1, 1, "0x");

            expect(await achievements.balanceOf(addr2.address, 1)).to.equal(1);
        });
    });
});
