import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL || 'https://scout-moniergrad.vercel.app';
const getToken = () => localStorage.getItem('cms_token');

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
  const [msg, setMsg] = useState("");

  const load = () => navAPI.getAll().then(setItems).catch(() => {});
  useEffect(() => { load(); }, []);

  const showMsg = (t) => { setMsg(t); setTimeout(() => setMsg(""), 3000); };

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
      showMsg("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {msg && (
        <div className="px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">{msg}</div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
        <strong>ℹ️ Navbar</strong> — Kelola item menu navigasi yang tampil di website.
        Perubahan akan langsung terlihat setelah halaman di-refresh.
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          {editId ? "Edit Item Navbar" : "Tambah Item Navbar"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label *</label>
              <input
                type="text"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                required
                placeholder="Home, About, Program..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL / Link *</label>
              <input
                type="text"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                required
                placeholder="#home, #about, /profile..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
                min={1}
                className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
            </div>
            <div className="flex items-center gap-2 mt-5">
              <input
                type="checkbox"
                id="navActive"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="w-4 h-4 accent-green-500"
              />
              <label htmlFor="navActive" className="text-sm font-medium text-gray-700">Aktif</label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : editId ? "Update Item" : "Tambah Item"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => { setEditId(null); setForm(defaultForm); }}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-sm transition-colors"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Daftar Item Navbar ({items.length})</h2>
        {items.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">Belum ada item navbar. Tambahkan di atas.</p>
        ) : (
          <div className="space-y-2">
            {items.sort((a, b) => a.order - b.order).map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:border-gray-200">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                  {item.order}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 text-sm">{item.label}</span>
                    <span className="text-xs text-gray-400">→ {item.url}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                      {item.active ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1.5 text-xs bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
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
