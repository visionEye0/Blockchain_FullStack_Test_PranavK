const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CropInsuranceNFT", function () {
  let CropInsuranceNFT, cropInsurance, owner, addr1, addr2;

  beforeEach(async function () {
    CropInsuranceNFT = await ethers.getContractFactory("CropInsuranceNFT");
    [owner, addr1, addr2] = await ethers.getSigners();

    cropInsurance = await CropInsuranceNFT.deploy();
    await cropInsurance.deployed();
  });

  it("should mint a policy NFT correctly", async function () {
    const expirationDate = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30 days from now

    // Mint from addr1
    const tx = await cropInsurance.connect(addr1).mintPolicyNFT(
      "farmer1",
      "Wheat",
      1000,
      50,
      expirationDate
    );
    const receipt = await tx.wait();

    // tokenId should be 1
    expect(await cropInsurance.nextTokenId()).to.equal(2);

    // Check owner of tokenId 1
    expect(await cropInsurance.ownerOf(1)).to.equal(addr1.address);

    // Check policy details
    const policy = await cropInsurance.getPolicyDetails(1);
    expect(policy.policyId).to.equal(1);
    expect(policy.farmerId).to.equal("farmer1");
    expect(policy.cropType).to.equal("Wheat");
    expect(policy.coverageAmount).to.equal(1000);
    expect(policy.premium).to.equal(50);
    expect(policy.expirationDate).to.equal(expirationDate);
    expect(policy.claimed).to.equal(false);
  });

  it("should allow owner to claim a policy", async function () {
    const expirationDate = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;

    await cropInsurance.connect(addr1).mintPolicyNFT(
      "farmer1",
      "Corn",
      2000,
      100,
      expirationDate
    );

    // Claim policy tokenId 1 from addr1 (owner)
    await cropInsurance.connect(addr1).claimPolicy(1);

    const policy = await cropInsurance.getPolicyDetails(1);
    expect(policy.claimed).to.equal(true);
  });

  it("should NOT allow non-owner to claim a policy", async function () {
    const expirationDate = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;

    await cropInsurance.connect(addr1).mintPolicyNFT(
      "farmer1",
      "Rice",
      1500,
      75,
      expirationDate
    );

    // addr2 tries to claim tokenId 1 - should revert
    await expect(
      cropInsurance.connect(addr2).claimPolicy(1)
    ).to.be.revertedWith("Not policy owner");
  });

  it("should NOT allow claiming an already claimed policy", async function () {
    const expirationDate = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;

    await cropInsurance.connect(addr1).mintPolicyNFT(
      "farmer1",
      "Barley",
      1800,
      80,
      expirationDate
    );

    await cropInsurance.connect(addr1).claimPolicy(1);

    await expect(
      cropInsurance.connect(addr1).claimPolicy(1)
    ).to.be.revertedWith("Already claimed");
  });

  it("should NOT allow claiming an expired policy", async function () {
    // Expiration date in the past
    const expirationDate = Math.floor(Date.now() / 1000) - 1000;

    await cropInsurance.connect(addr1).mintPolicyNFT(
      "farmer1",
      "Soy",
      1000,
      50,
      expirationDate
    );

    await expect(
      cropInsurance.connect(addr1).claimPolicy(1)
    ).to.be.revertedWith("Policy expired");
  });
});
