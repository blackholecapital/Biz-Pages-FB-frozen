// Minimal entrypoint stub — modules/payme
//
// This file is a deliberate non-baseline stub created by the S3 worker_b
// payme minimal-unblock pass (PATCH-RB002-014) to satisfy the "minimal
// entrypoint required to satisfy dependency resolution" expected artifact
// declared by the S3 re-dispatch. It is NOT a copy of the baseline
// `modules/payme/src/main.jsx` — the baseline entry imports from
// `./App.jsx`, `./services/usdcTransfer.js`, and `./styles/global.css`,
// all of which belong to the full 30-file src/ subtree and are explicitly
// out of scope for this minimal-unblock pass.
//
// The full baseline `src/` subtree remains deferred and tracked as
// PATCH-RB002-014 in `/job_site/patch_register.md`. A subsequent S3
// worker_b full-reconstruction pass against
// `/job_site/full_parity_fragment_allowlist.md` §8 will replace this stub
// with the baseline `src/main.jsx` and populate the remainder of the
// subtree.

export const paymeModuleStub = {
  name: "usdc.xyz-labs.xyz",
  status: "stub",
  reason: "S3 worker_b minimal-unblock pass; full subtree deferred to later S3 reconstruction",
};

export default paymeModuleStub;
