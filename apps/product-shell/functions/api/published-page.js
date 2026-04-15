import { bad, json, sanitize, assertRuntimeParams } from "../_lib/runtime-schema.js";
import { compileRuntimePage, mapLegacyBundleToPage, normalizePublishedPage } from "../_lib/runtime-compiler.js";
import { readBucketJson } from "../_lib/runtime-r2.js";

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
  const page = sanitize(url.searchParams.get("page"));

  const validation = assertRuntimeParams(slug, page);
  if (!validation.ok) return bad(validation.error, validation.status);

  const demoPageName = DEMO_PAGE_KEY[page];
  const demoKey = `json/${slug}/site.json`;

  try {
    if (env?.DEMO_BUCKET && demoPageName) {
      const demoBundle = await readBucketJson(env.DEMO_BUCKET, demoKey);
      const rawDemoPage = demoBundle?.json?.pages?.[demoPageName];
      if (rawDemoPage) {
        const normalizedDemo = normalizePublishedPage(page, rawDemoPage);
        if (!normalizedDemo || (!normalizedDemo.blocks.length && !normalizedDemo.exclusiveTiles?.length)) {
          return bad("Demo page JSON is invalid or empty", 500, { slug, page, key: demoKey, demoPageName });
        }

        return json(
          compileRuntimePage(page, normalizedDemo, {
            mode: "published-page",
            key: demoKey
          }, { slug }),
          200,
          { "x-runtime-source": demoKey }
        );
      }
    }

    const pageKey = `tenants/${slug}/${page}.json`;
    const pageFile = await readBucketJson(env.TENANTS_BUCKET, pageKey);
    if (pageFile) {
      const normalized = normalizePublishedPage(page, pageFile.json);
      if (!normalized || (!normalized.blocks.length && !normalized.exclusiveTiles?.length)) {
        return bad("Published page JSON is invalid or empty", 500, { slug, page, key: pageKey });
      }
      return json(
        compileRuntimePage(page, normalized, {
          mode: "published-page",
          key: pageKey
        }, { slug }),
        200,
        { "x-runtime-source": pageKey }
      );
    }

    const legacyKey = `${slug}.json`;
    const legacy = await readBucketJson(env.TENANTS_BUCKET, legacyKey);
    if (!legacy) return bad("Tenant page not found", 404, { slug, page });

    const mapped = mapLegacyBundleToPage(legacy.json, page);
    if (!mapped || !mapped.blocks.length) {
      return bad("Legacy bundle did not produce a renderable page", 404, { slug, page, key: legacyKey });
    }

    return json(
      compileRuntimePage(page, mapped, {
        mode: "legacy-bundle",
        key: legacyKey
      }, { slug }),
      200,
      { "x-runtime-source": legacyKey }
    );
  } catch (error) {
    return bad("Failed to compile runtime page", 500, {
      slug,
      page,
      message: error instanceof Error ? error.message : String(error)
    });
  }
}
