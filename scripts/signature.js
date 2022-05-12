const hre = require("hardhat");
const NFT = artifacts.require("KatanaNSamurai2");
var faunadb = require('faunadb');
var q = faunadb.query;
var adminClient = new faunadb.Client({
	secret: process.env.REACT_APP_FAUNA_KEY
});

async function main() {

	let nftAddress = "0x88B7063107d2CF7FAC83E30b37c938fE42c56040";
	let nft = await NFT.at(nftAddress);
	let owner = new ethers.Wallet(process.env.MAINNET_PRIVATE_KEY);
	let serial = 539;
	// Claim: 314
	let maxClaimNum = 1;
	let addressForClaim = ['0xea48c045b8e84739ab0461c808611102fa727b4d','0x075323b3a492214aabbd7736bbb8af91bcda2fc0','0x8d54914924dca4a330d225a2f7efd153936f02a0','0x9ded67eef2574c8cbe641a3af82842057365a4ab','0xab300cd1e9cc0c9142129547406237a0dad34078','0xbdd4315d434f07a5a5b426249de85569ccd4d693','0x87bbee24bc36db4244c825a5c1aad44911003f68','0xb4dc4ac23f2451478224bc7c4bcbc08f349130a8','0xc34e0727428303010eef33dfe026e0d175f430a3','0x4be41356e363135702909192943d990651452b68','0xc00e70d39e7883fe298de73d7dd962231998261b','0xdab1b5fe902de5c699dff1489bbca6203748b00b','0x5eed811f78b3bc8155644af409ef8d824e1aba1d','0xfe1ac09a47e371ab99a0b1899f9282cc32d22dbb','0x0b4c8a5bab4f131dbb56ae987deb2208d852e966','0x870b0857f448ed131b80a844199a541bb4e4e44b','0xca5d002d9c1dbc6d9f93103e87e67bead091f034','0x97183359319a17e58734968d05d42394588c2ae8','0x88e85d7244ceeb6844ae5946ba14ff215233d021','0xc005e459e0961733edef72bfb27a724d175c00d4','0xffc15a279eac8d2dfe1400b12656d8754b4c43a4','0x0f7bd47c73a072341d6a4107ffdc52a8f6f5c00f','0x2e24fb74ba4e017f69159aa20132368f223691b0','0x6654c76fb580d80d87485a08d3db4b58dff2d269','0x1d9f48b37122956245598f7e6ab2e6f66db015ce','0x71fd264366295dd33944db4b6c68baf0fae74f04','0x4d45cf4061d30635f3af496b6ec244f7e71d5866','0xc005e459e0961733edef72bfb27a724d175c00d4','0xa804742e59131c03f4a5c97039afb9de421faa31','0x240f5a039d39633e02ec959c1f31e979150751c7','0xeefc3aef202633efb926d0437491ba92a3a820e7','0xdac6518b023ef7784a12f781195fc095844dfe79','0x2e24fb74ba4e017f69159aa20132368f223691b0','0x4d45cf4061d30635f3af496b6ec244f7e71d5866'];
	
	for (let i = 0; i < addressForClaim.length; i++) {

		let hasPresale = await nft.hasPresale(addressForClaim[i]);
		presaleNum = maxClaimNum + parseInt(hasPresale["words"])
		console.log("maxClaimNum: ", presaleNum);

		const domain = {
			name: 'Katana N Samurai 2',
			version: '1.0.0',
			chainId: 1,
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
			maxClaimNum: presaleNum
		};

		signature = await owner._signTypedData(domain, types, value);
		console.log(signature);

		var creat = await adminClient.query(q.Create(q.Ref(q.Collection('Presale'), serial + i), {
			data: {
				address: addressForClaim[i],
				maxNum: presaleNum,
				signature: signature
			}
		}));

		console.log(creat);	
	}
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});