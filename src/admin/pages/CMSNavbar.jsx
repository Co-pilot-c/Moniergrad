import { useState, useEffect } from "react";
import { settingsAPI, uploadAPI } from "../../utils/api.js";

const API_BASE = import.meta.env.VITE_API_URL || 'https://scout-moniergrad.vercel.app';
const getToken = () => localStorage.getItem('cms_token');

// ─── Navigation API (inline karena tidak ada di utils/api.js) ─────────────────
const navAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/api/navigation`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.json();
  },
  create: async (data) => {
    const res = await fetch(`${API_BASE}/api/navigation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  update: async (id, data) => {
    const res = await fetch(`${API_BASE}/api/navigation/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  delete: async (id) => {
    await fetch(`${API_BASE}/api/navigation/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` }
    });
  }
};

const defaultForm = { label: "", url: "", order: 1, active: true };

export default function CMSNavbar() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "success" });

  // Logo state
  const [logoUrl, setLogoUrl] = useState("");
  const [logoLoading, setLogoLoading] = useState(false);
  const [logoSaving, setLogoSaving] = useState(false);

  const load = () => navAPI.getAll().then(setItems).catch(() => {});

  useEffect(() => {
    load();
    // Load logo dari settings
    settingsAPI.get().then((s) => {
      if (s?.logoUrl) setLogoUrl(s.logoUrl);
    }).catch(() => {});
  }, []);

  const showMsg = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "success" }), 3000);
  };

  // ─── Logo handlers ──────────────────────────────────────────────────────────
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoLoading(true);
    try {
      const res = await uploadAPI.upload(file, 'general');
      setLogoUrl(res.url);
      showMsg("Logo berhasil diupload! Klik Simpan Logo untuk menyimpan.");
    } catch (err) {
      showMsg("Upload gagal: " + err.message, "error");
    } finally {
      setLogoLoading(false);
    }
  };

  const handleLogoSave = async () => {
    setLogoSaving(true);
    try {
      const current = await settingsAPI.get();
      await settingsAPI.update({ ...current, logoUrl });
      showMsg("Logo berhasil disimpan!");
    } catch (err) {
      showMsg("Gagal menyimpan logo: " + err.message, "error");
    } finally {
      setLogoSaving(false);
    }
  };

  // ─── Nav item handlers ───────────────────────────────────────────────────────
  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({ label: item.label, url: item.url, order: item.order, active: item.active });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus item navbar ini?")) return;
    await navAPI.delete(id);
    showMsg("Item dihapus");
    load();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...form, order: Number(form.order), active: Boolean(form.active) };
      if (editId) {
        await navAPI.update(editId, data);
        showMsg("Item berhasil diupdate!");
      } else {
        await navAPI.create(data);
        showMsg("Item berhasil ditambahkan!");
      }
      setForm(defaultForm);
      setEditId(null);
      load();
    } catch (err) {
      showMsg("Error: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const msgBg = msg.type === "error"
    ? "bg-red-50 border-red-200 text-red-700"
    : "bg-green-50 border-green-200 text-green-700";

  return (
    <div className="space-y-5">

      {/* Toast message */}
      {msg.text && (
        <div className={`px-4 py-3 border rounded-xl text-sm font-medium ${msgBg}`}>
          {msg.text}
        </div>
      )}

      {/* ── LOGO SECTION ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-5 bg-green-500 rounded-full" />
          <h2 className="text-base font-semibold text-gray-900">Logo Navbar</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Preview */}
          <div className="flex-shrink-0">
            <p className="text-xs text-gray-500 mb-2 font-medium">Preview</p>
            <div className="w-32 h-20 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="max-w-full max-h-full object-contain p-2" />
              ) : (
                <div className="text-center">
                  <svg className="w-8 h-8 text-gray-300 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs text-gray-400">Belum ada logo</p>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex-1 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">URL Logo</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://... atau upload gambar"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 bg-white"
                />
                <label className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex-shrink-0 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {logoLoading ? "Uploading..." : "Upload"}
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">Rekomendasi: PNG transparan, ukuran 200×60px</p>
            </div>

            <button
              onClick={handleLogoSave}
              disabled={logoSaving || !logoUrl}
              className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {logoSaving ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Menyimpan...
                </>
              ) : "Simpan Logo"}
            </button>
          </div>
        </div>
      </div>

      {/* ── MENU ITEMS FORM ───────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-5 bg-green-500 rounded-full" />
          <h2 className="text-base font-semibold text-gray-900">
            {editId ? "Edit Item Menu" : "Tambah Item Menu"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Label *</label>
              <input
                type="text"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                required
                placeholder="Home, About, Program..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">URL / Link *</label>
              <input
                type="text"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                required
                placeholder="#home, #about, /profile..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Urutan</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
                min={1}
                className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer mt-5">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="w-4 h-4 accent-green-500 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Aktif</span>
            </label>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : editId ? "Update Item" : "Tambah Item"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => { setEditId(null); setForm(defaultForm); }}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-sm transition-colors"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ── MENU ITEMS LIST ───────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-green-500 rounded-full" />
            <h2 className="text-base font-semibold text-gray-900">Daftar Menu</h2>
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
            {items.length} item
          </span>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-10">
            <svg className="w-10 h-10 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h8" />
            </svg>
            <p className="text-gray-400 text-sm">Belum ada item menu. Tambahkan di atas.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {[...items].sort((a, b) => a.order - b.order).map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all"
              >
                {/* Order badge */}
                <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                  {item.order}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900 text-sm">{item.label}</span>
                  <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-0.5 rounded">{item.url}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    item.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {item.active ? "Aktif" : "Nonaktif"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
