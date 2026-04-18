# Resolver Regression Matrix — BIZ-PAGES-PROD-DETANGLE-002

job_id: BIZ-PAGES-PROD-DETANGLE-002
stage: S3
worker: Worker B
companion_fixture: `/job_site/known_slug_test_vector.json`

required_references:
- `/job_site/resolver_contract_spec.md` — Worker A S3 artifact (parallel pass; canonical contract this matrix asserts against)
- `/job_site/runtime_parity_matrix.md` — S1 baseline of three divergent wallpaper paths and the resolver-returns-code fault
- `/job_site/build-sheet-active.txt` — S3 dispatch and pass conditions

cross-stage notes:
- `/job_site/cloudflare_runtime_notes.md` §3.3 Topology T4 (Worker fronts asset bytes via `/r2/*` while Pages Functions handle JSON) is the assumed worker-fronted target. The `expected_unified` columns below cite that topology.
- `/job_site/wallpaper_renderer_fault_report.md` Faults A–F are the in-repo evidence for the `baseline_broken` columns.

---

## 0. Scope

This matrix records four regression cases that the unified resolver contract
must satisfy. Each case names: the input, the source code path that produces
the input, the current (broken) computed value plus the file/line that
computes it, and the expected unified value plus the worker-fronted path that
must produce it. The fixture JSON in `/job_site/known_slug_test_vector.json`
provides one canonical slug exercising all four cases end-to-end.

The matrix does **not** invent a new contract. It asserts the regression
shape that `resolver_contract_spec.md` (S3 Worker A) must declare and that
the S3 patch to `apps/product-shell/src/runtime/publishedClient.ts` plus a
new `resolveAssetUrl` helper must implement.

---

## 1. Case Index

| Case ID | Subject                          | Input    | Baseline result               | Expected unified result        |
|---------|----------------------------------|----------|-------------------------------|--------------------------------|
| RC1     | Wallpaper asset                  | `w91`    | `/wallpapers/acme-premium.png` (slug-as-code static path; wallpaper code dropped) | `/r2/wallpapers/w91.png` |
| RC2     | Sticker tile asset               | `c1734`  | `c1734` (raw code emitted into `<img src>`; 404) | `/r2/sticker-tiles/c1734.png` |
| RC3     | Missing asset                    | `null`   | `null` (locked placeholder; benign) | `null` (must remain locked placeholder; resolver MUST NOT synthesise a URL from slug) |
| RC4     | Worker-fronted bucket fetch      | `w91`    | Pages static 404 → AppShell `/w99.png` mask | Worker route `/r2/*` → `TENANTS_BUCKET.get("wallpapers/w91.png")` → 200 image/png or deterministic JSON 404 |

---

## 2. RC1 — Wallpaper Asset

### 2.1 Input

- Spec field: `spec.wallpaper` (or `spec.wallpaperCode`) on the published
  page JSON.
- Fixture value: `"w91"`.
- Origin in fixture: `bucket_inputs.primary_demo.json.json.pages.tier-2.wallpaper`
  (see `/job_site/known_slug_test_vector.json`).

### 2.2 Server-side path (shared by baseline and expected)

| Step | File | Line | Behaviour |
|------|------|------|-----------|
| Validate | `apps/product-shell/functions/_lib/runtime-schema.js` | 189 | `validateAssetCode(spec.wallpaper, ["w","m"])` returns `"w91"` |
| Carry through | `apps/product-shell/functions/_lib/runtime-compiler.js` | 109 | `if (normalized.wallpaper) result.wallpaper = normalized.wallpaper` |
| Wire format | `apps/product-shell/src/runtime/types.ts` | (PublishedRuntimePage.wallpaper) | `wallpaper?: string` — bare code, not URL |

### 2.3 Baseline (broken) client-side

| Step | File | Line | Behaviour |
|------|------|------|-----------|
| Resolver invoked | `apps/product-shell/src/utils/resolveWallpaper.ts` | 3 | `resolveStaticAsset("/wallpapers/{assetCode}.png", slug)` |
| Code substitution | `apps/product-shell/src/utils/resolveStaticAsset.ts` | 4–5 | `resolveAssetCode(slug)` is substituted into `{assetCode}` — the wallpaper code `"w91"` is not consumed |
| Computed URL | — | — | `/wallpapers/acme-premium.png` |
| Render consumer | `apps/product-shell/src/components/layout/PageShell.tsx` | 9–21 | Called with zero props by every page (Fault C, `wallpaper_renderer_fault_report.md` §2.2); the resolved value is dropped |
| Visible paint | `apps/product-shell/src/app/AppShell.tsx` | 8, 17 | `/w99.png` painted with `background-size:contain` (Fault A + Fault B) |

