// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TreeToken
 * @dev ERC-20 Token for the ChainTrees ecosystem
 * Used for rewards, marketplace transactions, and governance
 */
contract TreeToken is ERC20, ERC20Burnable, Ownable {
    // Mapping of authorized minters (RewardSystem, etc.)
    mapping(address => bool) public minters;

    event MinterStatusChanged(address indexed minter, bool status);

    constructor() ERC20("TreeToken", "TREE") Ownable(msg.sender) {
        // Mint initial supply to owner (1 million tokens)
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    /**
     * @dev Modifier to check if caller is a minter
     */
    modifier onlyMinter() {
        require(minters[msg.sender] || msg.sender == owner(), "Caller is not a minter");
        _;
    }

    /**
     * @dev Set minter status for an address
     * @param minter Address to set status for
     * @param status True to authorize, false to revoke
     */
    function setMinter(address minter, bool status) public onlyOwner {
        minters[minter] = status;
        emit MinterStatusChanged(minter, status);
    }

    /**
     * @dev Mint new tokens (only authorized minters)
     * @param to Address to mint to
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) public onlyMinter {
        _mint(to, amount);
    }
}
