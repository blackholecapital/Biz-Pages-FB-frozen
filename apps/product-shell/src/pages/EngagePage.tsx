import { useNavigate, useParams } from "react-router-dom";
import { PageShell } from "../components/layout/PageShell";
import { WorkspaceTile } from "../components/layout/WorkspaceTile";
import { ModuleFrame } from "../components/integrations/ModuleFrame";

type RouteParams = { designation?: string; slug?: string };

function adminPath(designation?: string, slug?: string) {
  if (designation && slug) return `/${designation}/${slug}/admin`;
  if (slug) return `/${slug}/gate/admin`;
  return "/admin";
}

export function EngagePage() {
  const nav = useNavigate();
  const { designation, slug } = useParams<RouteParams>();

  const backToAdmin = (
    <button className="workspaceTab" type="button" onClick={() => nav(adminPath(designation, slug))}>
      ← Admin
    </button>
  );

  return (
    <PageShell>
      <WorkspaceTile title="Engage" headerExtras={backToAdmin} contentClassName="workspaceTileFill">
        <ModuleFrame module="engage" height="100%" />
      </WorkspaceTile>
    </PageShell>
  );
}
