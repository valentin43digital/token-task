import { task } from "hardhat/config";

task("transfer", "Transfers tokens to address")
.addParam("address", "Address to transfer to")
.addParam("amount", "Amount to transfer")
.setAction(async (taskArgs, { ethers }) => {
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.attach("0x691d3E4bDD74fFb40E81cF070d4004Dd1CaCCD9F");
  await token.transfer(taskArgs.address, taskArgs.amount)
});

//npx hardhat --network ropsten transfer --address "0x108691CA61e04bC948FA2c17300CEEF4eEa83dc9" --amount "100"
