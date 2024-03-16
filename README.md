# UseProtocol

![RCSA UseProtocol Overview.jpg](https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2Ff6d86e9f-bf21-40e3-a0da-02ccac225362%2Fe609d224-3373-4c4f-9598-1c7839ff966c%2FRCSA_UseProtocol_Overview.jpg?table=block&id=1e51af19-0abc-4b36-b57f-05d889b7ef08&spaceId=f6d86e9f-bf21-40e3-a0da-02ccac225362&width=2000&userId=9ce8401f-b49d-4a08-a82d-80371477a558&cache=v2)

## 1. Introduction

### 1.1 prior work

- Incorporates elements from existing blockchain innovations such as utility ERC721 NFTs for unique digital assets representation.
- Utilises Smart accounts through Account Abstraction (ERC 4337) to allow for seamless user interactions with Ethereum's blockchain, enhancing both user experience and security without altering the core protocol.
- Introduces privacy-enabled NFTs to ensure proof of ownership while enabling transparent transactions.
- Leverages ENS off-chain resolvers on Layer 2 networks (e.g., rightclickuse.eth) for scalable, cost-effective resolution, facilitating user identification and IP management on the Use Protocol.

## 2. Protocol overview

The Use Protocol, aka uproto, is a decntralised protocol for tokenising intellectual property. This document will introduce you to the ideas behind the Use protocol.

### 2.1 High level description of components

Identity

- Users generate smart wallet accounts adhering to EIP 4337, securing their transactions and interactions within the protocol.
- Each user claims a unique username as an ENS subdomain (e.g., username.rightclickuse.eth), mapping it to their smart wallet address for identifiable and secure transactions.
- The protocol uniquely identifies users by their chosen usernames, ensuring a seamless and personalised user experience.

**KYC (Know Your Customer)**:

- Enforces ownership verification of intellectual property (IP) before registration on the Use Protocol to maintain the integrity and legitimacy of transactions.
- Implements a KYC Registry to manage and verify the KYC status of users engaging with the protocol. This registry utilises a predefined protobuf format for structure of fields, ensuring a standardised approach to user verification.

  ```protobuf
  syntax = "proto3";

  package kyc;

  message KYC {
    string full_name = 1;
    string date_of_birth = 2;
    Address address = 3;
    string nationality = 4;
    string document_type = 5;
    string document_number = 6;
    string document_expiry = 7;
    string country_of_issue = 8;
    string contact_number = 9;
    string email_address = 10;
  }

  message Address {
    string street = 1;
    string city = 2;
    string state = 3;
    string postal_code = 4;
    string country = 5;
  }

  ```

-

Use IP

