import { useState, useEffect } from "react";
import { programAPI, uploadAPI } from "../../utils/api.js";

const defaultForm = {
  title: "",
  subtitle: "",
  description: "",
  images: "[]",
  order: 1,
  active: true,
};

export default function CMSProgram() {
  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageList, setImageList] = useState([]);

  const load = () => programAPI.getAllAdmin().then(setPrograms).catch(() => {});
  useEffect(() => { load(); }, []);

  const showMsg = (text) => { setMsg(text); setTimeout(() => setMsg(""), 3000); };

  const handleEdit = (p) => {
    setEditId(p.id);
    setForm({ ...defaultForm, ...p });
    try {
      setImageList(JSON.parse(p.images || "[]"));
    } catch {
      setImageList([]);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus program ini?")) return;
    await programAPI.delete(id);
    showMsg("Program dihapus");
    load();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadAPI.upload(file, 'program');
      const newList = [...imageList, res.url];
      setImageList(newList);
      setForm((f) => ({ ...f, images: JSON.stringify(newList) }));
      showMsg("Gambar berhasil diupload");
    } catch (err) {
      showMsg("Upload gagal: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newList = imageList.filter((_, i) => i !== index);
    setImageList(newList);
    setForm((f) => ({ ...f, images: JSON.stringify(newList) }));
  };

  const addImageUrl = () => {
    const url = prompt("Masukkan URL gambar:");
    if (url) {
      const newList = [...imageList, url];
      setImageList(newList);
      setForm((f) => ({ ...f, images: JSON.stringify(newList) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...form,
        images: JSON.stringify(imageList),
        order: Number(form.order),
        active: Boolean(form.active),
      };
      if (editId) {
        await programAPI.update(editId, data);
        showMsg("Program berhasil diupdate!");
      } else {
        await programAPI.create(data);
        showMsg("Program berhasil ditambahkan!");
      }
      setForm(defaultForm);
      setImageList([]);
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
          {editId ? "Edit Program" : "Tambah Program Baru"}
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
                placeholder="PECABA 2025"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <input
                type="text"
                value={form.subtitle || ""}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="Pelantikan Calon Bantara"
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
              rows={4}
              placeholder="Deskripsi program..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 resize-none"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gambar Program <span className="text-gray-400 font-normal">(bisa lebih dari 1)</span>
            </label>
            <div className="flex gap-2 mb-3">
              <label className="cursor-pointer px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-medium transition-colors border border-green-200">
                {uploading ? "Uploading..." : "📷 Upload Gambar"}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              <button
                type="button"
                onClick={addImageUrl}
                className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-200"
              >
                🔗 Tambah URL
              </button>
            </div>
            {imageList.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {imageList.map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} alt="" className="w-24 h-16 object-cover rounded-lg border border-gray-200" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
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
                id="programActive"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="w-4 h-4 accent-green-500"
              />
              <label htmlFor="programActive" className="text-sm font-medium text-gray-700">Aktif</label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : editId ? "Update Program" : "Tambah Program"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => { setEditId(null); setForm(defaultForm); setImageList([]); }}
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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Daftar Program ({programs.length})</h2>
        {programs.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">Belum ada program.</p>
        ) : (
          <div className="space-y-3">
            {programs.map((p) => {
              let imgs = [];
              try { imgs = JSON.parse(p.images || "[]"); } catch { imgs = []; }
              return (
                <div key={p.id} className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
                  {imgs[0] && (
                    <img src={imgs[0]} alt="" className="w-20 h-14 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 text-sm">{p.title}</h3>
                      {p.subtitle && <span className="text-xs text-gray-500">— {p.subtitle}</span>}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${p.active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                        {p.active ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{p.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{imgs.length} gambar</p>
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
