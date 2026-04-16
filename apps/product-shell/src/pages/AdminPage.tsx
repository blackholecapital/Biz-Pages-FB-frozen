import { useNavigate, useParams } from "react-router-dom";
import { PageShell } from "../components/layout/PageShell";
import { WorkspaceTile } from "../components/layout/WorkspaceTile";
import { AdminPanel } from "../components/admin/AdminPanel";
import { usePayMeCart } from "../state/paymeCartState";

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
  const { show: showPayMe } = usePayMeCart();

  const headerTabs = (
    <>
      <button className="workspaceTab" type="button" onClick={showPayMe}>Pay Me</button>
      <button className="workspaceTab" type="button" onClick={() => nav(buildTo("/engage", designation, slug))}>Engage</button>
      <button className="workspaceTab" type="button" onClick={() => nav(buildTo("/referrals", designation, slug))}>Referrals</button>
      <button className="workspaceTab" type="button" onClick={() => nav(buildTo("/skins", designation, slug))}>Skins</button>
      <a className="workspaceTab" href="https://dripstudio.xyz-labs.xyz" target="_blank" rel="noreferrer">Biz Pages</a>
    </>
  );

  return (
    <PageShell>
      <WorkspaceTile title="Admin Dash" headerExtras={headerTabs}>
        <AdminPanel />
      </WorkspaceTile>
    </PageShell>
  );
}
