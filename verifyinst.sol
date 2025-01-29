// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "https://bafybeicg6ex5rli6gngh6wlxurd7umwekpekb4dhjlmfetl4dtt6blqjmu.ipfs.dweb.link?filename=registerInst.sol";
import "https://bafybeibxsclmaqcjiswg3jnjnuo52rr6v6ioisvjelpkjaelc5zhn5rfwq.ipfs.dweb.link?filename=institute.sol";

contract verifyinst {
    address public MOE;
    registerInst public instreg;

    constructor(address _registerInstAddress) {
        MOE = msg.sender;
        instreg = registerInst(_registerInstAddress);
    }

    modifier onlyMOE() {
        require(msg.sender == MOE);
        _;
    }

    mapping(address => address) public registeredinstitutesmap;
    address[] registeredinstitutes;

    function verifyInstitution(bytes32 key, uint256 index) public onlyMOE {
        (
            string memory institute_name,
            address institute_address,
            string memory unique_id,
            address MOE_address
        ) = instreg.getPendingInstituteByKey(key);
        institute newinst = new institute(
            institute_name,
            institute_address,
            unique_id,
            MOE_address
        );
        registeredinstitutesmap[institute_address] = address(newinst);
        registeredinstitutes.push(institute_address);
        instreg.removePendingInstitute(key, index);
    }

    function getPendingInstitutesCount() public view returns (uint256) {
        return instreg.getPendingInstitutesCount();
    }

    function getPendingInstituteByKey(
        bytes32 key
    ) public view returns (string memory, address, string memory, address) {
        return instreg.getPendingInstituteByKey(key);
    }

    function isinstitute(address _institutes) public view returns (bool) {
        return registeredinstitutesmap[_institutes] != address(0x0);
    }

    function instituteCount() public view returns (uint256) {
        return registeredinstitutes.length;
    }

    function getinstitutesContractByAddress(
        address _institutes
    ) public view returns (address) {
        return registeredinstitutesmap[_institutes];
    }

}