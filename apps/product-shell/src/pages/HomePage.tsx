import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PageShell } from "../components/layout/PageShell";
import {
  fetchPublishedRuntimePage,
  selectWallpaperUrl,
} from "../runtime/publishedClient";
import { isPremiumRuntimePage, type PublishedRuntimePage } from "../runtime/types";

type RouteParams = { slug?: string; designation?: string };

export function HomePage() {
  const { slug } = useParams<RouteParams>();
  const [runtimePage, setRuntimePage] = useState<PublishedRuntimePage | null>(null);
  const [wallpaperUrl, setWallpaperUrl] = useState<string | null>(null);
  const [runtimeResolved, setRuntimeResolved] = useState<boolean>(!slug);
  const isPremiumRuntime = isPremiumRuntimePage(runtimePage);
  const isSlugRoute = Boolean(slug);
  const shouldDeferHomeShell = isSlugRoute && !runtimeResolved && !runtimePage;

  useEffect(() => {
    if (!slug) {
      setRuntimePage(null);
      setWallpaperUrl(null);
      setRuntimeResolved(true);
      return;
    }

    setRuntimeResolved(false);
    setRuntimePage(null);
    setWallpaperUrl(null);

    let cancelled = false;

    fetchPublishedRuntimePage(slug, "home").then(async (homePage) => {
      if (cancelled) return;

      let resolvedPage = homePage;

      // Premium slug runtime for the known fixture can live on `tier-2`.
      // If `home` is non-premium, probe `tier-2` and promote it only when
      // the payload carries the premium contract.
      if (!isPremiumRuntimePage(resolvedPage)) {
        const tier2Page = await fetchPublishedRuntimePage(slug, "tier-2");
        if (cancelled) return;
        if (isPremiumRuntimePage(tier2Page)) {
          resolvedPage = tier2Page;
        }
      }

      setRuntimePage(resolvedPage);
      setWallpaperUrl(selectWallpaperUrl(resolvedPage));
      setRuntimeResolved(true);
    });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (shouldDeferHomeShell) {
    return <div data-route-intent="published-slug" data-runtime-state="pending" aria-busy="true" />;
  }

  return (
    <PageShell runtimePage={runtimePage} wallpaperUrl={wallpaperUrl ?? undefined}>
      {isPremiumRuntime ? null : (
        <div className="homeHero">
          <h1 className="homeHeroTitle">Welcome Home</h1>
        </div>
      )}
    </PageShell>
  );
}
