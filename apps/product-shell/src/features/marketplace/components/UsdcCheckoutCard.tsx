type UsdcCheckoutCardProps = {
  subtotalUsdc: number;
};

export function UsdcCheckoutCard({ subtotalUsdc }: UsdcCheckoutCardProps) {
  return (
    <article className="card">
      <h3 className="sectionTitle" style={{ marginTop: 0 }}>USDC Checkout</h3>
      <p style={{ margin: "6px 0" }}>Subtotal: {subtotalUsdc.toFixed(2)} USDC</p>
      <p style={{ margin: "6px 0", opacity: 0.7, fontSize: 13 }}>
        Wallet settlement is deferred until integrations are reconstructed.
      </p>
    </article>
  );
}
