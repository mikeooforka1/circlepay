import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MenuIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

const CloseIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const links = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const DEFAULT_AVATAR = "/assets/images/default-avatar.png";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const avatar =
    user?.avatar_url ||
    JSON.parse(localStorage.getItem("user") || "{}")?.avatar_url ||
    DEFAULT_AVATAR;

  const confirmLogout = () => {
  setLoggingOut(true);

  setTimeout(() => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setShowLogoutModal(false);
    setOpen(false);

    setLoggingOut(false);
    navigate("/login");
  }, 1000);
};

  return (
    <>
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
                  <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300 bg-clip-text text-transparent">
                    Circle
                  </span>
                  <span className="ml-1 bg-gradient-to-r from-yellow-500 to-yellow-400 bg-clip-text text-transparent">
                    Pay
                  </span>
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-6">
                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    className={({ isActive }) =>
                      `text-sm transition-colors font-semibold ${
                        isActive
                          ? "text-yellow-400"
                          : "text-yellow-200 hover:text-yellow-400"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}

                {!user && (
                  <Link
                    to="/login"
                    className="rounded-full px-4 py-2 text-sm font-semibold text-black bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300"
                  >
                    Start Banking
                  </Link>
                )}

                {user && (
                  <div className="flex items-center gap-3">
                    <Link to="/profile">
                      <img
                        src={avatar}
                        alt="profile"
                        className="w-11 h-11 rounded-full object-cover border-2 border-yellow-400 shadow-lg hover:scale-105 transition"
                      />
                    </Link>

                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="rounded-full px-4 py-2 text-sm font-semibold bg-yellow-700 text-white hover:bg-yellow-800 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </nav>

              <div className="flex items-center gap-2 md:hidden">
                {user && (
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                  >
                    <img
                      src={avatar}
                      alt="profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400"
                    />
                  </Link>
                )}

                <button
                  className="inline-flex items-center justify-center rounded-xl p-2 text-yellow-400"
                  onClick={() => setOpen((v) => !v)}
                >
                  {open ? <CloseIcon /> : <MenuIcon />}
                </button>
              </div>
            </div>

            {open && (
              <div className="md:hidden border-t border-yellow-400 px-4 pb-4 bg-black/95 rounded-b-2xl">
                <div className="flex flex-col gap-2 pt-2">
                  {links.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `rounded-xl px-3 py-2 text-sm font-semibold ${
                          isActive
                            ? "bg-yellow-900 text-yellow-400"
                            : "text-yellow-200 hover:bg-yellow-900"
                        }`
                      }
                    >
                      {l.label}
                    </NavLink>
                  ))}

                  {user && (
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="rounded-xl px-3 py-2 bg-yellow-700 text-white"
                    >
                      Logout
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center px-4">
          <div className="bg-slate-900 border border-yellow-400 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-white mb-2">
              Confirm Logout
            </h3>

            <p className="text-gray-300 mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2 rounded-xl bg-gray-700 text-white"
              >
                Cancel
              </button>

              <button
                onClick={confirmLogout}
                className="flex-1 py-2 rounded-xl bg-red-600 text-white"
              >
                Yes Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {loggingOut && (
        <div className="fixed inset-0 z-[120] bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-yellow-400 text-lg font-semibold">
              Logging out...
            </p>
          </div>
        </div>
      )}
    </>
  );
}