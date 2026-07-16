// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Institute {
    address public institute_address;
    string unique_id;
    string institute_name;
    address MOE_address;

    constructor(
        string memory _institute_name,
        address _institute_address,
        string memory _unique_id,
        address _MOE_address
    ) {
        institute_name = _institute_name;
        institute_address = _institute_address;
        unique_id = _unique_id;
        MOE_address = _MOE_address;
    }

    modifier OnlyMOE() {
        require(msg.sender == MOE_address);
        _;
    }
    function getInstInfo()
        public
        view
        returns (address, string memory, string memory)
    {
        return (institute_address, institute_name, unique_id);
    }

    struct certificationInfo {
        address institute;
        string certificate_name;
        bool visible;
        bool verified;
        string cert_hash;
    }

    struct official_cert_info {
        address student;
        string cert_type;
        string student_name;
        address institute;
        string startdate;
        string enddate;
        bool verified;
        string description;
        string cert_hash;
    }

    struct skillInfo {
        string skill_name;
        string experience;
        bool endorsed;
        address endorser_address;
        string review;
        bool visible;
        string cert_hash;
    }

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

    struct studentInfo {
        string student_name;
        string application_status;
        address student_address;
        string email;
        string id;
        string registration_type;
        address[] institutes;
        address inst_address;
        skillInfo[] skills;
        workexpInfo[] workexps;
        certificationInfo[] certifications;
        official_cert_info[] official_certifications;
    }

    studentInfo[] public registeredStudentsarray;

    mapping(bytes32 => studentInfo) public studentInfoMap;

    mapping(address => address) registeredStudentsmap;
    address[] registeredStudents;

    function verifystudent(studentInfo memory student) public {
        require(
            student.inst_address == institute_address,
            "Authorization failed"
        );
        bytes32 key = keccak256(
            abi.encodePacked(student.student_address, institute_address)
        );

        studentInfo storage newstudentInfo = studentInfoMap[key];
        newstudentInfo.application_status = "accepted";
        newstudentInfo.student_name = student.student_name;
        newstudentInfo.registration_type = student.registration_type;
        newstudentInfo.student_address = student.student_address;
        newstudentInfo.email = student.email;
        newstudentInfo.id = student.id;

        for (uint i = 0; i < student.institutes.length; i++) {
            newstudentInfo.institutes.push(student.institutes[i]);
        }
        for (uint i = 0; i < student.skills.length; i++) {
            newstudentInfo.skills.push(student.skills[i]);
        }

        for (uint i = 0; i < student.workexps.length; i++) {
            newstudentInfo.workexps.push(student.workexps[i]);
        }

        for (uint i = 0; i < student.certifications.length; i++) {
            newstudentInfo.certifications.push(student.certifications[i]);
        }

        for (uint i = 0; i < student.official_certifications.length; i++) {
            newstudentInfo.official_certifications.push(
                student.official_certifications[i]
            );
        }
        registeredStudentsarray.push(newstudentInfo);
        registeredStudents.push(student.student_address);
    }

    function AddnewSkill(
        address _student_address,
        skillInfo memory _skill
    ) public {
        bytes32 key = keccak256(
            abi.encodePacked(_student_address, institute_address)
        );
        studentInfo storage student = studentInfoMap[key];
        student.skills.push(_skill);
    }

    function AddnewWorkExp(
        address _student_address,
        workexpInfo memory _workexp
    ) public {
        bytes32 key = keccak256(
            abi.encodePacked(_student_address, institute_address)
        );
        studentInfo storage student = studentInfoMap[key];
        student.workexps.push(_workexp);
    }

    function AddnewCertification(
        address _student_address,
        certificationInfo memory _certification
    ) public {
        bytes32 key = keccak256(
            abi.encodePacked(_student_address, institute_address)
        );
        studentInfo storage student = studentInfoMap[key];
        student.certifications.push(_certification);
    }

    function AddnewOfficialCert(
        address _student_address,
        official_cert_info memory _official_cert
    ) public {
        bytes32 key = keccak256(
            abi.encodePacked(_student_address, institute_address)
        );
        studentInfo storage student = studentInfoMap[key];
        student.official_certifications.push(_official_cert);
    }
    function verify_cert(
        address _student,
        string memory _cert_type,
        uint256 index
    ) public OnlyMOE returns (bytes32) {
        bytes32 key = keccak256(abi.encodePacked(_student, _cert_type));
        studentInfo storage student = studentInfoMap[key];
        student.official_certifications[index].verified = true;
        return key;
    }
    function getStudentInfoList() public view returns (studentInfo[] memory) {
        return registeredStudentsarray;
    }

    function isStudent(address _studentAddress) public view returns (bool) {
        return registeredStudentsmap[_studentAddress] != address(0x0);
    }

    function StudentsCount() public view returns (uint256) {
        return registeredStudents.length;
    }
}
