import { ethers, network, run } from "hardhat";
import { Contract } from "ethers";

// Configuration for Base Sepolia
const DEPLOYMENT_CONFIG = {
  // Reward Treasury Config
  GLOBAL_PAY_CAP: ethers.parseUnits("1000000", 6), // 1M USDC cap
  
  // Savings Vault Config
  REWARD_RATE_PER_SECOND: "1157", // ~1% APY (approximate: 1000000 / 31536000 * 0.01)
  EARLY_WITHDRAW_PENALTY_BPS: "500", // 5% penalty
  DEPOSIT_CASHBACK_BPS: "100", // 1% cashback
  PER_TX_REDEEM_CAP: ethers.parseUnits("1000", 6), // 1000 USDC per transaction
  
  // Mock USDC initial mint
  INITIAL_MINT_AMOUNT: ethers.parseUnits("10000000", 6), // 10M mock USDC
};

interface DeploymentAddresses {
  mockUSDC: string;
  rewardTreasury: string;
  groupPoolImplementation: string;
  groupPoolFactory: string;
  savingsVault: string;
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function verifyContract(contractAddress: string, constructorArgs: any[] = []): Promise<void> {
  try {
    console.log(`🔍 Verifying contract at ${contractAddress}...`);
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: constructorArgs,
    });
    console.log(`✅ Contract verified at ${contractAddress}`);
  } catch (error: any) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log(`✅ Contract ${contractAddress} is already verified`);
    } else {
      console.error(`❌ Verification failed for ${contractAddress}:`, error.message);
    }
  }
}

async function waitForConfirmation(tx: any, confirmations: number = 2): Promise<void> {
  console.log(`⏳ Waiting for ${confirmations} confirmations...`);
  await tx.wait(confirmations);
  console.log(`✅ Transaction confirmed`);
}

