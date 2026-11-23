import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("KasseModule", (m) => {
  const kasse = m.contract("Kasse");

  return { kasse };
});
