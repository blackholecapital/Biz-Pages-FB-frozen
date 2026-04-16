import { PageShell } from "../components/layout/PageShell";
import { WorkspaceTile } from "../components/layout/WorkspaceTile";
import { ModuleFrame } from "../components/integrations/ModuleFrame";

export function PayMePage() {
  return (
    <PageShell>
      <WorkspaceTile title="PayMe">
        <div style={{ height: "calc(70vh - 48px)", minHeight: 420 }}>
          <ModuleFrame module="payme" height="100%" />
        </div>
      </WorkspaceTile>
    </PageShell>
  );
}
