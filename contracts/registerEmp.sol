// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract registerEmp {
    address public MOE;
    constructor() {
        MOE = msg.sender;
    }
    struct registerEmployersStruct {
        string name;
        address employer_address;
        string email;
        
    }
    registerEmployersStruct[] public registeredEmployersarray;
    mapping(bytes32 => registerEmployersStruct) public registeredEmployersMap;
    mapping(address => address) public registeredEmployersContract;
    string[] public employerList;
    mapping(string => address) public employerNameToAddressMap;

    function generateKey(
        address _address,
        string memory email
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_address, email));
    }
    function registerEmployers(
        string memory _name,
        address _employer_address,
        string memory _email, 
        address _contractAddress
    ) public {
       
        bytes32 key = generateKey(_employer_address, _email);
     
        registerEmployersStruct memory newEmployerStruct;
        newEmployerStruct.name = _name;
        newEmployerStruct.employer_address = _employer_address;
        newEmployerStruct.email = _email;    
        registeredEmployersMap[key] = newEmployerStruct;    
        employerList.push(_name);
        employerNameToAddressMap[_name] = _employer_address;
        registeredEmployersContract[_employer_address] = _contractAddress;
        registeredEmployersarray.push(newEmployerStruct);
    }

  
    function getRegisteredEmployersCount() public view returns (uint256) {
        return registeredEmployersarray.length;
    }    
  
    function getRegisteredEmployerByKey(
        bytes32 key
    )
        public
        view
        returns (string memory, address, string memory)
    {
        registerEmployersStruct memory employerinfo = registeredEmployersMap[key];
        return (
            employerinfo.name,
            employerinfo.employer_address,
            employerinfo.email
        );
    }

    function getEmployerList() public view returns (string[] memory) {
        return employerList;
    }

    function getRegisteredEmployerList()
        public
        view
        returns (registerEmployersStruct[] memory)
    {
        return registeredEmployersarray;        
    }
    function isEmployer(address _employerAddress) public view returns (bool) {
        return registeredEmployersContract[_employerAddress] != address(0x0);
    }
    function getRegisteredEmployersContract(address employerAddress) public view returns(address){
        return registeredEmployersContract[employerAddress];
    }
    function getemployeeAddressByName(string memory employerName) public view returns(address) {
        return employerNameToAddressMap[employerName];
    }
    
}
