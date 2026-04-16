import React, { useState } from "react";
import {
  transferUsdc,
  formatUsdc,
  toUsdcAtomicUnits,
} from "./services/usdcTransfer.js";

const labelStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  fontSize: 14,
  fontWeight: 500,
  color: "#374151",
};

const inputStyle = {
  padding: "8px 12px",
  borderRadius: 6,
  border: "1px solid #cbd5e1",
  fontSize: 14,
  background: "#fff",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

const btnStyle = {
  padding: "10px 20px",
  background: "#1d4ed8",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  width: "100%",
};

const resultBoxStyle = {
  marginTop: 20,
  padding: 16,
  background: "#f1f5f9",
  borderRadius: 8,
  border: "1px solid #e2e8f0",
};

export function PaymeModuleApp() {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const displayAmount = formatUsdc(parseFloat(amount) || 0);
  const atomicAmount = toUsdcAtomicUnits(parseFloat(amount) || 0);

  async function handleTransfer(e) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await transferUsdc({
        to: to.trim(),
        amount: parseFloat(amount) || 0,
        memo: memo.trim(),
      });
      setResult(res);
    } catch (err) {
      setError(err?.message ?? "Transfer failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 480, margin: "0 auto" }}>
      <h2 style={{ margin: "0 0 4px", fontSize: 22, color: "#0f172a", fontWeight: 700 }}>
        Pay Me
      </h2>
      <p style={{ margin: "0 0 20px", fontSize: 13, color: "#64748b" }}>
        USDC transfer — Base network
      </p>

      <form onSubmit={handleTransfer} style={{ display: "grid", gap: 14 }}>
        <label style={labelStyle}>
          Recipient address
          <input
            style={inputStyle}
            type="text"
            placeholder="0x..."
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
            autoComplete="off"
          />
        </label>

        <label style={labelStyle}>
          Amount (USDC)
          <input
            style={inputStyle}
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>

        <label style={labelStyle}>
          Memo (optional)
          <input
            style={inputStyle}
            type="text"
            placeholder="Payment reference"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </label>

        {amount && (
          <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
            Sending {displayAmount} USDC &nbsp;·&nbsp; {atomicAmount} atomic units
          </p>
        )}

        <button style={btnStyle} type="submit" disabled={loading}>
          {loading ? "Sending…" : "Send USDC"}
        </button>
      </form>

      {error && (
        <div style={{ ...resultBoxStyle, background: "#fef2f2", border: "1px solid #fecaca" }}>
          <p style={{ margin: 0, fontSize: 13, color: "#b91c1c", fontWeight: 600 }}>
            Error: {error}
          </p>
        </div>
      )}

      {result && (
        <div style={resultBoxStyle}>
          <p style={{ margin: "0 0 8px", fontWeight: 700, color: "#0f172a", fontSize: 14 }}>
            Transfer submitted
          </p>
          <p style={{ margin: "0 0 4px", fontSize: 13, color: "#475569" }}>
            Status: <strong>{result.status}</strong>
          </p>
          <p style={{ margin: "0 0 4px", fontSize: 13, color: "#475569" }}>
            To: {result.to || "—"}
          </p>
          <p style={{ margin: "0 0 4px", fontSize: 13, color: "#475569" }}>
            Amount: {result.amount} USDC
          </p>
          {result.memo && (
            <p style={{ margin: 0, fontSize: 13, color: "#475569" }}>
              Memo: {result.memo}
            </p>
          )}
          {result.txHash && (
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6366f1", wordBreak: "break-all" }}>
              Tx: {result.txHash}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default PaymeModuleApp;
