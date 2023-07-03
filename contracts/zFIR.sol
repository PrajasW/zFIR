// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

contract zFIR{
    address[] citizens;
    address[] verifiers;
    struct Report{
        address informant;
        uint32 pincode;
        string report;
        bool isVerified;
        address verifier;
    }
    Report[] reports;
    constructor(){
        verifiers = [0xB5757A95AEb8B86Bb3A48f2f1E055ebF1B82c559];
    }
    event Reported(address sender,uint32 pincode,string data);
    event Verified(address verifier,uint  reportNumber);
    function viewReport(uint reportNumber) public view returns(Report memory){
        require(reportNumber >= 0 && reportNumber < reports.length, "Must be a valid report number");
        return reports[reportNumber];
    }
    function isVerifier(address _verifier) internal view returns(bool){
        bool _found = false;
        for(uint i=0;i<verifiers.length;i++){
            if(_verifier == verifiers[i]){
                _found = true;
            }
        }
        return _found;
    }
    function isCitizen(address _citizen) internal view returns(bool){
        bool _found = false;
        for(uint i=0;i<citizens.length;i++){
            if(_citizen == citizens[i]){
                _found = true;
            }
        }
        return _found;
    }
    function addCitizen(address _wallet) external {
        require(isVerifier(msg.sender),"Need to be a verifier to add a citizen");
        require(!isVerifier(_wallet),"Cannot add verifier as citizen");
        require(!isCitizen(_wallet),"Already a citizen");
        citizens.push(_wallet);
    }
    function fileReport(uint32 _pincode,string calldata _data) external returns(uint){
        require(!isVerifier(msg.sender),"verifier can not report, please use your citizen wallet");
        require(isCitizen(msg.sender),"you need to be a registered citizen in order to file a report");
        Report memory _report = Report(
            msg.sender,
            _pincode,
            _data,
            false,
            address(0x0)
        );
        reports.push(_report);
        emit Reported(msg.sender, _pincode, _data);
        return reports.length-1;
    }
    function verify(uint reportNumber) external{
        require(isVerifier(msg.sender),"must be a verifier in order to verify");
        require(reportNumber >= 0 && reportNumber < reports.length, "Must be a valid report number");
        require(reports[reportNumber].isVerified == false,"is already verified");
        reports[reportNumber].isVerified = true;
        reports[reportNumber].verifier = msg.sender;
        emit Verified(msg.sender, reportNumber);
    }
    function totalReports() view external returns(uint _reports) {
        _reports = reports.length;
    }
}