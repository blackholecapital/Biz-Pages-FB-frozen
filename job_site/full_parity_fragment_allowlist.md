# Full Parity Fragment Allowlist — RB-INT-CHASSIS-002

job_id: RB-INT-CHASSIS-002
stage: S3
pass: partial — modules/engage ONLY
owner: Worker B
authority: non-authoritative — derived from `/job_site/missing_surface_matrix.yaml` §module_packages and `/job_site/full_parity_target_path_manifest.yaml` §SECTION 7 (modules/engage)
baseline_reference: gatweay-production-FREEZE-main (baseline_source declared in target path manifest)
current_tree_reference: gateway-fullbody-freeze repo continuation target
document_role: Declare the exact copy-fragment allowlist for modules/engage deploy-critical files so that S3 execution can write files with known-safe copy rules. Other modules (payme, referrals, vault) are not covered in this pass.

---

## 0. Pass Scope

This allowlist covers **only** `modules/engage` deploy-critical files as declared in `/job_site/full_parity_target_path_manifest.yaml` §SECTION 7. Specifically:

- `apps/modules/engage/package.json`
- `apps/modules/engage/package-lock.json`
- `apps/modules/engage/vite.config.js`
- `apps/modules/engage/index.html`
- `apps/modules/engage/src/main.jsx`
- `apps/modules/engage/src/App.jsx`
- `apps/modules/engage/src/` (full subtree — 37 files per missing_surface_matrix.yaml)
- `apps/modules/engage/public/_redirects`

Explicitly **out of scope** for this pass:

- `modules/payme/*`, `modules/referrals/*`, `modules/vault/*` — deferred to later S3 worker_b sub-passes
- `modules/engage/supabase_schema.sql` — `deploy_critical: no` per missing_surface_matrix.yaml §module_packages
- `modules/vault/Vault.MktMaker-main/` — `deploy_critical: no`
- `modules/blueprint/module-boundary-list.md` — `deploy_critical: no`
- any file outside the `modules/engage/` baseline subtree
- any admin app, product-shell app-root surface, chassis package, runtime-support, resolver-boundary, or test surface

The copy rules below apply to the engage files only. When payme, referrals, and vault are dispatched in later sub-passes, a new allowlist section must be appended; this document does not authorize copies for those modules.

---

## 1. Chassis-Native Mapping Rule (engage only)

| Baseline path | Chassis-native target path |
|---|---|
| `modules/engage/` | `apps/modules/engage/` |

Rule: every baseline path of the form `modules/engage/<rel>` maps to chassis-native target `apps/modules/engage/<rel>` with `<rel>` preserved exactly. This mapping preserves the baseline relative reference `../modules/engage` declared in `apps/product-shell/package.json` `build:engage` script, since `../modules/engage` relative to `apps/product-shell/` resolves to `apps/modules/engage/` under this rule.

---

## 2. Copy Rule (general)

A fragment from `modules/engage/` may be copied into its chassis-native target only when ALL of the following conditions are satisfied:

1. The baseline row exists in `/job_site/missing_surface_matrix.yaml` §module_packages with `deploy_critical: yes`.
2. The target path is declared in `/job_site/full_parity_target_path_manifest.yaml` §SECTION 7 (engage rows).
3. The fragment imports no external package that is not already declared by the baseline `modules/engage/package.json` dependencies/devDependencies (no invented dependency is introduced at copy time).
4. The fragment contains no reference to a file outside the `modules/engage/` subtree other than via npm module specifiers (bare-name imports resolved through `node_modules`).
5. The fragment introduces no cross-module import path — engage MUST NOT import from `modules/payme`, `modules/referrals`, `modules/vault`, or `product-shell` at source level.
6. The fragment introduces no import path into `packages/*`, `apps/*` (other than its own `apps/modules/engage/` subtree), `xyz-factory-system/*`, `worker-wb/*`, or `job_site/*`.

If any condition above fails, the fragment is NOT copied; the execution worker returns PATCH to Foreman A with the exact violating condition.

