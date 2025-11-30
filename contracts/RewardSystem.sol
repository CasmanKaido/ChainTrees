// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./TreeToken.sol";
import "./ChainTree.sol";

/**
 * @title RewardSystem
 * @dev Staking and reward distribution system for ChainTrees
 * Users stake their Tree NFTs to earn TREE tokens based on carbon offset
 */
contract RewardSystem is ERC721Holder, Ownable, ReentrancyGuard {
    TreeToken public treeToken;
    ChainTree public chainTree;

    // Staking info
    struct Stake {
        address owner;
        uint256 timestamp;
        uint256 carbonOffsetSnapshot;
    }

    // Mapping from token ID to Stake
    mapping(uint256 => Stake) public stakes;
    
    // Mapping of staked tokens by owner
    mapping(address => uint256[]) public ownerStakes;

    // Reward rate: Tokens per gram of CO2 per day
    // 1e18 scale (1 token = 1e18)
    // Example: 0.001 tokens per gram per day
    uint256 public rewardRate = 1e15; 

    event Staked(address indexed owner, uint256 indexed tokenId);
    event Unstaked(address indexed owner, uint256 indexed tokenId, uint256 reward);
    event RewardClaimed(address indexed owner, uint256 indexed tokenId, uint256 reward);

    constructor(address _treeToken, address _chainTree) Ownable(msg.sender) {
        treeToken = TreeToken(_treeToken);
        chainTree = ChainTree(_chainTree);
    }

    /**
     * @dev Stake a Tree NFT
     * @param tokenId The ID of the tree to stake
     */
    function stake(uint256 tokenId) public nonReentrant {
        require(chainTree.ownerOf(tokenId) == msg.sender, "Not the owner");
        
        // Transfer NFT to this contract
        chainTree.safeTransferFrom(msg.sender, address(this), tokenId);

        // Get current carbon offset
        ChainTree.TreeData memory data = chainTree.getTreeData(tokenId);

        // Record stake
        stakes[tokenId] = Stake({
            owner: msg.sender,
            timestamp: block.timestamp,
            carbonOffsetSnapshot: data.carbonOffset
        });

        _addOwnerStake(msg.sender, tokenId);

        emit Staked(msg.sender, tokenId);
    }

    /**
     * @dev Unstake a Tree NFT and claim rewards
     * @param tokenId The ID of the tree to unstake
     */
    function unstake(uint256 tokenId) public nonReentrant {
        require(stakes[tokenId].owner == msg.sender, "Not the staker");

        // Calculate reward
        uint256 reward = calculateReward(tokenId);

        // Remove stake record
        delete stakes[tokenId];
        _removeOwnerStake(msg.sender, tokenId);

        // Mint reward
        if (reward > 0) {
            treeToken.mint(msg.sender, reward);
        }

        // Transfer NFT back
        chainTree.safeTransferFrom(address(this), msg.sender, tokenId);

        emit Unstaked(msg.sender, tokenId, reward);
    }

    /**
     * @dev Claim rewards without unstaking
     * @param tokenId The ID of the tree
     */
    function claimReward(uint256 tokenId) public nonReentrant {
        require(stakes[tokenId].owner == msg.sender, "Not the staker");

        uint256 reward = calculateReward(tokenId);
        require(reward > 0, "No reward to claim");

        // Reset timestamp
        stakes[tokenId].timestamp = block.timestamp;

        // Mint reward
        treeToken.mint(msg.sender, reward);

        emit RewardClaimed(msg.sender, tokenId, reward);
    }

    /**
     * @dev Calculate pending reward for a staked tree
     * @param tokenId The ID of the tree
     */
    function calculateReward(uint256 tokenId) public view returns (uint256) {
        Stake memory stakeData = stakes[tokenId];
        if (stakeData.owner == address(0)) return 0;

        uint256 timeElapsed = block.timestamp - stakeData.timestamp;
        
        // Reward = (Carbon Offset * Reward Rate * Time) / 1 Day
        uint256 reward = (stakeData.carbonOffsetSnapshot * rewardRate * timeElapsed) / 1 days;
        
        return reward;
    }

    /**
     * @dev Helper to add token ID to owner's list
     */
    function _addOwnerStake(address owner, uint256 tokenId) private {
        ownerStakes[owner].push(tokenId);
    }

    /**
     * @dev Helper to remove token ID from owner's list
     */
    function _removeOwnerStake(address owner, uint256 tokenId) private {
        uint256[] storage userStakes = ownerStakes[owner];
        for (uint256 i = 0; i < userStakes.length; i++) {
            if (userStakes[i] == tokenId) {
                userStakes[i] = userStakes[userStakes.length - 1];
                userStakes.pop();
                break;
            }
        }
    }

    /**
     * @dev Get all staked tokens for a user
     */
    function getStakedTokens(address user) public view returns (uint256[] memory) {
        return ownerStakes[user];
    }
    
    /**
     * @dev Update reward rate (only owner)
     */
    function setRewardRate(uint256 _rate) public onlyOwner {
        rewardRate = _rate;
    }
}
