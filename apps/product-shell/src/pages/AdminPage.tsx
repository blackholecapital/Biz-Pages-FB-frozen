import { useNavigate, useParams } from "react-router-dom";
import { PageShell } from "../components/layout/PageShell";
import { AdminPanel } from "../components/admin/AdminPanel";

type RouteParams = { designation?: string; slug?: string };

function buildTo(path: string, designation?: string, slug?: string) {
  const base = designation && slug ? `/${designation}/${slug}/gate` : slug ? `/${slug}/gate` : "";
  if (!base) return path;
  if (path === "/") return base;
  return `${base}${path}`;
}

export function AdminPage() {
  const nav = useNavigate();
  const { designation, slug } = useParams<RouteParams>();

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
