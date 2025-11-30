// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title Achievements
 * @dev ERC-1155 Badge system for ChainTrees
 * Users earn badges for milestones (e.g., "First Tree", "Carbon Neutral", "Forest Keeper")
 */
contract Achievements is ERC1155, Ownable {
    // Badge IDs
    uint256 public constant FIRST_TREE = 1;
    uint256 public constant FIVE_TREES = 2;
    uint256 public constant TEN_TREES = 3;
    uint256 public constant FOREST_KEEPER = 4; // 50+ trees
    uint256 public constant GREEN_THUMB = 5; // Watered 100 times
    uint256 public constant CARBON_NEUTRAL = 6; // Offset 1 ton CO2
    
    // Mapping of authorized minters
    mapping(address => bool) public minters;

    constructor() ERC1155("https://chaintrees.io/api/badges/{id}.json") Ownable(msg.sender) {
        // Mint initial badges to owner for setup/testing
    }

    modifier onlyMinter() {
        require(minters[msg.sender] || msg.sender == owner(), "Caller is not a minter");
        _;
    }

    function setMinter(address minter, bool status) public onlyOwner {
        minters[minter] = status;
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyMinter
    {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyMinter
    {
        _mintBatch(to, ids, amounts, data);
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }
}
