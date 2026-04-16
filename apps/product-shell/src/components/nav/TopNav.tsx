import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { routes } from "../../app/routes";
import { usePayMeCart } from "../../state/paymeCartState";
import { AuthModal } from "./AuthModal";

export function TopNav() {
  const { toggle: togglePayMe, open: payMeOpen } = usePayMeCart();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <nav className="topNav">
      <div className="topNavInner">
        <Link to="/" className="brand">
          <svg
            className="brandMark"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <defs>
              <linearGradient id="bm-page-blue" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#60a5fa" />
                <stop offset="1" stopColor="#1d4ed8" />
              </linearGradient>
              <linearGradient id="bm-page-green" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#5eead4" />
                <stop offset="1" stopColor="#0d9488" />
              </linearGradient>
            </defs>
            <rect x="4" y="6" width="22" height="28" rx="3" fill="url(#bm-page-green)" opacity="0.95" />
            <rect x="4" y="6" width="22" height="28" rx="3" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="1" />
            <rect x="14" y="6" width="22" height="28" rx="3" fill="url(#bm-page-blue)" />
            <rect x="14" y="6" width="22" height="28" rx="3" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="1" />
            <path d="M18 14h14M18 19h14M18 24h10" stroke="rgba(255,255,255,.85)" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <div className="brandText">
            <div className="brandTitle brandTitleDesktop">Biz Pages</div>
            <div className="brandTitle brandTitleMobile">Biz Pages</div>
          </div>
        </Link>

        <div className="navLinks">
          {routes.map((r) => (
            <NavLink
              key={r.key}
              to={r.path}
              end={r.path === "/"}
              className={({ isActive }) =>
                "navLink" + (isActive ? " active" : "")
              }
            >
              {r.label}
            </NavLink>
          ))}
        </div>

        <div className="topNavRight">
          <button type="button" className="loginTextBtn" onClick={() => setAuthOpen(true)}>
            Login
          </button>
          <button
            type="button"
            className={"cartIconBtn" + (payMeOpen ? " active" : "")}
            aria-label="Toggle PayMe panel"
            aria-pressed={payMeOpen}
            onClick={togglePayMe}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </button>
        </div>
      </div>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </nav>
  );
}
