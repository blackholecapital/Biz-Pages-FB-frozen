import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageShell } from "../components/layout/PageShell";

type RouteParams = { designation?: string; slug?: string };

type Tier = 1 | 2 | 3;

export function AccessPage() {
  const nav = useNavigate();
  const { designation, slug } = useParams<RouteParams>();

  const base = useMemo(() => {
    if (designation && slug) return `/${designation}/${slug}/gate`;
    if (slug) return `/${slug}/gate`;
    return "";
  }, [designation, slug]);

  const tierPath = (tier: Tier) => `${base}/access/tier-${tier}`;

  const tierLabel = (tier: Tier) => tier === 1 ? "Customer" : tier === 2 ? "Exclusive" : "Admin";

  return (
    <PageShell>
      <div className="accessLandingTop">
        <div className="accessTitleRow">
          <div className="accessControlPill">
            <svg className="accessControlCheck" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
            <span style={{ color: "#3B82F6" }}>Control user access levels in the admin area.</span>
          </div>

          <div className="pageHeader">Access Page</div>

          <div className="accessRightGroup">
            <div className="tierRowTop">
              {([1, 2, 3] as Tier[]).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  className="tierTopBtn unlocked"
                  onClick={() => nav(tierPath(tier))}
                >
                  <div className="tierTopTitle">
                    <svg className="tierLockIcon tierLockUnlocked" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 13c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6-5h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h2c0-1.66 1.34-3 3-3s3 1.34 3 3v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"/>
                    </svg>
                    <span>{tierLabel(tier)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
