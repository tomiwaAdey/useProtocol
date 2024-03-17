pragma solidity 0.8.24;


interface IKYCRegistry {
    function getKYCStatus(address account) external view returns (bool);
}
