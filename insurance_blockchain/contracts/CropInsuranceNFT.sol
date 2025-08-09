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
        uint128 coverageAmount;   // Changed from uint256 to uint128
        uint128 premium;          // Changed from uint256 to uint128
        uint128 expirationDate;   // Changed from uint256 to uint128
        bool claimed;
    }

    mapping(uint256 => Policy) public policies;

    constructor() ERC721("CropInsuranceNFT", "CROP") Ownable(msg.sender) {}

    function mintPolicyNFT(
        string memory farmerId,
        string memory cropType,
        uint128 coverageAmount,
        uint128 premium,
        uint128 expirationDate
    ) public returns (uint256) {
        uint256 tokenId = nextTokenId;

        _safeMint(msg.sender, tokenId);

        // Use memory struct to batch storage write
        Policy memory newPolicy = Policy({
            policyId: tokenId,
            farmerId: farmerId,
            cropType: cropType,
            coverageAmount: coverageAmount,
            premium: premium,
            expirationDate: expirationDate,
            claimed: false
        });

        policies[tokenId] = newPolicy;

        nextTokenId++;
        return tokenId;
    }

    function claimPolicy(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not policy owner");
        Policy storage policy = policies[tokenId];

        // Combined require checks to reduce gas
        require(!policy.claimed && block.timestamp <= policy.expirationDate, "Already claimed or expired");

        policy.claimed = true;
    }

    function getPolicyDetails(uint256 tokenId) public view returns (Policy memory) {
        return policies[tokenId];
    }
}