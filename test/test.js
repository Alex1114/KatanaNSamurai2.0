const {
	assert,
	expect
} = require('chai');
const {
	BN,
	time,
	expectRevert,
	constants,
	balance
} = require('@openzeppelin/test-helpers');
const {
	artifacts,
	ethers
} = require('hardhat');

describe("KatanaNSamurai2", function () {

	let Token;
	let contract;
	let owner;
	let addr1;
	let addr2;
	let addrs;

	before(async function () {

		Token = await ethers.getContractFactory("KatanaNSamurai2");
		[owner, addr1, addr2, ...addrs] = await ethers.getSigners();

		contract = await Token.deploy();
		console.log("KatanaNSamurai2 deployed to:", contract.address);

	});

	describe("KatanaNSamurai2 Test", function () {

		it("pauseSale Function", async function () {

			await contract.connect(owner).pauseSale();

		});

		it("pausePresale Function", async function () {

			await contract.connect(owner).pausePresale();

		});

		it("startSale Function", async function () {

			await contract.connect(owner).startSale();

		});


		it("startPresale Function", async function () {

			await contract.connect(owner).startPresale();

		});

		it("giveawayMintSamurai Function", async function () {

			await contract.connect(owner).giveawayMintSamurai(addr2.address, 50);
			// expect(await contract.totalSupply()).to.equal(50);

		});

		it("mintSamurai Function", async function () {

			await contract.connect(addr2).mintSamurai(50, {value: "2500000000000000000"});
			// expect(await contract.totalSupply()).to.equal(100);

		});

		it("mintPresaleSamurai Function", async function () {

			let quantity = 2;
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
				NFT: [{
						name: 'addressForClaim',
						type: 'address'
					},
					{
						name: 'maxClaimNum',
						type: 'uint256'
					},
				],
			};

			const value = {
				addressForClaim: addr1.address,
				maxClaimNum: 10
			};

			signature = await owner._signTypedData(domain, types, value);

			await contract.connect(addr1).mintPresaleSamurai(quantity, _MAX_CLAIM_FRENS_ON_PRESALE, signature, {value: "100000000000000000"});

		});

		it("withdrawAll Function", async function () {

			await contract.connect(owner).withdrawAll();

		});
	});
});