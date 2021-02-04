pragma solidity ^0.7.4;

contract Passport {
    address public owner;
    mapping(address => bool) verifiedUsers;

    mapping(uint256 => Citizen) public passport;
    uint256 passportCount = 0;

    struct Citizen {
        uint256 id; // temporary uint id for testing
        string countryCode; // store country code of citizen (eg GB-ENG = England)
        string subdivisionCode; // store county code of citizen eg (GB-NBL = Northumberland)
        uint16 age;
        bool immunityStatus; // bool representing immunity status of citizen (true = immune)
    }

    constructor() public {
        owner = msg.sender;
        verifiedUsers[msg.sender] = true;
    }

    modifier admin() {
        require(msg.sender == owner);
        _;
    }

    modifier verified() {
        require(verifiedUsers[msg.sender] == true);
        _;
    }

    function addVerifiedUser(address _address) public verified {
        verifiedUsers[_address] = true;
        emit VerifiedUser(_address);
    }

    function topUp(address payable _address) public payable admin {
        if (isVerified(_address)) {
            _address.transfer(msg.value);
            emit Transfer(_address, msg.value);
        }
    }

    function isVerified(address _address) public view verified returns (bool) {
        return verifiedUsers[_address];
    }

    function addCitizen(
        string memory _countryCode,
        string memory _subdivisionCode,
        uint16 _age,
        bool _immunityStatus
    ) public verified {
        passportCount++;
        passport[passportCount] = Citizen(
            passportCount,
            _countryCode,
            _subdivisionCode,
            _age,
            _immunityStatus
        );
        if (_immunityStatus) {
            emit PositiveCase(_countryCode, _subdivisionCode, _age);
        }
    }

    event Transfer(address indexed _address, uint256 _amount);
    event VerifiedUser(address indexed _address);
    event PositiveCase(
        string _countryCode,
        string _subdivisionCode,
        uint16 _age
    );
}