**Result:** wallpaper code is silently discarded; the operator sees the
default static asset on every premium slug.

### 2.4 Expected unified

| Step | Reference | Behaviour |
|------|-----------|-----------|
| Resolver invoked | `resolver_contract_spec.md` (Worker A S3) | `resolveAssetUrl("w91", { kind: "wallpaper" })` |
| Computation | derived from code prefix `w` → folder `wallpapers`; remainder digits preserved; `.png` appended | returns `/r2/wallpapers/w91.png` |
| Render consumer | `apps/product-shell/src/features/desktop-premium/DesktopPremiumReceiver.tsx` (mounted because `shellId === "desktop-premium-v1"` after S2 dispatch patch) | `wallpaperUrl` threaded into `layout.wallpaper`; painted by `.dpv1Wallpaper` `background-size:cover` at the 2560×1440 stage |
| Network | `cloudflare_runtime_notes.md` §3.3 T4 | Worker route `/r2/*` reads `TENANTS_BUCKET.get("wallpapers/w91.png")` and streams bytes |

**Pass condition:** `resolveAssetUrl("w91",{kind:"wallpaper"}) === "/r2/wallpapers/w91.png"`
and `resolveWallpaper.ts` either deleted or rewired to call the unified
resolver. The slug MUST NOT appear in the wallpaper URL.

---

## 3. RC2 — Sticker Tile Asset

### 3.1 Input

- Spec field: `exclusiveTiles[i].contentCode` (alias: `assetCode`, `code`, `id`).
- Fixture value: `"c1734"` on tile slot 1.
- Origin in fixture: `bucket_inputs.primary_demo.json.json.pages.tier-2.exclusiveTiles[0]`.

### 3.2 Server-side path (shared)

| Step | File | Line | Behaviour |
|------|------|------|-----------|
| Normalise tile | `apps/product-shell/functions/_lib/runtime-schema.js` | 106–171 | `normalizeExclusiveTile` validates `assetCode` against `["c","x"]`, emits `{ slot, id, label, imageUrl, locked, price, assetCode, destinationPath? }` |
| Carry through | `apps/product-shell/functions/_lib/runtime-compiler.js` | 112–114 | `result.exclusiveTiles = normalized.exclusiveTiles` |
| Wire format | `apps/product-shell/src/runtime/types.ts` | (RenderedExclusiveTile) | `assetCode?: string`, `imageUrl: string \| null` |

### 3.3 Baseline (broken) client-side

| Step | File | Line | Behaviour |
|------|------|------|-----------|
| Hydrate | `apps/product-shell/src/runtime/exclusiveTileHydration.ts` | 119–122 | `resolvedImageSrc = tile.imageUrl \|\| (tile.assetCode ? resolveAssetCode(tile.assetCode, slug) : null)` |
| Resolver | `apps/product-shell/src/utils/assetCodeResolver.ts` | 7–11 | `resolveAssetCode` returns the **sanitised code**, not a URL |
| Computed value | — | — | `"c1734"` |
| Render consumer | `apps/product-shell/src/pages/ExclusivePage.tsx` (~L202) | — | Stuffs `resolvedImageSrc` directly into `<img src>` |
| Network result | browser | — | `GET <current-page-url>/c1734` → 404 |

**Result:** `runtime_parity_matrix.md` §4 fault: "asset resolver returns
e.g. `c1234` and that string is then stuffed into an `<img src>` attribute …
browsers resolve it against the current page URL and 404."

### 3.4 Expected unified

| Step | Reference | Behaviour |
|------|-----------|-----------|
| Hydrate | `resolver_contract_spec.md` (Worker A S3) | `resolvedImageSrc = tile.imageUrl ?? resolveAssetUrl(tile.assetCode, { kind: "sticker-tile" })` |
| Resolver | unified `resolveAssetUrl` | code prefix `c` → folder `sticker-tiles`; `.png` extension appended |
| Computed URL | — | `/r2/sticker-tiles/c1734.png` |
| Render consumer | `ExclusivePage.tsx` patched per S3 Worker A | `<img src>` consumes URL directly |
| Network | `cloudflare_runtime_notes.md` §3.3 T4 | Worker `/r2/*` → `TENANTS_BUCKET.get("sticker-tiles/c1734.png")` |

