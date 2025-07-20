// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract publicdata{
    address public MOE;
    address private regStudContractAddress;
    address private regInstContractAddress;
    address private verStudContractAddress;
    address private verInstContractAddress;
    address private node1_public;
    address private node2_public;   
    address private node3_public;
    string private node1;
    string private node2;
    string private node3;
    constructor(address _regStudContractAddress, address _regInstContractAddress, address _verStudContractAddress, address _verInstContractAddress, string memory _node1, string memory _node2, string memory _node3, address _node1_public, address _node2_public, address _node3_public) {
        MOE = msg.sender;
        regStudContractAddress = _regStudContractAddress;
        regInstContractAddress = _regInstContractAddress;
        verStudContractAddress = _verStudContractAddress;
        verInstContractAddress = _verInstContractAddress;
        node1_public = _node1_public;
        node2_public = _node2_public;
        node3_public = _node3_public;
        node1 = _node1;
        node2 = _node2;
        node3 = _node3;
    }
   
    mapping(address => address) public studAddressToStudContract;
    mapping(address => address) public instAddressToInstContract;
   
    function moecontractaddresses(uint256 id) public onlyMOE view returns(address, string memory) {
        if(id ==1 ){
            return (regStudContractAddress, node1);
        }else if (id == 2 ){
            return (verStudContractAddress, node1);
        }
        else if (id == 3 ){
            return (regInstContractAddress, node1);
        }
        else if (id == 4 ){
            return (verInstContractAddress, node1);
        } else {
            revert("Invalid ID");
        }
    }
    function registerStudent(address _studAddress,  address _studContractAddress)public {
        studAddressToStudContract[_studAddress] = _studContractAddress;
    }
    function registerInstitute(address _instAddress,  address _instContractAddress) onlyNode2 public {
        instAddressToInstContract[_instAddress] = _instContractAddress;
    }
    function getStudContractAddress(address _studAddress) public view onlyNode3 returns (address, string memory)
    {
        return (studAddressToStudContract[_studAddress], node3);
    }
    function getInstContractAddress(address _instAddress)public view onlyNode2 returns (address, string memory)
    {
        return (instAddressToInstContract[_instAddress], node2);
    }
    function ismoe() public view onlyMOE returns(bool){
        return (msg.sender==MOE);
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
   
}