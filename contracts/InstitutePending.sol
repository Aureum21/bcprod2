// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract InstitutePending {
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
        address instiztute;
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
        skillInfo[] skills;
        workexpInfo[] workexps;
        certificationInfo[] certifications;
        official_cert_info[] official_certifications;
    }

    address[] public pendingstudentaddress;
    mapping(address => studentInfo) public pendingStudentsMap;

    function AddStudInfoToPending(
        string memory _name,
        address _student_address,
        string memory _email,
        string memory _id,
        string memory _registration_type,
        address _inst_address,
        address[] memory _institutes,
        workexpInfo[] memory _workexp_info,
        skillInfo[] memory _skill_info,
        certificationInfo[] memory _cert_info,
        official_cert_info[] memory _official_cert_info
    ) public {
        require(_inst_address == institute_address, "Authorization failed");

        studentInfo storage newstudentInfo = pendingStudentsMap[
            _student_address
        ];
        newstudentInfo.application_status = "Pending";
        newstudentInfo.student_name = _name;
        newstudentInfo.registration_type = _registration_type;
        newstudentInfo.student_address = _student_address;
        newstudentInfo.email = _email;
        newstudentInfo.id = _id;

        for (uint i = 0; i < _institutes.length; i++) {
            newstudentInfo.institutes.push(_institutes[i]);
        }
        for (uint i = 0; i < _skill_info.length; i++) {
            newstudentInfo.skills.push(_skill_info[i]);
        }

        for (uint i = 0; i < _workexp_info.length; i++) {
            newstudentInfo.workexps.push(_workexp_info[i]);
        }

        for (uint i = 0; i < _cert_info.length; i++) {
            newstudentInfo.certifications.push(_cert_info[i]);
        }

        for (uint i = 0; i < _official_cert_info.length; i++) {
            newstudentInfo.official_certifications.push(_official_cert_info[i]);
        }
        pendingstudentaddress.push(_student_address);
    }

    function removeFromPending(address _student_address) public {
        delete pendingStudentsMap[_student_address];
    }

    function getPendingList() public view returns (studentInfo[] memory) {
        studentInfo[] memory pendingList = new studentInfo[](
            pendingstudentaddress.length
        );
        for (uint i = 0; i < pendingstudentaddress.length; i++) {
            if (
                pendingStudentsMap[pendingstudentaddress[i]].student_address !=
                address(0)
            ) {
                pendingList[i] = pendingStudentsMap[pendingstudentaddress[i]];
            }
        }
        return pendingList;
    }
}
