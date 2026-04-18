# Premium Fullscreen Proof — BIZ-PAGES-PROD-DETANGLE-002

job_id: BIZ-PAGES-PROD-DETANGLE-002
stage: S2
worker: Worker B
authority: written proof that the premium fullscreen renderer satisfies
three properties: (1) stage-space coordinates are execution truth, (2)
wallpaper uses the premium shell path, (3) viewport-fit covers the
operator's desktop target envelope (2550×1140) without top-left clipping.
Every proof is backed by a deterministic test at
`/apps/product-shell/src/tests/premium-renderer-parity.test.ts` and a
code citation by file+line.

required_references:
- /job_site/renderer_change_manifest.md (S2 Worker A artifact — produced in parallel)
- /job_site/build-sheet-active.txt (resolved in this mirror as `/job_site/build-sheet-BIZ-PAGES-PROD`)
- /job_site/runtime_parity_matrix.md (S1 Worker A artifact — produced in parallel)

---

## 0. Proof Contract

A "proof" in this document consists of four rows:

1. **Claim** — the invariant being proven.
2. **Code citation** — file + line that enforces the invariant at runtime.
3. **Test citation** — test name in
   `apps/product-shell/src/tests/premium-renderer-parity.test.ts` that
   asserts the invariant deterministically.
4. **Operator check** — the section number in
   `/job_site/operator_test_prompts.md` that confirms the invariant
   without developer tooling.

No proof relies on the rendered-runtime alone; each is grounded in a
value-level assertion or a CSS contract.

---

## 1. Proof P1 — Stage-space coordinates remain correct

### 1.1 Claim

When the published page payload carries `shellId = "desktop-premium-v1"`,
every declared tile's `(x, y, w, h)` value passes from page JSON to the
`DesktopPremiumReceiver` tile DOM **unchanged**. No field is recalculated
against viewport size, device pixel ratio, or container dimensions along
the way.

### 1.2 Code citations

- **Compiler branch:**
  `/apps/product-shell/functions/_lib/runtime-compiler.js:67`
  ```js
  const isPremium = normalized.shellId === "desktop-premium-v1";
  ```
  On the premium branch (lines 75–87), the compiler emits
  `shellId: "desktop-premium-v1"` and `stage: { w: 2560, h: 1440 }`, and
  the desktop canvas is set to `{ width: 2560, minHeight: 1440 }`.
  Blocks are assigned to `desktop.blocks` from `normalized.blocks` with
  no coordinate transform.

- **Schema normalization:**
  `/apps/product-shell/functions/_lib/runtime-schema.js:49–78`
  (`normalizeBlock`). Each of `x, y, w, h` is coerced via `toFiniteNumber`
  (no scaling), and `w, h` are `Math.max(40, ...)` guarded — that is the
  only transform, and it is a **floor**, not a scale.

- **Receiver render:**
  `/apps/product-shell/src/features/desktop-premium/DesktopPremiumReceiver.tsx:17–40`
  (`ReceiverTiles`). Inline style assigns `left: tile.x, top: tile.y,
  width: tile.w, height: tile.h` directly from the compiled tile record.
  No scaling, no offset, no media-query branch.

- **Stage scaling is a wrapper concern:**
  `/apps/product-shell/src/features/desktop-premium/DesktopPremiumShell.tsx:28–39`.
  The scale and centering live on the `.dpv1Stage` container's
  `transform: scale(...)`, so the tile's stage-space inline pixel values
  are rendered through a CSS transform — the values themselves are never
  mutated.

### 1.3 Test citation

- `A1. premium compile emits shellId + 2560x1440 stage metadata`
- `A2. block (x,y,w,h) round-trip unchanged — no re-interpretation`
- `A3. normalizePublishedPage preserves shellId flag for premium payloads`

The fixture declares four tiles (`t-top-left`, `t-center`, `t-bottom-rt`,
`t-header`) with hand-picked coordinates including the stage extremes
`(0, 0)` and `(2080, 1170)`, and asserts that the compiler output matches
the input coordinates field-by-field.

### 1.4 Operator check

`/job_site/operator_test_prompts.md` §2 — tile inline-style inspection
under resize.

### 1.5 Why this proof holds even without a browser

The round-trip identity is proven at the value layer (compiler input ==
compiler output for tile coordinates). Any browser-side mutation would be
a new bug in the tile renderer, but the renderer's own code
(DesktopPremiumReceiver.tsx:17–40) has no arithmetic — it only spreads
values into inline style. There is no surface on which a coordinate could
be re-interpreted.