async function main(): Promise<void> {
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  
  console.log("=".repeat(60));
  console.log("🚀 DEPLOYING TO BASE SEPOLIA");
  console.log("=".repeat(60));
  console.log("📍 Deploying with account:", deployerAddress);
  console.log("🌐 Network:", network.name);
  
  const balance = await ethers.provider.getBalance(deployerAddress);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");
  
  if (balance < ethers.parseEther("0.01")) {
    throw new Error("❌ Insufficient balance. Need at least 0.01 ETH for deployment");
  }

  const deployedAddresses: Partial<DeploymentAddresses> = {};

  console.log("\n" + "=".repeat(60));
  console.log("1️⃣ DEPLOYING MOCK USDC");
  console.log("=".repeat(60));
  
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy();
  await mockUSDC.waitForDeployment();
  deployedAddresses.mockUSDC = await mockUSDC.getAddress();
  
  console.log("✅ MockUSDC deployed to:", deployedAddresses.mockUSDC);
  
  // Mint initial supply to deployer
  console.log("🪙 Minting initial USDC supply...");
  const mintTx = await mockUSDC.mint(deployerAddress, DEPLOYMENT_CONFIG.INITIAL_MINT_AMOUNT);
  await waitForConfirmation(mintTx);
  console.log("✅ Minted", ethers.formatUnits(DEPLOYMENT_CONFIG.INITIAL_MINT_AMOUNT, 6), "USDC");

  console.log("\n" + "=".repeat(60));
  console.log("2️⃣ DEPLOYING REWARD TREASURY");
  console.log("=".repeat(60));
  
  const RewardTreasury = await ethers.getContractFactory("RewardTreasury");
  const rewardTreasury = await RewardTreasury.deploy(
    deployedAddresses.mockUSDC,
    deployerAddress, // admin
    DEPLOYMENT_CONFIG.GLOBAL_PAY_CAP
  );
  await rewardTreasury.waitForDeployment();
  deployedAddresses.rewardTreasury = await rewardTreasury.getAddress();
  
  console.log("✅ RewardTreasury deployed to:", deployedAddresses.rewardTreasury);
  
  // Fund the treasury
  console.log("💰 Funding RewardTreasury...");
  const fundAmount = ethers.parseUnits("500000", 6); // 500K USDC
  const approveTx = await mockUSDC.approve(deployedAddresses.rewardTreasury, fundAmount);
  await waitForConfirmation(approveTx);
  
  const transferTx = await mockUSDC.transfer(deployedAddresses.rewardTreasury, fundAmount);
  await waitForConfirmation(transferTx);
  console.log("✅ Funded treasury with", ethers.formatUnits(fundAmount, 6), "USDC");

  console.log("\n" + "=".repeat(60));
  console.log("3️⃣ DEPLOYING GROUP POOL IMPLEMENTATION");
  console.log("=".repeat(60));
  
  const GroupPool = await ethers.getContractFactory("GroupPool");
  const groupPoolImplementation = await GroupPool.deploy();
  await groupPoolImplementation.waitForDeployment();
  deployedAddresses.groupPoolImplementation = await groupPoolImplementation.getAddress();
  
  console.log("✅ GroupPool Implementation deployed to:", deployedAddresses.groupPoolImplementation);

  console.log("\n" + "=".repeat(60));
  console.log("4️⃣ DEPLOYING GROUP POOL FACTORY");
  console.log("=".repeat(60));
  
  const GroupPoolFactory = await ethers.getContractFactory("GroupPoolFactory");
  const groupPoolFactory = await GroupPoolFactory.deploy(
    deployedAddresses.groupPoolImplementation,
    deployerAddress // admin
  );
  await groupPoolFactory.waitForDeployment();
  deployedAddresses.groupPoolFactory = await groupPoolFactory.getAddress();
  
  console.log("✅ GroupPoolFactory deployed to:", deployedAddresses.groupPoolFactory);

  console.log("\n" + "=".repeat(60));
  console.log("5️⃣ DEPLOYING SAVINGS VAULT");
  console.log("=".repeat(60));
  
  const SavingsVault = await ethers.getContractFactory("SavingsVault");
  const savingsVault = await SavingsVault.deploy(
    deployedAddresses.mockUSDC,
    deployerAddress, // admin
    deployerAddress, // feeCollector
    DEPLOYMENT_CONFIG.REWARD_RATE_PER_SECOND,
    DEPLOYMENT_CONFIG.EARLY_WITHDRAW_PENALTY_BPS,
    deployedAddresses.rewardTreasury
  );
  await savingsVault.waitForDeployment();
  deployedAddresses.savingsVault = await savingsVault.getAddress();
  
  console.log("✅ SavingsVault deployed to:", deployedAddresses.savingsVault);

  console.log("\n" + "=".repeat(60));
  console.log("6️⃣ CONFIGURING CONTRACTS");
  console.log("=".repeat(60));
  
  // Set savings vault as reward caller in treasury
  console.log("🔧 Setting SavingsVault as reward caller...");
  const setRewardCallerTx = await rewardTreasury.setRewardCaller(deployedAddresses.savingsVault, true);
  await waitForConfirmation(setRewardCallerTx);
  console.log("✅ SavingsVault granted REWARD_CALLER_ROLE");
  
  // Configure SavingsVault parameters
  console.log("🔧 Configuring SavingsVault parameters...");
  const setCashbackTx = await savingsVault.setDepositCashbackBps(DEPLOYMENT_CONFIG.DEPOSIT_CASHBACK_BPS);
  await waitForConfirmation(setCashbackTx);
  
  const setRedeemCapTx = await savingsVault.setPerTxRedeemCap(DEPLOYMENT_CONFIG.PER_TX_REDEEM_CAP);
  await waitForConfirmation(setRedeemCapTx);
  
  console.log("✅ SavingsVault configured with:");
  console.log("   📊 Deposit Cashback:", DEPLOYMENT_CONFIG.DEPOSIT_CASHBACK_BPS, "bps (1%)");
  console.log("   🔒 Per-tx Redeem Cap:", ethers.formatUnits(DEPLOYMENT_CONFIG.PER_TX_REDEEM_CAP, 6), "USDC");

  console.log("\n" + "=".repeat(60));
  console.log("7️⃣ CONTRACT VERIFICATION");
  console.log("=".repeat(60));
  
  // Wait a bit before verification
  console.log("⏳ Waiting 30 seconds before starting verification...");
  await sleep(30000);
  
  // Verify MockUSDC
  await verifyContract(deployedAddresses.mockUSDC!, []);
  await sleep(5000);
  
  // Verify RewardTreasury
  await verifyContract(deployedAddresses.rewardTreasury!, [
    deployedAddresses.mockUSDC,
    deployerAddress,
    DEPLOYMENT_CONFIG.GLOBAL_PAY_CAP
  ]);
  await sleep(5000);
  
  // Verify GroupPool Implementation
  await verifyContract(deployedAddresses.groupPoolImplementation!, []);
  await sleep(5000);
  
  // Verify GroupPoolFactory
  await verifyContract(deployedAddresses.groupPoolFactory!, [
    deployedAddresses.groupPoolImplementation,
    deployerAddress
  ]);
  await sleep(5000);
  
  // Verify SavingsVault
  await verifyContract(deployedAddresses.savingsVault!, [
    deployedAddresses.mockUSDC,
    deployerAddress,
    deployerAddress,
    DEPLOYMENT_CONFIG.REWARD_RATE_PER_SECOND,
    DEPLOYMENT_CONFIG.EARLY_WITHDRAW_PENALTY_BPS,
    deployedAddresses.rewardTreasury
  ]);

  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=".repeat(60));
  console.log("📋 DEPLOYED CONTRACTS:");
  console.log("=".repeat(60));
  console.log("MockUSDC:", deployedAddresses.mockUSDC);
  console.log("RewardTreasury:", deployedAddresses.rewardTreasury);
  console.log("GroupPool Implementation:", deployedAddresses.groupPoolImplementation);
  console.log("GroupPoolFactory:", deployedAddresses.groupPoolFactory);
  console.log("SavingsVault:", deployedAddresses.savingsVault);
  
  console.log("\n" + "=".repeat(60));
  console.log("📊 CONTRACT STATES:");
  console.log("=".repeat(60));
  
  // Display contract states
  const usdcBalance = await mockUSDC.balanceOf(deployerAddress);
  const treasuryBalance = await mockUSDC.balanceOf(deployedAddresses.rewardTreasury!);
  
  console.log("💰 Your USDC Balance:", ethers.formatUnits(usdcBalance, 6), "USDC");
  console.log("🏦 Treasury Balance:", ethers.formatUnits(treasuryBalance, 6), "USDC");
  
  const vaultConfig = await savingsVault.getVaultConfig();
  console.log("🏛️ Vault Reward Rate:", vaultConfig.rewardRate.toString(), "per second");
  console.log("⚡ Vault Penalty:", vaultConfig.penaltyBps.toString(), "bps");
  
  const treasuryInfo = await rewardTreasury.getTreasuryInfo();
  console.log("🎯 Treasury Cap:", ethers.formatUnits(treasuryInfo.globalCap, 6), "USDC");
  
  console.log("\n" + "=".repeat(60));
  console.log("🔗 BASESCAN LINKS:");
  console.log("=".repeat(60));
  Object.entries(deployedAddresses).forEach(([name, address]) => {
    console.log(`${name}: https://sepolia.basescan.org/address/${address}`);
  });
  
  console.log("\n✨ Ready to use! All contracts are deployed and configured.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });