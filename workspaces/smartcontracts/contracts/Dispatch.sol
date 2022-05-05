//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

abstract contract Callbackable {
    address internal _dispatch;

    function dispatcher() public view returns (address) {
        return _dispatch;
    }

    modifier onlyDispatcher {
        require(msg.sender == dispatcher(), "Only the dispatcher can call this function.");
        _;
    }
}

contract Dispatch {
    event DispatchTask(string ipfsPath, address _address, bytes4 selector);

    function dispatch(string memory ipfsPath, bytes4 selector) public {
        emit DispatchTask(ipfsPath, msg.sender, selector);
    }

    function forward(address to, bytes memory encoded) public {
        // TODO check if the caller is a valid node
        (bool success, bytes memory data) = to.call(encoded);
        require(success, "Call failed.");
    }
}

contract Test is Callbackable {
    function callback(uint256) public {
        console.log("Callback called");
        require(false, "Something something");
    }

    function test(address dispatch, string memory ipfsPath) public {
        Dispatch(dispatch).dispatch(ipfsPath, this.callback.selector);
    }
}
