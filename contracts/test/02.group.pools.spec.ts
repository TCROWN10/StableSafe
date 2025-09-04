import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

const USDC = (n: number | string) => ethers.parseUnits(n.toString(), 6);

describe("GroupPoolFactory + GroupPool", () => {
  async function deployFixture() {
    const [deployer, admin, alice, bob, beneficiary] = await ethers.getSigners();

    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    const usdc = await MockUSDC.deploy();
    await usdc.waitForDeployment();

    await usdc.mint(alice.address, USDC(10_000));
    await usdc.mint(bob.address, USDC(10_000));

    const GroupPool = await ethers.getContractFactory("GroupPool");
    const impl = await GroupPool.deploy();
    await impl.waitForDeployment();

    const GroupPoolFactory = await ethers.getContractFactory("GroupPoolFactory");
    const factory = await GroupPoolFactory.deploy(await impl.getAddress(), admin.address);
    await factory.waitForDeployment();

    return { deployer, admin, alice, bob, beneficiary, usdc, impl, factory };
  }

  async function createPool(factory: any, usdcAddr: string, creator: any, purpose: string, beneficiary: string, target: bigint, deadline: bigint) {
    const tx = await factory.connect(creator).createPool(usdcAddr, purpose, beneficiary, target, deadline);
    const rc = await tx.wait();
    const evt = rc!.logs.find((l: any) => l.fragment?.name === "PoolCreated");
    const poolAddr = evt!.args.pool as string;
    const pool = await (await ethers.getContractFactory("GroupPool")).attach(poolAddr);
    return pool;
  }

  it("creates a pool and initializes state", async () => {
    const { factory, admin, alice, beneficiary, usdc } = await deployFixture();
    const deadline = BigInt((await time.latest()) + 7 * 24 * 3600);

    const pool = await createPool(factory, await usdc.getAddress(), alice, "Holiday fund", beneficiary.address, USDC(1000), deadline);

    expect(await pool.creator()).to.eq(alice.address);
    expect(await pool.purpose()).to.eq("Holiday fund");
    expect(await pool.beneficiary()).to.eq(beneficiary.address);
    expect(await pool.targetAmount()).to.eq(USDC(1000));
    expect(await pool.deadline()).to.eq(deadline);
    expect(await pool.initialized()).to.eq(true);
  });

  it("accepts contributions until deadline and tracks totals", async () => {
    const { factory, alice, bob, beneficiary, usdc } = await deployFixture();
    const deadline = BigInt((await time.latest()) + 3 * 24 * 3600);
    const pool = await createPool(factory, await usdc.getAddress(), alice, "Laptop", beneficiary.address, USDC(1500), deadline);

    await usdc.connect(alice).approve(await pool.getAddress(), USDC(2000));
    await usdc.connect(bob).approve(await pool.getAddress(), USDC(2000));

    await expect(pool.connect(alice).contribute(USDC(500)))
      .to.emit(pool, "Contributed")
      .withArgs(alice.address, USDC(500), USDC(500));

    await expect(pool.connect(bob).contribute(USDC(700)))
      .to.emit(pool, "Contributed")
      .withArgs(bob.address, USDC(700), USDC(1200));

    expect(await pool.totalContributed()).to.eq(USDC(1200));

    // cannot contribute after deadline
    await time.increaseTo(Number(deadline) + 1);
    await expect(pool.connect(alice).contribute(USDC(1))).to.be.reverted;
  });

  it("releases to beneficiary if target met after deadline", async () => {
    const { factory, alice, bob, beneficiary, usdc } = await deployFixture();
    const deadline = BigInt((await time.latest()) + 2 * 24 * 3600);
    const pool = await createPool(factory, await usdc.getAddress(), alice, "Community goal", beneficiary.address, USDC(1000), deadline);

    await usdc.connect(alice).approve(await pool.getAddress(), USDC(2000));
    await usdc.connect(bob).approve(await pool.getAddress(), USDC(2000));
    await pool.connect(alice).contribute(USDC(600));
    await pool.connect(bob).contribute(USDC(500));

    expect(await pool.totalContributed()).to.eq(USDC(1100));
    expect(await pool.canRelease()).to.eq(false);

    await time.increaseTo(Number(deadline) + 1);

    expect(await pool.canRelease()).to.eq(true);

    const before = await usdc.balanceOf(beneficiary.address);
    await expect(pool.connect(bob).release())
      .to.emit(pool, "Released");
    const after = await usdc.balanceOf(beneficiary.address);

    // All funds moved
    expect(after - before).to.eq(USDC(1100));

    // cannot release twice
    await expect(pool.connect(alice).release()).to.be.reverted;
  });

  it("refunds contributors if target not met after deadline", async () => {
    const { factory, alice, bob, beneficiary, usdc } = await deployFixture();
    const deadline = BigInt((await time.latest()) + 24 * 3600);
    const pool = await createPool(factory, await usdc.getAddress(), alice, "Emergency fund", beneficiary.address, USDC(2000), deadline);
  
    await usdc.connect(alice).approve(await pool.getAddress(), USDC(1000));
    await usdc.connect(bob).approve(await pool.getAddress(), USDC(1000));
  
    const aBefore = await usdc.balanceOf(alice.address);
    const bBefore = await usdc.balanceOf(bob.address);
  
    await pool.connect(alice).contribute(USDC(400));
    await pool.connect(bob).contribute(USDC(500));
  
    // Verify contributors were tracked
    expect(await pool.getContributorCount()).to.eq(2);
  
    await time.increaseTo(Number(deadline) + 1);
  
    // Test getContributionInfo
    const aliceInfo = await pool.getContributionInfo(alice.address);
    expect(aliceInfo.userContribution).to.eq(USDC(400));
    expect(aliceInfo.canRefundUser).to.eq(true);
  
    // Not enough to meet target
    await expect(pool.connect(alice).refund())
      .to.emit(pool, "Refunded")
      .withArgs(alice.address, USDC(400));
  
    await expect(pool.connect(bob).refund())
      .to.emit(pool, "Refunded")
      .withArgs(bob.address, USDC(500));
  
    const aAfter = await usdc.balanceOf(alice.address);
    const bAfter = await usdc.balanceOf(bob.address);
  
    expect(aAfter - aBefore).to.eq(0n);
    expect(bAfter - bBefore).to.eq(0n);
  
    // Cannot refund twice
    await expect(pool.connect(alice).refund()).to.be.reverted;
  });

  it("guards initialization and deadline/target checks", async () => {
    const { impl, factory, alice, beneficiary, usdc } = await deployFixture();
    const deadline = BigInt((await time.latest()) + 3600);
    const pool = await createPool(factory, await usdc.getAddress(), alice, "One-time init", beneficiary.address, USDC(100), deadline);

    // second init should revert
    await expect(
      pool.init(await usdc.getAddress(), alice.address, "Again", beneficiary.address, USDC(1), deadline)
    ).to.be.reverted;

    // release before deadline reverts
    await expect(pool.release()).to.be.reverted;
  });

  it("tracks contributors correctly", async () => {
    const { factory, alice, bob, beneficiary, usdc } = await deployFixture();
    const deadline = BigInt((await time.latest()) + 24 * 3600);
    const pool = await createPool(factory, await usdc.getAddress(), alice, "Test Pool", beneficiary.address, USDC(1000), deadline);
  
    await usdc.connect(alice).approve(await pool.getAddress(), USDC(2000));
    await usdc.connect(bob).approve(await pool.getAddress(), USDC(2000));
  
    // Initially no contributors
    expect(await pool.getContributorCount()).to.eq(0);
  
    // Alice contributes
    await pool.connect(alice).contribute(USDC(300));
    expect(await pool.getContributorCount()).to.eq(1);
    expect(await pool.hasContributed(alice.address)).to.eq(true);
  
    // Alice contributes again (shouldn't increase count)
    await pool.connect(alice).contribute(USDC(200));
    expect(await pool.getContributorCount()).to.eq(1);
  
    // Bob contributes (should increase count)
    await pool.connect(bob).contribute(USDC(400));
    expect(await pool.getContributorCount()).to.eq(2);
  
    // Test getContributors
    const contributors = await pool.getContributors();
    expect(contributors.length).to.eq(2);
    expect(contributors[0]).to.eq(alice.address);
    expect(contributors[1]).to.eq(bob.address);
  
    // Test contributor pagination
    const page = await pool.getContributorsPage(0, 10);
    expect(page.contributorAddresses.length).to.eq(2);
    expect(page.contributorAmounts[0]).to.eq(USDC(500)); // Alice's total
    expect(page.contributorAmounts[1]).to.eq(USDC(400)); // Bob's total
    expect(page.totalCount).to.eq(2);
  });
  
  it("getPoolInfo returns complete pool data", async () => {
    const { factory, alice, bob, beneficiary, usdc } = await deployFixture();
    const deadline = BigInt((await time.latest()) + 24 * 3600);
    const pool = await createPool(factory, await usdc.getAddress(), alice, "Test Pool", beneficiary.address, USDC(1000), deadline);
  
    await usdc.connect(alice).approve(await pool.getAddress(), USDC(2000));
    await usdc.connect(bob).approve(await pool.getAddress(), USDC(2000));
  
    // Test initial pool info
    let poolInfo = await pool.getPoolInfo();
    expect(poolInfo.assetToken).to.eq(await usdc.getAddress());
    expect(poolInfo.poolCreator).to.eq(alice.address);
    expect(poolInfo.poolPurpose).to.eq("Test Pool");
    expect(poolInfo.poolBeneficiary).to.eq(beneficiary.address);
    expect(poolInfo.target).to.eq(USDC(1000));
    expect(poolInfo.totalRaised).to.eq(0);
    expect(poolInfo.contributorCount).to.eq(0);
    expect(poolInfo.isReleased).to.eq(false);
    expect(poolInfo.canReleaseNow).to.eq(false);
    expect(poolInfo.canRefundNow).to.eq(false);
  
    // Add contributions
    await pool.connect(alice).contribute(USDC(600));
    await pool.connect(bob).contribute(USDC(500));
  
    poolInfo = await pool.getPoolInfo();
    expect(poolInfo.totalRaised).to.eq(USDC(1100));
    expect(poolInfo.contributorCount).to.eq(2);
  
    // Test funding progress
    const progress = await pool.getFundingProgress();
    expect(progress).to.eq(11000); // 110% in basis points
  
    // Test pool status (should be active)
    expect(await pool.getPoolStatus()).to.eq(0);
  
    // Move past deadline
    await time.increaseTo(Number(deadline) + 1);
  
    poolInfo = await pool.getPoolInfo();
    expect(poolInfo.canReleaseNow).to.eq(true); // Target met and past deadline
    expect(poolInfo.timeRemaining).to.eq(0);
  
    // Test pool status (should be successful)
    expect(await pool.getPoolStatus()).to.eq(1);
  });
  
  it("factory tracks pool creation count", async () => {
    const { factory, alice, beneficiary, usdc } = await deployFixture();
    const deadline = BigInt((await time.latest()) + 24 * 3600);
  
    // Initial count should be 0
    const initialInfo = await factory.getFactoryInfo();
    expect(initialInfo.totalPools).to.eq(0);
  
    // Create first pool
    await createPool(factory, await usdc.getAddress(), alice, "Pool 1", beneficiary.address, USDC(1000), deadline);
    
    let info = await factory.getFactoryInfo();
    expect(info.totalPools).to.eq(1);
  
    // Create second pool
    await createPool(factory, await usdc.getAddress(), alice, "Pool 2", beneficiary.address, USDC(2000), deadline + 3600n);
    
    info = await factory.getFactoryInfo();
    expect(info.totalPools).to.eq(2);
  });
});