- Represents the tokenisation of intellectual property (IP), such as patents, copyrights, trademarks, and NFTs, on the UseProtocol.
- It’s an ERC721-compatible contract representing unique digital assets, enabling a broad range of applications and interoperability with existing digital ecosystems.`
- It can’t be sold but is transferable.
- A UIP enables the transformation of static IP assets into dynamic, interactive tokens through a registration process that is secured by ZK proofs and publicly verifiable on the Ethereum blockchain.
- Only a user that has undergone KYC and has a proof of ownership can register an IP on the Use Protocol
- Component

  - UIPR - The is the registrar for Use IP, it allows for trustless decentralised IP to be issued as tokens on the Ethereum Blockchain. Registration is done through smart-contracts, and ownership proven with ZK proofs and verifiable by anyone on the blockchain.
  - IUIP - The interface for the UIP registrar
  - UIPController - The UIP controller
  - UIPHooks - Smart contracts attached to Use IP for customisation. Allowing developers to implement different functionalities at different points in the IP lifecycle, such as before IP registration, after registration, after KYC.

- ## **IP Ownership ZK Proofs**:
  - Provides detailed methods for generating and verifying ZK proofs for patents, copyrights, trademarks, and NFT ownership, leveraging the power of ZK-SNARKs and other cryptographic techniques to ensure secure and private IP management.

IP Ownership ZK proofs

- Implements zero-knowledge (ZK) proofs for each type of IP, ensuring ownership verification without compromising privacy or revealing sensitive information.
- Each type of IP has a approach for proofing ownership:
- Method for generating and verifying ZK proofs for patents, copyrights, trademarks, and NFT ownership, leveraging:

1. Patent

   - A ZK circuit to validate the match between the KYC details of the claimant and the patent owner details in the public government repository.
   - Input: Encrypted KYC details and patent registration information.
   - ZK Proof Generation: Prove that the encrypted details match the official patent owner’s information without disclosing the actual information.
   - Verification: Confirm the proof of ownership without exposing sensitive patent details or personal information.

   ```mermaid
   sequenceDiagram
       participant User
       participant Platform
       participant Blockchain
       participant SmartContract
       Note over User,SmartContract: Lifecycle of Proving Patent Ownership
       User->>Platform: Submits patent details & KYC info
       Platform->>Platform: Validates submission against public records
       Note over Platform: Circuit Definition
       Platform->>User: Initiates Trusted Setup
       User->>User: Generates zk-SNARK proof using private info
       Note over User: Proof Generation
       User->>Blockchain: Submits zk-SNARK proof & verification key
       Blockchain->>SmartContract: Invokes proof verification
       Note over SmartContract: Proof Verification
       SmartContract->>SmartContract: Verifies proof against verification key
       alt Proof Valid
           SmartContract->>Blockchain: Logs proof validity & updates ownership status
           Blockchain->>User: Confirms patent ownership & register IP
       else Proof Invalid
           Blockchain->>User: Notifies proof failure
       end

   ```

   Notes:

   - User = Creator
   - Platform = RightClickUse (Or any other app)
   - Blockchain = Optimism / Base / Arbitrum

   PS: This approach could also be used for MACI’s Sybil problem of who can sign up to vote (proof they are human, proof it’s not sybil)

   - I’d create a PR but as a solo hacker I have limited time

2. Copyright (e.g., Videos, Music, Digital Assets)

   - A ZK circuit that can verify ownership based on creation date, metadata, or registration details without revealing those details is constructed.
   - Input: Encrypted evidence of copyright registration, digital timestamps + KYC.
   - ZK Proof Generation: Prove match
   - Verification: Verify the proof against the public verification key, confirming the creator's claim of copyright ownership.

   PS: No digram but it’ll follow a similar process to 1.

3. Trademark

- A ZK circuit that can verify the claimant's ownership based on trademark registration.
- Input: Encrypted evidence of trademark registration and use in commerce.
- ZK Proof Generation: Prove possession of trademark registration and evidence of use, aligning with official records, without revealing specifics.
- Verification: Establish proof of trademark ownership, ensuring the claimant’s rights without disclosing detailed evidence.

1. NFT (Non-Fungible Token)
   - A ZK circuit that confirms the claimant’s controls the PK of the wallet that owns the NFT on the blockchain is constructed
   - Input: Encrypted details of the NFT and the claimant’s wallet address.
   - ZK Proof Generation: Prove ownership of the wallet address associated with the NFT without revealing the wallet’s private key or the NFT’s unique identifiers.
   - Verification: Confirm NFT ownership linked to the claimant’s wallet, ensuring privacy and security of the owner’s blockchain identity.

Smart Licenses

- Once an IP has been successfully registered, the user can now sell rights to their IP by creating licenses
- Implements ERC1155 contracts for managing multiple IP licenses, enhancing pricing flexibility and efficiency .
- Components
  - SmartLicenseRegistry
  - SmartLicenseController
  - SmartLicenseHooks
  - PS: Definitions of registry and hooks above.

UseProtocolReverseProxy

- Introduces an efficient and secure way to process protocol requests through the UseProtocolReverseProxy, optimising performance and reliability.
- Implements a structured UPFrame format to streamline request processing and routing, ensuring fast and accurate execution of protocol operations.
- Uses Multicall for efficiency

```markdown
UPFrame Header Format

     0                   1                   2                   3
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1

+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|VER | OP TYPE | Object | Function Selector |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
| Payload (Variable Length) |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

### **Explanation**

### Fields:

1. **Version (VER)**
   - **Size:** 4 bits
   - **Purpose:** Identifies the protocol version to ensure compatibility and support for future upgrades.
2. **Operation Type (OP TYPE)**
   - **Size:** 8 bits
   - **Purpose:** Specifies the operation to be performed
   - Types (To structure better later)
     1. **Register IP (0x01):** Initiates the registration of intellectual property, such as patents, copyrights, trademarks, or NFTs.
     2. **Verify KYC (0x02):** Triggers the KYC verification process for a user or entity, interfacing with the KYC smart contract.
     3. **Create License (0x03):** Initiates the creation of a license for a registered IP, allowing the IP owner to set terms for its use.
     4. **Transfer IP (0x04):** Facilitates the transfer of ownership or rights of an IP from one party to another.
     5. **Update IP Details (0x05):** Allows for the updating of IP-related information, such as metadata or ownership details.
     6. **Submit Proof of Ownership (0x06):** Used for submitting Zero-Knowledge Proofs or other forms of evidence to verify ownership of IP.
     7. **Revoke License (0x07):** Enables the revocation of a previously issued license, affecting the rights to use the IP.
     8. **Query IP (0x08):** Facilitates queries about registered IPs, including details about the IP, its ownership, and licensing.
     9. **Renew KYC (0x09):** Initiates the process for renewing KYC verification, ensuring continued compliance with regulatory requirements.
     10. **Burn UIP Token (0x0C):** Allows for the burning of a UIP token, removing it from circulation, typically used when an IP is no longer active or has been revoked.
     11. **Submit Verification Proof (0x0D):** Used to submit verification proofs, particularly in the context of ZK Proofs, to support claims of IP ownership or compliance.
     12. …. and so on
