import { useState, useEffect } from "react";
import { settingsAPI, authAPI } from "../../utils/api.js";

export default function CMSSettings() {
  const [settings, setSettings] = useState({ siteTitle: "", siteDescription: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [pwMsg, setPwMsg] = useState("");

  useEffect(() => {
    settingsAPI.get().then((data) => { if (data) setSettings(data); }).catch(() => {});
  }, []);

  const showMsg = (text, setter) => { setter(text); setTimeout(() => setter(""), 3000); };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await settingsAPI.update(settings);
      showMsg("Pengaturan berhasil disimpan!", setMsg);
    } catch (err) {
      showMsg("Error: " + err.message, setMsg);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMsg("Password baru tidak cocok!", setPwMsg);
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showMsg("Password minimal 6 karakter!", setPwMsg);
      return;
    }
    setPwLoading(true);
    try {
      // Verifikasi password lama dengan login
      const admin = JSON.parse(localStorage.getItem("cms_admin") || "{}");
      await authAPI.login(admin.username, passwordForm.currentPassword);
      // Jika berhasil, update password (endpoint belum ada, tampilkan info)
      showMsg("Fitur ganti password akan segera tersedia.", setPwMsg);
    } catch (err) {
      showMsg("Password lama salah!", setPwMsg);
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Site Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Pengaturan Website</h2>
        {msg && (
          <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
            {msg}
          </div>
        )}
        <form onSubmit={handleSettingsSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Website</label>
            <input
              type="text"
              value={settings.siteTitle || ""}
              onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
              placeholder="Dewan Ambalan Monierson & Gradison"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Website</label>
            <textarea
              value={settings.siteDescription || ""}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              rows={3}
              placeholder="Website resmi Dewan Ambalan..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </form>
      </div>

      {/* Info Akun */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Informasi Akun</h2>
        {pwMsg && (
          <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-sm">
            {pwMsg}
          </div>
        )}
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600">
              <strong>Username:</strong> {JSON.parse(localStorage.getItem("cms_admin") || "{}").username || "-"}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Nama:</strong> {JSON.parse(localStorage.getItem("cms_admin") || "{}").name || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Info API */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Sistem</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>🔗 <strong>API URL:</strong> {import.meta.env.VITE_API_URL || "http://localhost:3000"}</p>
          <p>🔐 <strong>CMS URL:</strong> /11.043-11.044</p>
          <p>🔑 <strong>Login URL:</strong> /11.043-11.044/login</p>
          <p className="text-xs text-gray-400 mt-4">
            Halaman login tidak terdaftar di navigasi publik dan tidak dapat diakses dari website utama.
          </p>
        </div>
      </div>
    </div>
  );
}
