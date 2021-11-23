const { assert, expect } = require('chai');
const { BN, time, expectRevert, constants, balance } = require('@openzeppelin/test-helpers');
const { artifacts, ethers } = require('hardhat');

describe("KatanaNSamurai2", function () {

  let Token;
  let contract;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  before(async function () {
    // Get the ContractFactory and Signers here.
    Token = await ethers.getContractFactory("KatanaNSamurai2");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    contract = await Token.deploy();
    console.log("KatanaNSamurai2 deployed to:", contract.address);

  });

  describe("isPresaleEligible Function", function() {

    it("isPresaleEligible Function", async function(){
    
      // let quantity = 2;
      // let chainId = await ethers.provider.getNetwork()
      let _MAX_CLAIM_FRENS_ON_PRESALE = 10;
      let _START_PRESALE_MINT_TIMESTAMP = 1636128000;

      const domain = {
        name: 'Katana N Samurai 2',
        version: '1.0.0',
        chainId: 31337,
        verifyingContract: '0x668eD30aAcC7C7c206aAF1327d733226416233E2'
      };
    
      const types = {
        NFT: [
            { name: 'addressForPresaleClaim', type: 'address' },
            { name: 'maxClaimNumOnPresale', type: 'uint256' },
        ],
      };
    
      const value = { addressForPresaleClaim: "0x959fd7ef9089b7142b6b908dc3a8af7aa8ff0fa1", maxClaimNumOnPresale: 10};
    
      signature = await owner._signTypedData(domain, types, value);

      await contract.mintPresaleSamurai(2, 10, signature, {value: "100000000000000000"});


    });



// describe("KatanaNSamurai Contract", function(){

//   let owner;
//   let user;
//   let nft;

//   before(async function() {
//     accounts = await ethers.getSigners();
//     owner = "0xbd42A2035D41b450eE7106C9F9C0C736fb546226"
//     user = accounts[1];
//     console.log(accounts);
//   });

//   beforeEach(async function() {
//     nft = await NFT.new({from: owner});
//     console.log(nft.address);
//   });


  // describe("KatanaNSamurai mintSamurai", function() {

  //   it("KatanaNSamurai mintSamurai", async function(){

  //     await contract.mintSamurai(1, {value: 50000000000000000, from: owner.address});



  //     // await expectRevert(
  //     //   nft.claimSamurai(1, {value: 50000000000000000}), "Error");

  //     // await expectRevert(
  //     //   nft.tokenURI(2), "ERC721Metadata: URI query for nonexistent token");

  //     // await nft.mintSamurai(2, {value: 100000000000000000});

  //     // let queriedURI = await nft.tokenURI(2);

  //     // assert.equal(queriedURI, uri);
  //     // console.log("QueriedURI: ", queriedURI);
  //   });

});
});