---

## 3. Allowed Fragments by File Class (engage)

Each class below names a specific baseline file or baseline subtree and the exact copy rule that applies to it.

### 3.1 Package Manifest — `modules/engage/package.json`

- **Copy kind:** verbatim file copy, bit-for-bit.
- **Target path:** `apps/modules/engage/package.json`.
- **Permitted content:** whatever baseline declares in `name`, `version`, `private`, `type`, `scripts`, `dependencies`, `devDependencies`, `peerDependencies`, `engines`.
- **Forbidden modifications:**
  - Do NOT rewrite `name` to a chassis name. Baseline name is authoritative.
  - Do NOT inject a `workspaces` field. The module is an isolated install unit under `apps/product-shell/package.json` `build:engage` script.
  - Do NOT inject a dependency on any chassis package (`packages/*`).
  - Do NOT remove or rename any baseline `scripts` entry. Baseline `build`/`dev`/`preview` are authoritative.
  - Do NOT change dependency version pins. Baseline versions are authoritative.
- **Authoritative source:** baseline `modules/engage/package.json`.
- **Verification:** byte-equal to baseline.

### 3.2 Lockfile — `modules/engage/package-lock.json`

- **Copy kind:** verbatim file copy, bit-for-bit.
- **Target path:** `apps/modules/engage/package-lock.json`.
- **Permitted content:** whatever baseline declares — dependency tree, integrity hashes, resolved URLs.
- **Forbidden modifications:**
  - Do NOT regenerate. Do NOT re-resolve. Do NOT `npm install` against a different registry.
  - Do NOT change `lockfileVersion`.
  - Do NOT substitute a `pnpm-lock.yaml` or `yarn.lock` variant.
- **Authoritative source:** baseline `modules/engage/package-lock.json`.
- **Verification:** byte-equal to baseline.

### 3.3 Vite Build Config — `modules/engage/vite.config.js`

- **Copy kind:** verbatim file copy, bit-for-bit.
- **Target path:** `apps/modules/engage/vite.config.js`.
- **Permitted content:** whatever baseline declares — plugins, resolve aliases, build options, server options, base path.
- **Forbidden modifications:**
  - Do NOT change `base` to anything other than baseline value.
  - Do NOT change `build.outDir`.
  - Do NOT inject a resolve alias to `packages/*` or `apps/product-shell/*`.
  - Do NOT inject a chassis package import.
  - Do NOT add or remove plugins.
- **Authoritative source:** baseline `modules/engage/vite.config.js`.
- **Verification:** byte-equal to baseline.

### 3.4 HTML Entrypoint — `modules/engage/index.html`

- **Copy kind:** verbatim file copy, bit-for-bit.
- **Target path:** `apps/modules/engage/index.html`.
- **Permitted content:** baseline HTML — doctype, `<html>`, `<head>`, `<body>`, `<div id="root">`, `<script type="module" src="/src/main.jsx">` (or whatever baseline script reference).
- **Forbidden modifications:**
  - Do NOT rewrite the script `src` attribute.
  - Do NOT rewrite `<link>` or `<meta>` tags.
  - Do NOT inject asset references that are not present in baseline.
  - Do NOT inject any comment referencing chassis path rewrites.
- **Authoritative source:** baseline `modules/engage/index.html`.
- **Verification:** byte-equal to baseline.

### 3.5 Script Entry — `modules/engage/src/main.jsx`

- **Copy kind:** verbatim file copy, bit-for-bit.
- **Target path:** `apps/modules/engage/src/main.jsx`.
- **Permitted content:** baseline React root bootstrap — `createRoot`/`ReactDOM.render`, `App` import, CSS imports.
- **Forbidden modifications:**
  - Do NOT rewrite any import specifier.
  - Do NOT inject a provider/wrapper not present in baseline.
  - Do NOT inject a chassis package import.
- **Authoritative source:** baseline `modules/engage/src/main.jsx`.
- **Verification:** byte-equal to baseline.

