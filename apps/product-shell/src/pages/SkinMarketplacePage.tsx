import { PageShell } from "../components/layout/PageShell";
import { WorkspaceTile } from "../components/layout/WorkspaceTile";
import { CartProvider } from "../features/marketplace/state/cartStore";
import { MarketplacePage } from "../features/marketplace/pages/MarketplacePage";

export function SkinMarketplacePage() {
  return (
    <PageShell>
      <WorkspaceTile title="Skins">
        <CartProvider>
          <MarketplacePage />
        </CartProvider>
      </WorkspaceTile>
    </PageShell>
  );
}
