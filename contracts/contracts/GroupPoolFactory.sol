// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";

interface IGroupPool {
    function init(address asset, address creator, string memory purpose, address beneficiary, uint256 targetAmount, uint256 deadline) external;
}

contract GroupPoolFactory is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    address public immutable poolImplementation;

    uint256 public totalPoolsCreated;

    event PoolCreated(address indexed pool, address indexed creator, string purpose, address beneficiary, uint256 target, uint256 deadline);

    constructor(address _poolImplementation, address _admin) {
        require(_poolImplementation != address(0));
        poolImplementation = _poolImplementation;
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
    }

    function createPool(address asset, string calldata purpose, address beneficiary, uint256 targetAmount, uint256 deadline) external returns (address pool) {
    require(deadline > block.timestamp, "Invalid deadline");
    bytes32 salt = keccak256(abi.encode(msg.sender, purpose, beneficiary, targetAmount, deadline, block.number));
    pool = Clones.cloneDeterministic(poolImplementation, salt);
    IGroupPool(pool).init(asset, msg.sender, purpose, beneficiary, targetAmount, deadline);
    
    totalPoolsCreated++;
    
    emit PoolCreated(pool, msg.sender, purpose, beneficiary, targetAmount, deadline);
}

    function getFactoryInfo() external view returns (
    address implementation,
    uint256 totalPools
) {
    return (poolImplementation, totalPoolsCreated);
}

}
