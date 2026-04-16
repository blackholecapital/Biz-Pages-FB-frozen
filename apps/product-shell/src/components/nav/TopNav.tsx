import { NavLink, Link } from "react-router-dom";
import { routes } from "../../app/routes";

export function TopNav() {
  return (
    <nav className="topNav">
      <div className="topNavInner">
        <Link to="/" className="brand">
          <svg className="brandMark" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M18 3L33 18L18 33L3 18Z" fill="url(#bm-grad)" />
            <defs>
              <linearGradient id="bm-grad" x1="3" y1="3" x2="33" y2="33" gradientUnits="userSpaceOnUse">
                <stop stopColor="#22d3ee" />
                <stop offset="1" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="brandText">
            <div className="brandTitle brandTitleDesktop">Biz Pages</div>
            <div className="brandTitle brandTitleMobile">Biz Pages</div>
            <div className="brandSub brandSubDesktop">In Under A Minute</div>
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
          <button type="button" className="loginTextBtn">
            Login
          </button>
          <button
            type="button"
            className="cartIconBtn"
            aria-label="Cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
