import { task } from "hardhat/config";

task("transferFrom", "Transfers tokens from account")
.addParam("from", "Address of spender")
.addParam("to", "Address of spender")
.addParam("amount", "Amount to transfer")
.setAction(async (taskArgs, { ethers }) => {
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.attach("0x691d3E4bDD74fFb40E81cF070d4004Dd1CaCCD9F");
  await token.transferFrom(taskArgs.from, taskArgs.to, taskArgs.amount)
});

//npx hardhat --network ropsten transferFrom --from 0x4fA8DD85Ea24975a3028A05BA0c6bDeada7f7530 --to "0x108691CA61e04bC948FA2c17300CEEF4eEa83dc9" --amount "100"
