// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.4;

contract Passport {
    address administrator; // address of who deployed the contract (admin access for certain operations)
    mapping(address => bool) verifiedUsers; // mapping of verified users
    mapping(bytes32 => Citizen) public passport; // map hashes to citizens (wont be public in final implementation)
    mapping(uint256 => bytes32) public ids;
    uint256 public passportCount = 0;

    struct Citizen {
        bytes32 hashID;
        string subdivisionCode; // store county code of citizen eg (GB-NBL = Northumberland)
        uint8 age;
        bool immunity; // a bool to represent immunity (true = immune)
        uint256 immuneTime;
    }

    constructor() {
        administrator = msg.sender;
        verifiedUsers[msg.sender] = true;
    }

    modifier admin() {
        require(msg.sender == administrator);
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

    function removeVerifiedUser(address _address) public admin {
        verifiedUsers[_address] = false;
        emit UnverifiedUser(_address);
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
        bytes32 _hash,
        string memory _subdivisionCode,
        uint8 _age,
        bool _immunityStatus
    ) public verified {
        Citizen memory newCitizen;
        if (_immunityStatus) {
            newCitizen = Citizen(
                _hash,
                _subdivisionCode,
                _age,
                _immunityStatus,
                block.timestamp
            );
        } else {
            newCitizen = Citizen(
                _hash,
                _subdivisionCode,
                _age,
                _immunityStatus,
                0
            );
        }
        passport[_hash] = newCitizen;

        passportCount++;
        ids[passportCount] = _hash;

        if (_immunityStatus) {
            emit ImmuneCase(_subdivisionCode, _age);
        }
    }

    function isImmune(bytes32 _hash) public view returns (bool) {
        return passport[_hash].immunity;
    }

    function updateImmunity(bytes32 _hash, bool _immunityStatus)
        public
        verified
    {
        passport[_hash].immunity = _immunityStatus;
    }

    event Transfer(address indexed _address, uint256 _amount);
    event VerifiedUser(address indexed _address);
    event UnverifiedUser(address indexed _address);
    event ImmuneCase(string _subdivisionCode, uint8 _age);
}

// TODO: Add timed function which changes immunity status after 14 days (from addition to the blockchain)
// TODO: Have citizens indexed by an integer, and then every 24 hours change immunity status from true = false if 14 days has passed
// TODO: Check if citizen exists before doing immunity checks