**Pass condition:**
- `resolveAssetUrl("c1734",{kind:"sticker-tile"}) === "/r2/sticker-tiles/c1734.png"`
- inline `tile.imageUrl` (e.g. tile B `https://cdn.example.com/preview/tile-b.jpg`) is preserved verbatim, never re-resolved.
- `resolveAssetCode` is removed from any `<img src>` site.

---

## 4. RC3 — Missing Asset

### 4.1 Input

- Tile with no `contentCode`, no `assetCode`, no `contentUrl` (fixture tile slot 3 — `"Tile C (missing asset)"`).

### 4.2 Server-side path (shared)

| Step | File | Line | Behaviour |
|------|------|------|-----------|
| Fallback id | `apps/product-shell/functions/_lib/runtime-schema.js` | 117–121 | Generates `EC-003` for `id` field; emits no `assetCode`, no `imageUrl` |
| Carry through | `runtime-compiler.js` | 112–114 | Tile passes through with `imageUrl: null`, no `assetCode` |

### 4.3 Baseline (incidentally OK) client-side

| Step | File | Line | Behaviour |
|------|------|------|-----------|
| Hydrate | `exclusiveTileHydration.ts` | 119–122 | `tile.imageUrl` is null AND `tile.assetCode` is undefined → short-circuit to `null` |
| Render | `ExclusivePage.tsx` | — | Renders the locked-state placeholder for the slot; no `<img src>` issued |

**Result:** missing-asset is benign in the baseline because the resolver
chain short-circuits before producing a bad URL. This is the only case
that does not regress visibly today.

### 4.4 Expected unified (regression guard)

| Requirement | Reason |
|-------------|--------|
| `resolveAssetUrl(undefined,{kind:"sticker-tile"}) === null` | Must not synthesise a URL from a slug or fallback string |
| `resolveAssetUrl("",{kind:"wallpaper"}) === null` | Empty string must be treated as missing input |
| `resolveAssetUrl("not-an-asset-code",{kind:"sticker-tile"}) === null` | Invalid prefix/format must NOT produce a 404-bound URL; the locked placeholder is the contract |
| Render | Locked placeholder remains; no network request issued for the missing tile |

**Pass condition:** the unified contract must preserve the benign baseline
behaviour. A regression that begins synthesising `/r2/sticker-tiles/<slug>.png`
or `/r2/sticker-tiles/EC-003.png` for a missing asset is a PATCH condition.

---

## 5. RC4 — Worker-Fronted Bucket Fetch

### 5.1 Subject

The network leg that serves the URL produced by RC1/RC2. This is where the
operator-belief recorded in `cloudflare_runtime_notes.md` §3 (Topology T4
hybrid: Worker fronts asset bytes, Pages Functions handle JSON) becomes
load-bearing.

### 5.2 Baseline (today's network leg)

| Component | Reference | Behaviour |
|-----------|-----------|-----------|
| Request URL | RC1 baseline | `/wallpapers/acme-premium.png` |
| Served by | Cloudflare Pages static handler | Looks under `apps/product-shell/public/wallpapers/...` |
| Object existence | repo audit | No `apps/product-shell/public/wallpapers/acme-premium.png`. Only `w91.png`, `w92.png`, `w99.png` exist directly under `public/` (cloudflare_runtime_notes.md §2.4) |
| Response | Pages | 404 (or SPA catch-all `/* /index.html 200` masks the missing asset for non-image MIME contexts; for `<img>` tags the image fails to load) |
| Visible effect | AppShell `/w99.png` repaints as default | Operator sees no premium wallpaper for any tenant |

**Result:** R2 is never consulted on the wallpaper path; the failure is
silently masked by the AppShell default.

### 5.3 Expected unified network leg

| Component | Reference | Behaviour |
|-----------|-----------|-----------|
| Request URL | RC1/RC2 expected | `/r2/wallpapers/w91.png`, `/r2/sticker-tiles/c1734.png` |
| Routed by | Cloudflare Worker route on `/r2/*` (worker-fronted bucket access) | Decomposes path `/r2/<folder>/<file>` into key `<folder>/<file>` |
| Binding consumed | `TENANTS_BUCKET` (worker-side) | Same logical R2 bucket the Pages Functions consume; binding NAME must match in worker dashboard metadata (recorded as U7 in `cloudflare_runtime_notes.md` §6) |
| Lookup | `TENANTS_BUCKET.get("wallpapers/w91.png")` / `TENANTS_BUCKET.get("sticker-tiles/c1734.png")` | Single object read |
| Success response | Worker | `200 image/png` with body = R2 object bytes; cache headers per worker policy |
| Failure response | Worker | `404 application/json` with body `{ ok:false, error:"asset not found", details:{ key:"<folder>/<file>" } }` — deterministic, not masked by Pages static |
| Pages interaction | none | `_redirects` SPA catch-all does not match `/r2/*` because the Worker route precedes Pages SPA fallback; this ordering must be re-verified per `cloudflare_runtime_notes.md` §3.4 |

