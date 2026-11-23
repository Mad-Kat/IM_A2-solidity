import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("GibzTokenModule", (m) => {
  const token = m.contract("GibzToken", [m.getAccount(0)]);

  return { token };
});
