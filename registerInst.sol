// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract registerInst {
    address public MOE;

    constructor() {
        MOE = msg.sender;
    }

    struct pendingInstitutes {
        string institute_name;
        address institute_address;
        string unique_id;
        address MOE_address;
    }
    
    pendingInstitutes[] public pendingInstitutesarray;
    mapping(bytes32 => pendingInstitutes) public pendingInstitutesMap;
    
    function generateKey(
        address _address,
        string memory _id
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_address, _id));
    }
    
    function registerInstToPending(
        
        address Address,
        string memory Name,
        // string memory email,
        string memory id
    ) public // uint256 Role
    {
        bytes32 key = generateKey(Address, id);
        
        pendingInstitutes memory newpendinginstitute;
        newpendinginstitute.institute_name = Name;
        newpendinginstitute.institute_address = Address;
        newpendinginstitute.unique_id = id;
        newpendinginstitute.MOE_address = MOE;
        pendingInstitutesarray.push(newpendinginstitute);
        pendingInstitutesMap[key] = newpendinginstitute;
    }


    function getPendingInstitutesCount() public view returns (uint256) {
        return pendingInstitutesarray.length;
    }

    function getPendingInstituteByKey(
        bytes32 key
    ) public view returns (string memory, address, string memory, address) {
        pendingInstitutes memory institute = pendingInstitutesMap[key];
        return (
            institute.institute_name,
            institute.institute_address,
            institute.unique_id,
            institute.MOE_address
        );
    }
    function getPendingInstituteByIndex(
        uint256 index
    ) public view returns (string memory, address, string memory, address) {
        pendingInstitutes memory institute = pendingInstitutesarray[index];
        return (
            institute.institute_name,
            institute.institute_address,
            institute.unique_id,
            institute.MOE_address
        );
    }

    function removePendingInstitute(bytes32 key, uint256 index) public {
        delete pendingInstitutesMap[key];
        delete pendingInstitutesarray[index];
    }
}
