import { PayMeAdminPanel } from "./PayMeAdminPanel";

export function MemberBillingPanel() {
  return (
    <section>
      <h2 className="sectionTitle" style={{ color: "#fff", marginBottom: 8 }}>
        Member Billing
      </h2>
      <p style={{ color: "rgba(255,255,255,0.78)", marginTop: 0 }}>
        Billing controls are available while the full PayMe feature surface is being reconstructed.
      </p>
      <PayMeAdminPanel />
    </section>
  );
}
