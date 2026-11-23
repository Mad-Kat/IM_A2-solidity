// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// Eine Kasse, die Ether annimmt und nur ihrem Besitzer wieder herausgibt.
contract Kasse {
    address public owner;
    mapping(address => uint256) public einzahlungen;

    event Einzahlung(address von, uint256 betrag);
    event Auszahlung(address an, uint256 betrag);

    constructor() {
        // TODO: den Absender der Transaktion als Owner merken
    }

    function einzahlen() external payable {
        einzahlungen[msg.sender] += msg.value;
        emit Einzahlung(msg.sender, msg.value);
    }

    function auszahlen(uint256 betrag) external {
        // TODO: nur der Owner darf auszahlen, und nur, was die Kasse hat.
        // Die Tests erwarten die Meldungen "nur der Owner" und "zu wenig in der Kasse".
        payable(owner).transfer(betrag);
        emit Auszahlung(owner, betrag);
    }

    function kassenstand() external view returns (uint256) {
        return address(this).balance;
    }
}
