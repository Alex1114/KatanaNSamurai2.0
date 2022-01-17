const hre = require("hardhat");

var faunadb = require('faunadb');
var q = faunadb.query;
var adminClient = new faunadb.Client({
	secret: process.env.REACT_APP_FAUNA_KEY
});

async function main() {

	let nftAddress = "0x4d36a6F81B6c861BdFb7254ECfB0A87aA2028Bac";
	let owner = new ethers.Wallet(process.env.RINKEBY_PRIVATE_KEY);
	let serial = 0;
	let maxClaimNum = 1;
	let addressForClaim = ['0xcd0fac521ad5456123746d895b8a8eab2137c135','0xb0f300b96f7b7377e877c3c9d20777081a12aae6','0x7b11418b321960838513f050e21c64df75131668','0x6bfaa7581bb90ef4c9caac88dfcba724949bb120','0x9e731ba261f790aff5d4588a8d6a266729a6ba11','0x29aa2e71089dae80266169281f1621f7bda9b50c','0x8be83453c6371011aaee2f881bdca9da490b493e','0x55fba7be90ef597153b33f72b3b4cb71623638e5','0xc02b13f0add866a86030cd35a019f40b2b335613','0xe7dbf4dd02bd72c33794e00877cfa1777eebcc91','0x25efbecf9fdc794aca9977483ce415272ba5acd9'];



	
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