// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// Ein fungibler Token aus dem OpenZeppelin-Wizard, für das Token-Labor.
contract GibzToken is ERC20 {
    constructor(address recipient) ERC20("GibzToken", "GIBZ") {
        _mint(recipient, 1000 * 10 ** decimals());
    }
}
