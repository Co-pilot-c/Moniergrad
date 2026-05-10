import { useState, useEffect } from "react";
import { footerAPI } from "../../utils/api.js";

const defaultLink = { label: "", url: "" };

// Reusable link list editor
function LinkEditor({ title, links, onChange }) {
  const add = () => onChange([...links, { ...defaultLink }]);
  const remove = (i) => onChange(links.filter((_, idx) => idx !== i));
  const update = (i, field, val) => {
    const updated = [...links];
    updated[i] = { ...updated[i], [field]: val };
    onChange(updated);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-green-500 rounded-full" />
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        </div>
        <button
          type="button"
          onClick={add}
          className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-medium transition-colors border border-green-200"
        >
          + Tambah Link
        </button>
      </div>

      {links.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-4 bg-gray-50 rounded-lg">
          Belum ada link. Klik "+ Tambah Link" untuk menambahkan.
        </p>
      ) : (
        <div className="space-y-2">
          {links.map((link, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="text"
                value={link.label}
                onChange={(e) => update(i, 'label', e.target.value)}
                placeholder="Label (contoh: Home)"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
              <input
                type="text"
                value={link.url}
                onChange={(e) => update(i, 'url', e.target.value)}
                placeholder="URL (#home, https://...)"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}

          {/* Preview */}
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-400 mb-2 font-medium">Preview:</p>
            <ul className="space-y-1">
              {links.filter(l => l.label).map((l, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-center gap-1">
                  <span className="text-gray-400">→</span>
                  <span className="font-medium">{l.label}</span>
                  {l.url && <span className="text-gray-400 font-mono">({l.url})</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CMSFooter() {
  const [form, setForm] = useState({
    brandName: "DewanAmbalan",
    brandDesc: "",
    facebookUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    email: "",
    phone: "",
    address: "",
    copyrightText: "",
    navLinks: "[]",
    quickLinks: "[]",
    active: true,
  });
  const [navLinks, setNavLinks] = useState([]);
  const [quickLinks, setQuickLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "success" });

  useEffect(() => {
    footerAPI.get().then((data) => {
      if (data) {
        setForm(data);
        try { setNavLinks(JSON.parse(data.navLinks || "[]")); } catch { setNavLinks([]); }
        try { setQuickLinks(JSON.parse(data.quickLinks || "[]")); } catch { setQuickLinks([]); }
      }
    }).catch(() => {});
  }, []);

  const showMsg = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "success" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...form,
        navLinks: JSON.stringify(navLinks),
        quickLinks: JSON.stringify(quickLinks),
      };
      await footerAPI.update(data);
      showMsg("Footer berhasil disimpan!");
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

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Brand */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-5 bg-green-500 rounded-full" />
            <h2 className="text-base font-semibold text-gray-900">Brand</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Brand</label>
              <input
                type="text"
                value={form.brandName}
                onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                placeholder="DewanAmbalan"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi Brand</label>
              <textarea
                value={form.brandDesc}
                onChange={(e) => setForm({ ...form, brandDesc: e.target.value })}
                rows={3}
                placeholder="Membangun generasi kreatif..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-5 bg-green-500 rounded-full" />
            <h2 className="text-base font-semibold text-gray-900">Social Media</h2>
          </div>
          <div className="space-y-4">
            {[
              { key: 'facebookUrl', label: 'Facebook URL', placeholder: 'https://facebook.com/...' },
              { key: 'twitterUrl',  label: 'Twitter URL',  placeholder: 'https://twitter.com/...' },
              { key: 'instagramUrl',label: 'Instagram URL',placeholder: 'https://instagram.com/...' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <input
                  type="text"
                  value={form[key] || ""}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigasi Links — CRUD */}
        <LinkEditor
          title="Link Navigasi"
          links={navLinks}
          onChange={setNavLinks}
        />

        {/* Quick Links — CRUD */}
        <LinkEditor
          title="Link Cepat"
          links={quickLinks}
          onChange={setQuickLinks}
        />

        {/* Kontak */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-5 bg-green-500 rounded-full" />
            <h2 className="text-base font-semibold text-gray-900">Kontak</h2>
          </div>
          <div className="space-y-4">
            {[
              { key: 'email',        label: 'Email',          type: 'email', placeholder: 'dewanambalan@email.com' },
              { key: 'phone',        label: 'Telepon',        type: 'text',  placeholder: '+62 812 3456 7890' },
              { key: 'address',      label: 'Alamat',         type: 'text',  placeholder: 'Majalengka, Indonesia' },
              { key: 'copyrightText',label: 'Teks Copyright', type: 'text',  placeholder: 'Dewan Ambalan. All rights reserved.' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <input
                  type={type}
                  value={form[key] || ""}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Menyimpan...
            </>
          ) : "Simpan Semua Perubahan"}
        </button>
      </form>
    </div>
  );
}
