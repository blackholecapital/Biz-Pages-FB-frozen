
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageShell } from "../components/layout/PageShell";
import { useDemoGate } from "../state/demoGateState";
import { sendUsdcOnBase } from "../utils/usdc";
import { usePublishedExclusiveTiles } from "../hooks/usePublishedExclusiveTiles";
import type { HydratedExclusiveTile } from "../runtime/exclusiveTileHydration";

type RouteParams = { designation?: string; slug?: string };

type ContentItem = {
  id: string;
  price: number;
  label: string;
  locked: boolean;
  imageSrc: string | null;
};

type MembershipOption = { label: string; buttonLabel: string; memo: string; amount: number };

const DEFAULT_CONTENT_ITEMS: ContentItem[] = Array.from({ length: 6 }, (_, i) => ({
  id: `Exclusive Content-${i + 1}`,
  price: 0,
  label: `Exclusive Content-${i + 1}`,
  locked: true,
  imageSrc: null,
}));

const MEMBERSHIP_OPTIONS: MembershipOption[] = [
  { label: "30 days", buttonLabel: "30-day subscription", memo: "Membership 30 days", amount: 100 },
  { label: "180 days", buttonLabel: "180-day subscription", memo: "Membership 180 days", amount: 500 },
  { label: "1 year", buttonLabel: "1-year subscription", memo: "Membership 1 year", amount: 800 }
];

