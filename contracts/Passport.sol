pragma solidity ^0.7.4;

contract Passport {
    address public owner;
    mapping(address => bool) public verifiedUsers;

    mapping(uint256 => Citizen) public passport;
    uint256 passportCount = 0;

    struct Citizen {
        uint256 id;
        string name;
        bool status;
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

    function addCitizen(string memory _name, bool _status) public verified {
        passportCount++;
        passport[passportCount] = Citizen(passportCount, _name, _status);
        if (_status) {
            emit PositiveCase(_name);
        }
    }

    event Transfer(address indexed _address, uint256 _amount);
    event VerifiedUser(address indexed _address);
    event PositiveCase(string _name);
}
