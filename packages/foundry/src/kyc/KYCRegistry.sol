// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

interface IKYCRegistry {
    function getKYCStatus(address account) external view returns (bool);
}

contract KYCRegistry is IKYCRegistry, AccessControl {
    bytes32 public constant KYC_ADMIN_ROLE = keccak256("KYC_ADMIN_ROLE");
    mapping(address => bool) private _kycVerified;

    event KYCStatusUpdated(address indexed user, bool isVerified);

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(KYC_ADMIN_ROLE, msg.sender);
    }

    function setKYCStatus(address user, bool isVerified) public onlyRole(KYC_ADMIN_ROLE) {
        require(user != address(0), "Invalid address");
        _kycVerified[user] = isVerified;
        emit KYCStatusUpdated(user, isVerified);
    }

    function getKYCStatus(address user) public view override returns (bool) {
        return _kycVerified[user];
    }
}
