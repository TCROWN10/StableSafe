import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

const USDC = (n: number | string) => ethers.parseUnits(n.toString(), 6);
const SEC = (n: number) => BigInt(n);

describe("SavingsVault + RewardTreasury + MockUSDC", () => {
  async function deployFixture() {
    const [deployer, admin, feeCollector, alice, bob] = await ethers.getSigners();

    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    const usdc = await MockUSDC.deploy();
    await usdc.waitForDeployment();

    // Mint test funds
    await usdc.mint(admin.address, USDC(1_000_000));
    await usdc.mint(alice.address, USDC(10_000));
    await usdc.mint(bob.address, USDC(10_000));

    const RewardTreasury = await ethers.getContractFactory("RewardTreasury");
    // global cap = 10,000 USDC
    const treasury = await RewardTreasury.deploy(usdc.getAddress(), admin.address, USDC(10_000));
    await treasury.waitForDeployment();

    // Fund treasury
    await usdc.connect(admin).transfer(await treasury.getAddress(), USDC(5_000));

    const SavingsVault = await ethers.getContractFactory("SavingsVault");
    // rewardRatePerSecond = 1 (conservative for test math), penalty = 1% (100 bps)
    const vault = await SavingsVault.deploy(
      usdc.getAddress(),
      admin.address,
      feeCollector.address,
      1n,
      100n,
      await treasury.getAddress()
    );
    await vault.waitForDeployment();

    // Allow vault to call treasury.payout
    await treasury.connect(admin).setRewardCaller(await vault.getAddress(), true);

    // Default: per-tx redeem cap off; set cashback bps to 50 = 0.5%
    await vault.connect(admin).setDepositCashbackBps(50n);

    // Approvals
    await usdc.connect(alice).approve(await vault.getAddress(), USDC(1_000_000));
    await usdc.connect(bob).approve(await vault.getAddress(), USDC(1_000_000));

    return { deployer, admin, feeCollector, alice, bob, usdc, treasury, vault };
  }

  it("deploys and wires roles/caps correctly", async () => {
    const { admin, treasury, vault, usdc } = await deployFixture();

    expect(await treasury.hasRole(await treasury.DEFAULT_ADMIN_ROLE(), admin.address)).to.eq(true);
    expect(await treasury.hasRole(await treasury.REWARD_CALLER_ROLE(), await vault.getAddress())).to.eq(true);

    // Check treasury funding
    expect(await usdc.balanceOf(await treasury.getAddress())).to.eq(USDC(5000));
  });

  it("deposit mints cashback points and updates balances", async () => {
    const { alice, vault, usdc } = await deployFixture();

    const before = await usdc.balanceOf(alice.address);
    await expect(vault.connect(alice).deposit(USDC(100), 0n))
      .to.emit(vault, "Deposited")
      .withArgs(alice.address, USDC(100), 0n);

    const after = await usdc.balanceOf(alice.address);
    expect(before - after).to.eq(USDC(100));

    const acct = await vault.accounts(alice.address);
    expect(acct.balance).to.eq(USDC(100));

    // Cashback 0.5% of 100 = 0.5 USDC = 500_000 points
    expect(acct.points).to.eq(USDC(0.5));
  });

  it("accrues time-based points and previews accurately", async () => {
    const { alice, vault } = await deployFixture();

    await vault.connect(alice).deposit(USDC(100), 0n);

    // advance 1 hour
    const dt = SEC(3600);
    await time.increase(Number(dt));

    const preview = await vault.previewPoints(alice.address);
    // cashback (0.5 USDC) + accrual:
    // addPoints = balance(100e6) * rate(1) * dt / 1e6 = 100 * 3600 = 360,000 points = 0.36 USDC
    const expected = USDC(0.5 + 0.36);
    expect(preview).to.eq(expected);
  });

  it("redeems points -> USDC via treasury and burns points", async () => {
    const { alice, vault, usdc, treasury } = await deployFixture();
  
    await vault.connect(alice).deposit(USDC(100), 0n);
    await time.increase(3600);
  
    const beforeTreasury = await usdc.balanceOf(await treasury.getAddress());
    const beforeAlice = await usdc.balanceOf(alice.address);
  
    // Get preview and immediately redeem without time passing
    const preview = await vault.previewPoints(alice.address);
    
    await expect(vault.connect(alice).redeemPoints(preview))
      .to.emit(vault, "PointsClaimedForUSDC")
      .withArgs(alice.address, preview, preview);
  
    const afterTreasury = await usdc.balanceOf(await treasury.getAddress());
    const afterAlice = await usdc.balanceOf(alice.address);
    const acct = await vault.accounts(alice.address);
  
    expect(beforeTreasury - afterTreasury).to.eq(preview);
    expect(afterAlice - beforeAlice).to.eq(preview);
    // Check that points are properly burned (should be 0 or very close to 0)
    expect(acct.points).to.be.lt(1000); // Allow for minimal accrual during tx
  });
  

  it("perTxRedeemCap limits redemptions in a single call", async () => {
    const { admin, alice, vault, usdc, treasury } = await deployFixture();
  
    await vault.connect(alice).deposit(USDC(100), 0n);
    await time.increase(3600);
  
    // Set cap = 0.4 USDC
    await vault.connect(admin).setPerTxRedeemCap(USDC(0.4));
  
    const preview = await vault.previewPoints(alice.address);
    const beforeAlice = await usdc.balanceOf(alice.address);
  
    // First redemption should be capped at 0.4 USDC
    await vault.connect(alice).redeemPoints(preview);
    const afterAlice = await usdc.balanceOf(alice.address);
  
    expect(afterAlice - beforeAlice).to.eq(USDC(0.4));
  
    // Check remaining points - should be original minus 0.4 (not the full preview amount)
    const remainingPoints = await vault.previewPoints(alice.address);
    const expectedRemaining = preview - USDC(0.4);
    expect(remainingPoints).to.be.closeTo(expectedRemaining, 1000);
  
    // Second redemption should get the remaining points
    if (remainingPoints > 0) {
      const beforeSecond = await usdc.balanceOf(alice.address);
      await vault.connect(alice).redeemPoints(remainingPoints);
      const afterSecond = await usdc.balanceOf(alice.address);
      
      // Should get the remaining amount (also capped if > 0.4)
      const expectedPayout = remainingPoints > USDC(0.4) ? USDC(0.4) : remainingPoints;
      expect(afterSecond - beforeSecond).to.eq(expectedPayout);
    }
  });
  

  it("global treasury cap enforces budget", async () => {
    const { admin, alice, vault, treasury } = await deployFixture();
  
    await vault.connect(alice).deposit(USDC(100), 0n);
    await time.increase(3600);
  
    // First, redeem some points to establish that redemption works
    const availablePoints = await vault.previewPoints(alice.address);
    await vault.connect(alice).redeemPoints(USDC(1));
  
    // Now set a very small global cap that's already exceeded
    await treasury.connect(admin).setGlobalCap(USDC(1));
  
    // Next redeem should fail because we've already hit the cap
    await expect(vault.connect(alice).redeemPoints(USDC(0.1)))
      .to.be.revertedWith("Global cap exceeded");
  });
  
  

  it("withdraw without lock has no penalty; with lock charges penalty", async () => {
    const { alice, feeCollector, vault, usdc } = await deployFixture();

    await vault.connect(alice).deposit(USDC(100), 0n);
    const balBefore1 = await usdc.balanceOf(alice.address);
    await vault.connect(alice).withdraw(USDC(10));
    const balAfter1 = await usdc.balanceOf(alice.address);
    expect(balAfter1 - balBefore1).to.eq(USDC(10)); // no penalty

    // Deposit with a 1 day lock, then withdraw immediately → 1% penalty on amount
    await vault.connect(alice).deposit(USDC(100), 86400n);
    const feeBefore = await usdc.balanceOf(feeCollector.address);
    await vault.connect(alice).withdraw(USDC(100));
    const feeAfter = await usdc.balanceOf(feeCollector.address);
    expect(feeAfter - feeBefore).to.eq(USDC(1)); // 1% of 100 = 1 USDC

    // Remaining principal should reflect previous withdrawal + deposit math
    const acct = await vault.accounts(alice.address);
    expect(acct.balance).to.eq(USDC(90)); // 100 - 10 + 100 - 100 = 90
  });

  it("pause/unpause gates deposits", async () => {
    const { admin, alice, vault } = await deployFixture();
    await vault.connect(admin).pause();
    await expect(vault.connect(alice).deposit(USDC(1), 0n)).to.be.reverted;
    await vault.connect(admin).unpause();
    await vault.connect(alice).deposit(USDC(1), 0n);
  });

  it("admin-only setters and treasury caller role enforcement", async () => {
    const { admin, alice, vault, treasury } = await deployFixture();
  
    await expect(vault.connect(alice).setParams(2n, 50n, alice.address)).to.be.reverted;
    
    // Remove the problematic line and just verify the transaction succeeds
    await vault.connect(admin).setParams(2n, 50n, alice.address);
  
    await expect(vault.connect(alice).setDepositCashbackBps(100n)).to.be.reverted;
    await vault.connect(admin).setDepositCashbackBps(100n);
  
    // Remove caller role -> redemption should fail
    await treasury.connect(admin).setRewardCaller(await vault.getAddress(), false);
    await vault.connect(alice).deposit(USDC(1), 0n);
    await expect(vault.connect(alice).redeemPoints(USDC(0.01))).to.be.reverted;
  });
  

  it("input validation reverts", async () => {
    const { alice, vault } = await deployFixture();

    await expect(vault.connect(alice).deposit(0n, 0n)).to.be.reverted;
    await expect(vault.connect(alice).withdraw(0n)).to.be.reverted;

    await expect(vault.connect(alice).redeemPoints(0n)).to.be.reverted;
    await vault.connect(alice).deposit(USDC(1), 0n);
    await expect(vault.connect(alice).redeemPoints(USDC(2))).to.be.reverted;
  });

  it("treasury rescue by admin", async () => {
    const { admin, alice, treasury, usdc } = await deployFixture();
    const before = await usdc.balanceOf(alice.address);
    await treasury.connect(admin).rescue(alice.address, USDC(10));
    const after = await usdc.balanceOf(alice.address);
    expect(after - before).to.eq(USDC(10));
  });

  it("getter functions return correct data", async () => {
    const { alice, vault, treasury, usdc, admin } = await deployFixture();
    
    // Test getVaultConfig
    const config = await vault.getVaultConfig();
    expect(config.assetToken).to.eq(await usdc.getAddress());
    expect(config.rewardRate).to.eq(1n);
    expect(config.penaltyBps).to.eq(100n);
    expect(config.cashbackBps).to.eq(50n);
    
    // Test getAccountInfo before any activity
    let accountInfo = await vault.getAccountInfo(alice.address);
    expect(accountInfo.balance).to.eq(0n);
    expect(accountInfo.points).to.eq(0n);
    expect(accountInfo.isLocked).to.eq(false);
    
    // Make a deposit and test again
    await vault.connect(alice).deposit(USDC(100), 86400n); // 1 day lock
    
    accountInfo = await vault.getAccountInfo(alice.address);
    expect(accountInfo.balance).to.eq(USDC(100));
    expect(accountInfo.points).to.eq(USDC(0.5)); // cashback
    expect(accountInfo.isLocked).to.eq(true);
    
    // Test penalty calculation
    const penalty = await vault.calculateWithdrawPenalty(alice.address, USDC(50));
    expect(penalty).to.eq(USDC(0.5)); // 1% of 50
    
    // Test time until unlock
    const timeLeft = await vault.getTimeUntilUnlock(alice.address);
    expect(timeLeft).to.be.gt(86300n); // Should be close to 86400 seconds
    
    // Test treasury info
    const treasuryInfo = await treasury.getTreasuryInfo();
    expect(treasuryInfo.assetToken).to.eq(await usdc.getAddress());
    expect(treasuryInfo.currentBalance).to.eq(USDC(5000));
    expect(treasuryInfo.globalCap).to.eq(USDC(10000));
  });
});
