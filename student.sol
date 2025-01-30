// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import {verifystud} from "https://github.com/Aureum21/blockchain/blob/main/verifystud.sol";
import {verifyinst} from "https://github.com/Aureum21/blockchain/blob/main/verifyinst.sol";

contract student {
    address MOE;
    address student_address;
    string email;
    string id;
    uint256 endorsecount;
    string name;
    address instAddress;
    // registerStud public studreg;
    verifystud public studver;
    verifyinst public instver;
    constructor(
        //address _admin,
        string memory _name,
        address _student_address,
        string memory _email,
        string memory _id,
        // address _instAddress,
        // address _registerAddress,
        address _verifystudAddress,
        address _verifyinstAddress,
        address _moeAddress
    ) {
        //admin = _admin;
        name = _name;
        student_address = _student_address;
        email = _email;
        id = _id;
        // instAddress = _instAddress;
        endorsecount = 0;
        // studreg = registerStud(_registerAddress);
        studver = verifystud(_verifystudAddress);
        instver = verifyinst(_verifyinstAddress);
        MOE = _moeAddress;
    }
    modifier OnlyStudent() {
        require(msg.sender == student_address, "Not Student error");
        _;
    }

    // retreiving and editing student information
    function getStudentInfo() // remove endorse count next time
        public
        view
        returns (address, string memory, string memory, string memory, uint256)
    {
        return (student_address, name, email, id, endorsecount);
    }

    address[] public listOfInstitutes;

    function editInfo(
        string memory _name,
        string memory _email,
        string memory _id
    ) public OnlyStudent {
        name = _name;
        email = _email;
        id = _id;
    }

    function addInstToProfile(address _instAddress) public onlyverfiedInstitute  {
        require(msg.sender == _instAddress);
        listOfInstitutes.push(_instAddress);
        instAddress = _instAddress;
    }
    function removeInstFromProfile() public  {
        require(msg.sender==instAddress);
        instAddress = address(0);
    }
    // certification unofficial

    // mapping(address => bool) public isCertVisible;
    struct certificationInfo {
        string name; // the student name
        address institute;
        string certificate_name;
        bool verified;
        // bool visible;
        // address[] visibleTo;
        mapping(address => bool) visibleTo;
    }
    // the key is the certificate name eg bachelors and the value is the struct and the name inside is the employee name.
    mapping(string => certificationInfo) certificationmap;
    string[] certifications;

    function addCertification(
        string memory _name,
        address _institute,
        string memory _certificate_name
        ) public OnlyStudent {
        certificationInfo storage newCert = certificationmap[_certificate_name];
        newCert.name = _name;
        newCert.institute = _institute;
        newCert.certificate_name = _certificate_name;
        newCert.verified = false;

        newCert.visibleTo[student_address] = true;
        newCert.visibleTo[instAddress] = true;
        newCert.visibleTo[MOE] = true;

        certifications.push(_certificate_name);
    }


    function makeCertVisibleTo(address recAgent, string memory _certificate_name) public {
        require(
            (msg.sender == MOE) || (msg.sender == instAddress) || (msg.sender == student_address),
            "Not authorized"
        );

    certificationmap[_certificate_name].visibleTo[recAgent] = true;
    }
    // gotta check the security. security barely passed
    function verifyCertification(string memory _certname) public {
        require(msg.sender == certificationmap[_certname].institute);
        certificationmap[_certname].verified = true;
    }

    function getCertificationBycertName(
        string memory _certname
    ) public view isAgentCertAllowed(_certname) returns (string memory, address, string memory, bool) {
        return (
            certificationmap[_certname].name,
            certificationmap[_certname].institute,
            certificationmap[_certname].certificate_name,
            certificationmap[_certname].verified
            // certificationmap[_certname].visible
        );
    }

    function getCertificationCount() public view returns (uint256) {
        return certifications.length;
    }

    function getCertificationByIndex(
        uint256 _index
    ) public view returns (string memory, address, string memory, bool) {
        return getCertificationBycertName(certifications[_index]);
    }
    // to be used in the front end  to say if i wanna show the certificate or not
    // function deleteCertification(string memory _certname) private OnlyStudent {
    //     certificationmap[_certname].visible = !certificationmap[_certname]
    //         .visible;
    // }

    // work experience section

    struct workexpInfo {
        string role;
        address institute;
        string employer;
        string startdate;
        string enddate;
        bool verified;
        string description;
        // address[] visibleTo;
        mapping(address => bool) visibleTo;
    }
    // try using mapping to map(same institution different roles)
    
    mapping(address => workexpInfo) workexpmap;
    address[] workexps;
    // mapping(address => bool) public isExpVisible;
    function addWorkExp(
        string memory _role,
        address _institute,
        string memory _startdate,
        string memory _enddate,
        string memory _description
    ) public OnlyStudent {
        workexpInfo storage newExp = workexpmap[_institute];
        newExp.role = _role;
        newExp.institute = _institute;
        newExp.startdate = _startdate;
        newExp.enddate = _enddate;
        newExp.verified = false;
        newExp.description = _description;

        newExp.visibleTo[student_address] = true;
        newExp.visibleTo[instAddress] = true;
        newExp.visibleTo[MOE] = true;

        workexps.push(_institute);
    }

    function makeExpVisibleTo(address recAgent, address _institute) public {
        require(
            (msg.sender == MOE) || (msg.sender == instAddress) || (msg.sender == student_address),
            "Not authorized"
        );
        workexpmap[_institute].visibleTo[recAgent] = true;
    }

    function verifyWorkExp(address _institute) public {
        require(msg.sender == workexpmap[_institute].institute);
        workexpmap[msg.sender].verified = true;
    }

    function getWorkExpByAddress(
        address _institute
    )
        public
        view
        isAgentexpAllowed(_institute)
        returns (
            string memory,
            address,
            string memory,
            string memory,
            bool,
            string memory
        )
    {
        return (
            workexpmap[_institute].role,
            workexpmap[_institute].institute,
            workexpmap[_institute].startdate,
            workexpmap[_institute].enddate,
            workexpmap[_institute].verified,
            workexpmap[_institute].description
        );
    }

    function getWorkExpCount() public view returns (uint256) {
        return workexps.length;
    }

    function getWorkExpByIndex(
        uint256 _index
    )
        public
        view
        returns (
            string memory,
            address,
            string memory,
            string memory,
            bool,
            string memory
        )
    {
        return getWorkExpByAddress(workexps[_index]);
    }

    // function deleteWorkExp(address org) public OnlyStudent {
    //     workexpmap[org].visible = false;
    // }

    // skills upload and endorse

    struct skillInfo {
        // name of the skill not the user
        string name;
        string student_name;
        // beginner, intermediate, advance
        string experience;
        bool endorsed;
        address endorser_address;
        // the thing written when endorsed
        string review;
        bool visible;
    }
    // the first string is the skill eg programming  the value is the struct and the name inside is the student name, eg abekebe
    mapping(string => skillInfo) skillmap;
    string[] skills;

    function addSkill(
        string memory _name,
        string memory _student_name,
        string memory _experience
    ) public OnlyStudent {
        //created an instance of the employee skill set
        skillInfo memory employeeSkillSet;
        // filled the instance variables
        employeeSkillSet.name = _name;
        employeeSkillSet.student_name = _student_name;
        employeeSkillSet.experience = _experience;
        employeeSkillSet.endorsed = false;
        employeeSkillSet.visible = true;
        skillmap[_name] = employeeSkillSet;
        skills.push(_name);
    }

    function endorseSkill(string memory _name, string memory _review) public {
        require(skillmap[_name].visible);
        endorsecount = endorsecount + 1;
        skillmap[_name].endorsed = true;
        skillmap[_name].endorser_address = msg.sender;
        skillmap[_name].review = _review;
    }

    function getSkillByName(
        string memory _name
    )
        public
        view
        returns (
            string memory,
            string memory,
            bool,
            address,
            string memory,
            bool
        )
    {
        return (
            skillmap[_name].name,
            skillmap[_name].experience,
            skillmap[_name].endorsed,
            skillmap[_name].endorser_address,
            skillmap[_name].review,
            skillmap[_name].visible
        );
    }

    function getSkillCount() public view returns (uint256) {
        return skills.length;
    }

    function getSkillByIndex(
        uint256 _index
    )
        public
        view
        returns (
            string memory,
            string memory,
            bool,
            address,
            string memory,
            bool
        )
    {
        return getSkillByName(skills[_index]);
    }

    function deleteSkill(string memory _name) public OnlyStudent {
        skillmap[_name].visible = !skillmap[_name].visible;
    }
    modifier onlyverfiedInstitute() {
        require(instver.registeredinstitutesmap(msg.sender)!=address(0), "You are not authorized!");
        _;
    }
    modifier isAgentCertAllowed(string memory _certname) {
        require(certificationmap[_certname].visibleTo[msg.sender], "Not Authorized");
        _;
    }
    modifier isAgentexpAllowed(address _institute) {
        require(workexpmap[_institute].visibleTo[msg.sender], "Not Authorized");
        _;
    }
    
}
