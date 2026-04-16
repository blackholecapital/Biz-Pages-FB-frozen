import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageShell } from "../components/layout/PageShell";
import { WorkspaceTile } from "../components/layout/WorkspaceTile";
import { ModuleFrame } from "../components/integrations/ModuleFrame";
import { CouponsPanel } from "../features/payme/CouponsPanel";
import { RecurringBillingPanel } from "../features/payme/RecurringBillingPanel";
import { PayMeSettingsPanel } from "../features/payme/PayMeSettingsPanel";

type RouteParams = { designation?: string; slug?: string };

type TabKey = "invoices" | "coupons" | "recurring" | "settings";

const TABS: { key: TabKey; label: string }[] = [
  { key: "invoices", label: "Invoices & Customers" },
  { key: "coupons", label: "Coupons" },
  { key: "recurring", label: "Recurring Billing" },
  { key: "settings", label: "Admin Settings" },
];

function adminPath(designation?: string, slug?: string) {
  if (designation && slug) return `/${designation}/${slug}/admin`;
  if (slug) return `/${slug}/gate/admin`;
  return "/admin";
}

export function PayMePage() {
  const nav = useNavigate();
  const { designation, slug } = useParams<RouteParams>();
  const [active, setActive] = useState<TabKey>("invoices");

  const headerExtras = (
    <>
      {TABS.map((t) => (
        <button
          key={t.key}
          type="button"
          className={"workspaceTab" + (active === t.key ? " active" : "")}
          onClick={() => setActive(t.key)}
        >
          {t.label}
        </button>
      ))}
      <button className="workspaceTab" type="button" onClick={() => nav(adminPath(designation, slug))}>
        ← Admin
      </button>
    </>
  );

  return (
    <PageShell>
      <WorkspaceTile title="PayMe" headerExtras={headerExtras} contentClassName={active === "invoices" ? "workspaceTileFill" : undefined}>
        {active === "invoices" && <ModuleFrame module="payme" height="100%" />}
        {active === "coupons" && <CouponsPanel />}
        {active === "recurring" && <RecurringBillingPanel />}
        {active === "settings" && <PayMeSettingsPanel />}
      </WorkspaceTile>
    </PageShell>
  );
}
