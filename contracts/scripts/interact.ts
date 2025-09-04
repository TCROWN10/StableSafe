import { ethers } from "hardhat";

// Replace with your deployed contract addresses
const CONTRACT_ADDRESSES = {
  mockUSDC: "0xdb7CE481475beF888cD0cBAfeC4C741b6fB59EeC", // Replace with deployed address
  savingsVault: "0xA4c4dd6991c3b6b2c85d4Dd315BfF4e247e50561", // Replace with deployed address
  groupPoolFactory: "0xd797b2d5fd4ffa407ef11ccdd4eFbc5cF0DE83c5", // Replace with deployed address
  rewardTreasury: "0xAFbd1B4bA5601EE7A7F600E45F314F00B951bd6d", // Replace with deployed address
};

async function testSavingsVault(): Promise<void> {
  console.log("\n🏛️ TESTING SAVINGS VAULT");
  console.log("=".repeat(40));
  
  const [user] = await ethers.getSigners();
  const userAddress = await user.getAddress();
  
  // Get contract instances
  const mockUSDC = await ethers.getContractAt("MockUSDC", CONTRACT_ADDRESSES.mockUSDC);
  const savingsVault = await ethers.getContractAt("SavingsVault", CONTRACT_ADDRESSES.savingsVault);
  
  // Check USDC balance
  const balance = await mockUSDC.balanceOf(userAddress);
  console.log("📊 USDC Balance:", ethers.formatUnits(balance, 6), "USDC");
  
  // Deposit into savings vault
  const depositAmount = ethers.parseUnits("1000", 6); // 1000 USDC
  const lockSeconds = 86400; // 1 day lock
  
  console.log("🔓 Approving USDC for deposit...");
  const approveTx = await mockUSDC.approve(CONTRACT_ADDRESSES.savingsVault, depositAmount);
  await approveTx.wait();
  
  console.log("💰 Depositing into SavingsVault...");
  const depositTx = await savingsVault.deposit(depositAmount, lockSeconds);
  await depositTx.wait();
  
  console.log("✅ Deposited", ethers.formatUnits(depositAmount, 6), "USDC with 1 day lock");
  
  // Check account info
  const accountInfo = await savingsVault.getAccountInfo(userAddress);
  console.log("📈 Account Info:");
  console.log("   Balance:", ethers.formatUnits(accountInfo.balance, 6), "USDC");
  console.log("   Points:", accountInfo.points.toString());
  console.log("   Locked Until:", new Date(Number(accountInfo.lockedUntil) * 1000).toLocaleString());
  console.log("   Is Locked:", accountInfo.isLocked);
}

