import { useNavigate, useParams } from "react-router-dom";
import { PageShell } from "../components/layout/PageShell";
import { WorkspaceTile } from "../components/layout/WorkspaceTile";
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

  const headerTabs = (
    <>
      <button className="workspaceTab" type="button" onClick={() => nav(buildTo("/payme", designation, slug))}>Pay Me</button>
      <button className="workspaceTab" type="button" onClick={() => nav(buildTo("/engage", designation, slug))}>Engage</button>
      <button className="workspaceTab" type="button" onClick={() => nav(buildTo("/referrals", designation, slug))}>Referrals</button>
      <button className="workspaceTab" type="button" onClick={() => nav(buildTo("/skins", designation, slug))}>Skins</button>
      <button className="workspaceTab" type="button" onClick={() => nav(buildTo("/studio", designation, slug))}>Biz Pages Studio</button>
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
