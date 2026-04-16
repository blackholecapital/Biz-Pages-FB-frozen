export type SendUsdcOnBaseParams = {
  to: string;
  amountUsdc: string;
  dataLabel?: string;
};

function validateAddress(to: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(to);
}

function mockTxHash(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const tail = hash.toString(16).padStart(8, "0");
  return `0x${tail}${tail}${tail}${tail}${tail}${tail}${tail}${tail}`;
}

export async function sendUsdcOnBase({ to, amountUsdc, dataLabel }: SendUsdcOnBaseParams) {
  if (!to) throw new Error("Missing destination address");
  if (!validateAddress(to)) throw new Error("Invalid destination address");
  if (!amountUsdc || Number.isNaN(Number(amountUsdc)) || Number(amountUsdc) <= 0) {
    throw new Error("Invalid USDC amount");
  }

  const seed = `${to}:${amountUsdc}:${dataLabel ?? ""}`;
  return Promise.resolve(mockTxHash(seed));
}
