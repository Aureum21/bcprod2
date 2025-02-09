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
        bool verified;
        string officialCertHash;
        address[] visibleTo;
    }
    struct studentandtype {
        address student;
        string cert_type;
    }

    mapping(bytes32 => official_cert_info) official_certmap;

    mapping(uint256 => studentandtype) indexTovalue;
    address[] certified_students;

    function generateKey(address _student, string memory _cert_type)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(_student, _cert_type));
    }

    function addEducation(
        string memory _student_name,
        address _student,
        string memory _hash,
        string memory _cert_type
    ) public OnlyInstitute {
        official_cert_info memory new_official_cert;
        studentandtype memory newstudenttotype;
        newstudenttotype.student = _student;
        newstudenttotype.cert_type = _cert_type;
        bytes32 key = generateKey(_student, _cert_type);
        new_official_cert.student_name = _student_name;
        new_official_cert.student = _student;
        new_official_cert.institute = msg.sender;
        new_official_cert.verified = false;
        new_official_cert.officialCertHash = _hash;
        official_certmap[key] = new_official_cert;
        indexTovalue[indexcount] = newstudenttotype;
        certified_students.push(_student);
        official_certmap[key].visibleTo.push(_student);
        official_certmap[key].visibleTo.push(msg.sender);
        official_certmap[key].visibleTo.push(MOE_address);
    }

    function makeCertVisibleTo(address recAgent, bytes32 key) public {
        require(
            (msg.sender == MOE_address) ||
                (msg.sender == official_certmap[key].institute) ||
                (msg.sender == official_certmap[key].student)
        );
        official_certmap[key].visibleTo.push(recAgent);
    }

    function verify_cert(address _student, string memory _cert_type)
        public
        OnlyMOE
        returns (bytes32)
    {
        bytes32 key = generateKey(_student, _cert_type);
        official_certmap[key].verified = true;
        return key;
    }

    function getCertByAddress(bytes32 key)
        public
        view
        isAgentofficialcertAllowed(key)
        returns (
            string memory,
            address,
            address,
            bool,
            string memory
        )
    {
        // bytes32 key = generateKey(_student, _cert_type);
        official_cert_info storage cert = official_certmap[key];
        return (
            cert.student_name,
            cert.student,
            cert.institute,
            cert.verified,
            cert.officialCertHash
        );
    }

    function getCertifiedStudentCount() public view returns (uint256) {
        return certified_students.length;
    }

    function getcertByIndex(uint256 _index)
        public
        view
        returns (
            string memory,
            address,
            address,
            bool,
            string memory
        )
    {
        bytes32 key = generateKey(
            indexTovalue[_index].student,
            indexTovalue[_index].cert_type
        );
        return getCertByAddress(key);
    }

    modifier isAgentofficialcertAllowed(bytes32 key) {
        bool isAuthorized = false;
        for (uint256 i = 0; i < official_certmap[key].visibleTo.length; i++) {
            if (official_certmap[key].visibleTo[i] == msg.sender) {
                isAuthorized = true;
                break;
            }
        }
        require(isAuthorized, "not Authorized");
        _;
    }
}
