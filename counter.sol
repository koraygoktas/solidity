    // SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter {
    uint public count = 0; // sayımızın başlangıç değeri

    // sayıyı artıran fonksiyon
    function increment() public {
        count += 1;
    }

    // sayıyı azaltan fonksiyon
    function decrement() public {
        require(count > 0, "Count cannot be negative");
        count -= 1;
    }

    // sayıyı sıfırlayan fonksiyon
    function reset() public {
        count = 0;
    }
}

