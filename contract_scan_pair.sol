//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface kontrak {
    function allPairs(uint256 idx) external returns (address); // ambil address pair
    function token0() external view returns (address);
    function token1() external view returns (address);
    function balanceOf(address x) external view returns (uint256);
    function symbol() external view returns (string memory);
}

contract BatchRequest {
    constructor(uint256 from, uint256 step, address factory) {
        //function testRawr(uint256 from, uint256 step, address factory) external {

        uint256[] memory returnData_balance0_pair = new uint256[](step);
        uint256[] memory returnData_balance1_pair = new uint256[](step);

        address[] memory returnData_address0 = new address[](step);
        address[] memory returnData_address1 = new address[](step);

        string[] memory returnData_symbol0 = new string[](step);
        string[] memory returnData_symbol1 = new string[](step);


        for(uint256 i = 0; i < step; i++) {
            address pair_address = kontrak(factory).allPairs(from+i); // ambil address pair
            address token0e = kontrak(pair_address).token0();
            address token1e = kontrak(pair_address).token1();

            string memory token0eSymbol = kontrak(token0e).symbol();
            string memory token1eSymbol = kontrak(token1e).symbol();

            uint256 token0balancePair = kontrak(token0e).balanceOf(pair_address);
            uint256 token1balancePair = kontrak(token1e).balanceOf(pair_address);


            returnData_balance0_pair[i] = token0balancePair;
            returnData_balance1_pair[i] = token1balancePair;

            returnData_symbol0[i] = token0eSymbol;
            returnData_symbol1[i] = token1eSymbol;

            returnData_address0[i] = token0e;
            returnData_address1[i] = token1e;

        }


        bytes memory _abiEncodedData = abi.encode(returnData_balance0_pair, returnData_balance1_pair, returnData_symbol0, returnData_symbol1, returnData_address0, returnData_address1);

        assembly {
            let dataStart := add(_abiEncodedData, 0x20)
            return(dataStart, sub(msize(), dataStart))
        }
    }
}