// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity <0.8.0;
import "./Fundraiser.sol";

contract FundraiserFactory {
    Fundraiser[] private _fundraisers;
    uint256 constant maxLimit = 20;

    function fundraisersCount() public view returns (uint256) {
        return _fundraisers.length;
    }

    function createFundraiser(
        string memory name,
        string memory url,
        string memory imageURL,
        string memory description,
        address payable beneficiary
    ) public {
        Fundraiser fundraiser = new Fundraiser(
            name,
            url,
            imageURL,
            description,
            beneficiary,
            msg.sender
        );
        _fundraisers.push(fundraiser);
    }

    function fundraisers(
        uint256 limit,
        uint256 offset
    ) public view returns (Fundraiser[] memory collections) {
        require(offset <= fundraisersCount(), "offset out of range");
        uint256 size = fundraisersCount() - offset;
        size = size < limit ? size : limit;
        size = size < maxLimit ? size : maxLimit;

        collections = new Fundraiser[](size);
        for (uint256 i = 0; i < size; i++) {
            collections[i] = _fundraisers[offset + i];
        }

        return collections;
    }
}
