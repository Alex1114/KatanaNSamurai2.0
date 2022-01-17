const hre = require("hardhat");

var faunadb = require('faunadb');
var q = faunadb.query;
var adminClient = new faunadb.Client({
	secret: process.env.REACT_APP_FAUNA_KEY
});

async function main() {

	let nftAddress = "0xc2f633850f2c2f2b8049bf9bb051ae8121f0bfc5";
	let owner = new ethers.Wallet(process.env.RINKEBY_PRIVATE_KEY);
	let serial = 0;
	let maxClaimNum = 1;
	let addressForClaim = [];



	
	for (let i = 0; i < addressForClaim.length; i++) {
		const domain = {
			name: 'Katana N Samurai 2',
			version: '1.0.0',
			chainId: 4,
			verifyingContract: nftAddress
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
			addressForClaim: addressForClaim[i],
			maxClaimNum: maxClaimNum
		};

		signature = await owner._signTypedData(domain, types, value);
		console.log(signature);

		var creat = await adminClient.query(q.Create(q.Ref(q.Collection('Presale'), serial + i), {
			data: {
				address: addressForClaim[i],
				maxNum: maxClaimNum,
				signature: signature
			}
		}));

		console.log(creat);	}
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});