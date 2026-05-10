import { useState, useEffect } from "react";
import { footerAPI } from "../../utils/api.js";

// ─── Reusable Link List Editor ────────────────────────────────────────────────
function LinkList({ title, hint, links, onChange }) {
  const add = () => onChange([...links, { label: "", url: "" }]);
  const remove = (i) => onChange(links.filter((_, idx) => idx !== i));
  const update = (i, field, val) => {
    const next = [...links];
    next[i] = { ...next[i], [field]: val };
    onChange(next);
  };
  const moveUp = (i) => {
    if (i === 0) return;
    const next = [...links];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    onChange(next);
  };
  const moveDown = (i) => {
    if (i === links.length - 1) return;
    const next = [...links];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    onChange(next);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
        </div>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah
        </button>
      </div>

      {/* List */}
      <div className="p-4">
        {links.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <svg className="w-8 h-8 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <p className="text-xs">Belum ada link. Klik Tambah.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {links.map((link, i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                {/* Order buttons */}
                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  <button type="button" onClick={() => moveUp(i)} disabled={i === 0}
                    className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-20 transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button type="button" onClick={() => moveDown(i)} disabled={i === links.length - 1}
                    className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-20 transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Inputs */}
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => update(i, 'label', e.target.value)}
                  placeholder="Label"
                  className="flex-1 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-green-500 min-w-0"
                />
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => update(i, 'url', e.target.value)}
                  placeholder="URL (#home, https://...)"
                  className="flex-1 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-green-500 min-w-0"
                />

                {/* Delete */}
                <button type="button" onClick={() => remove(i)}
                  className="w-7 h-7 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Field Row ────────────────────────────────────────────────────────────────
function Field({ label, value, onChange, type = "text", placeholder, rows }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {rows ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 resize-none bg-white"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 bg-white"
        />
      )}
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function Section({ title, icon, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-100 bg-gray-50">
        <span className="text-base">{icon}</span>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CMSFooter() {
  const [form, setForm] = useState({
    brandName: "", brandDesc: "",
    facebookUrl: "", twitterUrl: "", instagramUrl: "",
    email: "", phone: "", address: "", copyrightText: "",
    navLinks: "[]", quickLinks: "[]", active: true,
  });
  const [navLinks, setNavLinks] = useState([]);
  const [quickLinks, setQuickLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    footerAPI.get().then((data) => {
      if (!data) return;
      setForm(data);
      try { setNavLinks(JSON.parse(data.navLinks || "[]")); } catch { setNavLinks([]); }
      try { setQuickLinks(JSON.parse(data.quickLinks || "[]")); } catch { setQuickLinks([]); }
    }).catch(() => {});
  }, []);

  const f = (key) => ({
    value: form[key] || "",
    onChange: (v) => setForm((prev) => ({ ...prev, [key]: v })),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await footerAPI.update({
        ...form,
        navLinks: JSON.stringify(navLinks),
        quickLinks: JSON.stringify(quickLinks),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert("Gagal menyimpan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">

      {/* Save bar */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-5 py-3">
        <p className="text-sm text-gray-500">Kelola semua konten footer website</p>
        <button
          type="submit"
          disabled={loading}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            saved
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-green-500 hover:bg-green-600 text-white"
          } disabled:opacity-50`}
        >
          {loading ? (
            <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Menyimpan...</>
          ) : saved ? (
            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>Tersimpan!</>
          ) : "Simpan Semua"}
        </button>
      </div>

      {/* Brand */}
      <Section title="Brand & Deskripsi" icon="🏷️">
        <Field label="Nama Brand" placeholder="DewanAmbalan" {...f('brandName')} />
        <Field label="Deskripsi" placeholder="Membangun generasi kreatif..." rows={3} {...f('brandDesc')} />
      </Section>

      {/* Social */}
      <Section title="Social Media" icon="🔗">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Facebook" placeholder="https://facebook.com/..." {...f('facebookUrl')} />
          <Field label="Twitter / X" placeholder="https://twitter.com/..." {...f('twitterUrl')} />
          <Field label="Instagram" placeholder="https://instagram.com/..." {...f('instagramUrl')} />
        </div>
      </Section>

      {/* Nav Links */}
      <LinkList
        title="Link Navigasi"
        hint="Kolom kiri footer — link ke halaman utama"
        links={navLinks}
        onChange={setNavLinks}
      />

      {/* Quick Links */}
      <LinkList
        title="Link Cepat"
        hint="Kolom tengah footer — link ke halaman/fitur lain"
        links={quickLinks}
        onChange={setQuickLinks}
      />

      {/* Kontak */}
      <Section title="Kontak" icon="📞">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Email" type="email" placeholder="email@domain.com" {...f('email')} />
          <Field label="Telepon" placeholder="+62 812 ..." {...f('phone')} />
        </div>
        <Field label="Alamat" placeholder="Kota, Provinsi" {...f('address')} />
        <Field label="Teks Copyright" placeholder="Nama Organisasi. All rights reserved." {...f('copyrightText')} />
      </Section>

    </form>
  );
}
