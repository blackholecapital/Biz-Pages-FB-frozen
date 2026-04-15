import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "./AppShell";

import { HomePage } from "../pages/HomePage";
import { MembersPage } from "../pages/MembersPage";
import { AccessPage } from "../pages/AccessPage";
import { AccessTier1Page } from "../pages/AccessTier1Page";
import { AccessTier2Page } from "../pages/AccessTier2Page";
import { AccessTier3Page } from "../pages/AccessTier3Page";
import { PayMePage } from "../pages/PayMePage";
import { EngagePage } from "../pages/EngagePage";
import { ReferralsPage } from "../pages/ReferralsPage";
import { SkinMarketplacePage } from "../pages/SkinMarketplacePage";
import { AdminPage } from "../pages/AdminPage";
// DEV NOTE: To re-enable the gate locking system, uncomment the import below
// and wrap the gated routes (see comment block further down) with <RequireGate />.
// import { RequireGate } from "../components/gate/RequireGate";

/*
 * ──────────────────────────────────────────────────────────────
 * DEV NOTES — quick-reference for common configuration changes
 * ──────────────────────────────────────────────────────────────
 *
 * 1. GATE ON/OFF
 *    The gate (RequireGate) is currently DISABLED so all pages
 *    are publicly reachable from the homepage.
 *    To turn it back on:
 *      a) Uncomment the RequireGate import above.
 *      b) Find the "GATED ROUTES" comment blocks below and
 *         re-wrap those route arrays inside:
 *           { element: <RequireGate />, children: [ ...routes ] }
 *      c) The original gated structure is preserved in comments
 *         at the bottom of this file for easy copy-paste.
 *
 * 2. MAIN WALLPAPER
 *    The wallpaper image is set in the PageShell component
 *    (src/components/layout/PageShell.tsx) via the background
 *    config (src/config/backgrounds.ts or similar). Change the
 *    image URL there to swap the main wallpaper.
 *
 * 3. HOMEPAGE TITLE
 *    Edit src/pages/HomePage.tsx — the <h1> in homeHeroTitle.
 *
 * 4. BRAND NAME (top-left nav text)
 *    Edit src/components/nav/TopNav.tsx — brandTitleDesktop span.
 * ──────────────────────────────────────────────────────────────
 */

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      // Public / Gate entrypoints
      { index: true, element: <HomePage />, handle: { pageKey: "home" } },
      { path: "gate", element: <HomePage />, handle: { pageKey: "home" } },

      // Tenant slug gate entrypoints (no designation prefix)
      { path: ":slug", element: <HomePage />, handle: { pageKey: "home" } },
      { path: ":slug/gate", element: <HomePage />, handle: { pageKey: "home" } },

      // Designated gate entrypoints (skin prefix)
      { path: ":designation/:slug", element: <HomePage />, handle: { pageKey: "home" } },
      { path: ":designation/:slug/gate", element: <HomePage />, handle: { pageKey: "home" } },

      // ── GATED ROUTES (gate currently DISABLED — all public) ──
      // To re-enable, wrap these in { element: <RequireGate />, children: [...] }

      // Base pages
      { path: "members", element: <MembersPage />, handle: { pageKey: "members" } },

      { path: "access", element: <AccessPage />, handle: { pageKey: "access" } },
      { path: "access/tier-1", element: <AccessTier1Page />, handle: { pageKey: "payme" } },
      { path: "access/tier-2", element: <AccessTier2Page />, handle: { pageKey: "tier-2" } },
      { path: "access/tier-3", element: <AccessTier3Page />, handle: { pageKey: "admin" } },

      { path: "payme", element: <PayMePage />, handle: { pageKey: "payme" } },
      { path: "engage", element: <EngagePage />, handle: { pageKey: "engage" } },
      { path: "referrals", element: <ReferralsPage />, handle: { pageKey: "referrals" } },
      { path: "skins", element: <SkinMarketplacePage />, handle: { pageKey: "skins" } },
      { path: "admin", element: <AdminPage />, handle: { pageKey: "admin" } },

      // Tenant slug pages
      { path: ":slug/gate/members", element: <MembersPage />, handle: { pageKey: "members" } },

      { path: ":slug/gate/access", element: <AccessPage />, handle: { pageKey: "access" } },
      { path: ":slug/gate/access/tier-1", element: <AccessTier1Page />, handle: { pageKey: "payme" } },
      { path: ":slug/gate/access/tier-2", element: <AccessTier2Page />, handle: { pageKey: "tier-2" } },
      { path: ":slug/gate/access/tier-3", element: <AccessTier3Page />, handle: { pageKey: "admin" } },

      { path: ":slug/gate/payme", element: <PayMePage />, handle: { pageKey: "payme" } },
      { path: ":slug/gate/engage", element: <EngagePage />, handle: { pageKey: "engage" } },
      { path: ":slug/gate/referrals", element: <ReferralsPage />, handle: { pageKey: "referrals" } },
      { path: ":slug/gate/skins", element: <SkinMarketplacePage />, handle: { pageKey: "skins" } },
      { path: ":slug/gate/admin", element: <AdminPage />, handle: { pageKey: "admin" } },

      // Designated pages
      { path: ":designation/:slug/members", element: <MembersPage />, handle: { pageKey: "members" } },

      { path: ":designation/:slug/access", element: <AccessPage />, handle: { pageKey: "access" } },
      { path: ":designation/:slug/access/tier-1", element: <AccessTier1Page />, handle: { pageKey: "payme" } },
      { path: ":designation/:slug/access/tier-2", element: <AccessTier2Page />, handle: { pageKey: "tier-2" } },
      { path: ":designation/:slug/access/tier-3", element: <AccessTier3Page />, handle: { pageKey: "admin" } },

      { path: ":designation/:slug/payme", element: <PayMePage />, handle: { pageKey: "payme" } },
      { path: ":designation/:slug/engage", element: <EngagePage />, handle: { pageKey: "engage" } },
      { path: ":designation/:slug/referrals", element: <ReferralsPage />, handle: { pageKey: "referrals" } },
      { path: ":designation/:slug/skins", element: <SkinMarketplacePage />, handle: { pageKey: "skins" } },
      { path: ":designation/:slug/admin", element: <AdminPage />, handle: { pageKey: "admin" } }
    ]
  }
]);
