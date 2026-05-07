import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { authAPI } from "../utils/api.js";

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const Icons = {
  dashboard: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  hero: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 9h18" strokeLinecap="round" />
    </svg>
  ),
  navbar: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="M4 6h16M4 12h8" strokeLinecap="round" />
      <rect x="14" y="9" width="6" height="6" rx="1" />
    </svg>
  ),
  about: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
    </svg>
  ),
  stats: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="M4 20V14m4 6V10m4 10V6m4 14V12" strokeLinecap="round" />
    </svg>
  ),
  angkatan: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  program: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6m-6 4h4" strokeLinecap="round" />
    </svg>
  ),
  purna: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  cta: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  footer: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="M4 6h16M4 12h16M4 18h7" strokeLinecap="round" />
    </svg>
  ),
  settings: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  logout: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  external: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  menu: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  ),
  close: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
    </svg>
  ),
};

const menuItems = [
  { id: "dashboard", label: "Dashboard",        icon: Icons.dashboard, path: "/11.043-11.044" },
  { id: "hero",      label: "Hero / Home",       icon: Icons.hero,      path: "/11.043-11.044/hero" },
  { id: "navbar",    label: "Navbar",            icon: Icons.navbar,    path: "/11.043-11.044/navbar" },
  { id: "about",     label: "About & Visi Misi", icon: Icons.about,     path: "/11.043-11.044/about" },
  { id: "stats",     label: "Stats",             icon: Icons.stats,     path: "/11.043-11.044/stats" },
  { id: "angkatan",  label: "Angkatan",          icon: Icons.angkatan,  path: "/11.043-11.044/angkatan" },
  { id: "program",   label: "Program Kerja",     icon: Icons.program,   path: "/11.043-11.044/program" },
  { id: "purna",     label: "Kata Purna",        icon: Icons.purna,     path: "/11.043-11.044/purna" },
  { id: "cta",       label: "CTA Section",       icon: Icons.cta,       path: "/11.043-11.044/cta" },
  { id: "footer",    label: "Footer",            icon: Icons.footer,    path: "/11.043-11.044/footer" },
  { id: "settings",  label: "Pengaturan",        icon: Icons.settings,  path: "/11.043-11.044/settings" },
];

export default function CMSLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [admin, setAdmin] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("cms_token");
    if (!token) { navigate("/11.043-11.044/login", { replace: true }); return; }
    authAPI.me()
      .then((data) => setAdmin(data))
      .catch(() => {
        localStorage.removeItem("cms_token");
        localStorage.removeItem("cms_admin");
        navigate("/11.043-11.044/login", { replace: true });
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("cms_token");
    localStorage.removeItem("cms_admin");
    navigate("/11.043-11.044/login", { replace: true });
  };

  const isActive = (path) =>
    path === "/11.043-11.044"
      ? location.pathname === path
      : location.pathname.startsWith(path);

  const activeLabel = menuItems.find((m) => isActive(m.path))?.label || "CMS";

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ══════════════════════════════════════════
          SIDEBAR — scrolls with page, not fixed
      ══════════════════════════════════════════ */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-60 z-30 flex flex-col
          bg-white border-r border-gray-200
          transform transition-transform duration-300
          lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0
          ${sidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"}
        `}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
              DA
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-gray-900 leading-tight">CMS Admin</p>
              <p className="text-xs text-gray-400">Dewan Ambalan</p>
            </div>
          </div>
          {/* Close button mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
          >
            {Icons.close}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-150 group
                ${isActive(item.path)
                  ? "bg-green-50 text-green-700 border border-green-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              <span className={`flex-shrink-0 transition-colors ${isActive(item.path) ? "text-green-600" : "text-gray-400 group-hover:text-gray-600"}`}>
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
              {isActive(item.path) && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
              )}
            </Link>
          ))}
        </nav>

        {/* User info + Logout */}
        <div className="px-3 py-3 border-t border-gray-100 space-y-1">
          {admin && (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
                {admin.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">{admin.name}</p>
                <p className="text-xs text-gray-400 truncate">{admin.username}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-150"
          >
            <span className="flex-shrink-0">{Icons.logout}</span>
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar — NOT sticky, scrolls with page */}
        <header className="
          bg-white border-b border-gray-200
          px-5 py-3.5
          flex items-center justify-between
          shadow-sm
        ">
          <div className="flex items-center gap-3">
            {/* Hamburger mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
            >
              {Icons.menu}
            </button>

            {/* Breadcrumb */}
            <div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-0.5">
                <span>CMS</span>
                <span>/</span>
                <span className="text-gray-600 font-medium">{activeLabel}</span>
              </div>
              <h1 className="font-semibold text-gray-900 text-sm leading-tight">{activeLabel}</h1>
            </div>
          </div>

          {/* Right actions */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
              text-gray-600 hover:text-green-700
              bg-gray-50 hover:bg-green-50
              border border-gray-200 hover:border-green-200
              transition-all duration-150
            "
          >
            {Icons.external}
            <span>Lihat Website</span>
          </a>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
