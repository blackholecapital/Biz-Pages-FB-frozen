import { PageShell } from "../components/layout/PageShell";
import { WorkspaceTile } from "../components/layout/WorkspaceTile";
import { ModuleFrame } from "../components/integrations/ModuleFrame";

export function EngagePage() {
  return (
    <PageShell>
      <WorkspaceTile title="Engage">
        <div style={{ height: "calc(70vh - 48px)", minHeight: 420 }}>
          <ModuleFrame module="engage" height="100%" />
        </div>
      </WorkspaceTile>
    </PageShell>
  );
}
