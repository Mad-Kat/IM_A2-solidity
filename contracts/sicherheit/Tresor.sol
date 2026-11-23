// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// Ein Tresor: jede Adresse zahlt Ether ein und hebt ihr Guthaben wieder ab.
// Der Contract hat den Fehler des DAO-Hacks von 2016. Finden Sie ihn und
// reparieren Sie ihn, bis der Test in test/Tresor.ts gruen ist.
contract Tresor {
    mapping(address => uint256) public guthaben;

    function einzahlen() external payable {
        guthaben[msg.sender] += msg.value;
    }

    function abheben() external {
        uint256 betrag = guthaben[msg.sender];
        require(betrag > 0, "nichts da");
        (bool ok, ) = msg.sender.call{value: betrag}("");
        require(ok, "Zahlung fehlgeschlagen");
        guthaben[msg.sender] = 0;
    }
}