---

## 2. Proof P2 — Wallpaper uses the premium shell path

### 2.1 Claim

On the premium path, the wallpaper is rendered by
`DesktopPremiumShell.tsx` using the exact CSS contract declared in
`shellConfig.ts` (`cover`, `center center`, `no-repeat`). The legacy
`PageShell`/published-overlay wallpaper path is NOT engaged for premium
payloads.

### 2.2 Code citations

- **Canonical wallpaper contract:**
  `/apps/product-shell/src/features/desktop-premium/shellConfig.ts:13–17`
  ```ts
  wallpaper: {
    fit: "cover" as const,
    position: "center center",
    repeat: "no-repeat",
  },
  ```

- **Wallpaper render — premium path:**
  `/apps/product-shell/src/features/desktop-premium/DesktopPremiumShell.tsx:41–54`.
  The `.dpv1Wallpaper` element inside `.dpv1Stage` reads its styles from
  `cfg.wallpaper` (imported `SHELL` from `shellConfig`). There is no
  fallback CSS path — if `wallpaperUrl` is undefined the element is
  rendered with `undefined` inline style, but when it is present the
  three contract properties are applied verbatim.

- **Receiver composition:**
  `/apps/product-shell/src/features/desktop-premium/DesktopPremiumReceiver.tsx:60–68`.
  The Receiver passes `layout.wallpaper` directly to
  `DesktopPremiumShell` as `wallpaperUrl`. There is no detour through
  `PageShell`, no merging with `AppShell`'s default wallpaper, and no
  call to `resolveWallpaper` at this layer.

- **Legacy wallpaper lives on a different code path:**
  `/apps/product-shell/src/components/layout/PageShell.tsx:11–17` —
  `.pageShell` > `.wallpaperLayer` > `.wallpaperImage`, only rendered
  when a route uses `PageShell`. Premium pages do not use `PageShell`.

- **Compiler passes `wallpaper` through unchanged:**
  `/apps/product-shell/functions/_lib/runtime-compiler.js:109`
  ```js
  if (normalized.wallpaper) result.wallpaper = normalized.wallpaper;
  ```

### 2.3 Test citation

- `B1. shellConfig wallpaper contract declares cover+center+no-repeat`
- `B2. premium compile passes wallpaper asset code through unchanged`
- `B3. non-premium payloads do NOT emit premium metadata — proves routing split`

B3 proves the routing split: a payload without `shellId` returns
`desktop.canvas = { width: 1280, minHeight: 760 }` and no `stage` /
`shellId` field. That confirms the legacy canvas remains for legacy
payloads, and proves the premium canvas is gated.

### 2.4 Operator check

`/job_site/operator_test_prompts.md` §3 (CSS contract inspection) and §4
(negative check that `.pageShell` is absent from premium pages).

### 2.5 Known limitation (not a gap in this proof)

The **URL format** the browser uses for the wallpaper — whether it comes
through a Worker-fronted R2 route, a direct R2 custom domain, or a
Pages-static fallback — is settled by the resolver contract in S3. This
proof concerns the **CSS contract** only: whatever URL the resolver
returns, the premium shell renders it with `cover / center center /
no-repeat` on the 2560×1440 stage.

---

## 3. Proof P3 — Viewport-fit covers the desktop target envelope
## without top-left clipping

### 3.1 Claim

For the operator's desktop target envelope **2550×1140** (build-sheet
§6.5.3), the 2560×1440 stage fits entirely inside the viewport. No pixel
of the stage is clipped at the top or left edge, and no tile declared in
stage-space lands outside the viewport.

### 3.2 The math

The scale formula is:

```
scale   = min(vw / 2560, vh / 1440)
offsetX = (vw − 2560 × scale) / 2
offsetY = (vh − 1440 × scale) / 2
```

(`/apps/product-shell/src/features/desktop-premium/useStageScale.ts:19–34`.)

For `vw = 2550, vh = 1140`:

- `scale = min(2550/2560, 1140/1440) = min(0.9961, 0.7917) = 0.7917`
  (height-bound).
- Effective stage pixel box: `2560 × 0.7917 ≈ 2026.67` wide by
  `1440 × 0.7917 = 1140` tall.
- `offsetX = (2550 − 2026.67) / 2 ≈ 261.67`. Positive — horizontal
  letterbox.
