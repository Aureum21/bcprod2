// SPDX-License-Identifier: MIT
pragma solidity >=0.7.4;
contract student {
    address student_address;
    string email;
    string id;
    uint256 endorsecount;
    string public name;
    address public instAddress;
    constructor(
        string memory _name,
        string memory _email,
        string memory _id
    ) {
        name = _name;
        student_address = msg.sender;
        email = _email;
        id = _id;
    }
    modifier OnlyStudent() {
        require(msg.sender == student_address, "Not Student error");
        _;
    }

    // retreiving and editing student information

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

    function addInstToProfile(address _instAddress) public {
        listOfInstitutes.push(_instAddress);
        instAddress = _instAddress;
    }

    function removeInstFromProfile() public {
        require(msg.sender == instAddress);
        instAddress = address(0);
    }
    // certification unofficial

    struct certificationInfo {
        string name; // the student name
        address institute;
        string certificate_name;
        bool verified;
        bool visible;
        string cert_hash; // the hash of the certificate
    }
    // the key is the certificate name eg bachelors and the value is the struct and the name inside is the employee name.
    mapping(string => certificationInfo) certificationmap;
    string[] certifications;
    certificationInfo[] certificationList;

    function addCertification(
        string memory _name,
        address _institute,
        string memory _certificate_name,
        string memory _cert_hash
    ) public {
        certificationInfo memory newcertificationInfo;
        newcertificationInfo.name = _name;
        newcertificationInfo.institute = _institute;
        newcertificationInfo.certificate_name = _certificate_name;
        newcertificationInfo.cert_hash = _cert_hash;
        newcertificationInfo.verified = false;
        newcertificationInfo.visible = true;
        certificationmap[_certificate_name] = newcertificationInfo;
        certifications.push(_certificate_name);
        certificationList.push(newcertificationInfo);
    }
    // gotta check the security. security barely passed
    function verifyCertification(string memory _certname) public {
        require(msg.sender == certificationmap[_certname].institute);
        certificationmap[_certname].verified = true;
    }

    function getCertificationBycertName(
        string memory _certname
    )
        private
        view
        returns (
            string memory,
            address,
            string memory,
            string memory,
            bool,
            bool
        )
    {
        return (
            certificationmap[_certname].name,
            certificationmap[_certname].institute,
            certificationmap[_certname].certificate_name,
            certificationmap[_certname].cert_hash,
            certificationmap[_certname].verified,
            certificationmap[_certname].visible
        );
    }

    function getCertificationCount() public view returns (uint256) {
        return certifications.length;
    }

    function getCertificationByIndex(
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
            bool
        )
    {
        return getCertificationBycertName(certifications[_index]);
    }

    function getCertificateList()
        public
        view
        returns (certificationInfo[] memory)
    {
        return certificationList;
    }

    function deleteCertification(string memory _certname) public OnlyStudent {
        certificationmap[_certname].visible = !certificationmap[_certname]
            .visible;
    }

    // work experience section

    struct workexpInfo {
        string role;
        address institute;
        string employer;
        string startdate;
        string enddate;
        bool verified;
        string description;
        bool visible;
        string cert_hash;
    }
    // try using mapping to map(same institution different roles)
    mapping(address => workexpInfo) workexpmap;
    address[] workexps;
    workexpInfo[] workexpList;

    function addWorkExp(
        string memory _role,
        address _institute,
        string memory _employer,
        string memory _startdate,
        string memory _enddate,
        string memory _description,
        string memory _cert_hash
    ) public {
        workexpInfo memory newworkexp;
        newworkexp.role = _role;
        newworkexp.institute = _institute;
        newworkexp.startdate = _startdate;
        newworkexp.enddate = _enddate;
        newworkexp.employer = _employer;
        newworkexp.cert_hash = _cert_hash;
        newworkexp.verified = false;
        newworkexp.visible = true;
        newworkexp.description = _description;
        workexpmap[_institute] = newworkexp;
        workexps.push(_institute);
        workexpList.push(newworkexp);
    }

    function verifyWorkExp(address _institute) public {
        require(msg.sender == workexpmap[_institute].institute);
        workexpmap[msg.sender].verified = true;
    }

    function getWorkExpByAddress(
        address _institute
    )
        private
        view
        returns (
            string memory,
            string memory,
            address,
            string memory,
            string memory,
            // bool,
            string memory,
            bool
        )
    {
        return (
            workexpmap[_institute].role,
            workexpmap[_institute].cert_hash,
            workexpmap[_institute].institute,
            workexpmap[_institute].startdate,
            workexpmap[_institute].enddate,
            // workexpmap[_institute].verified,
            workexpmap[_institute].description,
            workexpmap[_institute].visible
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
            string memory,
            address,
            string memory,
            string memory,
            string memory,
            bool
        )
    {
        return getWorkExpByAddress(workexps[_index]);
    }

    function getWorkExpList() public view returns (workexpInfo[] memory) {
        return workexpList;
    }

    function deleteWorkExp(address org) public OnlyStudent {
        workexpmap[org].visible = false;
    }

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
        string cert_hash;
    }
    // the first string is the skill eg programming  the value is the struct and the name inside is the student name, eg abekebe
    mapping(string => skillInfo) skillmap;
    string[] skills;
    skillInfo[] skillList;

    function addSkill(
        string memory _name,
        string memory _student_name,
        string memory _experience
    ) public {
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
        skillList.push(employeeSkillSet);
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
        private
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

    function getSkillList() public view returns (skillInfo[] memory) {
        return skillList;
    }
    struct studentInfo {
        string student_name;
        address student_address;
        string email;
        string id;
        address[] institutes;
        skillInfo[] skills;
        workexpInfo[] workexps;
        certificationInfo[] certifications;
    }

    function getStudentInfo() public view returns (studentInfo memory) {
        studentInfo memory info;
        info.student_name = name;
        info.student_address = student_address;
        info.email = email;
        info.id = id;
        info.institutes = listOfInstitutes;
        info.skills = skillList;
        info.workexps = workexpList;
        info.certifications = certificationList;
        return info;
    }

    function deleteSkill(string memory _name) public OnlyStudent {
        skillmap[_name].visible = !skillmap[_name].visible;
    }
}
