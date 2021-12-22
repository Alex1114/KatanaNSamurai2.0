// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

const NFT = artifacts.require("KatanaNSamurai2");


async function main() {

  let nftAddress = "0x6cAf21819C8B31E87e3bD7eB0433C56bD76cC5d8";
  let nft = await NFT.at(nftAddress);
  // let chainId = await ethers.provider.getNetwork()
  let owner = new ethers.Wallet(process.env.RINKEBY_PRIVATE_KEY);
  let quantity = 2;
  let maxClaimNum = 50;

  const domain = {
    name: 'Katana N Samurai 2',
    version: '1.0.0',
    chainId: 4,
    verifyingContract: nftAddress
  };

  const types = {
    NFT: [
        { name: 'addressForClaim', type: 'address' },
        { name: 'maxClaimNum', type: 'uint256' },
    ],
  };

  const value = { addressForClaim: "0xf84D479C8430656C806153D9f9Da468eb7Ce00B1", maxClaimNum: 50};

  signature = await owner._signTypedData(domain, types, value);
  console.log(signature);

  // await nft.claimSamurai(quantity, maxClaimNum, signature);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
