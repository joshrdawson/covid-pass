// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.4;

contract Passport {
    address public administrator; // address of who deployed the contract (admin access for certain operations)
    mapping(address => bool) verifiedUsers; // mapping of verified users
    mapping(bytes32 => Citizen) public passports; // map hashes to citizens (wont be public in final implementation)

    struct Citizen {
        string postcode; // store county code of citizen eg (GB-NBL = Northumberland)
        uint8 age;
        bool vaccinationStatus; // a bool to represent vaccination status (true = vaccinated)
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
        string memory _postcode,
        uint8 _age
    ) public verified {
        passports[_hash] = Citizen(_postcode, _age, true);
    }

    function removeCitizen(bytes32 _hash) public verified {
        // remove data regarding _hash citizen
        passports[_hash].postcode = "";
        passports[_hash].age = 0;
        passports[_hash].vaccinationStatus = false;
    }

    function isVaccinated(bytes32 _hash) public view returns (bool) {
        return passports[_hash].vaccinationStatus;
    }

    event Transfer(address indexed _address, uint256 _amount);
    event VerifiedUser(address indexed _address);
    event UnverifiedUser(address indexed _address);
    event Vaccination(string _postcode, uint8 _age);

    function addTestingCitizens() public admin {
        // temporary testing function to populate citizens

        addCitizen(
            0x3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb,
            "CW9 8U1",
            1
        );

        addCitizen(
            0x67fad3bfa1e0321bd021ca805ce14876e50acac8ca8532eda8cbf924da565160,
            "CW9 8U2",
            2
        );
        addCitizen(
            0x4e03657aea45a94fc7d47ba826c8d667c0d1e6e33a64a036ec44f58fa12d6c45,
            "CW9 8U3",
            3
        );
        addCitizen(
            0x48bed44d1bcd124a28c27f343a817e5f5243190d3c52bf347daf876de1dbbf77,
            "CW9 8U4",
            4
        );
        addCitizen(
            0x6377c7e66081cb65e473c1b95db5195a27d04a7108b468890224bedbe1a8a6eb,
            "CW9 8U5",
            5
        );
        addCitizen(
            0xacd0c377fe36d5b209125185bc3ac41155ed1bf7103ef9f0c2aff4320460b6df,
            "CW9 8U6",
            6
        );
        addCitizen(
            0xa82aec019867b7307551dc397acde18b541e742fa1a4e53df4ce3b02d462f524,
            "CW9 8U7",
            7
        );
        addCitizen(
            0x48624fa43c68d5c552855a4e2919e74645f683f5384f72b5b051b71ea41d4f2d,
            "CW9 8U8",
            8
        );
        addCitizen(
            0x34fb2702da7001bf4dbf26a1e4cf31044bd95b85e1017596ee2d23aedc90498b,
            "CW9 8U9",
            9
        );
        addCitizen(
            0xf8da54b5a7dd75028acb077ee61e8dde47ed37c746703ce764edf4a789eb2103,
            "CW9 8U0",
            10
        );
    }
}
