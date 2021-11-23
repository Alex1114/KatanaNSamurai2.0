// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

const NFT = artifacts.require("KatanaNSamurai2");

async function main() {


  let nftAddress = "0x70a73b3F25342A64f3f5862C8539a97119c9DDF4";
  let nft = await NFT.at(nftAddress);


  let numPurchase = 2;

  await nft.mintSamurai(numPurchase, {value: 100000000000000000});
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
