import { useState, useEffect, useRef } from "react";
import { statsAPI } from "../../utils/api.js";

const defaultForm = {
  value: "",
  suffix: "",
  label: "",
  isText: false,
  order: 1,
  active: true,
  section: "about",
};

export default function CMSStats() {
  const [stats, setStats] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const formRef = useRef(null);

  const load = () => statsAPI.getAll().then(setStats).catch(() => {});
  useEffect(() => { load(); }, []);

  const showMsg = (text) => { setMsg(text); setTimeout(() => setMsg(""), 3000); };

  const handleEdit = (stat) => {
    setEditId(stat.id);
    setForm({ ...defaultForm, ...stat });
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus stat ini?")) return;
    await statsAPI.delete(id);
    showMsg("Stat dihapus");
    load();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...form, order: Number(form.order), active: Boolean(form.active), isText: Boolean(form.isText) };
      if (editId) {
        await statsAPI.update(editId, data);
        showMsg("Stat berhasil diupdate!");
      } else {
        await statsAPI.create(data);
        showMsg("Stat berhasil ditambahkan!");
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

  const aboutStats = stats.filter((s) => s.section === "about");
  const programStats = stats.filter((s) => s.section === "program");

  return (
    <div className="space-y-6">
      {msg && (
        <div className="px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
          {msg}
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
        <strong>ℹ️ Tentang Stats:</strong> Stats adalah angka/teks hijau yang muncul di section About dan Program.
        Aktifkan <strong>"Tampilkan sebagai Teks"</strong> jika value bukan angka (misal: "Aktif", "Nasional", dll).
        Jika dinonaktifkan, value akan dianimasikan sebagai counter angka.
      </div>

      {/* Form */}
      <div ref={formRef} className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          {editId ? "Edit Stat" : "Tambah Stat Baru"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value * <span className="text-gray-400 font-normal">(angka atau teks)</span>
              </label>
              <input
                type="text"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                required
                placeholder="120 atau Aktif"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Suffix <span className="text-gray-400 font-normal">(opsional: +, K, %, K+)</span>
              </label>
              <input
                type="text"
                value={form.suffix}
                onChange={(e) => setForm({ ...form, suffix: e.target.value })}
                placeholder="+ atau K atau %"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label *</label>
              <input
                type="text"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                required
                placeholder="Active, Users, Growth..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
              <select
                value={form.section}
                onChange={(e) => setForm({ ...form, section: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              >
                <option value="about">About</option>
                <option value="program">Program</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
                min={1}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isText"
                checked={form.isText}
                onChange={(e) => setForm({ ...form, isText: e.target.checked })}
                className="w-4 h-4 accent-green-500"
              />
              <label htmlFor="isText" className="text-sm font-medium text-gray-700">
                Tampilkan sebagai Teks (bukan counter angka)
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="statActive"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="w-4 h-4 accent-green-500"
              />
              <label htmlFor="statActive" className="text-sm font-medium text-gray-700">Aktif</label>
            </div>
          </div>

          {/* Preview */}
          {form.value && (
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-2">Preview:</p>
              <div className="inline-block text-center">
                <p className="text-3xl font-bold text-green-600">
                  {form.value}{form.suffix}
                </p>
                <p className="text-sm text-gray-600">{form.label}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : editId ? "Update Stat" : "Tambah Stat"}
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

      {/* Stats List */}
      {[
        { title: "Stats Section About", data: aboutStats },
        { title: "Stats Section Program", data: programStats },
      ].map(({ title, data }) => (
        <div key={title} className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{title} ({data.length})</h2>
          {data.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">Belum ada stat.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {data.map((stat) => (
                <div key={stat.id} className={`p-4 rounded-xl border ${stat.active ? "border-green-100 bg-green-50/50" : "border-gray-100 bg-gray-50 opacity-60"}`}>
                  <div className="text-center mb-3">
                    <p className="text-2xl font-bold text-green-600">
                      {stat.value}{stat.suffix}
                    </p>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                    {stat.isText && <span className="text-xs text-blue-500">teks</span>}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(stat)}
                      className="flex-1 py-1 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(stat.id)}
                      className="flex-1 py-1 text-xs bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
