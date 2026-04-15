import { NavLink, Link } from "react-router-dom";
import { routes } from "../../app/routes";

export function TopNav() {
  return (
    <nav className="topNav">
      <div className="topNavInner">
        <Link to="/" className="brand">
          <div className="brandMark" aria-hidden />
          <div className="brandText">
            <div className="brandTitle brandTitleDesktop">Gateway</div>
            <div className="brandTitle brandTitleMobile">Gateway</div>
            <div className="brandSub brandSubDesktop">full-body freeze</div>
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
            ⋯
          </button>
        </div>
      </div>
    </nav>
  );
}
