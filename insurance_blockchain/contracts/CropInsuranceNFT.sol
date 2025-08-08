// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CropInsuranceNFT is ERC721, Ownable {
    uint256 public nextTokenId = 1;

    struct Policy {
        uint256 policyId;
        string farmerId;
        string cropType;
        uint256 coverageAmount;
        uint256 premium;
        uint256 expirationDate;
        bool claimed;
    }

    mapping(uint256 => Policy) public policies;

    constructor() ERC721("CropInsuranceNFT", "CROP") Ownable(msg.sender) {}

    function mintPolicyNFT(
        string memory farmerId,
        string memory cropType,
        uint256 coverageAmount,
        uint256 premium,
        uint256 expirationDate
    ) public returns (uint256) {
        uint256 tokenId = nextTokenId;
        _safeMint(msg.sender, tokenId);

        policies[tokenId] = Policy(
            tokenId,
            farmerId,
            cropType,
            coverageAmount,
            premium,
            expirationDate,
            false
        );

        nextTokenId++;
        return tokenId;
    }

    function claimPolicy(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not policy owner");
        Policy storage policy = policies[tokenId];
        require(!policy.claimed, "Already claimed");
        require(block.timestamp <= policy.expirationDate, "Policy expired");

        policy.claimed = true;
    }

    function getPolicyDetails(uint256 tokenId) public view returns (Policy memory) {
        return policies[tokenId];
    }
}
