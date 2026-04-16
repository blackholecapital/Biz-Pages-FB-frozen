import { AdminActionButton } from "./AdminActionButton";
import { AdminStatusBlock } from "./AdminStatusBlock";

export function AdminPanel() {
  return (
    <section style={{ display: "grid", gap: 14 }}>
      <div className="cardsGrid">
        <AdminStatusBlock title="Runtime Status" value="Operational" note="mock data mode" />
        <AdminStatusBlock title="Published Pages" value="11" note="last sync: now" />
        <AdminStatusBlock title="Payment Rail" value="USDC" note="Base network" />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <AdminActionButton label="Publish" />
        <AdminActionButton label="Refresh Cache" />
        <AdminActionButton label="Rotate Keys" />
      </div>
    </section>
  );
}