### 3.6 App Root Component — `modules/engage/src/App.jsx`

- **Copy kind:** verbatim file copy, bit-for-bit.
- **Target path:** `apps/modules/engage/src/App.jsx`.
- **Permitted content:** baseline top-level component — imports, layout, router mount, page composition.
- **Forbidden modifications:**
  - Do NOT rewrite any import specifier.
  - Do NOT restructure component tree.
  - Do NOT inject a chassis import.
  - Do NOT inject a provider for any state, auth, or theme system not present in baseline.
- **Authoritative source:** baseline `modules/engage/src/App.jsx`.
- **Verification:** byte-equal to baseline.

### 3.7 Full Source Subtree — `modules/engage/src/` (37 files)

- **Copy kind:** verbatim subtree copy.
- **Target path:** `apps/modules/engage/src/` with the baseline subtree layout preserved one-for-one.
- **Covered paths (per missing_surface_matrix.yaml §module_packages notes):**
  - `modules/engage/src/admin/**`
  - `modules/engage/src/components/**`
  - `modules/engage/src/lib/**`
  - `modules/engage/src/pages/**`
  - `modules/engage/src/styles/**`
  - plus `modules/engage/src/main.jsx` and `modules/engage/src/App.jsx` (already named in §3.5 and §3.6 but included in the subtree)
- **Copy mechanism:** recursive directory copy; every file under `modules/engage/src/` in the baseline archive is copied to the same relative path under `apps/modules/engage/src/`.
- **Permitted content:** whatever baseline declares at every nested path.
- **Forbidden modifications:**
  - Do NOT rename any file.
  - Do NOT restructure any directory.
  - Do NOT rewrite any relative import within the subtree.
  - Do NOT rewrite any npm package import.
  - Do NOT omit any file whose baseline path is under `modules/engage/src/**` (excluding files explicitly marked `deploy_critical: no` in the source matrix — none exist under `src/` for engage).
  - Do NOT add a file that does not exist in baseline.
- **Authoritative source:** baseline `modules/engage/src/` subtree.
- **Verification:** recursive byte-equal comparison against baseline archive; file count MUST equal baseline file count (37 per source matrix).

### 3.8 Static Redirects — `modules/engage/public/_redirects`

- **Copy kind:** verbatim file copy, bit-for-bit.
- **Target path:** `apps/modules/engage/public/_redirects`.
- **Permitted content:** whatever baseline declares — Cloudflare Pages redirect/rewrite rules for engage standalone serving.
- **Forbidden modifications:**
  - Do NOT rewrite any rule path.
  - Do NOT add an SPA fallback rule if baseline does not have one.
  - Do NOT remove an SPA fallback rule if baseline has one.
  - Do NOT merge this file with `apps/product-shell/public/_redirects`. The two files are independent per-project redirect declarations.
- **Authoritative source:** baseline `modules/engage/public/_redirects`.
- **Verification:** byte-equal to baseline.

---

## 4. Explicitly Blocked From Copy (engage pass)

The following items MUST NOT be copied from `modules/engage/` under any circumstances in this pass:

| # | Blocked item | Reason |
|---|---|---|
| B1 | `modules/engage/supabase_schema.sql` | `deploy_critical: no` per missing_surface_matrix.yaml; runtime_support only, not required for Cloudflare Pages build |
| B2 | any file outside `modules/engage/` baseline subtree | out of scope for this pass |
| B3 | any file under `modules/payme/`, `modules/referrals/`, `modules/vault/` | deferred to later S3 worker_b sub-passes |
| B4 | `modules/blueprint/module-boundary-list.md` | `deploy_critical: no`; module_docs only |
| B5 | hidden files `.DS_Store`, `.git*`, `*.swp`, `node_modules/**`, `dist/**`, `.vite/**`, `coverage/**` | not source-of-truth files; regenerated on install/build |
| B6 | any file with a filename matching an OS metadata pattern or editor temp pattern | not source-of-truth files |
| B7 | any file that does not exist in the baseline archive | no invention of new files is permitted |
| B8 | any chassis package import injection into engage files | engage is a standalone microfrontend with no chassis dependency per baseline |

