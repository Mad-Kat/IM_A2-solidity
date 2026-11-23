import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";
import { parseEther } from "viem";

describe("Kasse", async function () {
  const { viem } = await network.create();
  const [owner, jemand] = await viem.getWalletClients();

  it("merkt sich den Deployer als Owner", async function () {
    const kasse = await viem.deployContract("Kasse");

    assert.equal((await kasse.read.owner()).toLowerCase(), owner.account.address.toLowerCase());
  });

  it("nimmt Einzahlungen an und zählt sie pro Adresse", async function () {
    const kasse = await viem.deployContract("Kasse");

    await kasse.write.einzahlen({ value: parseEther("1") });

    assert.equal(await kasse.read.kassenstand(), parseEther("1"));
    assert.equal(await kasse.read.einzahlungen([owner.account.address]), parseEther("1"));
  });

  it("lässt nur den Owner auszahlen", async function () {
    const kasse = await viem.deployContract("Kasse");
    await kasse.write.einzahlen({ value: parseEther("1") });

    await assert.rejects(
      kasse.write.auszahlen([parseEther("0.5")], { account: jemand.account }),
      /nur der Owner/,
    );
    assert.equal(await kasse.read.kassenstand(), parseEther("1"));
  });

  it("zahlt dem Owner aus, aber nicht mehr, als die Kasse hat", async function () {
    const kasse = await viem.deployContract("Kasse");
    await kasse.write.einzahlen({ value: parseEther("1") });

    await kasse.write.auszahlen([parseEther("0.5")]);

    assert.equal(await kasse.read.kassenstand(), parseEther("0.5"));
    await assert.rejects(kasse.write.auszahlen([parseEther("5")]), /zu wenig in der Kasse/);
  });

  it("schreibt bei jeder Einzahlung ein Ereignis", async function () {
    const kasse = await viem.deployContract("Kasse");

    await viem.assertions.emitWithArgs(
      kasse.write.einzahlen({ value: parseEther("1") }),
      kasse,
      "Einzahlung",
      [owner.account.address, parseEther("1")],
    );
  });
});