async function testGroupPoolCreation(): Promise<void> {
  console.log("\n👥 TESTING GROUP POOL CREATION");
  console.log("=".repeat(40));
  
  const [user] = await ethers.getSigners();
  
  // Get contract instances
  const groupPoolFactory = await ethers.getContractAt("GroupPoolFactory", CONTRACT_ADDRESSES.groupPoolFactory);
  
  // Create a group pool
  const purpose = "Emergency Fund for Community Center";
  const beneficiary = await user.getAddress(); // For demo, use deployer as beneficiary
  const targetAmount = ethers.parseUnits("5000", 6); // 5000 USDC target
  const deadline = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days from now
  
  console.log("🎯 Creating Group Pool...");
  console.log("   Purpose:", purpose);
  console.log("   Target:", ethers.formatUnits(targetAmount, 6), "USDC");
  console.log("   Deadline:", new Date(deadline * 1000).toLocaleString());
  
  const createTx = await groupPoolFactory.createPool(
    CONTRACT_ADDRESSES.mockUSDC,
    purpose,
    beneficiary,
    targetAmount,
    deadline
  );
  
  const receipt = await createTx.wait();
  
  // Get the created pool address from events
  const event = receipt?.logs.find((log: any) => {
    try {
      return groupPoolFactory.interface.parseLog(log)?.name === 'PoolCreated';
    } catch {
      return false;
    }
  });
  
  if (event) {
    const parsedEvent = groupPoolFactory.interface.parseLog(event);
    const poolAddress = parsedEvent?.args[0];
    console.log("✅ Pool created at:", poolAddress);
    
    // Test contribution to the pool
    const groupPool = await ethers.getContractAt("GroupPool", poolAddress);
    const contributionAmount = ethers.parseUnits("100", 6); // 100 USDC
    
    const mockUSDC = await ethers.getContractAt("MockUSDC", CONTRACT_ADDRESSES.mockUSDC);
    
    console.log("💰 Contributing to the pool...");
    const approveTx = await mockUSDC.approve(poolAddress, contributionAmount);
    await approveTx.wait();
    
    const contributeTx = await groupPool.contribute(contributionAmount);
    await contributeTx.wait();
    
    console.log("✅ Contributed", ethers.formatUnits(contributionAmount, 6), "USDC");
    
    // Check pool info
    const poolInfo = await groupPool.getPoolInfo();
    console.log("📊 Pool Info:");
    console.log("   Total Raised:", ethers.formatUnits(poolInfo.totalRaised, 6), "USDC");
    console.log("   Contributors:", poolInfo.contributorCount.toString());
    console.log("   Progress:", (Number(poolInfo.totalRaised) / Number(poolInfo.target) * 100).toFixed(2), "%");
  }
}

async function displayContractInfo(): Promise<void> {
  console.log("\n📋 CONTRACT INFORMATION");
  console.log("=".repeat(40));
  
  try {
    const mockUSDC = await ethers.getContractAt("MockUSDC", CONTRACT_ADDRESSES.mockUSDC);
    const rewardTreasury = await ethers.getContractAt("RewardTreasury", CONTRACT_ADDRESSES.rewardTreasury);
    const savingsVault = await ethers.getContractAt("SavingsVault", CONTRACT_ADDRESSES.savingsVault);
    const groupPoolFactory = await ethers.getContractAt("GroupPoolFactory", CONTRACT_ADDRESSES.groupPoolFactory);
    
    // MockUSDC info
    const name = await mockUSDC.name();
    const symbol = await mockUSDC.symbol();
    const decimals = await mockUSDC.decimals();
    console.log("🪙 MockUSDC:", name, `(${symbol})`, `- ${decimals} decimals`);
    
    // Treasury info
    const treasuryInfo = await rewardTreasury.getTreasuryInfo();
    console.log("🏦 Treasury Balance:", ethers.formatUnits(treasuryInfo.currentBalance, 6), "USDC");
    console.log("💸 Total Paid Out:", ethers.formatUnits(treasuryInfo.totalPaidOut, 6), "USDC");
    
    // Vault config
    const vaultConfig = await savingsVault.getVaultConfig();
    console.log("🏛️ Vault Reward Rate:", vaultConfig.rewardRate.toString(), "per second");
    console.log("⚡ Early Withdraw Penalty:", vaultConfig.penaltyBps.toString(), "bps");
    
    // Factory info
    const factoryInfo = await groupPoolFactory.getFactoryInfo();
    console.log("🏭 Total Pools Created:", factoryInfo.totalPools.toString());
    
  } catch (error) {
    console.error("❌ Error fetching contract info:", error);
  }
}

async function main(): Promise<void> {
  console.log("🚀 INTERACTING WITH DEPLOYED CONTRACTS");
  console.log("=".repeat(50));
  
  // Check if addresses are set
  if (Object.values(CONTRACT_ADDRESSES).some(addr => addr === "0x...")) {
    console.log("❌ Please update CONTRACT_ADDRESSES with your deployed contract addresses");
    return;
  }
  
  try {
    await displayContractInfo();
    await testSavingsVault();
    await testGroupPoolCreation();
    
    console.log("\n✅ All interactions completed successfully!");
  } catch (error) {
    console.error("❌ Error during interaction:", error);
  }
}

// Allow direct execution
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}