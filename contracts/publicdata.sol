// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract publicdata {
    address public MOE;

    address private node1_public;
    address private node2_public;
    address private node3_public;
    address private node4_public;
    string private node1;
    string private node2;
    string private node3;
    string private node4;
    constructor(
        address _node1_public,
        address _node2_public,
        address _node3_public,
        address _node4_public
    ) {
        MOE = msg.sender;

        node1_public = _node1_public;
        node2_public = _node2_public;
        node3_public = _node3_public;
        node4_public = _node4_public;
        // node1 = _node1;
        // node2 = _node2;
        // node3 = _node3;
        // node4 = _node4;
    }
    struct user {
        bool isVerified;
        string registrationDate;
        string verificationDate;
    }

    mapping(address => address) public studAddressToStudContract;
    mapping(address => address[]) public instAddressToInstContract;
    mapping(address => address) public employerAddressToEmployerContract;
    mapping(address => user) public instAddressToInstDetails;
    mapping(address => user) public studAddressToStudDetails;

    function setNodeNames(
        string memory _node1,
        string memory _node2,
        string memory _node3,
        string memory _node4
    ) public onlyMOE {
        node1 = _node1;
        node2 = _node2;
        node3 = _node3;
        node4 = _node4;
    }
    function registerStudent(
        address _studAddress,
        address _studContractAddress
    ) public {
        studAddressToStudContract[_studAddress] = _studContractAddress;
    }
    function registerInstitute(
        address _instAddress,
        address _instContractAddress,
        address _instPendingContractAddress
    ) public onlyNode2 {
        instAddressToInstContract[_instAddress].push(_instContractAddress);
        instAddressToInstContract[_instAddress].push(
            _instPendingContractAddress
        );
    }
    function registerEmployer(
        address _employerAddress,
        address _employerContractAddress
    ) public onlyNode4 {
        employerAddressToEmployerContract[
            _employerAddress
        ] = _employerContractAddress;
    }
    function getStudContractAddress(
        address _studAddress
    ) public view onlyNode3 returns (address, string memory) {
        return (studAddressToStudContract[_studAddress], node3);
    }
    function getInstContractAddress(
        address _instAddress
    ) public view onlyNode2 returns (address[] memory, string memory) {
        return (instAddressToInstContract[_instAddress], node2);
    }
    function getEmployerContractAddress(
        address _employerAddress
    ) public view onlyNode4 returns (address, string memory) {
        return (employerAddressToEmployerContract[_employerAddress], node4);
    }

    function addInstToPending(
        address _instAddress,
        string memory _registrationDate
    ) public onlyNode2 {
        user memory newinstitute;
        newinstitute.isVerified = false;
        newinstitute.registrationDate = _registrationDate;
        newinstitute.verificationDate = "";
        instAddressToInstDetails[_instAddress] = newinstitute;
    }
    function verifyInstitute(
        address _instAddress,
        string memory _verificationDate
    ) public onlyMOE {
        user storage inst = instAddressToInstDetails[_instAddress];
        require(!inst.isVerified, "Institute already verified");
        inst.isVerified = true;
        inst.verificationDate = _verificationDate;
    }

    function getInstDetails(
        address _instAddress
    ) public view returns (bool, string memory, string memory) {
        user memory inst = instAddressToInstDetails[_instAddress];
        return (inst.isVerified, inst.registrationDate, inst.verificationDate);
    }

    function addStudToPending(
        address _studAddress,
        string memory _registrationDate
    ) public onlyNode2 {
        user memory newstudent;
        newstudent.isVerified = false;
        newstudent.registrationDate = _registrationDate;
        newstudent.verificationDate = "";
        studAddressToStudDetails[_studAddress] = newstudent;
    }
    function verifyStudent(
        address _studAddress,
        string memory _verificationDate
    ) public onlyMOE {
        user storage stud = studAddressToStudDetails[_studAddress];
        require(!stud.isVerified, "Student already verified");
        stud.isVerified = true;
        stud.verificationDate = _verificationDate;
    }

    function getStudDetails(
        address _studAddress
    ) public view returns (bool, string memory, string memory) {
        user memory stud = studAddressToStudDetails[_studAddress];
        return (stud.isVerified, stud.registrationDate, stud.verificationDate);
    }

    function ismoe() public view returns (bool) {
        return (msg.sender == MOE);
    }

    modifier onlyMOE() {
        require(msg.sender == node1_public, "Not MOE");
        _;
    }
    modifier onlyNode2() {
        require(msg.sender == node2_public, "Not Node 2");
        _;
    }
    modifier onlyNode3() {
        require(msg.sender == node3_public, "Not Node3");
        _;
    }
    modifier onlyNode4() {
        require(msg.sender == node4_public, "Not Node4");
        _;
    }
}
