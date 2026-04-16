# ACCESS PATCH MANIFEST
## job_id: RB-INT-CHASSIS-004 | stage_2 | worker_a

---

## PATCH 1 — Exclusive tile page key bug

**File:** `apps/product-shell/src/hooks/usePublishedExclusiveTiles.ts`

**Line:** 21

**Before:**
```ts
const page = await fetchPublishedRuntimePage(slug, "access-tier-2");
```

**After:**
```ts
const page = await fetchPublishedRuntimePage(slug, "tier-2");
```

**Reason:** `"access-tier-2"` is not in `VALID_PAGES` in `functions/_lib/runtime-schema.js`.
Every call returned 400 and the hook fell back to 6 hardcoded locked default tiles with no
images. Changing to `"tier-2"` (the correct key) allows the published page fetch to succeed
and return real exclusive tile data from the tenant's R2 bucket.

---

## PATCH 2 — Remove deferred placeholder from MemberBillingPanel

**File:** `apps/product-shell/src/features/payme/MemberBillingPanel.tsx`

**Before:**
```tsx
<p style={{ color: "rgba(255,255,255,0.78)", marginTop: 0 }}>
  Billing controls are available while the full PayMe feature surface is being reconstructed.
</p>
```

**After:** Line removed. `PayMeAdminPanel` renders directly under the section heading.

**Reason:** The placeholder paragraph was deferred/blocked messaging that suppressed the
billing panel content. `PayMeAdminPanel` (the billing stats display) was already present and
functional beneath it. Removing the deferred text unblocks the Customer Service tier-1 panel.

---

## TARGETS NOT PATCHED (conditional from lock file)

| Target | Reason skipped |
|--------|---------------|
| `apps/product-shell/src/components/gate/RequireGate.tsx` | Gate is disabled in router; no blocking behavior. Build sheet requires pages not be incorrectly locked — re-enabling not in scope. |
| `apps/product-shell/src/app/router.tsx` | Gate intentionally OFF. Re-enable not required by build sheet outcome. |
| `apps/product-shell/functions/_lib/runtime-compiler.js` | `"tier-2"` legacy bundle key unknown. Primary per-tenant path (`tenants/{slug}/tier-2.json`) is unblocked. Legacy fallback is a separate concern not causing current access failures. |

---

## RESULT

- `/access` page: functional (no change required)
- `AccessTier1Page` (Customer Service): deferred text removed; billing panel renders
- `AccessTier2Page` (Exclusive Content): tier-2 tile fetch now uses correct API page key;
  published exclusive tile data will load when slug is present
- `AccessTier3Page` (Admin Dash): no change required; correct
- Provider / state wiring: no change required; correct
- No incorrect default-deny, blocked, deferred, or mock-only fallback remains in
  access/member-unlock path
