import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat"
import { Token } from "../typechain"
const {isCallTrace} = require("hardhat/internal/hardhat-network/stack-traces/message-trace")

describe("Token contract", function () {
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let token: Contract;
  const name = "Token name";
  const symbol = "TKN";
  const decimals = 10;
  const totalSupply = 1000000;

  beforeEach(async function(){
    [owner, addr1, addr2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token", owner);
    token = await Token.deploy(name, symbol, decimals, totalSupply);
    await token.deployed();
    //console.log(token.address);
  })
  describe("Deployment", function() {
    it("should be deployed", async function () {
      expect(token.address).to.be.properAddress;
    })
    it("should set the right owner", async function () {
      expect(await token.owner()).to.equal(owner.address);
    })
    it("should set the right name", async function () {
      expect(await token.name()).to.equal(name);
    })
    it("should set the right symbol", async function () {
      expect(await token.symbol()).to.equal(symbol);
    })
    it("should set the right decimals", async function () {
      expect(await token.decimals()).to.equal(decimals);
    })
    it("should set the right total supply", async function () {
      expect(await token.totalSupply()).to.equal(totalSupply);
    })
    it("should be possible to get balance", async function () {
      expect(await token.connect(addr1).balanceOf(addr1.address)).to.equal(0);
      let amount = 120;
      await token.connect(owner).transfer(addr1.address, amount);
      expect(await token.connect(addr1).balanceOf(addr1.address)).to.equal(amount);
    })
    it("should be possible to get allowance", async function () {
      expect(await token.connect(addr1).allowance(addr1.address, addr2.address)).to.equal(0);
    })
  })

  describe("Transfers", function() {
    it("should be possible to transfer tokens", async function () {
      let amount = 120;
      let balance = await token.connect(owner).balanceOf(owner.address);
      await token.connect(owner).transfer(addr1.address, amount);
      expect(await token.connect(addr1).balanceOf(addr1.address)).to.equal(amount);
      expect(await token.connect(owner).balanceOf(owner.address)).to.equal(balance-amount);
    })
    it("should be impossible to transfer tokens when balance is lower than amount", async function () {
      let amount = 120;
      await expect(token.connect(addr1).transfer(addr2.address, amount)).to.be.revertedWith("Not enough balance");
    })
    it("should be possible to approve transfer", async function () {
      let amount = 120;
      await token.connect(owner).approve(addr1.address, amount);
      expect(await token.connect(addr1).allowance(owner.address, addr1.address)).to.equal(amount);
      //expect(await token.connect(owner).approve(addr1.address, amount)).to.be.true;
    })
    it("should be impossible to approve transfer for balance lower than amount", async function () {
      let amount = 120;
      await expect(token.connect(addr1).approve(addr2.address, amount)).to.be.revertedWith("Not enough balance");
    })
    it("should be possible to transfer from account after approve", async function () {
      let amount = 120;
      let balance = await token.connect(owner).balanceOf(owner.address);
      await token.connect(owner).approve(addr1.address, amount);
      await token.connect(addr1).transferFrom(owner.address, addr1.address, amount)
      expect(await token.connect(addr1).balanceOf(addr1.address)).to.equal(amount);
      expect(await token.connect(owner).balanceOf(owner.address)).to.equal(balance-amount);
    })
    it("should be impossible to transfer from account after approve when allowance is lower than amount", async function () {
      let amount1 = 120;
      let amount2 = 250;
      await token.connect(owner).approve(addr1.address, amount1);
      await expect(token.connect(addr1).transferFrom(owner.address, addr1.address, amount2)).to.be.revertedWith("Not enough allowance")

    })
  })

  describe("Burn and mint", function() {
    it("should be possible for owner to burn tokens", async function () {
      let amount = 120;
      expect(await token.connect(owner).balanceOf(owner.address)).to.equal(totalSupply);
      await token.connect(owner).burn(owner.address, amount);
      expect(await token.connect(owner).balanceOf(owner.address)).to.equal(totalSupply-amount);
    })
    it("should be impossible for non owner to burn tokens", async function () {
      let amount = 120;
      await expect(token.connect(addr1).burn(addr1.address, amount)).to.be.revertedWith("You are not owner");
    })
    it("should be impossible for owner to burn tokens more than balance", async function () {
      let balance = await token.connect(owner).balanceOf(owner.address);
      let amount = balance+120;
      await expect(token.connect(owner).burn(owner.address, amount)).to.be.revertedWith("Not enough balance");
    })
    it("should be possible for owner to mint tokens", async function () {
      let amount = 120;
      expect(await token.connect(owner).balanceOf(owner.address)).to.equal(totalSupply);
      await token.connect(owner).mint(owner.address, amount);
      expect(await token.connect(owner).balanceOf(owner.address)).to.equal(totalSupply+amount);
    })
    it("should be impossible for non owner to mint tokens", async function () {
      let amount = 120;
      await expect(token.connect(addr1).mint(addr1.address, amount)).to.be.revertedWith("You are not owner");
    })
  })
});
  