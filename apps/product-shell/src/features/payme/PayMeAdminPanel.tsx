import { PayMeAdminCard } from "./PayMeAdminCard";

export function PayMeAdminPanel() {
  return (
    <section className="cardsGrid" style={{ marginTop: 16 }}>
      <PayMeAdminCard title="Active plans" value="3" helper="starter, growth, enterprise" />
      <PayMeAdminCard title="USDC collected" value="$2,430" helper="rolling 30-day total" />
      <PayMeAdminCard title="Failed renewals" value="0" helper="all invoices settled" />
    </section>
  );
}
