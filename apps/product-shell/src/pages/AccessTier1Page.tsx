import { PageShell } from "../components/layout/PageShell";
import { MemberBillingPanel } from "../features/payme/MemberBillingPanel";

export function AccessTier1Page() {
  return (
    <PageShell>
      <div className="paymeShell">
        <h1 className="pageTitle" style={{ color: "#fff", textAlign: "center", marginBottom: 12 }}>Customer Service</h1>
        <MemberBillingPanel />
      </div>
    </PageShell>
  );
}
