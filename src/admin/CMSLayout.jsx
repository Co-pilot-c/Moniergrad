import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { authAPI } from "../utils/api.js";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: "🏠", path: "/11.043-11.044" },
  { id: "hero", label: "Hero / Home", icon: "🖼️", path: "/11.043-11.044/hero" },
  { id: "about", label: "About & Visi Misi", icon: "📋", path: "/11.043-11.044/about" },
  { id: "stats", label: "Stats (Angka Hijau)", icon: "📊", path: "/11.043-11.044/stats" },
  { id: "angkatan", label: "Angkatan", icon: "🎓", path: "/11.043-11.044/angkatan" },
  { id: "program", label: "Program Kerja", icon: "📌", path: "/11.043-11.044/program" },
  { id: "purna", label: "Kata Purna", icon: "💬", path: "/11.043-11.044/purna" },
  { id: "cta", label: "CTA Section", icon: "🔔", path: "/11.043-11.044/cta" },
  { id: "footer", label: "Footer", icon: "📄", path: "/11.043-11.044/footer" },
  { id: "settings", label: "Pengaturan", icon: "⚙️", path: "/11.043-11.044/settings" },
];

export default function CMSLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [admin, setAdmin] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("cms_token");
    if (!token) {
      navigate("/11.043-11.044/login", { replace: true });
      return;
    }
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

  const isActive = (path) => {
    if (path === "/11.043-11.044") return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-30 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:transform-none flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center font-bold text-lg">
              DA
            </div>
            <div>
              <h1 className="font-bold text-sm">CMS Admin</h1>
              <p className="text-gray-400 text-xs">Dewan Ambalan</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-green-500/20 text-green-400 border border-green-500/20"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-white/10">
          {admin && (
            <div className="flex items-center gap-3 mb-3 px-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-sm">
                {admin.name?.charAt(0) || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{admin.name}</p>
                <p className="text-xs text-gray-400 truncate">{admin.username}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <span>🚪</span>
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h2 className="font-semibold text-gray-900">
                {menuItems.find((m) => isActive(m.path))?.label || "CMS"}
              </h2>
              <p className="text-xs text-gray-500">Kelola konten website</p>
            </div>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Lihat Website
          </a>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
