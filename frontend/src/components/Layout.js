import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/search", label: "Search" },
  { to: "/player", label: "Player" },
  { to: "/library", label: "Library" }
];

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <header>
        <h1>Unified Music MVP</h1>
        <nav>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? "nav-link nav-link-active" : "nav-link")}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
