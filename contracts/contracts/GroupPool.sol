// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract GroupPool is ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public asset;
    address public creator;
    string public purpose;
    address public beneficiary;
    uint256 public targetAmount;
    uint256 public deadline;
    uint256 public totalContributed;
    bool public released;
    bool public initialized;

    mapping(address => uint256) public contributions;

    address[] public contributors;
mapping(address => bool) public hasContributed;

    event Initialized(address asset, address creator, string purpose, address beneficiary, uint256 target, uint256 deadline);
    event Contributed(address indexed user, uint256 amount, uint256 totalContributed);
    event Released(address indexed beneficiary, uint256 amount);
    event Refunded(address indexed user, uint256 amount);

    modifier onlyCreator() { require(msg.sender == creator); _; }

    function init(address _asset, address _creator, string memory _purpose, address _beneficiary, uint256 _targetAmount, uint256 _deadline) external {
        require(!initialized);
        require(_asset != address(0) && _beneficiary != address(0) && _creator != address(0));
        require(_deadline > block.timestamp);
        require(_targetAmount > 0);
        asset = IERC20(_asset);
        creator = _creator;
        purpose = _purpose;
        beneficiary = _beneficiary;
        targetAmount = _targetAmount;
        deadline = _deadline;
        initialized = true;
        emit Initialized(_asset, _creator, _purpose, _beneficiary, _targetAmount, _deadline);
    }

    function contribute(uint256 amount) external nonReentrant {
    require(initialized, "Not initialized");
    require(block.timestamp <= deadline, "Past deadline");
    require(amount > 0, "Amount must be positive");
    
    // Track new contributors
    if (!hasContributed[msg.sender]) {
        contributors.push(msg.sender);
        hasContributed[msg.sender] = true;
    }
    
    contributions[msg.sender] += amount;
    totalContributed += amount;
    asset.safeTransferFrom(msg.sender, address(this), amount);
    emit Contributed(msg.sender, amount, totalContributed);
}


    function canRelease() public view returns (bool) {
        return totalContributed >= targetAmount && block.timestamp >= deadline && !released;
    }

    function release() external nonReentrant {
        require(initialized);
        require(!released);
        require(block.timestamp >= deadline);
        require(totalContributed >= targetAmount);
        released = true;
        uint256 amt = asset.balanceOf(address(this));
        asset.safeTransfer(beneficiary, amt);
        emit Released(beneficiary, amt);
    }

    function refund() external nonReentrant {
        require(initialized);
        require(block.timestamp >= deadline);
        require(!released);
        require(totalContributed < targetAmount);
        uint256 c = contributions[msg.sender];
        require(c > 0);
        contributions[msg.sender] = 0;
        asset.safeTransfer(msg.sender, c);
        emit Refunded(msg.sender, c);
    }

    function getPoolInfo() external view returns (
    address assetToken,
    address poolCreator,
    string memory poolPurpose,
    address poolBeneficiary,
    uint256 target,
    uint256 deadlineTimestamp,
    uint256 totalRaised,
    uint256 contributorCount,
    bool isReleased,
    bool canReleaseNow,  // Changed from canRelease to canReleaseNow
    bool canRefundNow,   // Changed from canRefund to canRefundNow  
    uint256 timeRemaining
) {
    uint256 timeLeft = deadline > block.timestamp ? deadline - block.timestamp : 0;
    bool releasable = totalContributed >= targetAmount && block.timestamp >= deadline && !released;
    bool refundable = block.timestamp >= deadline && !released && totalContributed < targetAmount;
    
    return (
        address(asset),
        creator,
        purpose,
        beneficiary,
        targetAmount,
        deadline,
        totalContributed,
        getContributorCount(),
        released,
        releasable,
        refundable,
        timeLeft
    );
}
function getContributionInfo(address user) external view returns (
    uint256 userContribution,
    bool canRefundUser
) {
    uint256 contrib = contributions[user];
    bool canRefund = contrib > 0 && block.timestamp >= deadline && !released && totalContributed < targetAmount;
    
    return (contrib, canRefund);
}


function getFundingProgress() external view returns (uint256 progressBps) {
    if (targetAmount == 0) return 0;
    return (totalContributed * 10000) / targetAmount;
}


function getPoolStatus() external view returns (uint8 status) {
    if (released) return 3;
    if (block.timestamp < deadline) return 0;
    if (totalContributed >= targetAmount) return 1;
    return 2;
}


function getContributorCount() public view returns (uint256 count) {
    return contributors.length;
}

function getContributors() external view returns (address[] memory) {
    return contributors;
}

function getContributorsPage(uint256 offset, uint256 limit) external view returns (
    address[] memory contributorAddresses,
    uint256[] memory contributorAmounts,
    uint256 totalCount
) {
    uint256 total = contributors.length;
    if (offset >= total) {
        return (new address[](0), new uint256[](0), total);
    }
    
    uint256 end = offset + limit;
    if (end > total) {
        end = total;
    }
    
    uint256 length = end - offset;
    contributorAddresses = new address[](length);
    contributorAmounts = new uint256[](length);
    
    for (uint256 i = 0; i < length; i++) {
        address contributor = contributors[offset + i];
        contributorAddresses[i] = contributor;
        contributorAmounts[i] = contributions[contributor];
    }
    
    return (contributorAddresses, contributorAmounts, total);
}
}
