// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
contract institute {
    address institute_address;
    string unique_id;
    string institute_name;
    uint256 indexcount;
    address MOE_address;
    constructor(
        //address _admin,
        string memory _institute_name,
        address _institute_address,
        string memory _unique_id,
        address _MOE_address
    ) {
        //admin = _admin;
        institute_name = _institute_name;
        institute_address = _institute_address;
        unique_id = _unique_id;
        MOE_address = _MOE_address;
        //endorsecount = 0;
    }
    modifier OnlyInstitute() {
        require(msg.sender == institute_address);
        _;
    }
    modifier OnlyMOE() {
        require(msg.sender == MOE_address);
        _;
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
    }
    struct studentandtype {
        address student;
        string cert_type;
    }

    mapping(bytes32 => official_cert_info) official_certmap;

    mapping(uint256 => studentandtype) indexTovalue;
    address[] certified_students;
    function generateKey(
        address _student,
        string memory _cert_type
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_student, _cert_type));
    }

    function addEducation(
        string memory _student_name,
        address _student,
        string memory _startdate,
        string memory _enddate,
        string memory _description,
        string memory _cert_type
    ) public OnlyInstitute returns (bytes32) {
        official_cert_info memory new_official_cert;
        studentandtype memory newstudenttotype;
        newstudenttotype.student = _student;
        newstudenttotype.cert_type = _cert_type;
        bytes32 key = generateKey(_student, _cert_type);
        new_official_cert.student_name = _student_name;
        new_official_cert.student = _student;
        new_official_cert.institute = msg.sender;
        new_official_cert.startdate = _startdate;
        new_official_cert.enddate = _enddate;
        new_official_cert.verified = false;
        new_official_cert.description = _description;
        official_certmap[key] = new_official_cert;
        indexTovalue[indexcount] = newstudenttotype;
        certified_students.push(_student);
        return key;
    }

    function verify_cert(
        address _student,
        string memory _cert_type
    ) public OnlyMOE returns (bytes32) {
        bytes32 key = generateKey(_student, _cert_type);
        official_certmap[key].verified = true;
        return key;
    }

    function getCertByAddress(
        address _student,
        string memory _cert_type
    )
        public
        view
        returns (
            string memory,
            address,
            address,
            string memory,
            string memory,
            bool,
            string memory
        )
    {
        bytes32 key = generateKey(_student, _cert_type);
        return (
            official_certmap[key].student_name,
            official_certmap[key].student,
            official_certmap[key].institute,
            official_certmap[key].startdate,
            official_certmap[key].enddate,
            official_certmap[key].verified,
            official_certmap[key].description
        );
    }

    function getCertifiedStudentCount() public view returns (uint256) {
        return certified_students.length;
    }

    function getcertByIndex(
        uint256 _index
    )
        public
        view
        returns (
            string memory,
            address,
            address,
            string memory,
            string memory,
            bool,
            string memory
        )
    {
        return
            getCertByAddress(
                indexTovalue[_index].student,
                indexTovalue[_index].cert_type
            );
    }
}
