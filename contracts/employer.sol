// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
contract employer {
    address employer_address;
    string email;
    string employer_name;
    address MOE_address;
    constructor(
        string memory _employer_name,
        address _employer_address,
        string memory _email,
        address _MOE_address
    ) {
        employer_name = _employer_name;
        employer_address = _employer_address;
        email = _email;
        MOE_address = _MOE_address;
    }
    function getEmployerInfo()
        public
        view
        returns (address, string memory, string memory)
    {
        return (employer_address, employer_name, email);
    }
    modifier OnlyMOE() {
        require(msg.sender == MOE_address);
        _;
    }
    struct certificationInfo {
        address institute;
        string certificate_name;
        bool visible;
        bool verified;
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

    struct employeeInfo {
        string employee_name;
        string application_status;
        address employee_address;
        string role;
        address[] institutes;
        skillInfo[] skills;
        workexpInfo[] workexps;
        certificationInfo[] certifications;
    }
    mapping(address => employeeInfo) pendingEmployeeInfoMap;
    address[] public pendingEmployeeAddresses;

    function addpendingEmployeeInfo(
        string memory _employee_name,
        string memory _application_status,
        address _employee_address,
        workexpInfo[] memory _workexp_info,
        skillInfo[] memory _skill_info,
        certificationInfo[] memory _cert_info
    ) public {
        employeeInfo storage newpendingEmployeeInfo = pendingEmployeeInfoMap[
            _employee_address
        ];
        newpendingEmployeeInfo.employee_name = _employee_name;
        newpendingEmployeeInfo.application_status = _application_status;
        newpendingEmployeeInfo.employee_address = _employee_address;

        for (uint i = 0; i < _skill_info.length; i++) {
            newpendingEmployeeInfo.skills.push(_skill_info[i]);
        }

        for (uint i = 0; i < _workexp_info.length; i++) {
            newpendingEmployeeInfo.workexps.push(_workexp_info[i]);
        }

        for (uint i = 0; i < _cert_info.length; i++) {
            newpendingEmployeeInfo.certifications.push(_cert_info[i]);
        }

        pendingEmployeeAddresses.push(_employee_address);
    }

    function getPendingEmployeeInfo()
        public
        view
        returns (employeeInfo[] memory)
    {
        employeeInfo[] memory pendingEmployeeInfoList = new employeeInfo[](
            pendingEmployeeAddresses.length
        );
        for (uint i = 0; i < pendingEmployeeAddresses.length; i++) {
            employeeInfo
                storage newpendingEmployeeInfo = pendingEmployeeInfoMap[
                    pendingEmployeeAddresses[i]
                ];
            pendingEmployeeInfoList[i] = newpendingEmployeeInfo;
        }
        return pendingEmployeeInfoList;
    }

    function updateApplicationStatus(
        address _employee_address,
        string memory _application_status
    ) public {
        pendingEmployeeInfoMap[_employee_address]
            .application_status = _application_status;
    }

    mapping(address => employeeInfo) employeeInfoMap;
    address[] public employeeAddresses;

    function acceptEmployee(address _employee_address) public {
        employeeInfo storage newemployeeInfo = pendingEmployeeInfoMap[
            _employee_address
        ];
        newemployeeInfo.application_status = "accepted";
        employeeInfoMap[_employee_address] = newemployeeInfo;
        employeeAddresses.push(_employee_address);
        delete pendingEmployeeInfoMap[_employee_address];
        for (uint i = 0; i < pendingEmployeeAddresses.length; i++) {
            if (pendingEmployeeAddresses[i] == _employee_address) {
                pendingEmployeeAddresses[i] = pendingEmployeeAddresses[
                    pendingEmployeeAddresses.length - 1
                ];
                pendingEmployeeAddresses.pop();
                break;
            }
        }
    }

    function getEmployeeInfo() public view returns (employeeInfo[] memory) {
        employeeInfo[] memory employeeInfoList = new employeeInfo[](
            employeeAddresses.length
        );
        for (uint i = 0; i < employeeAddresses.length; i++) {
            employeeInfo storage newemployeeInfo = employeeInfoMap[
                employeeAddresses[i]
            ];
            employeeInfoList[i] = newemployeeInfo;
        }
        return employeeInfoList;
    }

    function fireEmployee(address _employee_address) public {
        employeeInfo storage newemployeeInfo = employeeInfoMap[
            _employee_address
        ];
        newemployeeInfo.application_status = "fired";
        delete employeeInfoMap[_employee_address];
        for (uint i = 0; i < employeeAddresses.length; i++) {
            if (employeeAddresses[i] == _employee_address) {
                employeeAddresses[i] = employeeAddresses[
                    employeeAddresses.length - 1
                ];
                employeeAddresses.pop();
                break;
            }
        }
    }
    address[] public rejectedEmployeeAddresses;
    mapping(address => employeeInfo) rejectedemployeeInfoMap;
    address[] public rejectedemployeeAddresses;

    function rejectEmployee(address _employee_address) public {
        employeeInfo storage newemployeeInfo = pendingEmployeeInfoMap[
            _employee_address
        ];
        newemployeeInfo.application_status = "rejected";
        rejectedemployeeAddresses.push(_employee_address);
        rejectedemployeeInfoMap[_employee_address] = newemployeeInfo;
        delete pendingEmployeeInfoMap[_employee_address];
        for (uint i = 0; i < pendingEmployeeAddresses.length; i++) {
            if (pendingEmployeeAddresses[i] == _employee_address) {
                pendingEmployeeAddresses[i] = pendingEmployeeAddresses[
                    pendingEmployeeAddresses.length - 1
                ];
                pendingEmployeeAddresses.pop();
                break;
            }
        }
    }

    function getNumberOfApplicants() public view returns (uint, uint, uint) {
        return (
            rejectedemployeeAddresses.length,
            pendingEmployeeAddresses.length,
            employeeAddresses.length
        );
    }
}
