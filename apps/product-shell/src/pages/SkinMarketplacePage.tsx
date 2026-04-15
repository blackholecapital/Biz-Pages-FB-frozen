import { PageShell } from "../components/layout/PageShell";
import { CartProvider } from "../features/marketplace/state/cartStore";
import { MarketplacePage } from "../features/marketplace/pages/MarketplacePage";

export function SkinMarketplacePage() {
  return (
    <PageShell>
      <div className="paymeShell">
        <CartProvider>
          <MarketplacePage />
        </CartProvider>
      </div>
    </PageShell>
  );
}
