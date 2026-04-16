import { useState } from "react";

type Plan = {
  id: string;
  name: string;
  interval: "month" | "year";
  price: number;
  active: boolean;
  subscribers: number;
  mrr: number;
};

type Subscription = {
  id: string;
  customer: string;
  plan: string;
  status: "active" | "past_due" | "canceled";
  nextRenewal: string;
  amount: number;
};

const SEED_PLANS: Plan[] = [
  { id: "p1", name: "Pro Plan", interval: "month", price: 29, active: true, subscribers: 128, mrr: 3712 },
  { id: "p2", name: "Team Plan", interval: "year", price: 249, active: true, subscribers: 44, mrr: 913 },
  { id: "p3", name: "Starter", interval: "month", price: 9, active: true, subscribers: 213, mrr: 1917 },
];

const SEED_SUBS: Subscription[] = [
  { id: "s1", customer: "Acme Corp", plan: "Pro Plan", status: "active", nextRenewal: "2026-05-02", amount: 29 },
  { id: "s2", customer: "Mercer & Sons", plan: "Team Plan", status: "active", nextRenewal: "2026-11-14", amount: 249 },
  { id: "s3", customer: "Liu Freelance", plan: "Starter", status: "past_due", nextRenewal: "2026-04-10", amount: 9 },
  { id: "s4", customer: "Plume Studio", plan: "Pro Plan", status: "canceled", nextRenewal: "—", amount: 0 },
];

export function RecurringBillingPanel() {
  const [plans, setPlans] = useState<Plan[]>(SEED_PLANS);
  const [subs] = useState<Subscription[]>(SEED_SUBS);
  const [form, setForm] = useState({ name: "", interval: "month" as "month" | "year", price: "" });

  function addPlan() {
    if (!form.name.trim() || !form.price) return;
    setPlans((prev) => [
      ...prev,
      {
        id: `p${Date.now()}`,
        name: form.name.trim(),
        interval: form.interval,
        price: Number(form.price) || 0,
        active: true,
        subscribers: 0,
        mrr: 0,
      },
    ]);
    setForm({ name: "", interval: "month", price: "" });
  }

  function toggleActive(id: string) {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  }

  const totalMrr = plans.reduce((sum, p) => sum + p.mrr, 0);
  const totalSubs = plans.reduce((sum, p) => sum + p.subscribers, 0);

  return (
    <div className="paymeSubGrid">
      <div className="adminBlock">
        <div className="adminBlockTitle">PayMe Pro · Overview</div>
        <div className="adminBlockBody">
          <div className="paymeStats">
            <div className="paymeStat">
              <div className="paymeStatValue">${totalMrr.toLocaleString()}</div>
              <div className="paymeStatLabel">Monthly recurring revenue</div>
            </div>
            <div className="paymeStat">
              <div className="paymeStatValue">{totalSubs}</div>
              <div className="paymeStatLabel">Active subscribers</div>
            </div>
            <div className="paymeStat">
              <div className="paymeStatValue">{plans.filter((p) => p.active).length}</div>
              <div className="paymeStatLabel">Live plans</div>
            </div>
          </div>
        </div>
      </div>

      <div className="adminBlock">
        <div className="adminBlockTitle">Create Plan</div>
        <div className="adminBlockBody">
          <div className="paymeFormGrid">
            <label>
              <span className="paymeLabel">Plan name</span>
              <input className="adminTextInput" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Growth Plan" />
            </label>
            <label>
              <span className="paymeLabel">Interval</span>
              <select className="adminTextInput" value={form.interval} onChange={(e) => setForm({ ...form, interval: e.target.value as "month" | "year" })}>
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
              </select>
            </label>
            <label>
              <span className="paymeLabel">Price (USD)</span>
              <input className="adminTextInput" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="49" />
            </label>
          </div>
          <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
            <button type="button" className="adminBtn primary" onClick={addPlan}>Create plan</button>
          </div>
        </div>
      </div>

      <div className="adminBlock" style={{ gridColumn: "1 / -1" }}>
        <div className="adminBlockTitle">Plans</div>
        <div className="adminBlockBody">
          <table className="paymeTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Interval</th>
                <th>Price</th>
                <th>Subscribers</th>
                <th>MRR</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.interval === "month" ? "Monthly" : "Yearly"}</td>
                  <td>${p.price.toFixed(2)}</td>
                  <td>{p.subscribers}</td>
                  <td>${p.mrr.toLocaleString()}</td>
                  <td>
                    <span className={"paymePill" + (p.active ? " on" : " off")}>
                      {p.active ? "Active" : "Paused"}
                    </span>
                  </td>
                  <td>
                    <button className="adminBtn" onClick={() => toggleActive(p.id)}>
                      {p.active ? "Pause" : "Resume"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="adminBlock" style={{ gridColumn: "1 / -1" }}>
        <div className="adminBlockTitle">Recent Subscriptions</div>
        <div className="adminBlockBody">
          <table className="paymeTable">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Next renewal</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.id}>
                  <td>{s.customer}</td>
                  <td>{s.plan}</td>
                  <td>
                    <span className={"paymePill status-" + s.status}>{s.status.replace("_", " ")}</span>
                  </td>
                  <td>{s.nextRenewal}</td>
                  <td>${s.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
