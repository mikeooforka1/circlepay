import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MenuIcon = ({size=22}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
);
const CloseIcon = ({size=22}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
);

const UserIcon = ({size=28}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
  </svg>
);

const links = [
  { to: "/", label: "Home" },
  { to: "/sectors", label: "Sectors" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-4 rounded-2xl border border-yellow-400 bg-black/90 shadow-lg backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-3">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/assets/images/site-logo.png"
                alt="CirclePay logo"
                className="h-8 w-8 rounded-full ring-1 ring-yellow-400/30"
              />
              <span className="text-lg font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300 bg-clip-text text-transparent">Circle</span>
                <span className="ml-1 bg-gradient-to-r from-yellow-500 to-yellow-400 bg-clip-text text-transparent">Pay</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              {links.map(l => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `text-sm transition-colors font-semibold ${isActive ? "text-yellow-400" : "text-yellow-200 hover:text-yellow-400"}`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              {!user && (
                <Link
                  to="/login"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-black bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300 shadow-lg hover:shadow-xl transition-shadow"
                >
                  Start Banking
                </Link>
              )}
              {user && (
                <div className="flex items-center gap-3">
                  <Link
                    to="/profile"
                    className="rounded-full bg-yellow-400 text-black hover:bg-yellow-500 transition flex items-center justify-center"
                    style={{ width: 40, height: 40 }}
                    title="Profile"
                  >
                    <UserIcon size={24} />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="rounded-full px-4 py-2 text-sm font-semibold bg-yellow-700 text-white hover:bg-yellow-800 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </nav>

            {/* Mobile: user icon beside hamburger */}
            <div className="flex items-center gap-2 md:hidden">
              {user && (
                <Link
                  to="/profile"
                  className="rounded-full bg-yellow-400 text-black hover:bg-yellow-500 transition flex items-center justify-center"
                  style={{ width: 38, height: 38 }}
                  title="Profile"
                  onClick={() => setOpen(false)}
                >
                  <UserIcon size={22} />
                </Link>
              )}
              <button
                className="inline-flex items-center justify-center rounded-xl p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900"
                aria-label="Open menu"
                onClick={() => setOpen(v => !v)}
              >
                {open ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
              </button>
            </div>
          </div>

          {open && (
            <div className="md:hidden border-t border-yellow-400 px-4 pb-4 bg-black/95 rounded-b-2xl">
              <div className="flex flex-col gap-2 pt-2">
                {links.map(l => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `rounded-xl px-3 py-2 text-sm font-semibold ${isActive ? "bg-yellow-900 text-yellow-400" : "text-yellow-200 hover:text-yellow-400 hover:bg-yellow-900"}`
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
                {!user && (
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-2 text-center text-sm font-semibold text-black bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300"
                  >
                    Start Banking
                  </Link>
                )}
                {user && (
                  <>
                    <button
                      onClick={handleLogout}
                      className="rounded-xl px-3 py-2 text-center text-sm font-semibold bg-yellow-700 text-white hover:bg-yellow-800"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
