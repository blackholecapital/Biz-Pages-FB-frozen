import { bad, json, sanitize } from "../_lib/runtime-schema.js";
import { objectExists, readBucketJson } from "../_lib/runtime-r2.js";

const PAGES = ["home", "members", "access", "tier-2"];
const DEMO_PAGE_KEY = {
  home: "gate",
  members: "members",
  access: "access",
  "tier-2": "tier-2"
};

export async function onRequestGet({ request, env }) {
  if (!env?.TENANTS_BUCKET) return bad("Missing TENANTS_BUCKET binding", 500);

  const url = new URL(request.url);
  const slug = sanitize(url.searchParams.get("slug"));
  if (!slug) return bad("Missing slug", 400);

  const pages = {};
  const demoKey = `json/${slug}/site.json`;
  let demoBundle = null;

  if (env?.DEMO_BUCKET) {
    try {
      demoBundle = await readBucketJson(env.DEMO_BUCKET, demoKey);
    } catch {
      demoBundle = null;
    }
  }

  for (const page of PAGES) {
    const demoPageName = DEMO_PAGE_KEY[page];
    const hasDemoPage = Boolean(demoBundle?.json?.pages?.[demoPageName]);
    if (hasDemoPage) {
      pages[page] = {
        mode: "published-page",
        key: demoKey
      };
      continue;
    }

    const publishedKey = `tenants/${slug}/${page}.json`;
    const legacyKey = `${slug}.json`;

    const hasPublishedPage = await objectExists(env.TENANTS_BUCKET, publishedKey);
    pages[page] = {
      mode: hasPublishedPage ? "published-page" : "legacy-bundle",
      key: hasPublishedPage ? publishedKey : legacyKey
    };
  }

  return json({
    ok: true,
    version: 2,
    slug,
    pages,
    mobile: {
      editableNamespace: "src/mobile",
      notes: "Mobile overlay layout is isolated into dedicated files for separate tuning."
    }
  });
}
