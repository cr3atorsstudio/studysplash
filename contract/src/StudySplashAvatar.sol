// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./ERC6551.sol";

contract  StudySplashAvatar is ERC721, ERC721Enumerable, ERC721URIStorage {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("StudySplashAvatar", "SSA") {}

    struct NFTInfo {
        uint256 tokenId;
        address creator;
        address tbaAddress;
    }

    mapping(uint256 => NFTInfo) private _nftInfos;
    mapping(address => bool) public isTeacher;
    mapping(address => bool) public hasMinted;

    function createNFT(bool isTeacherStatus) public {
        require(!hasMinted[msg.sender], "You have already minted a token");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        _setTeacherStatus(msg.sender, isTeacherStatus);
        _createTbaAccount(tokenId);
        address _tbaAddress = _computeTbaAddress(tokenId);

        NFTInfo storage newNFTInfo = _nftInfos[tokenId];

        newNFTInfo.creator = msg.sender;
        newNFTInfo.tokenId = tokenId;
        newNFTInfo.tbaAddress = _tbaAddress;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://studysplash.s3.amazonaws.com/metadata/user/{id}.json";
    }

    function _setTeacherStatus(address user, bool status) internal {
        isTeacher[user] = status;
    }

    function _createTbaAccount(uint256 tokenId) internal {
        address implementation = 0x2D25602551487C3f3354dD80D76D54383A243358;
        uint256 chainId = 11155111; // Sepolia
        address tokenContract = address(this);
        uint salt = 0;
        bytes memory initData = "0x";

        ERC6551Registry registry = ERC6551Registry(
            0x02101dfB77FDE026414827Fdc604ddAF224F0921
        );

        registry.createAccount(
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
        address registry = 0x02101dfB77FDE026414827Fdc604ddAF224F0921;
        address implementation = 0x2D25602551487C3f3354dD80D76D54383A243358;
        uint256 chainId = 11155111; // Sepolia
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
        uint256 _tokenId
    ) public view returns (uint256, address, address) {
        return (
            _nftInfos[_tokenId].tokenId,
            _nftInfos[_tokenId].creator,
            _nftInfos[_tokenId].tbaAddress
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

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
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
