// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {registerStud} from "https://github.com/Aureum21/blockchain/blob/main/registerStud.sol";
import {verifyinst} from "https://github.com/Aureum21/blockchain/blob/main/verifyinst.sol";

contract verifystud {
    address public MOE;
    registerStud public studreg;
    verifyinst public instregd;
    address public studentRegisterContractAddress; //to be removed cause repeated

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

    function addStudToPending(string memory _name, address _student_address, string memory _email, string memory _id, address _instAddress) public onlystudentorMOE{
        require(msg.sender == _student_address);
        pendingstudents memory newpendingstudent;
        newpendingstudent.name = _name;
        newpendingstudent.student_address = _student_address;
        newpendingstudent.email = _email;
        newpendingstudent.id = _id;
        newpendingstudent.instAddress = _instAddress;
        pendingStudentsarray.push(newpendingstudent);
    }
    function CheckReturn(address student_address,string memory id) public view returns (bool){
        bytes32 key = studreg.generateKey(
            student_address,
            id
        );
        (,,,,address currentInstAddress)=studreg.getRegisteredStudentByKey(key);
        return (msg.sender == currentInstAddress);
    }

    function addTransferStudToPending(string memory _name, address _student_address, string memory _email, string memory _id, address _instAddress) public onlyverfiedInstitute{
        bytes32 key = studreg.generateKey(
            _student_address,
            _id
        );
        
        (,,,,address currentInstAddress)=studreg.getRegisteredStudentByKey(key);
        require(msg.sender == currentInstAddress);
        pendingstudents memory newpendingstudent;
        newpendingstudent.name = _name;
        newpendingstudent.student_address = _student_address;
        newpendingstudent.email = _email;
        newpendingstudent.id = _id;
        newpendingstudent.instAddress = _instAddress;
        transferStudentsarray.push(newpendingstudent);
    }

    function verifystudent(uint256 index) public onlyverfiedInstitute  {
        (, address student_address,,string memory id,address instaddress)=getPendingStudentByindex(index);
        require(msg.sender == instaddress, "Not the Student's Institute");
        
        // address studContractaddress = studreg.getRegisteredStudentsContract(
        //     student_address
        // );
        // require(studContractaddress != address(0), "Invalid student contract address(Studetnt not Registerd))");
        
        bytes32 key = studreg.generateKey(
            student_address,
            id
        );
        require(studreg.addInstTostudInfo(key, msg.sender), "Failed to add institute to student info");
        // student(studContractaddress).addInstToProfile(msg.sender);

    }

     function verifyTransferstudent(uint256 index) public {
        (,address student_address,,string memory id,address instaddress)=getTransferStudentByindex(index);
        require(msg.sender == instaddress, "Not the Student's Institute");
        
        // address studContractaddress = studreg.getRegisteredStudentsContract(
        //     student_address
        // );
        // require(studContractaddress != address(0), "Invalid student contract address(Studetnt not Registerd))");
        
        bytes32 key = studreg.generateKey(
            student_address,
            id
        );
        require(studreg.addInstTostudInfo(key, msg.sender), "Failed to add institute to student info");
        // student(studContractaddress).addInstToProfile(msg.sender);

    }
    function removeGraduateStud(address student_address,string memory id) public {
        bytes32 key = studreg.generateKey(
            student_address,
            id
        );
        
        (,address studAddress,,,address currentInstAddress)=studreg.getRegisteredStudentByKey(key);
        require((msg.sender == currentInstAddress) || (msg.sender == studAddress));
        require(studreg.removeInstFromstudInfo(key), "Failed to remove institute from student info");
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
        returns (string memory, address, string memory, string memory, address)
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

    function getTransferStudentByindex(
        uint256 index
    )
        public
        view
        returns (string memory, address, string memory, string memory, address)
    {
        require(index < transferStudentsarray.length, "Index out of bounds");

        pendingstudents memory studentinfo = transferStudentsarray[index];

    return (
        studentinfo.name,
        studentinfo.student_address,
        studentinfo.email,
        studentinfo.id,
        studentinfo.instAddress
    );
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
    modifier onlystudentorMOE () {
        require(studreg.isStudent(msg.sender) || (msg.sender == MOE), "Not authorized");
        _;
    }
}
