import { task } from "hardhat/config";

task("balanceOf", "Gets balance of address")
.addParam("address", "Address to get balance of")
.setAction(async (taskArgs, { ethers }) => {
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.attach("0x691d3E4bDD74fFb40E81cF070d4004Dd1CaCCD9F");
  const balance = await token.balanceOf(taskArgs.address)
  console.log(balance, "tokens");
});

//npx hardhat --network ropsten balanceOf --address "0x4fA8DD85Ea24975a3028A05BA0c6bDeada7f7530"
