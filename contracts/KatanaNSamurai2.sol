// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import './ERC721B.sol';
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

//  _  __ _   _   _____   ___       ___
// | |/ /| \ | | / ____| |__ \     / _ \
// | ' / |  \| || (___      ) |   | | | |
// |  <  | . ` | \___ \    / /    | | | |
// | . \ | |\  | ____) |  / /_  _ | |_| |
// |_|\_\|_| \_||_____/  |____|(_) \___/

contract KatanaNSamurai2 is Ownable, EIP712, ERC721B {

	using SafeMath for uint256;
	using Strings for uint256;

	// Sales variables
	// ------------------------------------------------------------------------
	uint public MAX_SAMURAI = 6666;
	uint public PRICE = 0.075 ether;
	uint public numPresale = 0;
	uint public numSale = 0;
	uint public numClaim = 0;
	uint public numGiveaway = 0;
	uint public totalSupply = 0;
	bool public hasSaleStarted = false;
	bool public hasPresaleStarted = false;
	bool public hasClaimStarted = false;
	string private _baseTokenURI = "http://api.katanansamurai.art/Metadata/";

	mapping (address => uint256) public hasClaimed;
	mapping (address => uint256) public hasPresale;

	// Events
	// ------------------------------------------------------------------------
	event mintEvent(address owner, uint256 quantity, uint256 totalSupply);
	
	// Constructor
	// ------------------------------------------------------------------------
	constructor()
	EIP712("Katana N Samurai 2", "1.0.0")  
	ERC721B("Katana N Samurai 2", "KNS2.0"){}

	// Verify functions
	// ------------------------------------------------------------------------
	function verify(uint256 maxClaimNum, bytes memory SIGNATURE) public view returns (bool){
		address recoveredAddr = ECDSA.recover(_hashTypedDataV4(keccak256(abi.encode(keccak256("NFT(address addressForClaim,uint256 maxClaimNum)"), _msgSender(), maxClaimNum))), SIGNATURE);

		return owner() == recoveredAddr;
	}

	// Claim functions
	// ------------------------------------------------------------------------
	function claimSamurai(uint256 quantity, uint256 maxClaimNum, bytes memory SIGNATURE) external {

		require(hasClaimStarted == true, "Claime hasn't started.");
		require(verify(maxClaimNum, SIGNATURE), "Not eligible for claim.");
		require(quantity > 0 && hasClaimed[msg.sender].add(quantity) <= maxClaimNum, "Exceed the quantity that can be claimed");

		for (uint i = 0; i < quantity; i++) {
			_safeMint(msg.sender, totalSupply);
			totalSupply = totalSupply.add(1);
		}

		numClaim = numClaim.add(quantity);
		hasClaimed[msg.sender] = hasClaimed[msg.sender].add(quantity);

		emit mintEvent(msg.sender, quantity, totalSupply);
	}

	// Presale functions
	// ------------------------------------------------------------------------
	function mintPresaleSamurai(uint256 quantity, uint256 maxClaimNumOnPresale, bytes memory SIGNATURE) external payable{
		require(hasPresaleStarted == true, "Presale hasn't started.");
		require(verify(maxClaimNumOnPresale, SIGNATURE), "Not eligible for presale.");
		require(quantity > 0 && hasPresale[msg.sender].add(quantity) <= maxClaimNumOnPresale, "Exceeds max presale number.");
		require(msg.value >= PRICE.mul(quantity), "Ether value sent is below the price.");
		require(totalSupply.add(quantity) <= MAX_SAMURAI, "Exceeds MAX_SAMURAI.");

		for (uint i = 0; i < quantity; i++) {
			_safeMint(msg.sender, totalSupply);
			totalSupply = totalSupply.add(1);
		}

		numPresale = numPresale.add(quantity);
		hasPresale[msg.sender] = hasPresale[msg.sender].add(quantity);

		emit mintEvent(msg.sender, quantity, totalSupply);
	}

	// Giveaway functions
	// ------------------------------------------------------------------------
	function giveawayMintSamurai(address _to, uint256 quantity) external onlyOwner{
		require(totalSupply.add(quantity) <= MAX_SAMURAI, "Exceeds MAX_SAMURAI.");

		for (uint i = 0; i < quantity; i++) {
			_safeMint(_to, totalSupply);
			totalSupply = totalSupply.add(1);
		}

		numGiveaway = numGiveaway.add(quantity);
		emit mintEvent(_to, quantity, totalSupply);
	}

	// Mint functions
	// ------------------------------------------------------------------------
	function mintSamurai(uint256 numPurchase) external payable {
		require(hasSaleStarted == true, "Sale hasn't started.");
		require(numPurchase > 0 && numPurchase <= 50, "You can mint minimum 1, maximum 50 samurais.");
		require(totalSupply.add(numPurchase) <= MAX_SAMURAI, "Sold out!");
		require(msg.value >= PRICE.mul(numPurchase), "Ether value sent is below the price.");

		for (uint i = 0; i < numPurchase; i++) {
			_safeMint(msg.sender, totalSupply);
			totalSupply = totalSupply.add(1);
		}

		numSale = numSale.add(numPurchase);
		emit mintEvent(msg.sender, numPurchase, totalSupply);
	}

	// Base URI Functions
	// ------------------------------------------------------------------------
	function tokenURI(uint256 tokenId) public view override returns (string memory) {
		require(_exists(tokenId), "TOKEN_NOT_EXISTS");
		
		return string(abi.encodePacked(_baseTokenURI, tokenId.toString()));
	}

	// setting functions
	// ------------------------------------------------------------------------
	function setURI(string calldata _tokenURI) external onlyOwner {
		_baseTokenURI = _tokenURI;
	}

	function setMAX_SAMURAI(uint _MAX_num) public onlyOwner {
		MAX_SAMURAI = _MAX_num;
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

	function startClaim() public onlyOwner {
		hasClaimStarted = true;
	}

	function pauseSale() public onlyOwner {
		hasSaleStarted = false;
	}

	function pausePresale() public onlyOwner {
		hasPresaleStarted = false;
	}

	function pauseClaim() public onlyOwner {
		hasClaimStarted = false;
	}

	// Withdrawal functions
	// ------------------------------------------------------------------------
	function withdrawAll() public payable onlyOwner {
		require(payable(msg.sender).send(address(this).balance));
	}
}
  