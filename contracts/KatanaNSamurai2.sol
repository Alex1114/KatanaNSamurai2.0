// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "hardhat/console.sol";


interface KNS1Interface {
  function tokensOfOwner(address _owner) external view returns(uint256[] memory );
}

contract KatanaNSamurai2 is Ownable, EIP712, ERC721Enumerable {

	using SafeMath for uint256;
	using Strings for uint256;

	// Interface
    // ------------------------------------------------------------------------
	address KNS1Address = 0xD6499Dac79a48cf21B7a6344a551A52DA943E10c;
  	KNS1Interface KNS1Contract = KNS1Interface(KNS1Address);

    // Sales variables
    // ------------------------------------------------------------------------
	uint public MAX_SAMURAI = 10640;
	uint public MAX_PRESALE = 6000; 
	uint public PRICE = 0.05 ether;
	uint public numPresale = 0;
    uint public numTokens = 2000;
	uint public numClaim = 0;
	bool public hasSaleStarted = true;
	bool public hasPresaleStarted = true;
	string private _baseTokenURI = "http://api.katanansamurai.art/Metadata/";

	mapping (address => uint256) public hasClaimed;
	mapping (address => uint256) public hasPresale;
    // Events
    // ------------------------------------------------------------------------
	event mintEvent(address owner, uint256 numPurchase, uint256 totalSupply);
	event claimEvent(address owner, uint256 numClaims, uint256 totalClaim);
	event presaleEvent(address owner, uint256 numPresale, uint256 totalSupply);
	
	// Constructor
    // ------------------------------------------------------------------------
	constructor()
	EIP712("Katana N Samurai 2", "1.0.0")  
	ERC721("Katana N Samurai 2", "KNS2.0"){}

	// Claim functions
    // ------------------------------------------------------------------------
	function claimSamurai(uint256 quantity) external {
		uint256[] memory tokenId;
		tokenId = KNS1Contract.tokensOfOwner(msg.sender);

		require(hasSaleStarted == true, "Sale hasn't started.");
		require(hasClaimed[msg.sender].add(quantity) <= tokenId.length, "Exceed the quantity that can be claimed");

		for (uint i = 0; i < quantity; i++) {
			hasClaimed[msg.sender] = hasClaimed[msg.sender].add(1);
			_safeMint(msg.sender, tokenId[hasClaimed[msg.sender].sub(1)]);
			numClaim = numClaim.add(1);
		}

		emit claimEvent(msg.sender, quantity, numClaim);
	}

	// Presale functions
    // ------------------------------------------------------------------------
    function isPresaleEligible(uint256 maxClaimNumOnPresale, bytes memory SIGNATURE) public view returns (bool){
        address recoveredAddr = ECDSA.recover(_hashTypedDataV4(keccak256(abi.encode(keccak256("NFT(address addressForPresaleClaim,uint256 maxClaimNumOnPresale)"), _msgSender(), maxClaimNumOnPresale))), SIGNATURE);

        return owner() == recoveredAddr;
    }

    function mintPresaleSamurai(uint256 quantity, uint256 maxClaimNumOnPresale, bytes memory SIGNATURE) external payable{
		require(hasPresaleStarted == true, "Presale hasn't started.");
        require(isPresaleEligible(maxClaimNumOnPresale, SIGNATURE), "Not eligible for presale.");
        require(quantity > 0 && hasPresale[msg.sender].add(quantity) <= maxClaimNumOnPresale, "Exceeds max presale number.");
        require(msg.value >= PRICE.mul(quantity), "Ether value sent is below the price.");
        require(totalSupply().add(quantity) <= MAX_SAMURAI, "Exceeds the MAX_SAMURAI.");

		for (uint i = 0; i < quantity; i++) {
			numTokens = numTokens.add(1);
			_safeMint(msg.sender, numTokens);
		}

		hasPresale[msg.sender] = hasPresale[msg.sender].add(quantity);
		numPresale = numPresale.add(quantity);

		emit presaleEvent(msg.sender, quantity, numTokens);
    }

	// Giveaway functions
    // ------------------------------------------------------------------------
	function giveawayMintSamurai(address _to, uint256 quantity) external onlyOwner{
		require(totalSupply().add(quantity) <= MAX_SAMURAI, "Exceeds MAX_SAMURAI.");

		for (uint i = 0; i < quantity; i++) {
			numTokens = numTokens.add(1);
			_safeMint(_to, numTokens);
		}

		emit mintEvent(_to, quantity, numTokens);
	}

	// Mint functions
    // ------------------------------------------------------------------------
	function mintSamurai(uint256 numPurchase) external payable {
		require(hasSaleStarted == true, "Sale hasn't started.");
		require(numPurchase > 0 && numPurchase <= 50, "You can mint minimum 1, maximum 50 punks.");
		require(totalSupply().add(numPurchase) <= MAX_SAMURAI, "Sold out!");
		require(msg.value >= PRICE.mul(numPurchase), "Ether value sent is below the price.");

		for (uint i = 0; i < numPurchase; i++) {
			numTokens = numTokens.add(1);
			_safeMint(msg.sender, numTokens);
		}

		emit mintEvent(msg.sender, numPurchase, numTokens);
	}

    // Base URI Functions
    // ------------------------------------------------------------------------
    function tokenURI(uint256 tokenId) public view override(ERC721) returns (string memory) {
        require(_exists(tokenId), "TOKEN_NOT_EXISTS");
        
        return string(abi.encodePacked(_baseTokenURI, tokenId.toString()));
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
    function setURI(string calldata _tokenURI) external onlyOwner {
        _baseTokenURI = _tokenURI;
    }

	function setMAX_SAMURAI(uint _MAX_num) public onlyOwner {
		MAX_SAMURAI = _MAX_num;
	}

	function setMAX_PRESALE(uint _MAX_PS_num) public onlyOwner {
		MAX_PRESALE = _MAX_PS_num;
	}

	function set_PRICE(uint _price) public onlyOwner {
		PRICE = _price;
	}

	function startSale() public onlyOwner {
		hasSaleStarted = true;		
	}

	function startPresale() public onlyOwner {
		hasPresaleStarted = true;
	}

	function pauseSale() public onlyOwner {
		hasSaleStarted = false;
	}

	function pausePresale() public onlyOwner {
		hasPresaleStarted = false;
	}

	// Withdrawal functions
    // ------------------------------------------------------------------------
	function withdrawAll() public payable onlyOwner {
		require(payable(msg.sender).send(address(this).balance));
	}
}
  