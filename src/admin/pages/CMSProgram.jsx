import { useState, useEffect, useRef } from "react";
import { programAPI, uploadAPI } from "../../utils/api.js";

const defaultForm = {
  title: "",
  subtitle: "",
  description: "",
  images: "[]",
  stats: "[]",
  order: 1,
  active: true,
};

const defaultStatItem = { value: "", suffix: "", label: "", isText: false };

export default function CMSProgram() {
  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "success" });
  const [uploading, setUploading] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [statsList, setStatsList] = useState([]);
  const formRef = useRef(null);

  const load = () => programAPI.getAllAdmin().then(setPrograms).catch(() => {});
  useEffect(() => { load(); }, []);

  const showMsg = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "success" }), 3000);
  };

  const handleEdit = (p) => {
    setEditId(p.id);
    setForm({ ...defaultForm, ...p });
    try { setImageList(JSON.parse(p.images || "[]")); } catch { setImageList([]); }
    try { setStatsList(JSON.parse(p.stats || "[]")); } catch { setStatsList([]); }
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus program ini?")) return;
    await programAPI.delete(id);
    showMsg("Program dihapus");
    load();
  };

  // ── Image handlers ──────────────────────────────────────────────────────────
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
      showMsg("Upload gagal: " + err.message, "error");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const url = imageList[index];
    if (url && url.includes('cloudinary')) uploadAPI.deleteMedia(url).catch(() => {});
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

  // ── Stats handlers ──────────────────────────────────────────────────────────
  const addStat = () => setStatsList([...statsList, { ...defaultStatItem }]);

  const removeStat = (i) => setStatsList(statsList.filter((_, idx) => idx !== i));

  const updateStat = (i, field, val) => {
    const updated = [...statsList];
    updated[i] = { ...updated[i], [field]: val };
    setStatsList(updated);
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...form,
        images: JSON.stringify(imageList),
        stats: JSON.stringify(statsList),
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
      setStatsList([]);
      setEditId(null);
      load();
    } catch (err) {
      showMsg("Error: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const msgClass = msg.type === "error"
    ? "bg-red-50 border-red-200 text-red-700"
    : "bg-green-50 border-green-200 text-green-700";

  return (
    <div className="space-y-5">
      {msg.text && (
        <div className={`px-4 py-3 border rounded-xl text-sm font-medium ${msgClass}`}>
          {msg.text}
        </div>
      )}

      {/* ── Form ── */}
      <div ref={formRef} className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-5 bg-green-500 rounded-full" />
          <h2 className="text-base font-semibold text-gray-900">
            {editId ? "Edit Program" : "Tambah Program Baru"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Judul & Subtitle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Subtitle</label>
              <input
                type="text"
                value={form.subtitle || ""}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="Pelantikan Calon Bantara"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={4}
              placeholder="Deskripsi program..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 resize-none"
            />
          </div>

          {/* Gambar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gambar <span className="text-gray-400 font-normal">(bisa lebih dari 1)</span>
            </label>
            <div className="flex gap-2 mb-3">
              <label className="cursor-pointer px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-medium transition-colors border border-green-200 flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {uploading ? "Uploading..." : "Upload"}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              <button
                type="button"
                onClick={addImageUrl}
                className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-200"
              >
                + URL
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
                    >✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── STATS PER PROGRAM ── */}
          <div className="border border-gray-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Stats Program Ini</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Kosongkan = pakai stats global section Program
                </p>
              </div>
              <button
                type="button"
                onClick={addStat}
                className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-medium transition-colors border border-green-200"
              >
                + Tambah Stat
              </button>
            </div>

            {statsList.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-3 bg-gray-50 rounded-lg">
                Belum ada stats — akan pakai stats global
              </p>
            ) : (
              <div className="space-y-2">
                {statsList.map((stat, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-center">
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => updateStat(i, 'value', e.target.value)}
                      placeholder="800 atau Yonif"
                      className="col-span-3 px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-green-500"
                    />
                    <input
                      type="text"
                      value={stat.suffix}
                      onChange={(e) => updateStat(i, 'suffix', e.target.value)}
                      placeholder="+ / K"
                      className="col-span-2 px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-green-500"
                    />
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => updateStat(i, 'label', e.target.value)}
                      placeholder="Label"
                      className="col-span-4 px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-green-500"
                    />
                    <label className="col-span-2 flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={stat.isText}
                        onChange={(e) => updateStat(i, 'isText', e.target.checked)}
                        className="w-3 h-3 accent-green-500"
                      />
                      <span className="text-xs text-gray-500">Teks</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => removeStat(i)}
                      className="col-span-1 text-red-400 hover:text-red-600 text-xs font-bold"
                    >✕</button>
                  </div>
                ))}
                {/* Preview */}
                <div className="flex gap-3 pt-2 flex-wrap">
                  {statsList.filter(s => s.value || s.label).map((s, i) => (
                    <div key={i} className="text-center bg-green-50 rounded-lg px-3 py-2 min-w-[60px]">
                      <p className="text-sm font-bold text-green-600">{s.value}{s.suffix}</p>
                      <p className="text-xs text-gray-500">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Urutan & Aktif */}
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
                className="w-4 h-4 accent-green-500"
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
              {loading ? "Menyimpan..." : editId ? "Update Program" : "Tambah Program"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => { setEditId(null); setForm(defaultForm); setImageList([]); setStatsList([]); }}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-sm transition-colors"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ── List ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-green-500 rounded-full" />
            <h2 className="text-base font-semibold text-gray-900">Daftar Program</h2>
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
            {programs.length} program
          </span>
        </div>

        {programs.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">Belum ada program.</p>
        ) : (
          <div className="space-y-3">
            {programs.map((p) => {
              let imgs = [];
              try { imgs = JSON.parse(p.images || "[]"); } catch { imgs = []; }
              let pStats = [];
              try { pStats = JSON.parse(p.stats || "[]"); } catch { pStats = []; }
              return (
                <div key={p.id} className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
                  {imgs[0] && (
                    <img src={imgs[0]} alt="" className="w-20 h-14 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-900 text-sm">{p.title}</h3>
                      {p.subtitle && <span className="text-xs text-gray-400">— {p.subtitle}</span>}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${p.active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                        {p.active ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">{p.description}</p>
                    <div className="flex gap-2 mt-1.5 flex-wrap">
                      <span className="text-xs text-gray-400">{imgs.length} gambar</span>
                      {pStats.length > 0 ? (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          {pStats.length} stats sendiri
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                          pakai stats global
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(p)}
                      className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
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
