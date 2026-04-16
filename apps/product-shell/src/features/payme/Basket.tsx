import { useMemo, useState } from "react";

type BasketItem = {
  id: string;
  name: string;
  description?: string;
  unitPrice: number;
  qty: number;
  recurring?: "month" | "year";
};

type SubscriptionOffer = {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
};

const SEED_ITEMS: BasketItem[] = [
  { id: "api-pro-plan", name: "API Pro Plan", description: "Monthly API access — 50 000 calls", unitPrice: 49, qty: 1 },
  { id: "extra-seat", name: "Extra Team Seat", description: "Additional user licence", unitPrice: 12, qty: 3 },
  { id: "priority-support", name: "Priority Support Add-on", description: "24/7 priority email & chat", unitPrice: 29, qty: 1 },
];

const SUBS: SubscriptionOffer[] = [
  { id: "pro-plan-sub", name: "Pro Plan", price: 29, interval: "month" },
  { id: "team-plan-sub", name: "Team Plan", price: 249, interval: "year" },
];

const COUPONS: Record<string, { type: "percent" | "fixed"; value: number }> = {
  LAUNCH30: { type: "percent", value: 30 },
  SAVE10: { type: "fixed", value: 10 },
};

export type BasketCheckout = {
  items: BasketItem[];
  subtotal: number;
  discount: number;
  total: number;
  coupon?: string;
};

export function Basket({ onCheckout }: { onCheckout?: (result: BasketCheckout) => void }) {
  const [items, setItems] = useState<BasketItem[]>(SEED_ITEMS);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; amountOff: number } | null>(null);
  const [couponMsg, setCouponMsg] = useState("");
  const [confirmed, setConfirmed] = useState<string | null>(null);

  const totals = useMemo(() => {
    const active = items.filter((i) => i.qty > 0);
    const subtotal = active.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
    const discount = appliedCoupon ? Math.min(appliedCoupon.amountOff, subtotal) : 0;
    const total = Math.max(0, subtotal - discount);
    const itemCount = active.reduce((n, i) => n + i.qty, 0);
    const hasRecurring = active.some((i) => i.recurring);
    return { subtotal, discount, total, itemCount, hasRecurring };
  }, [items, appliedCoupon]);

  function updateQty(id: string, delta: number) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item))
    );
  }
  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }
  function addSubscription(sub: SubscriptionOffer) {
    if (items.some((i) => i.id === sub.id)) return;
    setItems((prev) => [
      ...prev,
      { id: sub.id, name: sub.name, description: `Subscription (${sub.interval})`, unitPrice: sub.price, qty: 1, recurring: sub.interval },
    ]);
  }

  function applyCoupon() {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponMsg("Enter a code to apply.");
      return;
    }
    const c = COUPONS[code];
    if (!c) {
      setAppliedCoupon(null);
      setCouponMsg(`Coupon "${code}" not found.`);
      return;
    }
    const amountOff = c.type === "percent" ? (totals.subtotal * c.value) / 100 : c.value;
    setAppliedCoupon({ code, amountOff });
    setCouponMsg(`Coupon ${code} applied.`);
  }

  function proceed() {
    const active = items.filter((i) => i.qty > 0);
    if (!active.length) return;
    const result: BasketCheckout = {
      items: active,
      subtotal: totals.subtotal,
      discount: totals.discount,
      total: totals.total,
      coupon: appliedCoupon?.code,
    };
    onCheckout?.(result);
    setConfirmed(`Charged $${totals.total.toFixed(2)} (demo). ${active.length} line item(s).`);
    setTimeout(() => setConfirmed(null), 3000);
  }

  return (
    <div className="paymeBasket">
      <div className="paymeBasketHead">
        <h2 className="paymeBasketTitle">Your basket</h2>
        <p className="paymeBasketSub">Review items before checkout.</p>
      </div>

      {items.length === 0 ? (
        <div className="paymeBasketEmpty">Basket is empty.</div>
      ) : (
        <div className="paymeBasketList">
          {items.map((item) => (
            <div key={item.id} className="paymeBasketRow">
              <div className="paymeBasketRowInfo">
                <div className="paymeBasketRowName">
                  {item.name}
                  {item.recurring && <span className="paymeBasketRecurring"> / {item.recurring}</span>}
                </div>
                {item.description && <div className="paymeBasketRowDesc">{item.description}</div>}
              </div>
              <div className="paymeBasketQty">
                <button type="button" onClick={() => updateQty(item.id, -1)} aria-label="Decrease">−</button>
                <span>{item.qty}</span>
                <button type="button" onClick={() => updateQty(item.id, 1)} aria-label="Increase">+</button>
              </div>
              <div className="paymeBasketPrice">${(item.unitPrice * item.qty).toFixed(2)}</div>
              <button type="button" className="paymeBasketRemove" onClick={() => removeItem(item.id)} aria-label="Remove">×</button>
            </div>
          ))}
        </div>
      )}

      <div className="paymeBasketSection">
        <div className="paymeBasketSectionLabel">Add a subscription</div>
        <div className="paymeBasketSubs">
          {SUBS.map((sub) => {
            const added = items.some((i) => i.id === sub.id);
            return (
              <button
                key={sub.id}
                type="button"
                className="paymeBasketSubBtn"
                disabled={added}
                onClick={() => addSubscription(sub)}
              >
                + {sub.name} (${sub.price}/{sub.interval === "month" ? "mo" : "yr"})
              </button>
            );
          })}
        </div>
      </div>

      <div className="paymeBasketSection">
        <label className="paymeBasketSectionLabel" htmlFor="coupon-input">Coupon code</label>
        <div className="paymeBasketCouponRow">
          <input
            id="coupon-input"
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Enter code"
          />
          <button type="button" className="paymeBasketApply" onClick={applyCoupon}>Apply</button>
        </div>
        {couponMsg && (
          <div className={"paymeBasketCouponMsg" + (appliedCoupon ? " ok" : "")}>{couponMsg}</div>
        )}
      </div>

      <div className="paymeBasketTotals">
        <div className="paymeBasketTotalRow">
          <span>Subtotal ({totals.itemCount} items)</span>
          <span>${totals.subtotal.toFixed(2)}</span>
        </div>
        {totals.discount > 0 && (
          <div className="paymeBasketTotalRow discount">
            <span>Discount</span>
            <span>− ${totals.discount.toFixed(2)}</span>
          </div>
        )}
        <div className="paymeBasketTotalRow grand">
          <span>Estimated total</span>
          <span>${totals.total.toFixed(2)}</span>
        </div>
        {totals.hasRecurring && (
          <div className="paymeBasketRecurringNote">Includes recurring subscription item(s)</div>
        )}
      </div>

      <button
        type="button"
        className="paymeBasketCheckout"
        disabled={items.every((i) => i.qty === 0)}
        onClick={proceed}
      >
        Proceed to checkout
      </button>

      {confirmed && <div className="paymeBasketConfirmed">{confirmed}</div>}

      <div className="paymeBasketFooter">Powered by PayMe</div>
    </div>
  );
}
