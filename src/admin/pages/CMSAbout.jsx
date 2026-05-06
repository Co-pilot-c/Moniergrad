import { useState, useEffect } from "react";
import { aboutAPI, uploadAPI } from "../../utils/api.js";

export default function CMSAbout() {
  const [form, setForm] = useState({
    tagline: "Tentang Kami",
    title: "",
    description: "",
    imageUrl: "",
    imageQuote: "",
    visiTitle: "Visi",
    visiContent: "",
    misiTitle: "Misi",
    misiItems: "",
    active: true,
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  // misiItems sebagai array untuk editing
  const [misiList, setMisiList] = useState([""]);

  useEffect(() => {
    aboutAPI.get().then((data) => {
      if (data) {
        setForm(data);
        try {
          const items = JSON.parse(data.misiItems || "[]");
          setMisiList(items.length > 0 ? items : [""]);
        } catch {
          setMisiList([""]);
        }
      }
    }).catch(() => {});
  }, []);

  const showMsg = (text) => { setMsg(text); setTimeout(() => setMsg(""), 3000); };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadAPI.upload(file);
      setForm((f) => ({ ...f, imageUrl: res.url }));
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
      const filteredMisi = misiList.filter((item) => item.trim() !== "");
      const data = { ...form, misiItems: JSON.stringify(filteredMisi) };
      await aboutAPI.update(data);
      showMsg("About berhasil disimpan!");
    } catch (err) {
      showMsg("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const addMisiItem = () => setMisiList([...misiList, ""]);
  const removeMisiItem = (i) => setMisiList(misiList.filter((_, idx) => idx !== i));
  const updateMisiItem = (i, val) => {
    const updated = [...misiList];
    updated[i] = val;
    setMisiList(updated);
  };

  return (
    <div className="space-y-6">
      {msg && (
        <div className="px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Konten Utama */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Konten About</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  placeholder="Tentang Kami"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  placeholder="Wadah untuk Menampung Ide dan Gagasan"
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
                rows={5}
                placeholder="Deskripsi tentang organisasi..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Kanan</label>
              <div className="flex gap-3 items-start">
                <input
                  type="text"
                  value={form.imageUrl || ""}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="URL gambar"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
                />
                <label className="cursor-pointer px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                  {uploading ? "Uploading..." : "Upload"}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
              {form.imageUrl && (
                <img src={form.imageUrl} alt="preview" className="mt-2 h-20 rounded-lg object-cover" />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kutipan di Gambar</label>
              <input
                type="text"
                value={form.imageQuote || ""}
                onChange={(e) => setForm({ ...form, imageQuote: e.target.value })}
                placeholder="Meninggalkan Jejak untuk Mengukir Sejarah"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
            </div>
          </div>
        </div>

        {/* Visi */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Visi</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Visi</label>
              <input
                type="text"
                value={form.visiTitle}
                onChange={(e) => setForm({ ...form, visiTitle: e.target.value })}
                placeholder="Visi"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Isi Visi *</label>
              <textarea
                value={form.visiContent}
                onChange={(e) => setForm({ ...form, visiContent: e.target.value })}
                required
                rows={4}
                placeholder="Isi visi organisasi..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Misi */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Misi</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Misi</label>
              <input
                type="text"
                value={form.misiTitle}
                onChange={(e) => setForm({ ...form, misiTitle: e.target.value })}
                placeholder="Misi"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Poin-poin Misi</label>
              <div className="space-y-2">
                {misiList.map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateMisiItem(i, e.target.value)}
                      placeholder={`Poin misi ${i + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeMisiItem(i)}
                      className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addMisiItem}
                className="mt-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-green-200"
              >
                + Tambah Poin Misi
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl text-sm transition-colors disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}
