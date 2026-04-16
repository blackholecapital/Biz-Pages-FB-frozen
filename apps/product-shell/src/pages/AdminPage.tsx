import { PageShell } from "../components/layout/PageShell";
import { WorkspaceTile } from "../components/layout/WorkspaceTile";
import { AdminPanel } from "../components/admin/AdminPanel";

export function AdminPage() {
  return (
    <PageShell>
      <WorkspaceTile title="Admin Dash">
        <AdminPanel />
      </WorkspaceTile>
    </PageShell>
  );
}
