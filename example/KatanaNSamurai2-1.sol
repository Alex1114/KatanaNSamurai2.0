pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface KNS1Interface {
  function tokensOfOwner(address _owner) external view returns(uint256[] memory );
}

contract KatanaNSamurai2 is ERC721, Ownable {

	using SafeMath for uint256;

	// Interface
    // ------------------------------------------------------------------------
	address KNS1Address = 0xD6499Dac79a48cf21B7a6344a551A52DA943E10c;
  	KNS1Interface KNS1Contract = KNS1Interface(KNS1Address);

    // Sales variables
    // ------------------------------------------------------------------------
	uint public MAX_SAMURAI = 10640;
	uint public MAX_GIVEAWAYS = 500; 
	uint public MAX_CLAIM = 2000; 
	uint public PRICE = 0.05 ether;
	uint public numGiveaways = 0;
    uint public numTokens = 2000;
	uint public numClaim = 0;
	bool public hasSaleStarted = true;

	mapping (address => bool) public hasClaimed;

    // Events
    // ------------------------------------------------------------------------
	event mintEvent(address owner, uint256 numPurchase, uint256 totalSupply);
	event claimEvent(address owner, uint256 numClaims, uint256 totalClaim);
	
	// Constructor
    // ------------------------------------------------------------------------
	// constructor() ERC721("KNS: The Last Ramen", "KNS2.0") {
	// 	setBaseURI("http://api.katanansamurai.art/Metadata/");
	// }
	constructor() ERC721("K1", "K1") {
		setBaseURI("http://api.katanansamurai.art/Metadata/");
	}

	// Claim functions
    // ------------------------------------------------------------------------
	function claimSamurai() public {
		uint256[] memory tokenId;
		tokenId = KNS1Contract.tokensOfOwner(msg.sender);

		require(numClaim.add(tokenId.length) <= MAX_CLAIM, "Exceeds the MAX_CLAIM.");
		require(hasClaimed[msg.sender] == false, "Can only be claimed once.");
		require(hasSaleStarted == true, "Sale hasn't started.");

		for (uint i = 0; i < tokenId.length; i++) {
			uint claimIndex = numClaim.add(1);
			_safeMint(msg.sender, claimIndex);
			numClaim = numClaim.add(1);
		}

		hasClaimed[msg.sender] = true;
		emit claimEvent(msg.sender, tokenId.length, numClaim);
	}

	// Giveaway functions
    // ------------------------------------------------------------------------
	function giveawayMintSamurai(address _to, uint256 numPurchase) public onlyOwner{
		require(totalSupply() < MAX_SAMURAI, "Sold out!!");
		require(numPurchase > 0 && numPurchase <= 50, "You can mint minimum 1, maximum 50 punks.");
		require(totalSupply().add(numPurchase) <= MAX_SAMURAI, "Exceeds MAX_SAMURAI.");
		require(numGiveaways.add(numPurchase) <= MAX_GIVEAWAYS, "Exceeds the MAX_GIVEAWAYS.");

		for (uint i = 0; i < numPurchase; i++) {
			uint mintIndex = numTokens.add(1);
			_safeMint(_to, mintIndex);
            numTokens = numTokens.add(1);
		}

		numGiveaways = numGiveaways.add(numPurchase);
		emit mintEvent(_to, numPurchase, numTokens);
	}

	// Mint functions
    // ------------------------------------------------------------------------
	function mintSamurai(uint256 numPurchase) public payable {
		require(hasSaleStarted == true, "Sale hasn't started.");
		require(totalSupply() < MAX_SAMURAI, "Sold out!");
		require(numPurchase > 0 && numPurchase <= 50, "You can mint minimum 1, maximum 50 punks.");
		require(totalSupply().add(numPurchase) <= MAX_SAMURAI, "Exceeds MAX_SAMURAI.");
		require(msg.value >= PRICE.mul(numPurchase), "Ether value sent is below the price.");

		for (uint i = 0; i < numPurchase; i++) {
			uint mintIndex = numTokens.add(1);
			_safeMint(msg.sender, mintIndex);
            numTokens = numTokens.add(1);
		}

		emit mintEvent(msg.sender, numPurchase, numTokens);
	}

	function tokensOfOwner(address _owner) external view returns(uint256[] memory ) {
		uint256 tokenCount = balanceOf(_owner);
		
		if (tokenCount == 0) {
			return new uint256[](0);
		} else {
			uint256[] memory result = new uint256[](tokenCount);
			uint256 index;
			for (index = 0; index < tokenCount; index++) {
				result[index] = tokenOfOwnerByIndex(_owner, index);
			}
			return result;
		}
	}

    // setting functions
    // ------------------------------------------------------------------------
	function setBaseURI(string memory baseURI) public onlyOwner {
		_setBaseURI(baseURI);
	}

	function setMAX_SAMURAI(uint _MAX_num) public onlyOwner {
		MAX_SAMURAI = _MAX_num;
	}

	function setMAX_GIVEAWAYS(uint _MAX_GA_num) public onlyOwner {
		MAX_GIVEAWAYS = _MAX_GA_num;
	}

	function set_PRICE(uint _price) public onlyOwner {
		PRICE = _price;
	}

	function startSale() public onlyOwner {
		hasSaleStarted = true;
	}

	function pauseSale() public onlyOwner {
		hasSaleStarted = false;
	}

	// Withdrawal functions
    // ------------------------------------------------------------------------
	function withdrawAll() public payable onlyOwner {
		require(payable(msg.sender).send(address(this).balance));
	}
}
  