3. **Object (**protocol component)
   - **Size:** 4 bits
   - **Purpose:** Indicates the target smart contract ().
   - Different components:
     - UID
     - KYC
     - UIP
     - License
     - VerificationProof.
4. **Function Selector**
   - **Size:** 16 bits
   - **Purpose:** Directly correlates with the function signature within the smart contract.
   - This is derived from the first 4 bytes of the hash of the function signature, ensuring precise and secure function calling.
5. **Payload (Args for the function)**
   - **Size:** Varies
   - **Purpose:** Contains the arguments for the specified function call, encoded according to the Ethereum ABI. This field follows directly after the header fields, tailored to the function’s requirements.

### L2 Ens resolver

- UP protocol version resolving
- UP protocol l2 deployment contract address resolving

### Hooks

- Allow for the injection of custom logic at specific points within the IP its respective licenses lifecycle, such as before or after IP registration, license creation, pricing changes, e.t.c
- They implement the IHook’s interface
- Hooks must be deployed at deterministic addresses using the Ethereum **`CREATE2`** opcode, allowing their addresses to be predictable and verifiable.
- Similar to Uniswap v4, each hook is associated with specific flags (permissions) encoded within its address, indicating the events it should be triggered for.
- The IP controller is responsible for invoking the appropriate hooks based on the operations being performed and the permissions encoded in the hook addresses.

### Deploying Hooks

| Hex Hook Address                           | Binary Address (Leading Bits) | Description                    |
| ------------------------------------------ | ----------------------------- | ------------------------------ |
| 0x8000000000000000000000000000000000000000 | 1000 0000... (bit 159)        | BEFORE_IP_REGISTRATION_FLAG    |
| 0x4000000000000000000000000000000000000000 | 0100 0000... (bit 158)        | AFTER_IP_REGISTRATION_FLAG     |
| 0x2000000000000000000000000000000000000000 | 0010 0000... (bit 157)        | BEFORE_LICENSE_CREATION_FLAG   |
| 0x1000000000000000000000000000000000000000 | 0001 0000... (bit 156)        | AFTER_LICENSE_CREATION_FLAG    |
| 0x0800000000000000000000000000000000000000 | 0000 1000... (bit 155)        | BEFORE_PRICE_MODIFICATION_FLAG |
| 0x0400000000000000000000000000000000000000 | 0000 0100... (bit 154)        | AFTER_PRICE_MODIFICATION_FLAG  |
| 0x0200000000000000000000000000000000000000 | 0000 0010... (bit 153)        | AFTER_IP_TRANSFER_FLAG         |
| 0x0100000000000000000000000000000000000000 | 0000 0001... (bit 152)        | BEFORE_IP_TRANSFER_FLAG        |

- Design hook: Create a smart contract that implements the **`IHooks`** interface and contains the logic for the events you want to hook into.
- Deploy Using CREATE2: Utilise a deterministic deployment method, such as **`CREATE2`** opcode directly, to ensure the hook's address is predictable. This involves:
  - Generating a specific "salt" value that, along with your contract bytecode and deployer address, produces the deterministic address.
  - Using this salt in the **`CREATE2`** deployment command.
- Mine the Hook Address: The process of "mining" involves finding a salt value that results in a contract address with the desired flag bits set in the leading positions, indicating the permissions for the hook. This might require iterating through multiple salt values until the correct address is generated.
- **Associate with IP controller**: During IP registration (or through an update action for existing IPs), specify the deterministic address of your hook contract. This links your hook with the IP, enabling it to be called at designated lifecycle events.
- **Automated Invocation**: Once deployed and associated with an IP, your hook will be automatically called by the IP controller according to the permissions encoded in its address and the events occurring around the IP.

Note

