const { ethers } = require("hardhat");

const NFT = artifacts.require("KatanaNSamurai2");

module.exports = async ({
  getNamedAccounts,
  deployments,
  getChainId,
  getUnnamedAccounts,
}) => {
  const {deploy, all} = deployments;
  const accounts = await ethers.getSigners();
  const deployer = accounts[0];
  console.log("");
  console.log("Deployer: ", deployer.address);

  nft = await deploy('KatanaNSamurai2', {
    contract: "KatanaNSamurai2",
    from: deployer.address,
    args: [
    ],
  });

  console.log("KatanaNSamurai2 address: ", nft.address);
};

module.exports.tags = ['KatanaNSamurai2'];