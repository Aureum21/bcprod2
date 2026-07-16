// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
contract registerStud {
    address public MOE;
    constructor() {
        MOE = msg.sender;
    }
    struct registerStudentsStruct {
        string name;
        address student_address;
        string join_date;
        string email;
        string id;
        address instAddress;
    }
    registerStudentsStruct[] public registeredStudentsarray;
    mapping(bytes32 => registerStudentsStruct) public registeredStudentsMap;
    mapping(address => address) public registeredStudentsContract;
    function generateKey(
        address _address,
        string memory _id
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_address, _id));
    }
    function registerStudents(
        string memory _name,
        string memory _email,
        string memory _id,
        address newstudent,
        string memory _join_date
    ) public {
        address instAddress;
        bytes32 key = generateKey(msg.sender, _id);

        registerStudentsStruct memory newStudentStruct;
        newStudentStruct.name = _name;
        newStudentStruct.student_address = msg.sender;
        newStudentStruct.email = _email;
        newStudentStruct.join_date = _join_date;
        newStudentStruct.id = _id;
        newStudentStruct.instAddress = instAddress;
        registeredStudentsMap[key] = newStudentStruct;
        registeredStudentsContract[msg.sender] = newstudent;
        registeredStudentsarray.push(newStudentStruct);
    }

    function addInstTostudInfo(
        bytes32 key,
        address _instAddress
    ) public returns (bool) {
        registeredStudentsMap[key].instAddress = _instAddress;
        return true;
    }

    function removeInstFromstudInfo(bytes32 key) public returns (bool) {
        registeredStudentsMap[key].instAddress = address(0);
        return true;
    }

    function getRegisteredStudentsCount() public view returns (uint256) {
        return registeredStudentsarray.length;
    }

    function getRegisteredStudentByKey(
        bytes32 key
    )
        public
        view
        returns (
            string memory,
            address,
            string memory,
            string memory,
            address,
            string memory
        )
    {
        registerStudentsStruct memory studentinfo = registeredStudentsMap[key];
        return (
            studentinfo.name,
            studentinfo.student_address,
            studentinfo.email,
            studentinfo.id,
            studentinfo.instAddress,
            studentinfo.join_date
        );
    }

    function getListOfRegisteredStudents()
        public
        view
        returns (registerStudentsStruct[] memory)
    {
        return registeredStudentsarray;
    }

    function isStudent(address _studentAddress) public view returns (bool) {
        return registeredStudentsContract[_studentAddress] != address(0x0);
    }
    function getRegisteredStudentsContract(
        address studAddress
    ) public view returns (address) {
        return registeredStudentsContract[studAddress];
    }
}
