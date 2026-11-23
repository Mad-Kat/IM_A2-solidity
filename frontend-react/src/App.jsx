import { useState } from "react";
import { BrowserProvider, Contract, formatEther, parseEther } from "ethers";

// Der erste Deploy von Account #0 auf einer frischen Kette.
const KASSE_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// Nur die Teile der Kasse, die diese Seite braucht.
const KASSE_ABI = [
  "function owner() view returns (address)",
  "function kassenstand() view returns (uint256)",
  "function einzahlen() payable",
  "function auszahlen(uint256 betrag)",
  "event Einzahlung(address von, uint256 betrag)",
];

export default function App() {
  const [kasse, setKasse] = useState(null);
  const [account, setAccount] = useState("–");
  const [owner, setOwner] = useState("–");
  const [balance, setBalance] = useState(null);
  const [amount, setAmount] = useState("0.1");
  const [status, setStatus] = useState("");
  const [history, setHistory] = useState([]);

  async function refresh(contract) {
    setOwner(await contract.owner());
    setBalance(await contract.kassenstand());
    setHistory(await contract.queryFilter("Einzahlung"));
  }

  async function connect() {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(KASSE_ADDRESS, KASSE_ABI, signer);
    setKasse(contract);
    setAccount(signer.address);
    await refresh(contract);
  }

  async function send(call) {
    try {
      setStatus("Warte auf MetaMask …");
      const tx = await call();
      await tx.wait();
      setStatus("Bestätigt");
      await refresh(kasse);
    } catch (err) {
      setStatus(err.reason ?? err.shortMessage ?? err.message);
    }
  }

  return (
    <>
      <h1>Kasse mit React</h1>
      <button onClick={connect}>Mit MetaMask verbinden</button>
      <p>Konto: {account}</p>
      <p>Owner: {owner}</p>
      <p>Kassenstand: {balance === null ? "–" : formatEther(balance) + " ETH"}</p>

      <input value={amount} onChange={(e) => setAmount(e.target.value)} /> Ether
      <button onClick={() => send(() => kasse.einzahlen({ value: parseEther(amount) }))}>Einzahlen</button>
      <button onClick={() => send(() => kasse.auszahlen(parseEther(amount)))}>Auszahlen</button>
      <p>{status}</p>

      <h2>Verlauf</h2>
      <ul>
        {history.map((e) => (
          <li key={e.transactionHash}>
            {e.args.von}: {formatEther(e.args.betrag)} ETH
          </li>
        ))}
      </ul>
    </>
  );
}
