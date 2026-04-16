export function toUsdcAtomicUnits(amount) {
  const n = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(n)) return "0";
  return String(Math.round(n * 1_000_000));
}

export function fromUsdcAtomicUnits(amountAtomic) {
  const n = typeof amountAtomic === "string" ? Number(amountAtomic) : amountAtomic;
  if (!Number.isFinite(n)) return 0;
  return n / 1_000_000;
}

export function formatUsdc(amount) {
  const n = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(n)) return "0.00";
  return n.toFixed(2);
}

export async function transferUsdc({ to, amount, memo } = {}) {
  return {
    status: "stubbed",
    to: to ?? "",
    amount: formatUsdc(amount ?? 0),
    memo: memo ?? "",
    txHash: null,
  };
}
