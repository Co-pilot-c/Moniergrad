import { useState, useEffect } from "react";
import { heroAPI, uploadAPI } from "../../utils/api.js";

const defaultForm = {
  title: "",
  subtitle: "",
  description: "",
  badgeText: "Welcome to Our Community",
  bgImage: "",
  btn1Text: "Jelajahi",
  btn1Link: "#about",
  btn2Text: "Anggota",
  btn2Link: "#strukture",
  order: 1,
  active: true,
};

export default function CMSHero() {
  const [heroes, setHeroes] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = () => heroAPI.getAllAdmin().then(setHeroes).catch(() => {});

  useEffect(() => { load(); }, []);

  const showMsg = (text) => { setMsg(text); setTimeout(() => setMsg(""), 3000); };

  const handleEdit = (hero) => {
    setEditId(hero.id);
    setForm({ ...defaultForm, ...hero });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus hero ini?")) return;
    await heroAPI.delete(id);
    showMsg("Hero dihapus");
    load();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadAPI.upload(file);
      setForm((f) => ({ ...f, bgImage: res.url }));
      showMsg("Gambar berhasil diupload");
    } catch (err) {
      showMsg("Upload gagal: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...form, order: Number(form.order), active: Boolean(form.active) };
      if (editId) {
        await heroAPI.update(editId, data);
        showMsg("Hero berhasil diupdate!");
      } else {
        await heroAPI.create(data);
        showMsg("Hero berhasil ditambahkan!");
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
        <div className="px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
          {msg}
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          {editId ? "Edit Hero" : "Tambah Hero Baru"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                placeholder="Dewan Ambalan Monierson & Gradison"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <input
                type="text"
                value={form.subtitle || ""}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="Selamat Datang"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={3}
              placeholder="Deskripsi singkat..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teks Badge</label>
            <input
              type="text"
              value={form.badgeText || ""}
              onChange={(e) => setForm({ ...form, badgeText: e.target.value })}
              placeholder="Welcome to Our Community"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Background Image</label>
            <div className="flex gap-3 items-start">
              <input
                type="text"
                value={form.bgImage || ""}
                onChange={(e) => setForm({ ...form, bgImage: e.target.value })}
                placeholder="URL gambar atau upload di bawah"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
              <label className="cursor-pointer px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                {uploading ? "Uploading..." : "Upload"}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            {form.bgImage && (
              <img src={form.bgImage} alt="preview" className="mt-2 h-20 rounded-lg object-cover" />
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tombol 1 Teks</label>
              <input
                type="text"
                value={form.btn1Text}
                onChange={(e) => setForm({ ...form, btn1Text: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tombol 1 Link</label>
              <input
                type="text"
                value={form.btn1Link}
                onChange={(e) => setForm({ ...form, btn1Link: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tombol 2 Teks</label>
              <input
                type="text"
                value={form.btn2Text}
                onChange={(e) => setForm({ ...form, btn2Text: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tombol 2 Link</label>
              <input
                type="text"
                value={form.btn2Link}
                onChange={(e) => setForm({ ...form, btn2Link: e.target.value })}
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
                id="active"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="w-4 h-4 accent-green-500"
              />
              <label htmlFor="active" className="text-sm font-medium text-gray-700">Aktif</label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : editId ? "Update Hero" : "Tambah Hero"}
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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Daftar Hero ({heroes.length})</h2>
        {heroes.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">Belum ada hero. Tambahkan di atas.</p>
        ) : (
          <div className="space-y-3">
            {heroes.map((hero) => (
              <div key={hero.id} className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
                {hero.bgImage && (
                  <img src={hero.bgImage} alt="" className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 text-sm truncate">{hero.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${hero.active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                      {hero.active ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{hero.description}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(hero)}
                    className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(hero.id)}
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
