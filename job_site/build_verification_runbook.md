# Build Verification Runbook — RB-INT-CHASSIS-002

job_id: RB-INT-CHASSIS-002
stage: S5 (build verification)
dispatched_as: S3 task header (operator dispatch — re-run after pages + payme updates)
worker: worker_a
authority: exact procedure for running install and build from the declared deploy root
references:
  - /job_site/deploy_root_plan.md
  - /job_site/pages_deployment_spec.md
  - /job_site/worker-execution-manual-v1.1.txt

---

## 1. Declared Deploy Root

Primary authority: `/job_site/deploy_root_plan.md` §1.

```
apps/product-shell
```

Absolute path on attached file system:

```
/home/user/gateway-fullbody-freeze/apps/product-shell
```

Note: `/job_site/pages_deployment_spec.md` §1 (as present on origin/main)
declares `deploy_root_path = / (repo root)`. This conflicts with
`/job_site/deploy_root_plan.md`. Per the S3 deploy_surface_change_manifest.md
§8.1 conflict resolution (target_path_manifest + foreman dispatch + deploy_root_plan
agree on `apps/product-shell`), this runbook uses `apps/product-shell` as the
declared deploy root. The pages_deployment_spec.md divergence is recorded here
for Foreman B adjudication but is not re-resolved by this step.

---

## 2. Environment

| item | value |
|---|---|
| node binary | `/opt/node22/bin/node` |
| node version | v22.22.2 |
| npm binary | `/opt/node22/bin/npm` |
| npm version | 10.9.7 |
| working directory | `/home/user/gateway-fullbody-freeze/apps/product-shell` |
| network | available (npm registry reachable during this run) |
| git branch | `claude/rebuild-product-shell-KIQNp` |

---

## 3. Procedure

### Step 1 — cd to declared deploy root

```
cd /home/user/gateway-fullbody-freeze/apps/product-shell
```

### Step 2 — install

Command:

```
npm install --no-audit --no-fund
```

Contract (per `/job_site/pages_deployment_spec.md` §2): install_command is
`npm install`, MUST run from the deploy root. `--no-audit --no-fund` are
non-semantic noise suppression flags that do not change the resolved package
graph.

### Step 3 — build (primary path)

Command:

```
npm run build
```

Contract (per `apps/product-shell/package.json` `scripts.build`): resolves to
`npm run build:engage && vite build`. `build:engage` resolves to
`npm --prefix ../modules/engage install --progress=false && npm --prefix ../modules/engage run build`
which requires a sibling `apps/modules/engage/` directory to exist.

### Step 3b — build (secondary probe, direct vite)

Command:

```
npx vite build
```

Run when Step 3 reaches the top-level `vite build` phase (i.e. `build:engage`
has already completed) and fails there, to surface the exact Rollup
module-graph resolution failure inside `apps/product-shell/src/` independent
of `build:engage` output noise. Also run if Step 3 fails before reaching
`vite build`, to probe the deploy app src graph directly.

### Step 4 — verify output directory

Expected output per `/job_site/pages_deployment_spec.md` §3:

```
apps/product-shell/dist
```

containing SPA HTML entry, bundled JS/CSS, hashed chunks, and the verbatim
copied contents of `apps/product-shell/public/*` including `_redirects`.

### Step 5 — cleanup (workstation hygiene)

Install artifacts are NOT committed to the repo. After verification:

```
rm -rf apps/product-shell/node_modules
rm -rf apps/product-shell/dist
rm -f  apps/product-shell/package-lock.json
rm -rf apps/modules/engage/node_modules
rm -rf apps/public
```

The `apps/public/` path is the engage build output location (resolved from
`apps/modules/engage/vite.config.js` relative to its own working directory);
it is untracked and must be removed after verification. Tracked files under
`apps/modules/engage/` and `apps/modules/payme/` are left untouched. If
`apps/product-shell/package-lock.json` does not exist at the start of the
step it is skipped silently; same for any other artifact not produced by
this run.

---

## 4. Pass/Fail Definition

| outcome | criterion |
|---|---|
| PASS | Step 2 exits 0, Step 3 exits 0, and Step 4 confirms non-empty `apps/product-shell/dist` with `index.html` and `_redirects` present. |
| FAIL (install) | Step 2 exits non-zero. |
| FAIL (engage) | Step 2 exits 0 but `build:engage` sub-step exits non-zero. |
| FAIL (vite) | `build:engage` completes but top-level `vite build` (apps/product-shell) exits non-zero. |
| FAIL (vite-direct) | Step 3b `npx vite build` exits non-zero at Rollup module-graph resolution. |
| FAIL (output) | Commands exit 0 but expected output artifacts are absent. |

Any FAIL case is recorded verbatim in `/job_site/build_verification_results.md`
including the exact error, the failing step, and the minimal reproduction
command.

---

## 5. Repo Mirror / Commit / Push

Per task dispatch: `repo_mirror_required: no`, `commit_required: no`,
`push_required: no`. This runbook and its results file are written to
`/job_site/` only. No repo writes under `apps/` are performed by this step.
Install artifacts (`node_modules/`, `package-lock.json`, `dist/`, engage
output under `apps/public/`) are local-only and are removed by Step 5.
