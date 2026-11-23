import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";
import { parseEther } from "viem";

// Alice zahlt 5 Ether in den Tresor. Ein Angreifer zahlt einen Ether ein und
// versucht, mehr als seinen Ether wieder herauszuholen. Der Test ist gruen,
// wenn Alices 5 Ether nach dem Angriff noch im Tresor liegen.
describe("Tresor", async function () {
  const { viem } = await network.create();
  const publicClient = await viem.getPublicClient();
  const [, alice, boese] = await viem.getWalletClients();

  it("verliert bei einem Angriff nicht das Guthaben der anderen", async function () {
    const tresor = await viem.deployContract("Tresor");
    await tresor.write.einzahlen({ value: parseEther("5"), account: alice.account });

    const angreifer = await viem.deployContract("Angreifer", [tresor.address], {
      client: { wallet: boese },
    });
    try {
      await angreifer.write.angriff({ value: parseEther("1"), account: boese.account });
    } catch {
      // Ein abgebrochener Angriff ist in Ordnung, entscheidend ist der Bestand danach.
    }

    const bestand = await publicClient.getBalance({ address: tresor.address });
    assert.ok(
      bestand >= parseEther("5"),
      `Im Tresor liegen noch ${bestand} Wei, Alices 5 Ether sind weg`,
    );
  });
});
