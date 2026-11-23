// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// Eine Kasse, die Ether annimmt und nur ihrem Besitzer wieder herausgibt.
///
/// Worum es ging: Der Contract kennt keinen Namen und kein Passwort, nur Adressen.
/// msg.sender ist die einzige Wahrheit darueber, wer ruft, und require am Anfang der
/// Funktion ist die Regel. Was require ablehnt, wird komplett zurueckgenommen, das
/// verbrauchte Gas ist trotzdem weg. Deshalb steht die Pruefung ganz oben.
contract Kasse {
    address public owner;
    mapping(address => uint256) public einzahlungen;

    event Einzahlung(address von, uint256 betrag);
    event Auszahlung(address an, uint256 betrag);

    constructor() {
        owner = msg.sender;
    }

    function einzahlen() external payable {
        einzahlungen[msg.sender] += msg.value;
        emit Einzahlung(msg.sender, msg.value);
    }

    function auszahlen(uint256 betrag) external {
        require(msg.sender == owner, "nur der Owner");
        require(betrag <= address(this).balance, "zu wenig in der Kasse");
        payable(owner).transfer(betrag);
        emit Auszahlung(owner, betrag);
    }

    function kassenstand() external view returns (uint256) {
        return address(this).balance;
    }
}
