// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IUseProtocolHooks} from "../interfaces/IUseProtocolHooks.sol";

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
