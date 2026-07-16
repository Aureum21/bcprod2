// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

contract admin {
    address public MOE;
    constructor() {
        MOE = msg.sender;
    }
    modifier onlyMOE() {
        require(msg.sender == MOE);
        _;
    }

    struct pendingInstitutes {
        string institute_name;
        address institute_address;
        string unique_id;
        address MOE_address;
    }

    address[] public pendingInstitutesAddress;
    mapping(address => pendingInstitutes) public pendingInstitutesMap;

    function generateKey(
        address _address,
        string memory _id
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_address, _id));
    }

    function registerInstToPending(
        address Address,
        string memory Name,
        string memory id // uint256 Role
    ) public {
        pendingInstitutes memory newpendinginstitute;
        newpendinginstitute.institute_name = Name;
        newpendinginstitute.institute_address = Address;
        newpendinginstitute.unique_id = id;
        newpendinginstitute.MOE_address = MOE;
        pendingInstitutesMap[Address] = newpendinginstitute;
        pendingInstitutesAddress.push(Address);
    }

    function getPendingInstitutesCount() public view returns (uint256) {
        return pendingInstitutesAddress.length;
    }

    function getPendingInstituteByAddress(
        address Address
    ) public view returns (string memory, address, string memory, address) {
        pendingInstitutes memory institute = pendingInstitutesMap[Address];
        return (
            institute.institute_name,
            institute.institute_address,
            institute.unique_id,
            institute.MOE_address
        );
    }

    function getPendingInstList()
        public
        view
        returns (pendingInstitutes[] memory)
    {
        pendingInstitutes[] memory institutes = new pendingInstitutes[](
            pendingInstitutesAddress.length
        );
        for (uint256 i = 0; i < pendingInstitutesAddress.length; i++) {
            if (
                pendingInstitutesMap[pendingInstitutesAddress[i]]
                    .institute_address != address(0)
            ) {
                institutes[i] = pendingInstitutesMap[
                    pendingInstitutesAddress[i]
                ];
            }
        }
        return institutes;
    }

    function removePendingInstitute(address Address) public {
        delete pendingInstitutesMap[Address];
    }

    string[] public institution_names;
    mapping(address => address[]) public registeredinstitutesmap;
    mapping(string => address) public instNameToAddress;
    address[] registeredinstitutes;

    function verifyInstitution(
        address instContractAddress,
        string memory institute_name,
        address institute_address,
        address pending_contract_address
    ) public onlyMOE {
        registeredinstitutesmap[institute_address].push(instContractAddress);
        registeredinstitutesmap[institute_address].push(
            pending_contract_address
        );
        registeredinstitutes.push(institute_address);
        instNameToAddress[institute_name] = institute_address;
        institution_names.push(institute_name);
    }
    function getInstitutesCount() public view returns (uint256) {
        return institution_names.length;
    }
    function getAddresByName(string memory name) public view returns (address) {
        return instNameToAddress[name];
    }
    function getInstituteByIndex(
        uint256 index
    ) public view returns (string memory) {
        return institution_names[index];
    }
    function getInstList() public view returns (string[] memory) {
        return institution_names;
    }

    function isinstitute(address _institutes) public view returns (bool) {
        return registeredinstitutesmap[_institutes].length != 0;
    }

    function instituteCount() public view returns (uint256) {
        return registeredinstitutes.length;
    }

    function getinstitutesContractByAddress(
        address _institutes
    ) public view returns (address[] memory) {
        return registeredinstitutesmap[_institutes];
    }
}
