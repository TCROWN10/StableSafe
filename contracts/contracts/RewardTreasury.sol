// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract RewardTreasury is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant REWARD_CALLER_ROLE = keccak256("REWARD_CALLER_ROLE");

    IERC20 public immutable asset;
    uint256 public totalPaid;
    uint256 public globalPayCap;

    event Payout(address indexed to, uint256 amount);
    event GlobalCapSet(uint256 cap);

    constructor(IERC20 _asset, address admin, uint256 _globalCap) {
        require(address(_asset) != address(0));
        asset = _asset;
        globalPayCap = _globalCap;
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
    }

    function setGlobalCap(uint256 cap) external onlyRole(ADMIN_ROLE) {
        globalPayCap = cap;
        emit GlobalCapSet(cap);
    }

    function setRewardCaller(address caller, bool enabled) external onlyRole(ADMIN_ROLE) {
        if (enabled) _grantRole(REWARD_CALLER_ROLE, caller);
        else _revokeRole(REWARD_CALLER_ROLE, caller);
    }

    function payout(address to, uint256 amount) external nonReentrant onlyRole(REWARD_CALLER_ROLE) {
    require(amount > 0, "Amount must be positive");
    require(to != address(0), "Invalid recipient");
    
    if (globalPayCap > 0) {
        require(totalPaid + amount <= globalPayCap, "Global cap exceeded");
    }
    
    require(asset.balanceOf(address(this)) >= amount, "Insufficient treasury balance");
    
    totalPaid += amount;
    asset.safeTransfer(to, amount);
    emit Payout(to, amount);
}

    function rescue(address to, uint256 amount) external onlyRole(ADMIN_ROLE) {
        asset.safeTransfer(to, amount);
    }

    function getTreasuryInfo() external view returns (
    address assetToken,
    uint256 currentBalance,
    uint256 totalPaidOut,
    uint256 globalCap,
    uint256 remainingCap
) {
    uint256 balance = asset.balanceOf(address(this));
    uint256 remaining = globalPayCap > totalPaid ? globalPayCap - totalPaid : 0;
    
    return (
        address(asset),
        balance,
        totalPaid,
        globalPayCap,
        remaining
    );
}

function isRewardCaller(address caller) external view returns (bool) {
    return hasRole(REWARD_CALLER_ROLE, caller);
}
}
