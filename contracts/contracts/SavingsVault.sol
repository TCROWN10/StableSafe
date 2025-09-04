// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

interface IRewardTreasury {
    function payout(address to, uint256 amount) external;
}

contract SavingsVault is AccessControl, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    IERC20 public immutable asset;
    address public feeCollector;
    IRewardTreasury public treasury;

    uint256 public rewardRatePerSecond;
    uint256 public earlyWithdrawPenaltyBps;
    uint256 public depositCashbackBps;
    uint256 public perTxRedeemCap;

    struct Account {
        uint256 balance;
        uint256 lastAccrual;
        uint256 points;
        uint256 lockedUntil;
    }

    mapping(address => Account) public accounts;

    event Deposited(address indexed user, uint256 amount, uint256 lockUntil);
    event Withdrawn(address indexed user, uint256 amount, uint256 penalty);
    event PointsClaimedForUSDC(address indexed user, uint256 pointsBurned, uint256 usdcPaid);
    event ParamsUpdated(uint256 rewardRatePerSecond, uint256 earlyWithdrawPenaltyBps, address feeCollector);
    event CashbackBpsSet(uint256 bps);
    event TreasurySet(address treasury);
    event PerTxRedeemCapSet(uint256 cap);

    constructor(
        IERC20 _asset,
        address _admin,
        address _feeCollector,
        uint256 _rewardRatePerSecond,
        uint256 _penaltyBps,
        IRewardTreasury _treasury
    ) {
        require(address(_asset) != address(0));
        asset = _asset;
        feeCollector = _feeCollector;
        rewardRatePerSecond = _rewardRatePerSecond;
        earlyWithdrawPenaltyBps = _penaltyBps;
        treasury = _treasury;
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
    }

    function deposit(uint256 amount, uint256 lockSeconds) external nonReentrant whenNotPaused {
        require(amount > 0,  "Amount must be positive");
        _accrue(msg.sender);
        accounts[msg.sender].balance += amount;
        if (lockSeconds > 0) {
            uint256 newLock = block.timestamp + lockSeconds;
            if (newLock > accounts[msg.sender].lockedUntil) accounts[msg.sender].lockedUntil = newLock;
        }
        asset.safeTransferFrom(msg.sender, address(this), amount);
        emit Deposited(msg.sender, amount, accounts[msg.sender].lockedUntil);
        if (depositCashbackBps > 0) {
            uint256 bonus = (amount * depositCashbackBps) / 10_000;
            accounts[msg.sender].points += bonus;
        }
    }

    function withdraw(uint256 amount) external nonReentrant {
         require(amount > 0, "Amount must be positive");
    Account storage a = accounts[msg.sender];
    require(a.balance >= amount, "Insufficient balance");
        uint256 penalty;
        if (a.lockedUntil > block.timestamp && earlyWithdrawPenaltyBps > 0) {
            penalty = (amount * earlyWithdrawPenaltyBps) / 10_000;
            if (penalty > 0) asset.safeTransfer(feeCollector, penalty);
        }
        a.balance -= amount;
        asset.safeTransfer(msg.sender, amount - penalty);
        emit Withdrawn(msg.sender, amount, penalty);
    }

   function redeemPoints(uint256 pointsToRedeem) external nonReentrant {
    require(pointsToRedeem > 0, "Points must be positive");
    Account storage a = accounts[msg.sender];
    _accrue(msg.sender);
    require(a.points >= pointsToRedeem, "Insufficient points");
    
    uint256 usdcAmount = pointsToRedeem;
    uint256 actualPointsBurned = pointsToRedeem;
    
    if (perTxRedeemCap > 0 && usdcAmount > perTxRedeemCap) {
        usdcAmount = perTxRedeemCap;
        actualPointsBurned = perTxRedeemCap; // Burn same amount as payout
    }
    
    a.points -= actualPointsBurned;
    treasury.payout(msg.sender, usdcAmount);
    emit PointsClaimedForUSDC(msg.sender, actualPointsBurned, usdcAmount);
}   


    function _accrue(address user) internal {
        Account storage a = accounts[user];
        uint256 t = block.timestamp;
        if (a.lastAccrual == 0) { a.lastAccrual = t; return; }
        if (a.balance == 0) { a.lastAccrual = t; return; }
        uint256 dt = t - a.lastAccrual;
        if (dt > 0 && rewardRatePerSecond > 0) {
            uint256 addPoints = (a.balance * rewardRatePerSecond * dt) / 1e6;
            a.points += addPoints;
        }
        a.lastAccrual = t;
    }

    function previewPoints(address user) external view returns (uint256 totalPoints) {
        Account memory a = accounts[user];
        uint256 add;
        if (a.lastAccrual != 0 && a.balance > 0 && rewardRatePerSecond > 0) {
            uint256 dt = block.timestamp - a.lastAccrual;
            add = (a.balance * rewardRatePerSecond * dt) / 1e6;
        }
        return a.points + add;
    }

    function setParams(uint256 _rate, uint256 _penaltyBps, address _feeCollector) external onlyRole(ADMIN_ROLE) {
        require(_penaltyBps <= 10_000);
        rewardRatePerSecond = _rate;
        earlyWithdrawPenaltyBps = _penaltyBps;
        feeCollector = _feeCollector;
        emit ParamsUpdated(_rate, _penaltyBps, _feeCollector);
    }

    function setDepositCashbackBps(uint256 bps) external onlyRole(ADMIN_ROLE) {
        require(bps <= 10_000);
        depositCashbackBps = bps;
        emit CashbackBpsSet(bps);
    }

    function setTreasury(IRewardTreasury t) external onlyRole(ADMIN_ROLE) {
        treasury = t;
        emit TreasurySet(address(t));
    }

    function setPerTxRedeemCap(uint256 cap) external onlyRole(ADMIN_ROLE) {
        perTxRedeemCap = cap;
        emit PerTxRedeemCapSet(cap);
    }

    function pause() external onlyRole(ADMIN_ROLE) { _pause(); }
    function unpause() external onlyRole(ADMIN_ROLE) { _unpause(); }


    function getAccountInfo(address user) external view returns (
    uint256 balance,
    uint256 lastAccrual, 
    uint256 points,
    uint256 lockedUntil,
    uint256 pendingPoints,
    bool isLocked
) {
    Account memory a = accounts[user];
    uint256 pending = 0;
    
    if (a.lastAccrual != 0 && a.balance > 0 && rewardRatePerSecond > 0) {
        uint256 dt = block.timestamp - a.lastAccrual;
        pending = (a.balance * rewardRatePerSecond * dt) / 1e6;
    }
    
    return (
        a.balance,
        a.lastAccrual,
        a.points,
        a.lockedUntil,
        pending,
        a.lockedUntil > block.timestamp
    );
}


function getVaultConfig() external view returns (
    address assetToken,
    address feeCollectorAddress,
    address treasuryAddress,
    uint256 rewardRate,
    uint256 penaltyBps,
    uint256 cashbackBps,
    uint256 redeemCap,
    bool isPaused
) {
    return (
        address(asset),
        feeCollector,
        address(treasury),
        rewardRatePerSecond,
        earlyWithdrawPenaltyBps,
        depositCashbackBps,
        perTxRedeemCap,
        paused()
    );
}

function calculateWithdrawPenalty(address user, uint256 amount) external view returns (uint256 penalty) {
    Account memory a = accounts[user];
    if (a.lockedUntil > block.timestamp && earlyWithdrawPenaltyBps > 0) {
        penalty = (amount * earlyWithdrawPenaltyBps) / 10_000;
    }
    return penalty;
}


function getTimeUntilUnlock(address user) external view returns (uint256) {
    uint256 lockedUntil = accounts[user].lockedUntil;
    if (lockedUntil <= block.timestamp) return 0;
    return lockedUntil - block.timestamp;
}


}
