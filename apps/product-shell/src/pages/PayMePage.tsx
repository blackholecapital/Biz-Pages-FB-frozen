import { PageShell } from "../components/layout/PageShell";
import { ModuleFrame } from "../components/integrations/ModuleFrame";

export function PayMePage() {
  return (
    <PageShell>
      <ModuleFrame module="payme" height="76vh" />
    </PageShell>
  );
}
