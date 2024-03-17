// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./IKYCRegistry.sol";

contract LicenseRegistry is ERC1155, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    IKYCRegistry public kycRegistry;

    // Price option structures
    enum PriceStability { Stable, Crypto }
    enum PriceType { Fixed, PayWhatYouWant, Subscription }

    struct PriceOption {
        PriceStability stability;
        PriceType priceType;
        uint256 price;
        uint256 duration;
    }

    struct IPToken {
        bytes32 merkleRoot;
        PriceOption[] prices;
    }

    mapping(uint256 => IPToken) public ipTokens;

    event IPMinted(address indexed to, uint256 indexed tokenId, bytes32 merkleRoot);
    event PriceOptionAdded(uint256 indexed tokenId, PriceOption priceOption);

    constructor(address kycRegistryAddress) ERC1155("Your Metadata URI") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        kycRegistry = IKYCRegistry(kycRegistryAddress);
    }

    function mint(address to, uint256 tokenId, bytes32[] calldata merkleProof, uint256 priceOptionIndex) public {
        require(kycRegistry.isKYCVerified(msg.sender), "Minter is not KYC verified");
        IPToken storage token = ipTokens[tokenId];
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(MerkleProof.verify(merkleProof, token.merkleRoot, leaf), "Invalid Merkle Proof");
        _mint(to, tokenId, 1, "");

        emit IPMinted(to, tokenId, token.merkleRoot);
    }

    function addPriceOption(uint256 tokenId, PriceOption calldata priceOption) external onlyRole(MINTER_ROLE) {
        ipTokens[tokenId].prices.push(priceOption);
        emit PriceOptionAdded(tokenId, priceOption);
    }
}
