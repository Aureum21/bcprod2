// SPDX-License-Identifier: MIT
import {student} from "./student.sol";
pragma solidity ^0.8.10;
contract registerStud {
    address public MOE;
    constructor() {
        MOE = msg.sender;
    }
    struct registerStudentsStruct {
        string name;
        address student_address;
        string email;
        string id;
        address instAddress;
    }
    registerStudentsStruct[] public registeredStudentsarray;
    mapping(bytes32 => registerStudentsStruct) public registeredStudentsMap;
    // mapping(bytes32 => pendingStudents) public pendingStudentsMap;
    mapping(address => address) public registeredStudentsContract;
    function generateKey(
        address _address,
        string memory _id
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_address, _id));
    }
    function registerStudents(
        string memory _name,
        address _student_address,
        string memory _email,
        string memory _id,
        address newstudent
    ) public {
       
        address instAddress;
        bytes32 key = generateKey(_student_address, _id);
     
        registerStudentsStruct memory newStudentStruct;
        newStudentStruct.name = _name;
        newStudentStruct.student_address = _student_address;
        newStudentStruct.email = _email;
        newStudentStruct.id = _id;
        newStudentStruct.instAddress = instAddress;
        registeredStudentsMap[key] = newStudentStruct;
        registeredStudentsContract[_student_address] = newstudent;
        registeredStudentsarray.push(newStudentStruct);
    }

    
    function addInstTostudInfo(uint256 index, bytes32 key, address _instAddress) public returns(bool) {
        registeredStudentsarray[index].instAddress = _instAddress;
        registeredStudentsMap[key].instAddress = _instAddress;
        return true;
    }
    function removeInstFromstudInfo(uint256 index, bytes32 key) public returns(bool) {
        registeredStudentsarray[index].instAddress = address(0);
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
        returns (string memory, address, string memory, string memory,address)
    {
        registerStudentsStruct memory studentinfo = registeredStudentsMap[key];
        return (
            studentinfo.name,
            studentinfo.student_address,
            studentinfo.email,
            studentinfo.id,
            studentinfo.instAddress
        );
    }
    function getRegisteredStudentByIndex(
        uint256 index
    )
        public
        view
        returns (string memory, address, string memory, string memory,address)
    {
        registerStudentsStruct memory studentinfo = registeredStudentsarray[
            index
        ];
        return (
            studentinfo.name,
            studentinfo.student_address,
            studentinfo.email,
            studentinfo.id,
            studentinfo.instAddress
        );
    }
    function isStudent(address _studentAddress) public view returns (bool) {
        return registeredStudentsContract[_studentAddress] != address(0x0);
    }
    function getRegisteredStudentsContract(address studAddress) public view returns(address){
        return registeredStudentsContract[studAddress];
    }


}
