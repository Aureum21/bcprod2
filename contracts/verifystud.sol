// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {registerStud} from "./registerStud.sol";
import {student} from "./student.sol";
import {verifyinst} from "./verifyinst.sol";

contract verifystud {
    address public MOE;
    registerStud public studreg;
    verifyinst public instregd;
    address public studentRegisterContractAddress; //to be removed cause repeated
    uint256 public trialnumber = 0;

    constructor(address _registerStudAddress, address _registeredInstAddress) {
        MOE = msg.sender;
        studentRegisterContractAddress = _registerStudAddress;
        studreg = registerStud(_registerStudAddress);
        instregd = verifyinst(_registeredInstAddress);
    }

    modifier onlyMOE() {
        require(msg.sender == MOE);
        _;
    }

    struct pendingstudents {
            string name;
            address student_address;
            string email;
            string id;
            address instAddress;
    }
    pendingstudents[] public pendingStudentsarray;
    pendingstudents[] public transferStudentsarray;

    mapping(address => address) registeredStudentsmap;
    // mapping(address => address) registeredinstitutesmap;
    address[] registeredStudents;

    function generateKey(
        address _address,
        string memory _id
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_address, _id));
    }

    function addStudToPending(string memory _name, address _student_address, string memory _email, string memory _id, address _instAddress) public{
        

        pendingstudents memory newpendingstudent;
        newpendingstudent.name = _name;
        newpendingstudent.student_address = _student_address;
        newpendingstudent.email = _email;
        newpendingstudent.id = _id;
        newpendingstudent.instAddress = _instAddress;
        pendingStudentsarray.push(newpendingstudent);
    }
    

    function addTransferStudToPending(string memory _name, address _student_address, string memory _email, string memory _id, address _currentInstAddress, address _newinstAddress) public{
        bytes32 key = studreg.generateKey(
            _student_address,
            _id
        );
        
        // (,,,,address currentInstAddress)=studreg.getRegisteredStudentByKey(key);
        // require(!(currentInstAddress == address(0)) && currentInstAddress == _currentInstAddress, "Not the Student's Institute");

        pendingstudents memory newpendingstudent;
        newpendingstudent.name = _name;
        newpendingstudent.student_address = _student_address;
        newpendingstudent.email = _email;
        newpendingstudent.id = _id;
        newpendingstudent.instAddress = _newinstAddress;
        transferStudentsarray.push(newpendingstudent);
    }

    function verifystudent(uint256 index) public  {
        // (string memory name,address student_address,string memory email,string memory id,address instaddress)=getPendingStudentByindex(index);
               
    
        // require(studreg.addInstTostudInfo(index, key, instaddress), "Failed to add institute to student info");
        delete pendingStudentsarray[index];

    }

     function verifyTransferstudent(uint256 index) public {
        // (string memory name,address student_address,string memory email,string memory id,address instaddress)=getTransferStudentByindex(index);
                
        // require(studreg.addInstTostudInfo(index, key, instaddress), "Failed to add institute to student info");
        delete transferStudentsarray[index];

    }
    function removeGraduateStud(uint256 index,address student_address,string memory id) public {
        bytes32 key = studreg.generateKey(
            student_address,
            id
        );
        
        (,,,,address currentInstAddress)=studreg.getRegisteredStudentByKey(key);
        // require(msg.sender == currentInstAddress);
        require(studreg.removeInstFromstudInfo(index, key), "Failed to remove institute from student info");
    }

    function getTransferStudentsCount() public view returns (uint256) {
        return transferStudentsarray.length;
    }

    function getPendingStudentsCount() public view returns (uint256) {
        return pendingStudentsarray.length;
    }

   
    function getPendingStudentByindex(
        uint256 index
    )
        public
        view
        returns (string memory, address, 
        
        string memory, string memory, address)
    {
        require(index < pendingStudentsarray.length, "Index out of bounds");

        pendingstudents memory studentinfo = pendingStudentsarray[index];

    return (
        studentinfo.name,
        studentinfo.student_address,
        studentinfo.email,
        studentinfo.id,
        studentinfo.instAddress
    );
    }

    function getPendingStudentsList () public view returns (pendingstudents[] memory) {
        return pendingStudentsarray;
    }
    function getTransferStudentByindex(
        uint256 index
    )
        public
        view
        returns (string memory, address, string memory, string memory, address)
    {
        require(index < pendingStudentsarray.length, "Index out of bounds");

        pendingstudents memory studentinfo = transferStudentsarray[index];

    return (
        studentinfo.name,
        studentinfo.student_address,
        studentinfo.email,
        studentinfo.id,
        studentinfo.instAddress
    );
    }

    function getTransferStudentsList () public view returns (pendingstudents[] memory) {
        return transferStudentsarray;
    }

    function isStudent(address _studentAddress) public view returns (bool) {
        return registeredStudentsmap[_studentAddress] != address(0x0);
    }

    

    function StudentsCount() public view returns (uint256) {
        return registeredStudents.length;
    }

    function getStudentContractByAddress(
        address _employee
    ) public view returns (address) {
        return registeredStudentsmap[_employee];
    }
    function checkFunction() public view returns(bool){
        return(instregd.registeredinstitutesmap(msg.sender)!=address(0));

    }

    modifier onlyverfiedInstitute() {

        require(instregd.registeredinstitutesmap(msg.sender)!=address(0), "You are not Authorized!");
        _;
    }
    modifier onlystudent () {
        require(studreg.isStudent(msg.sender), "Not authorized");
        _;
    }
}
