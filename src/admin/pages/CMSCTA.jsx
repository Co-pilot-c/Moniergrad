import { useState, useEffect } from "react";
import { ctaAPI } from "../../utils/api.js";

export default function CMSCTA() {
  const [form, setForm] = useState({
    title: "Bergabunglah dengan Keluarga Besar Dewan Ambalan",
    description: "Jadilah bagian dari perjalanan inspiratif dan bentuk karakter kepemimpinanmu bersama kami.",
    btn1Text: "Bergabung Sekarang",
    btn1Link: "#",
    btn1Style: "primary",
    btn2Text: "Pelajari Lebih Lanjut",
    btn2Link: "#",
    btn2Style: "secondary",
    active: true,
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    ctaAPI.get().then((data) => { if (data) setForm(data); }).catch(() => {});
  }, []);

  const showMsg = (text) => { setMsg(text); setTimeout(() => setMsg(""), 3000); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await ctaAPI.update(form);
      showMsg("CTA berhasil disimpan!");
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

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
        <strong>ℹ️ CTA Section</strong> — Bagian "Bergabunglah" di bawah section Kata Purna.
        Link tombol bisa diisi dengan URL biasa, link WhatsApp (<code>https://wa.me/628xxx</code>),
        link Instagram (<code>https://instagram.com/xxx</code>), atau anchor (<code>#about</code>).
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Teks */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Teks CTA</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                placeholder="Bergabunglah dengan Keluarga Besar Dewan Ambalan"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Jadilah bagian dari perjalanan inspiratif..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Tombol 1 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Tombol 1 (Kiri)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teks Tombol *</label>
              <input
                type="text"
                value={form.btn1Text}
                onChange={(e) => setForm({ ...form, btn1Text: e.target.value })}
                required
                placeholder="Bergabung Sekarang"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link <span className="text-gray-400 font-normal">(URL / WA / IG / #anchor)</span>
              </label>
              <input
                type="text"
                value={form.btn1Link}
                onChange={(e) => setForm({ ...form, btn1Link: e.target.value })}
                placeholder="https://wa.me/628xxx atau #about"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
              <select
                value={form.btn1Style}
                onChange={(e) => setForm({ ...form, btn1Style: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              >
                <option value="primary">Primary (Hijau)</option>
                <option value="secondary">Secondary (Putih)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tombol 2 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Tombol 2 (Kanan)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teks Tombol *</label>
              <input
                type="text"
                value={form.btn2Text}
                onChange={(e) => setForm({ ...form, btn2Text: e.target.value })}
                required
                placeholder="Pelajari Lebih Lanjut"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link <span className="text-gray-400 font-normal">(URL / WA / IG / #anchor)</span>
              </label>
              <input
                type="text"
                value={form.btn2Link}
                onChange={(e) => setForm({ ...form, btn2Link: e.target.value })}
                placeholder="https://instagram.com/xxx atau #program"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
              <select
                value={form.btn2Style}
                onChange={(e) => setForm({ ...form, btn2Style: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              >
                <option value="secondary">Secondary (Putih)</option>
                <option value="primary">Primary (Hijau)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-3">{form.title}</h3>
            <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">{form.description}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <span className={`px-6 py-2 rounded-full text-sm font-medium ${
                form.btn1Style === "primary"
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-900 border border-gray-200"
              }`}>
                {form.btn1Text}
              </span>
              <span className={`px-6 py-2 rounded-full text-sm font-medium ${
                form.btn2Style === "primary"
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-900 border border-gray-200"
              }`}>
                {form.btn2Text}
              </span>
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
