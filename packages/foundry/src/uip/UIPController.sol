// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./UIPRegistry.sol";

contract UIPController is Ownable {
    UIPRegistry public uipRegistry;

    constructor(address registryAddress) {
        uipRegistry = UIPRegistry(registryAddress);
    }

    function setMerkleRoot(bytes32 _merkleRoot) public onlyOwner {
        uipRegistry.setMerkleRoot(_merkleRoot);
    }

    function setKYCRegistry(address kycRegistryAddress) public onlyOwner {
        uipRegistry.setKYCRegistry(kycRegistryAddress);
    }
}