```solidity
pragma solidity ^0.8.0;

interface IUseProtocolHooks {
}

library UseProtocolHooks {
    // Define constants for flag positions using bitwise left shifts
    uint256 internal constant BEFORE_IP_REGISTRATION_FLAG = 1 << 159; // (Bit 159)
    uint256 internal constant AFTER_IP_REGISTRATION_FLAG = 1 << 158; // (Bit 158)
    uint256 internal constant BEFORE_LICENSE_CREATION_FLAG = 1 << 157; // (Bit 157)
    uint256 internal constant AFTER_LICENSE_CREATION_FLAG = 1 << 156; // (Bit 156)
    uint256 internal constant BEFORE_PRICE_MODIFICATION_FLAG = 1 << 155; // (Bit 155)
    uint256 internal constant AFTER_PRICE_MODIFICATION_FLAG = 1 << 154; // (Bit 154)
    uint256 internal constant AFTER_IP_TRANSFER_FLAG = 1 << 153; // (Bit 153)
    uint256 internal constant BEFORE_IP_TRANSFER_FLAG = 1 << 152; // (Bit 152)

    // Structure to define permissions for each hook
    struct Permissions {
        bool beforeIPRegistration;
        bool afterIPRegistration;
        bool beforeLicenseCreation;
        bool afterLicenseCreation;
        bool beforePriceModification;
        bool afterPriceModification;
        bool afterIPTransfer;
        bool beforeIPTransfer;
    }

    /// @notice Validates if a UseProtocol hook address has the correct permissions set.
    /// @param self The address of the UseProtocol hook contract to validate.
    /// @param permissions The expected permissions for the hook.
    function validateHookPermissions(IUseProtocolHooks self, Permissions memory permissions) internal pure {
        uint256 addressPermissions = uint256(uint160(address(self)));

        bool isValid = true;
        isValid = isValid && ((addressPermissions & BEFORE_IP_REGISTRATION_FLAG != 0) == permissions.beforeIPRegistration);
        isValid = isValid && ((addressPermissions & AFTER_IP_REGISTRATION_FLAG != 0) == permissions.afterIPRegistration);
        isValid = isValid && ((addressPermissions & BEFORE_LICENSE_CREATION_FLAG != 0) == permissions.beforeLicenseCreation);
        isValid = isValid && ((addressPermissions & AFTER_LICENSE_CREATION_FLAG != 0) == permissions.afterLicenseCreation);
        isValid = isValid && ((addressPermissions & BEFORE_PRICE_MODIFICATION_FLAG != 0) == permissions.beforePriceModification);
        isValid = isValid && ((addressPermissions & AFTER_PRICE_MODIFICATION_FLAG != 0) == permissions.afterPriceModification);
        isValid = isValid && ((addressPermissions & AFTER_IP_TRANSFER_FLAG != 0) == permissions.afterIPTransfer);
        isValid = isValid && ((addressPermissions & BEFORE_IP_TRANSFER_FLAG != 0) == permissions.beforeIPTransfer);

        if (!isValid) {
            revert("HookAddressNotValid");
        }
    }

    /// @notice Checks if a UseProtocol hook contract has permission for a specific flag.
    /// @param self The UseProtocol hook contract to check.
    /// @param flag The flag to check the permission for.
    /// @return hasPermission True if the hook has permission, false otherwise.
    function hasPermission(IUseProtocolHooks self, uint256 flag) internal pure returns (bool) {
        return uint256(uint160(address(self))) & flag != 0;
    }
}

```

Each section builds upon the innovations and standards discussed in the prior work, enhancing the protocol's capabilities and user experience while ensuring security, privacy, and interoperability within the Ethereum ecosystem and beyond.

# Right Click Use (The Platform / The application / The Client )

![SequenceDiagramPlatform.jpg](https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2Ff6d86e9f-bf21-40e3-a0da-02ccac225362%2Ff75c9a62-d870-4f15-9561-eae4685be6cf%2FSequenceDiagramPlatform.jpg?table=block&id=ebfc38cc-778c-4308-b002-713c2a30cd0c&spaceId=f6d86e9f-bf21-40e3-a0da-02ccac225362&width=2000&userId=9ce8401f-b49d-4a08-a82d-80371477a558&cache=v2)

Note for later: Mistake on user registering ID

RightclickUse is a decentralised e-commerce platform enabling creators to sell the rights associated to their work (IP) directly to their community.

Ux considerations

- supports multi-chain accounts
- gas sponsorship
- pop-upless blockchain interactions
- flexible ownership

### IP VS License

Think of **IP as the asset (e.g., a song)** and the **license as the ticket granting access to use it (e.g., perform it live)**

### To Do

- Dispute & Resolution
- 24/7 Automated IP infringement monitoring