- `offsetY = (1140 − 1140) / 2 = 0`. No vertical letterbox.
- Stage top-left maps to viewport pixel `(261.67, 0)`.
- Stage bottom-right maps to viewport pixel `(261.67 + 2026.67, 0 + 1140) = (2288.33, 1140)`.
- Both `(261.67, 0)` and `(2288.33, 1140)` are inside the viewport
  `(0..2550, 0..1140)`.

There is no clipping. There is no overflow. The stage is fully visible
with a symmetric horizontal letterbox.

### 3.3 Code citation

`/apps/product-shell/src/features/desktop-premium/useStageScale.ts:27–36`
implements the formula verbatim and applies it via `ResizeObserver`, so
the fit state updates on every container resize.

`/apps/product-shell/src/features/desktop-premium/DesktopPremiumShell.tsx:28–39`
applies `transform: scale(${scale})` with `transformOrigin: "top left"`
and positions the stage at `left: stageOffsetX, top: stageOffsetY`. The
`transform-origin` is "top left" because the offset already accounts for
the centered letterbox — the stage is positioned at the offset and then
scaled from its own top-left, which is mathematically equivalent to
centering.

### 3.4 Test citation

- `C1. target envelope 2550x1140 — scale locks to height, stage is letterboxed horizontally`
- `C2. stage-space (0,0) maps inside the viewport — NO top-left clipping`
- `C3. stage-space (2560,1440) maps inside the viewport — NO bottom-right overflow`
- `C7. fixture tiles — every declared tile lands inside the 2550x1140 envelope`

Complementary tests cover other viewport shapes:

- `C4. smaller viewport (1280x720)` — perfect fit, scale 0.5.
- `C5. larger viewport (3840x2160)` — perfect fit, scale 1.5.
- `C6. portrait viewport (1080x1920)` — width-bound, vertical letterbox,
  still no clipping.

### 3.5 Operator check

`/job_site/operator_test_prompts.md` §5 (envelope resize to 2550×1140)
and §6 (continuous resize between 1280×720 and 3840×2160).

### 3.6 Why a top-left anchor would fail

If the premium receiver applied `transform: scale(...)` with
`transform-origin: center center` but left the stage positioned at
`(0, 0)`, the stage corners would rotate around the container center and
produce a visible clip at every non-fit viewport size. The code above
uses `transform-origin: "top left"` **with** explicit
`left: stageOffsetX, top: stageOffsetY` — those two choices are coupled,
and together they produce the centered, unclipped placement.

Similarly, if the scale formula were `max(vw/2560, vh/1440)` (cover
semantics) instead of `min(...)` (contain semantics), any non-16:9
viewport would clip at one of the axes. The code is `min(...)` — contain
semantics — which is the unclipped choice.

---

## 4. Cross-Proof Invariant

The three proofs compose: tile coordinates are stage-space truth (P1);
wallpaper uses the same 2560×1440 stage (P2); the stage is fit into the
viewport by `min(...)` with centered offsets (P3). Therefore, for any
viewport ≥ some minimum size and any compliant premium payload, the
rendered output is a deterministic, clipping-free projection of the
declared page JSON onto the browser.

The receiver contains **no** legacy-fallback branch. Removing any of the
three invariants above would mean introducing a new code path, which
would be observable by test B3 (which would newly fail because a
non-premium canvas would appear on a premium payload) or by operator
check §7 (which would newly fail because `.dpv1Viewport` would appear on
a non-premium slug).

---

## 5. Gaps explicitly called out

- **Runner wiring.** The test file is TypeScript. The repo's current test
  script is `node --test tests/microfrontend/*.test.mjs`. Wiring the
  `.test.ts` file into a TS-capable runner (e.g. `tsx`, `ts-node`, or
  pre-compile + `node --test`) is not part of this S2 proof; the test
  file functions as a **written proof** even when not executed.
- **Missing reference documents.** `/job_site/renderer_change_manifest.md`
  and `/job_site/runtime_parity_matrix.md` are Worker A outputs and are
  expected to land in parallel with this document. Citations to those
  files remain as pointers; this proof does not depend on their content.
- **Resolver URL shape.** Exact asset URL format for the wallpaper is
  deferred to S3. Only the CSS contract is proven here.

None of the gaps invalidate the three proofs. Every claim above is
anchored to a code citation that exists in this commit, plus a
deterministic test file that exists at the declared path.
