# IM_A2 Smart Contracts, Hardhat

Der Kasse-Contract aus dem Unterricht als Hardhat-Projekt, mit Tests. Es ist das Werkzeug,
mit dem später die Projektarbeit gebaut wird, hier an einem Contract, den Sie schon kennen.

Die Tests sind der Auftrag. Ein roter Test sagt, was fehlt, ein grüner, dass es stimmt.

## Voraussetzungen

Node.js ab Version 22. Prüfen mit:

```bash
node --version
```

Falls nicht: https://nodejs.org/en/download

## Loslegen

```bash
git clone https://github.com/Mad-Kat/IM_A2-solidity.git
cd IM_A2-solidity
npm install
npx hardhat test
```

Das erste Mal lädt Hardhat den Solidity-Compiler, das dauert eine Minute. Danach laufen die
Tests in wenigen Sekunden. Zwei sind grün, drei rot, das ist der Auftrag.

## Die Aufgabe

In `contracts/Kasse.sol` fehlen dieselben zwei Stellen wie auf dem Blatt aus dem Unterricht:
der Owner im Konstruktor und die zwei `require` in `auszahlen`. Die Tests erwarten die
Meldungen `nur der Owner` und `zu wenig in der Kasse`, wörtlich.

Wenn alle fünf Tests grün sind, geht es an die lokale Kette.

## Die lokale Kette

Im ersten Terminal eine Kette starten. Sie zeigt zwanzig Konten mit je 10'000 Ether und
deren privaten Schlüsseln, die Sie in MetaMask importieren können:

```bash
npx hardhat node
```

Im zweiten Terminal den Contract dorthin deployen:

```bash
npx hardhat ignition deploy ignition/modules/Kasse.ts --network localhost
```

Die Adresse, die dabei ausgegeben wird, brauchen Sie in der Konsole:

```bash
npx hardhat console --network localhost
```

Darin:

```js
const c = await hre.network.create();
const kasse = await c.viem.getContractAt("Kasse", "0x5FbDB2315678afecb367f032d93F642f64180aa3");
await kasse.write.einzahlen({ value: 10n ** 18n });
await kasse.read.kassenstand();
```

Jede Zeile einzeln eingeben und auf die Antwort warten, die Konsole arbeitet asynchron.

Wer die Kette neu startet, startet bei null. Ignition merkt sich den letzten Deploy in
`ignition/deployments`, deshalb beim nächsten Mal `--reset` anhängen.

Die Adresse ist auf einer frischen Kette immer dieselbe, weil der erste Deploy vom ersten
Konto mit Nonce 0 immer dieselbe Adresse ergibt.

## Lösungen

Die Lösung liegt auf dem Branch `origin/solutions`:

```bash
git show origin/solutions:contracts/Kasse.sol
git diff HEAD origin/solutions -- contracts/Kasse.sol
git checkout origin/solutions -- contracts/Kasse.sol
```

Schauen Sie erst hin, wenn Sie es selbst versucht haben.

## Aufbau

```
contracts/          der Contract, hier arbeiten Sie
test/               die Tests, die brauchen Sie nicht anzufassen
ignition/modules/   das Deploy-Modul
```

Hardhat 3 mit `node:test` und `viem`. OpenZeppelin ist installiert, für das Token-Labor und
später für das Projekt.

## Der Tresor

`contracts/sicherheit/Tresor.sol` ist ein zweiter Contract mit einem Fehler, dem des DAO-Hacks von 2016. `Angreifer.sol` daneben nutzt ihn aus, und `test/Tresor.ts` prüft, ob der Angriff scheitert. Der Test ist rot, bis der Tresor repariert ist. Am Angreifer und am Test wird nichts geändert, die Reparatur liegt in einer Zeile des Tresors.

## Zwei Frontends für die Kasse

Zwei Webseiten sprechen mit derselben Kasse auf der lokalen Kette, über MetaMask und ethers.js.
`frontend/kasse.html` ist eine einzelne Datei ohne Build. `frontend-react/` ist dieselbe Seite
mit React und Vite. Beide erwarten die Kasse an `0x5FbDB2315678afecb367f032d93F642f64180aa3`,
also als ersten Deploy auf einer frischen Kette.

Nach `git pull` einmal `npm install`, dann in einem dritten Terminal:

```bash
npm run frontend          # http://localhost:8080/kasse
npm run frontend-react    # http://localhost:5173
```

Auf diesem Branch ist die Kasse ergänzt, die Frontends laufen deshalb ohne die Aufgabe aus dem
Hardhat-Blatt. In beiden Seiten fehlt der Verlauf der Einzahlungen, er ist mit `// TODO` markiert.
