import type { PublishedRuntimeManifest, PublishedRuntimePage } from "./types";

async function safeJson<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchPublishedRuntimePage(slug: string, page: string): Promise<PublishedRuntimePage | null> {
  const res = await fetch(`/api/published-page?slug=${encodeURIComponent(slug)}&page=${encodeURIComponent(page)}`);
  if (!res.ok) {
    console.warn("[gateway] published runtime page fetch failed", {
      slug,
      page,
      status: res.status
    });
    return null;
  }

  const data = await safeJson<PublishedRuntimePage>(res);
  if (!data?.ok) {
    console.warn("[gateway] published runtime page payload invalid", { slug, page, data });
    return null;
  }

  return data;
}

export async function fetchPublishedRuntimeManifest(slug: string): Promise<PublishedRuntimeManifest | null> {
  const res = await fetch(`/api/published-manifest?slug=${encodeURIComponent(slug)}`);
  if (!res.ok) {
    console.warn("[gateway] published runtime manifest fetch failed", {
      slug,
      status: res.status
    });
    return null;
  }

  const data = await safeJson<PublishedRuntimeManifest>(res);
  if (!data?.ok) {
    console.warn("[gateway] published runtime manifest payload invalid", { slug, data });
    return null;
  }

  return data;
}