---

## 5. Verification Requirements (per file)

Before declaring any engage copy PASS, the execution worker MUST verify:

1. The target path exactly matches the chassis-native mapping in §1 and the declaration in `/job_site/full_parity_target_path_manifest.yaml` §SECTION 7.
2. The file byte-content equals the baseline byte-content (verified by byte-level comparison against the baseline archive or the declared `source_ref` URL).
3. The file imports are unchanged from baseline.
4. No forbidden modification listed in §3 has been applied.
5. For subtree copies (§3.7), the file count at the target matches the baseline file count (37 for engage `src/`).
6. For the package manifest (§3.1), no dependency or script has been added, removed, or renamed.
7. For the lockfile (§3.2), the file is identical to baseline including `lockfileVersion`.

---

## 6. Cross-Reference Lock

Every allowlisted fragment in this document MUST correspond to exactly one row in `/job_site/full_parity_target_path_manifest.yaml` §SECTION 7 (engage rows) and exactly one row in `/job_site/missing_surface_matrix.yaml` §module_packages with `deploy_critical: yes`. If any fragment in this allowlist lacks a corresponding row, return PATCH. If any engage row in SECTION 7 lacks a corresponding fragment in this allowlist, return PATCH.

Matrix:

| Allowlist §  | Target path                                       | Manifest row (SECTION 7)                                  | Source matrix row (§module_packages) |
|---|---|---|---|
| 3.1 | `apps/modules/engage/package.json`               | `modules/engage/package.json` → `apps/modules/engage/package.json` | `modules/engage/package.json` (deploy_critical: yes) |
| 3.2 | `apps/modules/engage/package-lock.json`          | `modules/engage/package-lock.json` → `apps/modules/engage/package-lock.json` | `modules/engage/package-lock.json` (deploy_critical: yes) |
| 3.3 | `apps/modules/engage/vite.config.js`             | `modules/engage/vite.config.js` → `apps/modules/engage/vite.config.js` | `modules/engage/vite.config.js` (deploy_critical: yes) |
| 3.4 | `apps/modules/engage/index.html`                 | `modules/engage/index.html` → `apps/modules/engage/index.html` | `modules/engage/index.html` (deploy_critical: yes) |
| 3.5 | `apps/modules/engage/src/main.jsx`               | `modules/engage/src/main.jsx` → `apps/modules/engage/src/main.jsx` | `modules/engage/src/main.jsx` (deploy_critical: yes) |
| 3.6 | `apps/modules/engage/src/App.jsx`                | `modules/engage/src/App.jsx` → `apps/modules/engage/src/App.jsx` | `modules/engage/src/App.jsx` (deploy_critical: yes) |
| 3.7 | `apps/modules/engage/src/` (full tree)           | `modules/engage/src/ (full tree)` → `apps/modules/engage/src/ (full subtree)` | `modules/engage/src/ (full tree)` (deploy_critical: yes) |
| 3.8 | `apps/modules/engage/public/_redirects`          | `modules/engage/public/_redirects` → `apps/modules/engage/public/_redirects` | `modules/engage/public/_redirects` (deploy_critical: yes) |

---

## 7. Checksum Pointers for Foreman B

- Every section §3.x corresponds to exactly one baseline file or subtree declared `deploy_critical: yes` in `/job_site/missing_surface_matrix.yaml` §module_packages for `modules/engage/`.
- Every blocked item §4.Bx is either explicitly `deploy_critical: no` in the source matrix, out of the engage subtree, or a non-source-of-truth file type.
- No fragment in this document authorizes a copy that introduces a chassis package dependency, a cross-module import, or a path rewrite. Byte-equal verbatim copies only.
- Modules payme, referrals, and vault are not covered by any section in this document. Any attempt to copy from those modules under this allowlist MUST return PATCH to Foreman A.
- The allowlist is closed: no fragment outside §3 is permitted.
