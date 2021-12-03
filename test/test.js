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

		it("pauseClaim Function", async function () {

			await contract.connect(owner).pauseClaim();

		});

		it("pausePresale Function", async function () {

			await contract.connect(owner).pausePresale();

		});

		it("startSale Function", async function () {

			await contract.connect(owner).startSale();

		});

		it("startClaim Function", async function () {

			await contract.connect(owner).startClaim();

		});

		it("startPresale Function", async function () {

			await contract.connect(owner).startPresale();

		});

		it("giveawayMintSamurai Function", async function () {

			await contract.connect(owner).giveawayMintSamurai(addr2.address, 2);
			expect(await contract.totalSupply()).to.equal(2);

		});

		it("mintSamurai Function", async function () {

			await contract.connect(addr2).mintSamurai(50, {value: "2500000000000000000"});
			expect(await contract.totalSupply()).to.equal(52);

		});

		it("mintPresaleSamurai Function", async function () {

			let quantity = 2;
			// let chainId = await ethers.provider.getNetwork()
			let _MAX_CLAIM_FRENS_ON_PRESALE = 10;

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

		it("setURI", async function () {

			await contract.connect(owner).setURI("http://api.katanansamurai.art/metadata/");

		});

		it("setMAX_SAMURAI", async function () {

			await contract.connect(owner).setMAX_SAMURAI(10000);

		});

		it("set_PRICE", async function () {

			await contract.connect(owner).set_PRICE("10000000000000000");

		});

		it("tokenURI", async function () {

			await contract.connect(owner).tokenURI(2);

		});
	});
});