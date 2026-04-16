import { PayMeAdminPanel } from "./PayMeAdminPanel";

export function MemberBillingPanel() {
  return (
    <section>
      <h2 className="sectionTitle" style={{ color: "#fff", marginBottom: 8 }}>
        Member Billing
      </h2>
      <PayMeAdminPanel />
    </section>
  );
}
