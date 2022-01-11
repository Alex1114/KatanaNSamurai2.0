const hre = require("hardhat");

var faunadb = require('faunadb');
var q = faunadb.query;
var adminClient = new faunadb.Client({
	secret: process.env.REACT_APP_FAUNA_KEY
});

async function main() {

	let nftAddress = "0x07DC076a1dDd5d311d0d396FF9053F21c9fD0892";
	let owner = new ethers.Wallet(process.env.RINKEBY_PRIVATE_KEY);
	let serial = 0;
	let maxClaimNum = 1;
	let addressForClaim = ["0xd56e7bcf62a417b821e6cf7ee16df7715a3e82ab","0xbd42a2035d41b450ee7106c9f9c0c736fb546226", "0x25efbecf9fdc794aca9977483ce415272ba5acd9", "0xfa7af2738398bf9b70a744fd69b0bfb849fbf8db"];


	
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