const LOCK_SVG_RED = (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 7H4a1 1 0 00-1 1v5a1 1 0 001 1h8a1 1 0 001-1V8a1 1 0 00-1-1z" fill="#e53e3e" opacity=".95"/>
    <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="#e53e3e" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const LOCK_SVG_GREEN = (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 7H4a1 1 0 00-1 1v5a1 1 0 001 1h8a1 1 0 001-1V8a1 1 0 00-1-1z" fill="#38a169" opacity=".95"/>
    <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="#38a169" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export function AccessTier2Page() {
  const nav = useNavigate();
  const { designation, slug } = useParams<RouteParams>();
  const { state, actions } = useDemoGate();
  const publishedTiles = usePublishedExclusiveTiles(slug);

  const contentItems: ContentItem[] = useMemo(() => {
    if (!publishedTiles.length) return DEFAULT_CONTENT_ITEMS;
    return publishedTiles.map((tile, i) => ({
      id: tile.label,
      price: tile.price ? parseFloat(tile.price.replace(/[^0-9.]/g, "")) || 0 : 0,
      label: tile.label,
      locked: tile.locked,
      imageSrc: tile.resolvedImageSrc,
    }));
  }, [publishedTiles]);

  const [selectedId, setSelectedId] = useState(DEFAULT_CONTENT_ITEMS[0].id);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [helpOpen, setHelpOpen] = useState(false);
  const [status, setStatus] = useState<string>("Ready To Send");
  const [unlocked, setUnlocked] = useState<Record<string, boolean>>({});
  const [membershipIndex, setMembershipIndex] = useState(0);
  const [membershipActiveMemo, setMembershipActiveMemo] = useState("");
  const [expandedTileId, setExpandedTileId] = useState<string | null>(null);
  const [showUsdc, setShowUsdc] = useState(false);

  const membership = MEMBERSHIP_OPTIONS[membershipIndex];
  const walletReady = Boolean(state.walletConnected && state.signedMessage);
  const canSend = Boolean(walletReady && Number(selectedPrice) > 0);

  const base = useMemo(() => {
    if (designation && slug) return `/${designation}/${slug}/gate`;
    if (slug) return `/${slug}/gate`;
    return "";
  }, [designation, slug]);

  useEffect(() => {
    if (!state.tier2Unlocked) {
      nav(`${base}/access`, { replace: true });
    }
  }, [state.tier2Unlocked, nav, base]);

  useEffect(() => {
    const firstLocked = contentItems.find((item) => item.locked) ?? contentItems[0];
    if (!firstLocked) return;
    setSelectedId(firstLocked.id);
    setSelectedPrice(firstLocked.price);
  }, [contentItems]);

  async function onSend() {
    try {
      setStatus("Opening wallet…");
      const to = localStorage.getItem("gateway_usdc_receiving_address") ?? "";
      if (!to) {
        setStatus("Set receiving address in Admin");
        return;
      }
      const hash = await sendUsdcOnBase({ to, amountUsdc: String(selectedPrice), dataLabel: selectedId });
      setStatus(`Sent (tx: ${hash.slice(0, 10)}…)`);
    } catch (e: any) {
      setStatus(String(e?.message ?? e ?? "Transaction cancelled"));
    }
  }

  const onSimulatePurchase = () => {
    if (selectedId.startsWith("Membership")) {
      const unlockAll = contentItems.reduce<Record<string, boolean>>((acc, item) => {
        acc[item.id] = true;
        return acc;
      }, {});
      setUnlocked(unlockAll);
      setMembershipActiveMemo(selectedId);
      setStatus(`${selectedId} active`);
      return;
    }

    setUnlocked((v) => ({ ...v, [selectedId]: true }));
    setStatus(`Unlocked ${selectedId}`);
  };

  function openExclusiveTile(item: ContentItem) {
    if (item.locked && !unlocked[item.id]) {
      setSelectedId(item.id);
      setSelectedPrice(item.price);
      return;
    }

    nav(`${base}/content/not-wired`);
  }

  return (
    <PageShell>
      <div style={{ display: "grid", gap: 16 }}>
        <h1 className="pageTitle" style={{ textAlign: "center" }}>EXCLUSIVE CONTENT</h1>

        {/* Info tile */}
        <div className="cardGlow" style={{ border: "1px solid rgba(59,130,246,.18)", borderRadius: 16, padding: 20, background: "rgba(255,255,255,.97)", width: "min(900px, 100%)", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontWeight: 900, fontSize: 20, color: "#3B82F6" }}>Gateway provides a built-in monetization layer.</div>
          <div style={{ marginTop: 6, fontSize: 15, color: "#1E293B" }}>Sell goods, services, memberships, content, and more.</div>
          <div style={{ marginTop: 6, fontSize: 13, color: "#64748B" }}>
            PayMe USDC payments. Get paid faster with lower fees.
          </div>
          <div style={{ marginTop: 4, fontSize: 13, color: "#64748B" }}>
            1% fee. Instantaneous settlement.
          </div>
        </div>

        {/* Membership tile */}
        <div className="cardGlow" style={{ border: "1px solid rgba(59,130,246,.18)", borderRadius: 16, padding: 16, background: "rgba(255,255,255,.97)", width: "min(900px, 100%)", margin: "0 auto" }}>
          <div style={{ fontWeight: 900, marginBottom: 12, textAlign: "center", color: "#3B82F6" }}>Purchase monthly memberships, recurring billing and subscriptions.</div>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr auto auto" }}>
            <select
              className="adminTextInput"
              style={{ WebkitAppearance: "none", MozAppearance: "none", appearance: "none" } as React.CSSProperties}
              value={membershipIndex}
              onChange={(e) => setMembershipIndex(Number(e.target.value))}
            >
              {MEMBERSHIP_OPTIONS.map((option, index) => (
                <option value={index} key={option.memo}>{`${option.label} — $${option.amount}`}</option>
              ))}
            </select>
            <button
              className="usdcPayBtn primary"
              type="button"
              onClick={() => {
                setSelectedId(membership.memo);
                setSelectedPrice(membership.amount);
              }}
            >
              Pay
            </button>
            <button
              className={membershipActiveMemo === membership.memo ? "usdcPayBtn primary" : "usdcPayBtn"}
              type="button"
              style={membershipActiveMemo !== membership.memo ? { color: "#1E293B" } : undefined}
            >
              {membership.buttonLabel}
            </button>
          </div>
        </div>

        {/* Exclusive content tiles */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, maxWidth: 900, margin: "0 auto", width: "100%" }}>
          {contentItems.map((item, idx) => {
            const isFree = !item.locked || !!unlocked[item.id];
            const isLocked = !isFree;
            const isExpanded = expandedTileId === item.id;

            // Expanded overlay for free content viewing
            if (isExpanded) {
              return (
                <div
                  key={item.id}
                  style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 100,
                    display: "grid",
                    placeItems: "center",
                    background: "rgba(0,0,0,.75)",
                    cursor: "pointer",
                  }}
                  onClick={() => setExpandedTileId(null)}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "min(90vw, 900px)",
                      maxHeight: "85vh",
                      borderRadius: 18,
                      overflow: "hidden",
                      background: "rgba(10,16,26,.95)",
                      border: "1px solid rgba(255,255,255,.18)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.imageSrc ? (
                      <img
                        src={item.imageSrc}
                        alt={item.label}
                        style={{ width: "100%", maxHeight: "80vh", objectFit: "contain", display: "block" }}
                      />
                    ) : (
                      <div style={{ padding: 40, textAlign: "center", fontSize: 16, opacity: 0.6 }}>No content available</div>
                    )}
                    <div style={{ padding: "12px 16px", fontWeight: 800, fontSize: 15 }}>{item.label}</div>
                    <button
                      type="button"
                      onClick={() => setExpandedTileId(null)}
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        width: 32,
                        height: 32,
                        borderRadius: 999,
                        border: "1px solid rgba(255,255,255,.25)",
                        background: "rgba(0,0,0,.6)",
                        color: "#fff",
                        fontSize: 18,
                        cursor: "pointer",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                style={{
                  position: "relative",
                  border: "1px solid rgba(255,255,255,.14)",
                  borderRadius: 14,
                  minHeight: 180,
                  background: "rgba(10,16,26,.81)",
                  overflow: "hidden",
                  cursor: isFree ? "pointer" : "default",
                }}
                onClick={isFree ? () => setExpandedTileId(item.id) : undefined}
              >
                {/* Tile image */}
                {item.imageSrc ? (
                  <img
                    src={item.imageSrc}
                    alt={item.label}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      inset: 0,
                    }}
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                ) : null}

                {/* Red tint overlay for locked tiles (no blur) */}
                {isLocked && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(180, 30, 30, .18)",
                      zIndex: 1,
                    }}
                  />
                )}

                {/* Tile label */}
                <div style={{
                  position: "absolute",
                  top: 8,
                  left: 10,
                  fontWeight: 700,
                  fontSize: 12,
                  color: "rgba(255,255,255,.85)",
                  zIndex: 2,
                  textShadow: "0 1px 4px rgba(0,0,0,.7)",
                }}>
                  {item.label}
                </div>

                {/* Bottom-left lock/price badge */}
                <div style={{
                  position: "absolute",
                  bottom: 10,
                  left: 10,
                  zIndex: 2,
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 10,
                }}>
                  {isLocked ? (
                    <>
                      {/* Left column: red lock + "Paid" */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        {LOCK_SVG_RED}
                        <span style={{ fontSize: 10, fontWeight: 800, color: "#e53e3e", textTransform: "uppercase" }}>Paid</span>
                      </div>
                      {/* Right column: price + "Purchase Price" */}
                      {item.price > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
                          <span style={{ fontSize: 14, fontWeight: 900, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,.8)" }}>
                            ${item.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,.7)", textTransform: "uppercase" }}>Purchase Price</span>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Free: green lock + "Free" */
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                      {LOCK_SVG_GREEN}
                      <span style={{ fontSize: 10, fontWeight: 800, color: "#38a169", textTransform: "uppercase" }}>Free</span>
                    </div>
                  )}
                </div>

                {/* Click area for locked tiles to select for purchase */}
                {isLocked && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(item.id);
                      setSelectedPrice(item.price);
                    }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "transparent",
                      border: "none",
                      borderRadius: 14,
                      cursor: "pointer",
                      zIndex: 3,
                    }}
                    aria-label={`Select ${item.label} for purchase`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* USDC Pay Card — hidden by default, toggled by cart button */}
        {showUsdc && (
          <div className="usdcPayCard" style={{ position: "fixed", top: 132, right: 0, width: 250, zIndex: 20, color: "#1E293B" }}>
            <div className="usdcPayHeader">
              <div className="usdcPayTitleRow" style={{ width: "100%", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "grid", gap: 6, color: "#1E293B" }}>
                  <div style={{ fontWeight: 900, lineHeight: 1.1, color: "#1E293B" }}>USDC Payments</div>
                  <div style={{ fontSize: 12, lineHeight: 1.1, color: "#64748B" }}>Powered by PayMe</div>
                  <div style={{ fontSize: 12, lineHeight: 1.1, color: "#64748B" }}>• Base network</div>
                </div>
                <div className="usdcPayLogo" title="xyz Labs" style={{ width: 52, height: 52 }}>
                  <img src="/demo/logo-mark.png" alt="drip" style={{ width: 28, height: 28 }} />
                </div>
              </div>
            </div>

            <div className="usdcPayRow">
              <label>
                <div className="lbl" style={{ color: "#1E293B" }}>Invoice #</div>
                <input value={selectedId} onChange={(e) => setSelectedId(e.target.value)} style={{ color: "#1E293B" }} />
              </label>
              <label>
                <div className="lbl" style={{ color: "#1E293B" }}>Amount (USDC)</div>
                <input value={selectedPrice} onChange={(e) => setSelectedPrice(Number(e.target.value) || 0)} style={{ color: "#1E293B" }} />
              </label>

              <div className="usdcPayActions">
                <button
                  type="button"
                  className={walletReady ? "usdcPayBtn ready" : "usdcPayBtn danger"}
                  onClick={!walletReady ? actions.connectWallet : undefined}
                >
                  {walletReady ? "Ready To Send" : "Connect Wallet"}
                </button>

                <button className={canSend ? "usdcPayBtn sendReady" : "usdcPayBtn"} disabled={!canSend} onClick={onSend} style={{ color: "#1E293B" }}>
                  Send USDC
                </button>

                <button className="usdcPayBtn primary" type="button" onClick={onSimulatePurchase}>
                  Simulate Purchase
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
                <button
                  type="button"
                  className="usdcPayBtn"
                  style={{ width: 24, height: 24, padding: 0, borderRadius: 999 }}
                  onClick={() => setHelpOpen((v) => !v)}
                >
                  ?
                </button>
              </div>
              {helpOpen ? (
                <div className="usdcPayCollapseBody" style={{ fontSize: 11, color: "#1E293B" }}>
                  Select content or membership to auto-fill Invoice and Amount.<br />
                  Click <b>Simulate Purchase</b> to unlock content.<br />
                  <span style={{ opacity: 0.9 }}>Status: <b>{status}</b></span>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* Floating cart toggle button */}
      <button
        type="button"
        className={showUsdc ? "cartToggleBtn" : "cartToggleBtn cartTogglePulse"}
        onClick={() => setShowUsdc((v) => !v)}
        aria-label="Toggle USDC Payments"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
      </button>
    </PageShell>
  );
}
