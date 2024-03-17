// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./IKYCRegistry.sol";

contract UIPRegistry is ERC721Enumerable, AccessControl {
    bytes32 public constant CONTROLLER_ROLE = keccak256("CONTROLLER_ROLE");
    bytes32 public merkleRoot;
    IKYCRegistry public kycRegistry;

    constructor(string memory name, string memory symbol, address kycRegistryAddress) ERC721(name, symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(CONTROLLER_ROLE, msg.sender);
        kycRegistry = IKYCRegistry(kycRegistryAddress);
    }

    function setMerkleRoot(bytes32 _merkleRoot) external onlyRole(CONTROLLER_ROLE) {
        merkleRoot = _merkleRoot;
    }

    function setKYCRegistry(address kycRegistryAddress) external onlyRole(DEFAULT_ADMIN_ROLE) {
        kycRegistry = IKYCRegistry(kycRegistryAddress);
    }

    function mint(address to, uint256 tokenId, bytes32[] calldata merkleProof) external onlyRole(CONTROLLER_ROLE) {
        // Verify the minter is KYC verified
        require(kycRegistry.isKYCVerified(msg.sender), "Minter is not KYC verified");

        // Verify the ownership of the IP using the Merkle proof
        bytes32 leaf = keccak256(abi.encodePacked(to, tokenId));
        require(MerkleProof.verify(merkleProof, merkleRoot, leaf), "Invalid proof of ownership");

        _mint(to, tokenId);
    }
}
