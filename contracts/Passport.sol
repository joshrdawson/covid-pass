// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.4;

contract Passport {
    address public administrator; // address of who deployed the contract (admin access for certain operations)
    mapping(address => bool) verifiedUsers; // mapping of verified users
    mapping(bytes32 => Citizen) public passports; // map hashes to citizens (wont be public in final implementation)
    mapping(uint256 => bytes32) public entries;
    uint256 public entryCount = 0;
    uint256 public lastAutoUpdate = 0;

    struct Citizen {
        uint256 entrynumber; // stores which entry the citizen is in the entries mapping. used to iterate through citizens periodically to check they are still immune
        string subdivisionCode; // store county code of citizen eg (GB-NBL = Northumberland)
        uint8 age;
        bool immunity; // a bool to represent immunity (true = immune)
        uint256 immuneTime;
    }

    constructor() {
        administrator = msg.sender;
        verifiedUsers[msg.sender] = true;
        lastAutoUpdate = block.timestamp;
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
        entries[entryCount] = _hash;
        if (_immunityStatus) {
            newCitizen = Citizen(
                entryCount,
                _subdivisionCode,
                _age,
                _immunityStatus,
                block.timestamp
            );
        } else {
            newCitizen = Citizen(
                entryCount,
                _subdivisionCode,
                _age,
                _immunityStatus,
                0
            );
        }
        passports[_hash] = newCitizen;
        entryCount++;
        if (_immunityStatus) {
            emit ImmuneCase(_subdivisionCode, _age);
        }
    }

    function removeCitizen(bytes32 _hash) public verified {
        // delete the entry from entries and shift all entries down 1
        if (bytes(passports[_hash].subdivisionCode).length != 0) {
            // if an entry doesnt exist, it has contains. this check ensures you are deleting an entry which exists, if subdivisioncode length is 0 then an entry doesnt exist.
            for (
                uint256 i = passports[_hash].entrynumber;
                i <= entryCount;
                i++
            ) {
                entries[i] = entries[i + 1];
            }
            delete entries[entryCount]; // delete the final entry
            entryCount--;

            delete passports[_hash];
        }
    }

    function isImmune(bytes32 _hash) public view returns (bool) {
        return passports[_hash].immunity;
    }

    function updateImmunity(bytes32 _hash, bool _immunityStatus)
        public
        verified
    {
        if (_immunityStatus) {
            passports[_hash].immunity = _immunityStatus;
            passports[_hash].immuneTime = block.timestamp;
        } else {
            passports[_hash].immunity = _immunityStatus;
            passports[_hash].immuneTime = 0;
        }
    }

    function autoUpdateImmunity() public verified {
        uint256 updateCount = 0;
        if (lastAutoUpdate + 5 < block.timestamp) {
            for (uint256 i = 1; i <= entryCount; i++) {
                if (
                    passports[entries[i]].immunity == true &&
                    passports[entries[i]].immuneTime + 30 < block.timestamp
                ) {
                    // change immunity of citizen if they are immune and the set time period has past (in seconds)
                    passports[entries[i]].immunity = false;
                    passports[entries[i]].immuneTime = 0;
                    updateCount++;
                }
            }
            emit AutoImmunityUpdate(updateCount);
        }
    }

    event Transfer(address indexed _address, uint256 _amount);
    event VerifiedUser(address indexed _address);
    event UnverifiedUser(address indexed _address);
    event ImmuneCase(string _subdivisionCode, uint8 _age);
    event AutoImmunityUpdate(uint256 _updateCount);

    function addTestingCitizens() public admin {
        // temporary testing function to populate citizens

        addCitizen(
            0x3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb,
            "ENG-AAA",
            1,
            true
        );

        addCitizen(
            0x67fad3bfa1e0321bd021ca805ce14876e50acac8ca8532eda8cbf924da565160,
            "ENG-BBB",
            2,
            true
        );
        addCitizen(
            0x4e03657aea45a94fc7d47ba826c8d667c0d1e6e33a64a036ec44f58fa12d6c45,
            "ENG-CCC",
            3,
            false
        );
        addCitizen(
            0x48bed44d1bcd124a28c27f343a817e5f5243190d3c52bf347daf876de1dbbf77,
            "ENG-DDD",
            4,
            true
        );
        addCitizen(
            0x6377c7e66081cb65e473c1b95db5195a27d04a7108b468890224bedbe1a8a6eb,
            "ENG-EEE",
            5,
            false
        );
        addCitizen(
            0xacd0c377fe36d5b209125185bc3ac41155ed1bf7103ef9f0c2aff4320460b6df,
            "ENG-FFF",
            6,
            false
        );
        addCitizen(
            0xa82aec019867b7307551dc397acde18b541e742fa1a4e53df4ce3b02d462f524,
            "ENG-GGG",
            7,
            false
        );
        addCitizen(
            0x48624fa43c68d5c552855a4e2919e74645f683f5384f72b5b051b71ea41d4f2d,
            "ENG-HHH",
            8,
            true
        );
        addCitizen(
            0x34fb2702da7001bf4dbf26a1e4cf31044bd95b85e1017596ee2d23aedc90498b,
            "ENG-III",
            9,
            true
        );
        addCitizen(
            0xf8da54b5a7dd75028acb077ee61e8dde47ed37c746703ce764edf4a789eb2103,
            "ENG-JJJ",
            10,
            false
        );
    }
}
