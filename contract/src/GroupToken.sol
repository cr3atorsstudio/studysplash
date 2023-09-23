pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface StudySplashTeacherToken {
    function isTeacher(address user) external view returns (bool);
}

contract GroupToken is ERC1155, Ownable {
    mapping(uint256 => mapping(address => bool)) public hasMinted;
    mapping(uint256 => bool) public isOpen;
    mapping(uint256 => address) public tokenCreators;

    StudySplashTeacherToken public erc6551TestToken;

    constructor() ERC1155("https://studysplash.s3.amazonaws.com/metadata/group/{id}.json") {
    }

    function setTeacherTokenAddress(address _teacherTokenAddress) external onlyOwner {
        erc6551TestToken = StudySplashTeacherToken(_teacherTokenAddress);
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(address account, uint256 id)
        public
    {
        require(!hasMinted[id][msg.sender], "You have already minted this token ID");

        if (tokenCreators[id] == address(0)) {
            // isTeacher?
            require(erc6551TestToken.isTeacher(msg.sender), "You must be a teacher to create a new token ID");
            isOpen[id] = true;
        } else {
            // If token ID exists, check if it's open for minting
            require(isOpen[id], "This token ID is not open for minting");
        }
        _mint(account, id, 1, bytes(""));
        hasMinted[id][msg.sender] = true;
        tokenCreators[id] = msg.sender;
    }

    function toggleOpenStatus(uint256 id) public {
        require(tokenCreators[id] == msg.sender, "Only the creator can toggle the status");
        isOpen[id] = !isOpen[id];
    }
}