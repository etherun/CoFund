// SPDX-License-Identifier: UNLICENSED
pragma solidity <0.8.0;
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Fundraiser is Ownable {
    using SafeMath for uint256;

    string public name;
    string public url;
    string public imageURL;
    string public description;
    address payable public beneficiary;
    uint256 public donationsCount;

    struct Donation {
        uint256 value;
        // uint256 conversionFactor;
        uint256 date;
    }
    mapping(address => Donation[]) private _donations;
    event DonationReceived(address indexed donor, uint256 value);
    event withdrawEvent(uint256 value);

    constructor(
        string memory _name,
        string memory _url,
        string memory _imageURL,
        string memory _description,
        address payable _beneficiary,
        address _custodian
    ) {
        name = _name;
        url = _url;
        imageURL = _imageURL;
        description = _description;
        beneficiary = _beneficiary;
        transferOwnership(_custodian);
    }

    function setBeneficiary(address payable add) public onlyOwner {
        beneficiary = add;
    }

    function myDonationsCount() public view returns (uint256) {
        return _donations[msg.sender].length;
    }

    function donate() public payable {
        Donation memory donation = Donation({
            value: msg.value,
            date: block.timestamp
        });
        _donations[msg.sender].push(donation);
        donationsCount += 1;
        emit DonationReceived(msg.sender, msg.value);
    }

    function myDonations()
        public
        view
        returns (uint256[] memory values, uint256[] memory dates)
    {
        uint256 count = myDonationsCount();
        values = new uint256[](count);
        dates = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            Donation memory _donation = _donations[msg.sender][i];
            values[i] = _donation.value;
            dates[i] = _donation.date;
        }

        return (values, dates);
    }

    function totalDonations() public view returns (uint256) {
        uint256 _sum = 0;
        Donation[] memory _user_donations = _donations[msg.sender];
        for (uint256 i = 0; i < _user_donations.length; i++) {
            _sum += _user_donations[i].value;
        }
        return _sum;
    }

    function withdraw() public onlyOwner {
        uint256 account_balance = address(this).balance;
        beneficiary.transfer(account_balance);
        emit withdrawEvent(account_balance);
    }
}
