const hre = require("hardhat");

var faunadb = require('faunadb');
var q = faunadb.query;
var adminClient = new faunadb.Client({
	secret: process.env.REACT_APP_FAUNA_KEY
});

async function main() {

	let nftAddress = "0xf84D479C8430656C806153D9f9Da468eb7Ce00B1";
	let owner = new ethers.Wallet(process.env.RINKEBY_PRIVATE_KEY);
	let serial = 0;
	let maxClaimNum = 1;
	let addressForClaim = ["0x25efbecf9fdc794aca9977483ce415272ba5acd9", "0x691fbf8928e8a22dda275b94da3fbc2a079fcc0e"];


	
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