### 5.4 Pass conditions for RC4

1. A repo-declared Worker config (forthcoming `apps/product-shell/wrangler.toml` from S5) declares the `/r2/*` route and the `TENANTS_BUCKET` binding.
2. The Worker source either lives in-repo or is named in `cloudflare_binding_map.md` (S5) with U6/U7 resolved.
3. `resolveAssetUrl` produces URLs that target the `/r2/*` route — not `/wallpapers/*`, not `/assets/*`, not the bucket-direct R2 custom domain (which would bypass the unified contract).
4. A 404 from the Worker route returns the documented JSON body so failures are observable instead of masked by AppShell `/w99.png`.

---

## 6. Cross-case invariants

| # | Invariant | Why |
|---|-----------|-----|
| I1 | One `resolveAssetUrl` function exists in the client tree; `resolveAssetCode`, `resolveStaticAsset`, and `resolveWallpaper` are deleted or rewired to call it. | S3 pass condition: "one resolver contract exists in writing and in code". |
| I2 | The `slug` is never substituted into an asset URL. | Baseline RC1 fault is precisely that — the slug is mistaken for the asset code. |
| I3 | Server emits bare codes (`w91`, `c1734`); client converts to URL exactly once. | Keeps R2 key shape and CDN URL shape decoupled; matches the bucket layout in `cloudflare_runtime_notes.md` §4.2. |
| I4 | Inline `imageUrl` / `contentUrl` on a tile is preserved verbatim. | Allows out-of-bucket previews (e.g. external CDN) without round-tripping through the resolver. |
| I5 | Missing input → `null`. | Preserves the benign RC3 baseline; prevents a regression that synthesises 404-bound URLs. |
| I6 | The premium receiver dispatch (S2) consumes the resolved URL via the `DesktopPremiumShell` `.dpv1Wallpaper` layer. | Closes the renderer + resolver loop documented in `runtime_parity_matrix.md` §1–§2. |

---

## 7. How to run this matrix against a build

For each row in §1, with the fixture in `/job_site/known_slug_test_vector.json`:

1. Load the fixture's `bucket_inputs.primary_demo.json` into the bucket bound
   to `DEMO_BUCKET` for slug `acme-premium`, key `json/acme-premium/site.json`.
2. Issue `GET /api/published-page?slug=acme-premium&page=tier-2`.
3. Assert response matches `compiler_output.payload` (modulo the
   `mobile.blocks` field, which is computed deterministically by
   `compileMobileBlocks` and is out of scope for the resolver matrix).
4. In the client, call `resolveAssetUrl` against each row's `input_code` with
   the row's `kind`. Assert the result equals the row's `expected_unified`
   computed value (or `null` for RC3).
5. For RC4, issue an actual `GET` against the resolved URL and assert
   200 image/png on success and the documented JSON 404 body on miss.

A row is PASS only when (3), (4), and — for RC1/RC2/RC4 — (5) all hold.
RC3 is PASS when (4) returns `null` and the rendered page issues no
network request for the missing tile.

---

## 8. Patch conditions (matrix-side)

| Trigger | Why it is a PATCH |
|---------|-------------------|
| `resolveWallpaper.ts` still calls `resolveStaticAsset` with `slug` | RC1 baseline fault still primary |
| Any `<img src={resolveAssetCode(...)} />` site remains | RC2 baseline fault still primary |
| Resolver synthesises a URL when input is empty/invalid | I5 / RC3 regression |
| Resolver targets a path that bypasses the Worker route (e.g. raw R2 custom domain) | I3 / RC4 contract violation |
| Server payload `result.wallpaper` is changed from a code to a URL | I3 violation; also breaks the agreed contract that emission stays code-shaped |
| `_redirects` rewrites `/r2/*` to `/index.html` | RC4 routing violation; SPA catch-all would shadow the Worker route |

Each PATCH trigger above is verifiable from the in-repo evidence cited in
the matching case section.
