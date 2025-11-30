const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("ChainTree", function () {
    let chainTree;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();

        const ChainTree = await ethers.getContractFactory("ChainTree");
        chainTree = await ChainTree.deploy();
        await chainTree.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await chainTree.owner()).to.equal(owner.address);
        });

        it("Should have correct name and symbol", async function () {
            expect(await chainTree.name()).to.equal("ChainTree");
            expect(await chainTree.symbol()).to.equal("TREE");
        });

        it("Should start with 0 total supply", async function () {
            expect(await chainTree.totalSupply()).to.equal(0);
        });

        it("Should have 0 mint price initially", async function () {
            expect(await chainTree.mintPrice()).to.equal(0);
        });
    });

    describe("Minting", function () {
        it("Should mint a tree successfully", async function () {
            const tx = await chainTree.mintTree(
                0, // Oak
                "ipfs://QmTest123"
            );

            await expect(tx)
                .to.emit(chainTree, "TreeMinted")
                .withArgs(owner.address, 0, 0, 22000);

            expect(await chainTree.totalSupply()).to.equal(1);
            expect(await chainTree.ownerOf(0)).to.equal(owner.address);
        });

        it("Should set correct tree data", async function () {
            await chainTree.mintTree(0, "ipfs://QmTest123");

            const treeData = await chainTree.getTreeData(0);

            expect(treeData.species).to.equal(0); // Oak
            expect(treeData.carbonOffset).to.equal(22000);
            expect(treeData.waterCount).to.equal(0);
            expect(treeData.growthStage).to.equal(0); // Sapling
        });

        it("Should increment tree count for owner", async function () {
            await chainTree.mintTree(0, "ipfs://QmTest1");
            await chainTree.mintTree(1, "ipfs://QmTest2");

            expect(await chainTree.treeCount(owner.address)).to.equal(2);
        });

        it("Should update total carbon offset", async function () {
            await chainTree.mintTree(0, "ipfs://QmTest1"); // Oak: 22000
            await chainTree.mintTree(7, "ipfs://QmTest2"); // Sequoia: 40000

            expect(await chainTree.totalCarbonOffset()).to.equal(62000);
        });

        it("Should require payment if mint price is set", async function () {
            await chainTree.setMintPrice(ethers.parseEther("0.01"));

            await expect(
                chainTree.mintTree(0, "ipfs://QmTest")
            ).to.be.revertedWith("Insufficient payment");

            await expect(
                chainTree.mintTree(0, "ipfs://QmTest", {
                    value: ethers.parseEther("0.01")
                })
            ).to.not.be.reverted;
        });
    });

    describe("Watering", function () {
        beforeEach(async function () {
            await chainTree.mintTree(0, "ipfs://QmTest");
        });

        it("Should water a tree successfully", async function () {
            await expect(chainTree.waterTree(0))
                .to.emit(chainTree, "TreeWatered")
                .withArgs(0, owner.address, 1);

            const treeData = await chainTree.getTreeData(0);
            expect(treeData.waterCount).to.equal(1);
        });

        it("Should not allow watering twice in one day", async function () {
            await chainTree.waterTree(0);

            await expect(
                chainTree.waterTree(0)
            ).to.be.revertedWith("Tree already watered today");
        });

        it("Should allow watering after 1 day", async function () {
            await chainTree.waterTree(0);

            // Increase time by 1 day
            await time.increase(86400);

            await expect(chainTree.waterTree(0)).to.not.be.reverted;

            const treeData = await chainTree.getTreeData(0);
            expect(treeData.waterCount).to.equal(2);
        });

        it("Should revert when watering non-existent tree", async function () {
            await expect(
                chainTree.waterTree(999)
            ).to.be.revertedWith("Tree does not exist");
        });
    });

    describe("Growth", function () {
        beforeEach(async function () {
            await chainTree.mintTree(0, "ipfs://QmTest");
        });

        it("Should grow to Young stage", async function () {
            // Water 10 times over 30 days
            for (let i = 0; i < 10; i++) {
                await chainTree.waterTree(0);
                await time.increase(86400 * 3); // 3 days
            }

            const treeData = await chainTree.getTreeData(0);
            expect(treeData.growthStage).to.equal(1); // Young
        });

        it("Should grow to Mature stage", async function () {
            // Water 20 times over 60 days
            for (let i = 0; i < 20; i++) {
                await chainTree.waterTree(0);
                await time.increase(86400 * 3); // 3 days
            }

            const treeData = await chainTree.getTreeData(0);
            expect(treeData.growthStage).to.equal(2); // Mature
        });

        it("Should grow to Ancient stage", async function () {
            // Water 30 times over 90 days
            for (let i = 0; i < 30; i++) {
                await chainTree.waterTree(0);
                await time.increase(86400 * 3); // 3 days
            }

            const treeData = await chainTree.getTreeData(0);
            expect(treeData.growthStage).to.equal(3); // Ancient
        });

        it("Should increase carbon offset when growing", async function () {
            const initialData = await chainTree.getTreeData(0);
            const initialOffset = initialData.carbonOffset;

            // Grow to Young
            for (let i = 0; i < 10; i++) {
                await chainTree.waterTree(0);
                await time.increase(86400 * 3);
            }

            const newData = await chainTree.getTreeData(0);
            expect(newData.carbonOffset).to.be.greaterThan(initialOffset);
        });
    });

    describe("Carbon Offset Calculations", function () {
        it("Should calculate correct initial offset for Oak", async function () {
            expect(await chainTree.calculateInitialCarbonOffset(0)).to.equal(22000);
        });

        it("Should calculate correct initial offset for Sequoia", async function () {
            expect(await chainTree.calculateInitialCarbonOffset(7)).to.equal(40000);
        });

        it("Should calculate correct growth offset", async function () {
            expect(await chainTree.calculateGrowthCarbonOffset(1)).to.equal(10000); // Young
            expect(await chainTree.calculateGrowthCarbonOffset(2)).to.equal(20000); // Mature
            expect(await chainTree.calculateGrowthCarbonOffset(3)).to.equal(30000); // Ancient
        });
    });

    describe("Owner Functions", function () {
        it("Should allow owner to set mint price", async function () {
            await chainTree.setMintPrice(ethers.parseEther("0.05"));
            expect(await chainTree.mintPrice()).to.equal(ethers.parseEther("0.05"));
        });

        it("Should not allow non-owner to set mint price", async function () {
            await expect(
                chainTree.connect(addr1).setMintPrice(ethers.parseEther("0.05"))
            ).to.be.reverted;
        });

        it("Should allow owner to withdraw", async function () {
            await chainTree.setMintPrice(ethers.parseEther("0.01"));
            await chainTree.connect(addr1).mintTree(0, "ipfs://QmTest", {
                value: ethers.parseEther("0.01")
            });

            const initialBalance = await ethers.provider.getBalance(owner.address);
            await chainTree.withdraw();
            const finalBalance = await ethers.provider.getBalance(owner.address);

            expect(finalBalance).to.be.greaterThan(initialBalance);
        });
    });

    describe("Query Functions", function () {
        it("Should get trees by owner", async function () {
            await chainTree.mintTree(0, "ipfs://QmTest1");
            await chainTree.mintTree(1, "ipfs://QmTest2");
            await chainTree.connect(addr1).mintTree(2, "ipfs://QmTest3");

            const ownerTrees = await chainTree.getTreesByOwner(owner.address);
            expect(ownerTrees.length).to.equal(2);
            expect(ownerTrees[0]).to.equal(0);
            expect(ownerTrees[1]).to.equal(1);

            const addr1Trees = await chainTree.getTreesByOwner(addr1.address);
            expect(addr1Trees.length).to.equal(1);
            expect(addr1Trees[0]).to.equal(2);
        });

        it("Should return correct season", async function () {
            const season = await chainTree.getCurrentSeason();
            expect(["Spring", "Summer", "Fall", "Winter"]).to.include(season);
        });
    });
});
