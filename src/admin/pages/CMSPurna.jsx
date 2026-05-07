import { useState, useEffect, useRef } from "react";
import { purnaAPI, uploadAPI } from "../../utils/api.js";

const defaultForm = {
  title: "",
  angkatan: "",
  profile: "",
  quotes: "",
  order: 1,
  active: true,
};

export default function CMSPurna() {
  const [purnas, setPurnas] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const formRef = useRef(null);

  const load = () => purnaAPI.getAllAdmin().then(setPurnas).catch(() => {});
  useEffect(() => { load(); }, []);

  const showMsg = (text) => { setMsg(text); setTimeout(() => setMsg(""), 3000); };

  const handleEdit = (p) => {
    setEditId(p.id);
    setForm({ ...defaultForm, ...p });
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus kata purna ini?")) return;
    await purnaAPI.delete(id); // backend otomatis hapus foto dari Cloudinary
    showMsg("Kata purna dihapus");
    load();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      if (form.profile && form.profile.includes('cloudinary')) {
        await uploadAPI.deleteMedia(form.profile).catch(() => {});
      }
      const res = await uploadAPI.upload(file, 'purna');
      setForm((f) => ({ ...f, profile: res.url }));
      showMsg("Foto berhasil diupload");
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
        await purnaAPI.update(editId, data);
        showMsg("Kata purna berhasil diupdate!");
      } else {
        await purnaAPI.create(data);
        showMsg("Kata purna berhasil ditambahkan!");
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
      <div ref={formRef} className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          {editId ? "Edit Kata Purna" : "Tambah Kata Purna Baru"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                placeholder="Nama alumni"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Angkatan *</label>
              <input
                type="text"
                value={form.angkatan}
                onChange={(e) => setForm({ ...form, angkatan: e.target.value })}
                required
                placeholder="Angkatan 51"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kutipan / Kata Purna *</label>
            <textarea
              value={form.quotes}
              onChange={(e) => setForm({ ...form, quotes: e.target.value })}
              required
              rows={4}
              placeholder="Kata-kata inspiratif dari alumni..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto Profil</label>
            <div className="flex gap-3 items-start">
              <input
                type="text"
                value={form.profile || ""}
                onChange={(e) => setForm({ ...form, profile: e.target.value })}
                placeholder="URL foto profil"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
              <label className="cursor-pointer px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                {uploading ? "Uploading..." : "Upload"}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            {form.profile && (
              <img src={form.profile} alt="preview" className="mt-2 w-16 h-16 rounded-full object-cover border-2 border-gray-200" />
            )}
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
                id="purnaActive"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="w-4 h-4 accent-green-500"
              />
              <label htmlFor="purnaActive" className="text-sm font-medium text-gray-700">Aktif</label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : editId ? "Update Kata Purna" : "Tambah Kata Purna"}
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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Daftar Kata Purna ({purnas.length})</h2>
        {purnas.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">Belum ada kata purna.</p>
        ) : (
          <div className="space-y-3">
            {purnas.map((p) => (
              <div key={p.id} className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
                {p.profile && (
                  <img src={p.profile} alt={p.title} className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-gray-100" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 text-sm">{p.title}</h3>
                    <span className="text-xs text-gray-500 italic">{p.angkatan}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                      {p.active ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 italic line-clamp-2">"{p.quotes}"</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(p)}
                    className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
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
