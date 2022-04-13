//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Token {
    address public owner;
    string public _name;
    string public _symbol;
    uint8 public _decimals;
    uint256 public _totalSupply;

    mapping(address =>uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    modifier ownerOnly() {
        require(msg.sender == owner, "You are not owner");
        _;
    }

    constructor(string memory newName, string memory newSymbol, uint8 newDecimals, uint256 newTotalSupply) {
        _name = newName;
        _symbol = newSymbol;
        owner = msg.sender;
        _decimals = newDecimals;
        _totalSupply = newTotalSupply;
        _balances[owner] = _totalSupply;
    }

    function name() public view returns (string memory){
        return _name;
    }

    function symbol() public view returns (string memory){
        return _symbol;
    }

    function decimals() public view returns (uint8){
        return _decimals;
    }

    function totalSupply() public view returns (uint256){
        return _totalSupply;
    }

    function balanceOf(address _owner) public view returns (uint256){
        return _balances[_owner];
    }

    function allowance(address _owner, address _spender) public view returns (uint256){
        uint256 remaining = _allowances[_owner][_spender];
        return remaining;
    }

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    function transfer(address _to, uint256 _value) public returns (bool success){
        // Enough balance check
        if (_balances[msg.sender] < _value) {revert ("Not enough balance");}

        // balances changes
        _balances[msg.sender] -= _value;
        _balances[_to] += _value;

        // successfull ending
        emit Transfer(msg.sender, _to, _value);
        return success=true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
        // Enough allowance check
        if (_value > _allowances[_from][_to]){revert ("Not enough allowance");}

        // balances changes
        _balances[_from] -= _value;
        _balances[_to] += _value;

        // successfull ending
        emit Transfer(_from, _to, _value);
        return success=true;
    }
    
    function approve(address _spender, uint256 _value) public returns (bool success){
        // Enough balance check
        if (_balances[msg.sender] < _value){revert("Not enough balance");}
        _allowances[msg.sender][_spender] += _value;
        emit Approval(msg.sender, _spender, _value);
        return success=true;
    }

    function burn(address account, uint256 amount) public ownerOnly {
        // Enough balance check
        if (amount > _balances[account]){revert("Not enough balance");}
        // Supply and balance changes
        _totalSupply -= amount;
        _balances[account] -= amount;
        emit Transfer(account, address(0), amount);
    }

    function mint(address account, uint256 amount) public ownerOnly {
        // Supply and balance changes
        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }
}
