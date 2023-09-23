// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./ERC6551.sol";

contract  StudySplashAvatar is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter = Counters.Counter(1);

    constructor() ERC721("StudySplashAvatar", "SSA") {}

    struct NFTInfo {
        uint256 tokenId;
        address creator;
        address tbaAddress;
    }

    mapping(uint256 => NFTInfo) public _nftInfos;
    mapping(address => bool) public isTeacher;
    mapping(address => bool) public hasMinted;
    mapping(address => uint256) public creatorToTokenId;

    address public registry = 0x02101dfB77FDE026414827Fdc604ddAF224F0921;
    address public implementation = 0x2D25602551487C3f3354dD80D76D54383A243358;
    uint256 public chainId = 11155111;

    function createNFT(bool isTeacherStatus) public {
        require(!hasMinted[msg.sender], "You have already minted a token");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        _createTbaAccount(tokenId);
        creatorToTokenId[msg.sender] = tokenId;
        hasMinted[msg.sender] = true;
        address _tbaAddress = _computeTbaAddress(tokenId);
        _setTeacherStatus(msg.sender, isTeacherStatus);

        NFTInfo storage newNFTInfo = _nftInfos[tokenId];

        newNFTInfo.creator = msg.sender;
        newNFTInfo.tokenId = tokenId;
        newNFTInfo.tbaAddress = _tbaAddress;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://studysplash.s3.amazonaws.com/metadata/user/";
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory base = _baseURI();
        string memory jsonExtension = ".json";

        if (bytes(base).length > 0) {
            return string(abi.encodePacked(base, Strings.toString(tokenId), jsonExtension));
        }
        return Strings.toString(tokenId);
    }

    function _setTeacherStatus(address user, bool status) internal {
        isTeacher[user] = status;
    }
    function setRegistryAddress(address _registry) public onlyOwner {
        registry = _registry;
    }
    function setimplementationAddress(address _implementation) public onlyOwner {
        implementation = _implementation;
    }
    function setChainId(uint256 _chainId) public onlyOwner {
        chainId = _chainId;
    }

    function _createTbaAccount(uint256 tokenId) internal {
        address tokenContract = address(this);
        uint salt = 0;
        bytes memory initData = "0x";

        ERC6551Registry(registry).createAccount(
            implementation,
            chainId,
            tokenContract,
            tokenId,
            salt,
            initData
        );
    }

    function _computeTbaAddress(
        uint256 tokenId
    ) internal view returns (address) {
        address tokenContract = address(this);
        uint salt = 0;

        address _tbaAddress = ERC6551AccountLib.computeAddress(
            registry,
            implementation,
            chainId,
            tokenContract,
            tokenId,
            salt
        );

        return _tbaAddress;
    }

    // view functions (for frontend) 
    function getNFTInfos() public view returns (NFTInfo[] memory) {
        NFTInfo[] memory allNFTInfos = new NFTInfo[](_tokenIdCounter.current());

        for (uint256 i = 0; i < _tokenIdCounter.current(); ++i) {
            NFTInfo storage item = _nftInfos[i];
            allNFTInfos[i] = item;
        }

        return allNFTInfos;
    }

    function getIndividualNFTInfo(
        address _creator
    ) public view returns (uint256, address) {
        uint256 tokenId = creatorToTokenId[_creator];
        require(tokenId != 0, "No NFT found for this creator");
        return (
            _nftInfos[tokenId].tokenId,
            _nftInfos[tokenId].tbaAddress
        );
    }

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal pure override(ERC721, ERC721Enumerable) {
        require(from == address(0), "Token transfers are not allowed");
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
