// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
require("@trufflesuite/web3-provider-engine");
const hre = require("hardhat");

const NFT = artifacts.require("KatanaNSamurai2");

async function main() {

  // let nftAddress = "0xf84D479C8430656C806153D9f9Da468eb7Ce00B1";
  // let nft = await NFT.at(nftAddress);
  // // let chainId = await ethers.provider.getNetwork()
  // let owner = new ethers.Wallet(process.env.RINKEBY_PRIVATE_KEY);
  let quantity = 1;
  let maxClaimNum = 1;

  // const domain = {
  //   name: 'Katana N Samurai 2',
  //   version: '1.0.0',
  //   chainId: 4,
  //   verifyingContract: nftAddress
  // };

  // const types = {
  //   NFT: [
  //       { name: 'addressForClaim', type: 'address' },
  //       { name: 'maxClaimNum', type: 'uint256' },
  //   ],
  // };

  // const value = { addressForClaim: "0xbd42A2035D41b450eE7106C9F9C0C736fb546226", maxClaimNum: 5};

  // signature = await owner._signTypedData(domain, types, value);
  // console.log(signature);
  signature = "0xdc39b1927a5f017ef5f1a795b38b4aed7f46d2998ea5f797accfc831fdc9cc580833a7e0411379e8b2b03589258f2283cde00ccf76dec1ef72a56a3fcaede53a1c"

  await nft.mintPresaleSamurai(quantity, maxClaimNum, signature, {value: "100000000000000000"});
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
