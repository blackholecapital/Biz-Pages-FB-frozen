import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageShell } from "../components/layout/PageShell";
import { useDemoGate } from "../state/demoGateState";
import { AdminPanel } from "../components/admin/AdminPanel";

type RouteParams = { designation?: string; slug?: string };

function buildTo(path: string, designation?: string, slug?: string) {
  if (!designation || !slug) return path;
  return `/${designation}/${slug}${path}`;
}

export function AccessTier3Page() {
  const nav = useNavigate();
  const { designation, slug } = useParams<RouteParams>();
  const { state } = useDemoGate();

  const base = useMemo(() => {
    if (designation && slug) return `/${designation}/${slug}/gate`;
    if (slug) return `/${slug}/gate`;
    return "";
  }, [designation, slug]);

  useEffect(() => {
    if (!state.tier3Unlocked) {
      nav(`${base}/access`, { replace: true });
    }
  }, [state.tier3Unlocked, nav, base]);

  return (
    <PageShell>
      <div className="paymeShell">
        <div className="pageTitleRow" style={{ alignItems: "center" }}>
          <h1 className="pageTitle" style={{ color: "#fff" }}>Admin Dash</h1>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginLeft: "auto" }}>
            <button className="paymeTab" type="button" onClick={() => nav(buildTo("/payme", designation, slug))}>Pay Me</button>
            <button className="paymeTab" type="button" onClick={() => nav(buildTo("/engage", designation, slug))}>Engage</button>
            <button className="paymeTab" type="button" onClick={() => nav(buildTo("/referrals", designation, slug))}>Referrals</button>
            <button className="paymeTab" type="button" onClick={() => nav(buildTo("/skins", designation, slug))}>Skins</button>
            <a className="paymeTab" href="https://dripstudio.xyz-labs.xyz" target="_blank" rel="noreferrer">Pages</a>
          </div>
        </div>
        <AdminPanel />
      </div>
    </PageShell>
  );
}
