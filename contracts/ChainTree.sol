// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ChainTree
 * @dev ERC-721 NFT contract for ChainTrees environmental impact platform
 * Each tree NFT represents a planted tree with metadata and carbon offset tracking
 */
contract ChainTree is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    
    // Tree species enum
    enum TreeSpecies {
        Oak,
        Maple,
        Pine,
        Birch,
        Willow,
        Cherry,
        Redwood,
        Sequoia,
        Spruce,
        Cedar
    }
    
    // Tree growth stage
    enum GrowthStage {
        Sapling,
        Young,
        Mature,
        Ancient
    }
    
    // Tree data structure
    struct TreeData {
        TreeSpecies species;
        uint256 plantedAt;
        uint256 carbonOffset; // in grams of CO2
        uint256 lastWatered;
        uint256 waterCount;
        GrowthStage growthStage;
        string season; // Spring, Summer, Fall, Winter
        uint256 generationSeed; // For procedural generation
    }
    
    // Mapping from token ID to tree data
    mapping(uint256 => TreeData) public trees;
    
    // Mapping from owner to tree count
    mapping(address => uint256) public treeCount;
    
    // Total carbon offset by all trees
    uint256 public totalCarbonOffset;
    
    // Minting price (can be 0 for free minting)
    uint256 public mintPrice;
    
    // Events
    event TreeMinted(
        address indexed owner,
        uint256 indexed tokenId,
        TreeSpecies species,
        uint256 carbonOffset
    );
    
    event TreeWatered(
        uint256 indexed tokenId,
        address indexed waterer,
        uint256 waterCount
    );
    
    event TreeGrown(
        uint256 indexed tokenId,
        GrowthStage newStage
    );
    
    constructor() ERC721("ChainTree", "TREE") Ownable(msg.sender) {
        mintPrice = 0; // Free minting initially
    }
    
    /**
     * @dev Mint a new tree NFT
     * @param species The species of tree to mint
     * @param tokenURI The metadata URI for the tree
     */
    function mintTree(
        TreeSpecies species,
        string memory tokenURI
    ) public payable returns (uint256) {
        require(msg.value >= mintPrice, "Insufficient payment");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        // Calculate initial carbon offset based on species
        uint256 carbonOffset = calculateInitialCarbonOffset(species);
        
        // Generate random seed for procedural generation
        uint256 seed = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    msg.sender,
                    tokenId,
                    species
                )
            )
        );
        
        // Create tree data
        trees[tokenId] = TreeData({
            species: species,
            plantedAt: block.timestamp,
            carbonOffset: carbonOffset,
            lastWatered: block.timestamp,
            waterCount: 0,
            growthStage: GrowthStage.Sapling,
            season: getCurrentSeason(),
            generationSeed: seed
        });
        
        // Update statistics
        treeCount[msg.sender]++;
        totalCarbonOffset += carbonOffset;
        
        // Mint the NFT
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        emit TreeMinted(msg.sender, tokenId, species, carbonOffset);
        
        return tokenId;
    }
    
    /**
     * @dev Water a tree to increase its growth
     * @param tokenId The ID of the tree to water
     */
    function waterTree(uint256 tokenId) public {
        require(_ownerOf(tokenId) != address(0), "Tree does not exist");
        
        TreeData storage tree = trees[tokenId];
        
        // Can only water once per day
        require(
            block.timestamp >= tree.lastWatered + 1 days,
            "Tree already watered today"
        );
        
        tree.lastWatered = block.timestamp;
        tree.waterCount++;
        
        // Check if tree should grow
        _checkGrowth(tokenId);
        
        emit TreeWatered(tokenId, msg.sender, tree.waterCount);
    }
    
    /**
     * @dev Check and update tree growth stage
     * @param tokenId The ID of the tree
     */
    function _checkGrowth(uint256 tokenId) private {
        TreeData storage tree = trees[tokenId];
        GrowthStage oldStage = tree.growthStage;
        
        uint256 age = block.timestamp - tree.plantedAt;
        
        // Growth stages based on age and water count
        if (age >= 90 days && tree.waterCount >= 30) {
            tree.growthStage = GrowthStage.Ancient;
        } else if (age >= 60 days && tree.waterCount >= 20) {
            tree.growthStage = GrowthStage.Mature;
        } else if (age >= 30 days && tree.waterCount >= 10) {
            tree.growthStage = GrowthStage.Young;
        }
        
        // Update carbon offset based on growth
        if (tree.growthStage != oldStage) {
            uint256 additionalOffset = calculateGrowthCarbonOffset(tree.growthStage);
            tree.carbonOffset += additionalOffset;
            totalCarbonOffset += additionalOffset;
            
            emit TreeGrown(tokenId, tree.growthStage);
        }
    }
    
    /**
     * @dev Calculate initial carbon offset based on species
     * @param species The tree species
     * @return Carbon offset in grams
     */
    function calculateInitialCarbonOffset(TreeSpecies species) 
        public 
        pure 
        returns (uint256) 
    {
        // Different species have different carbon sequestration rates
        // Values in grams of CO2 per year
        if (species == TreeSpecies.Oak) return 22000;
        if (species == TreeSpecies.Maple) return 20000;
        if (species == TreeSpecies.Pine) return 18000;
        if (species == TreeSpecies.Birch) return 16000;
        if (species == TreeSpecies.Willow) return 19000;
        if (species == TreeSpecies.Cherry) return 17000;
        if (species == TreeSpecies.Redwood) return 35000;
        if (species == TreeSpecies.Sequoia) return 40000;
        if (species == TreeSpecies.Spruce) return 21000;
        if (species == TreeSpecies.Cedar) return 23000;
        
        return 20000; // Default
    }
    
    /**
     * @dev Calculate additional carbon offset for growth stage
     * @param stage The growth stage
     * @return Additional carbon offset in grams
     */
    function calculateGrowthCarbonOffset(GrowthStage stage) 
        public 
        pure 
        returns (uint256) 
    {
        if (stage == GrowthStage.Young) return 10000;
        if (stage == GrowthStage.Mature) return 20000;
        if (stage == GrowthStage.Ancient) return 30000;
        return 0;
    }
    
    /**
     * @dev Get current season based on timestamp
     * @return Season name
     */
    function getCurrentSeason() public view returns (string memory) {
        uint256 month = (block.timestamp / 30 days) % 12;
        
        if (month >= 2 && month < 5) return "Spring";
        if (month >= 5 && month < 8) return "Summer";
        if (month >= 8 && month < 11) return "Fall";
        return "Winter";
    }
    
    /**
     * @dev Get tree data
     * @param tokenId The ID of the tree
     * @return TreeData struct
     */
    function getTreeData(uint256 tokenId) 
        public 
        view 
        returns (TreeData memory) 
    {
        require(_ownerOf(tokenId) != address(0), "Tree does not exist");
        return trees[tokenId];
    }
    
    /**
     * @dev Get trees owned by an address
     * @param owner The owner address
     * @return Array of token IDs
     */
    function getTreesByOwner(address owner) 
        public 
        view 
        returns (uint256[] memory) 
    {
        uint256 balance = balanceOf(owner);
        uint256[] memory result = new uint256[](balance);
        uint256 counter = 0;
        
        for (uint256 i = 0; i < _tokenIdCounter; i++) {
            if (_ownerOf(i) == owner) {
                result[counter] = i;
                counter++;
            }
        }
        
        return result;
    }
    
    /**
     * @dev Set mint price (only owner)
     * @param newPrice New mint price in wei
     */
    function setMintPrice(uint256 newPrice) public onlyOwner {
        mintPrice = newPrice;
    }
    
    /**
     * @dev Withdraw contract balance (only owner)
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(owner()).transfer(balance);
    }
    
    /**
     * @dev Get total number of trees minted
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }
    
    // Required overrides
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
