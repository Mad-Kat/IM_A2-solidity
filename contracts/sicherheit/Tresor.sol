// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// Ein Tresor: jede Adresse zahlt Ether ein und hebt ihr Guthaben wieder ab.
//
// Worum es ging: abheben() zahlte zuerst aus und setzte das Guthaben erst
// danach auf null. Ein Contract als Empfaenger konnte in seinem receive()
// sofort wieder abheben() aufrufen, mit unveraendertem Guthaben, so oft er
// wollte. Die Reparatur ist die Reihenfolge: erst pruefen, dann aendern,
// dann erst rufen (Checks, Effects, Interactions). OpenZeppelin bietet
// dafuer zusaetzlich den Modifier nonReentrant aus ReentrancyGuard.
contract Tresor {
    mapping(address => uint256) public guthaben;

    function einzahlen() external payable {
        guthaben[msg.sender] += msg.value;
    }

    function abheben() external {
        uint256 betrag = guthaben[msg.sender];
        require(betrag > 0, "nichts da");
        guthaben[msg.sender] = 0;
        (bool ok, ) = msg.sender.call{value: betrag}("");
        require(ok, "Zahlung fehlgeschlagen");
    }
}
