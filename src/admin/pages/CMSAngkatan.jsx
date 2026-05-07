import { useState, useEffect } from "react";
import { angkatanAPI, uploadAPI } from "../../utils/api.js";

const defaultForm = { nama: "", status: "Aktif", image: "", description: "", order: 1, active: true };
const defaultMemberForm = { name: "", position: "", image: "", bidang: "Umum", instagram: "", linkedin: "", order: 1, active: true };

export default function CMSAngkatan() {
  const [angkatans, setAngkatans] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  // Member management
  const [selectedAngkatan, setSelectedAngkatan] = useState(null);
  const [memberForm, setMemberForm] = useState(defaultMemberForm);
  const [editMemberId, setEditMemberId] = useState(null);
  const [memberLoading, setMemberLoading] = useState(false);
  const [memberUploading, setMemberUploading] = useState(false);

  const load = () => angkatanAPI.getAllAdmin().then(setAngkatans).catch(() => {});
  useEffect(() => { load(); }, []);

  const showMsg = (text) => { setMsg(text); setTimeout(() => setMsg(""), 3000); };

  const handleEdit = (a) => {
    setEditId(a.id);
    setForm({ ...defaultForm, ...a });
    setSelectedAngkatan(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus angkatan ini beserta semua anggotanya?")) return;
    await angkatanAPI.delete(id); // backend otomatis hapus gambar dari Cloudinary
    showMsg("Angkatan dihapus");
    load();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      if (form.image && form.image.includes('cloudinary')) {
        await uploadAPI.deleteMedia(form.image).catch(() => {});
      }
      const res = await uploadAPI.upload(file, 'angkatan');
      setForm((f) => ({ ...f, image: res.url }));
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
        await angkatanAPI.update(editId, data);
        showMsg("Angkatan berhasil diupdate!");
      } else {
        await angkatanAPI.create(data);
        showMsg("Angkatan berhasil ditambahkan!");
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

  // Member handlers
  const handleMemberImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMemberUploading(true);
    try {
      if (memberForm.image && memberForm.image.includes('cloudinary')) {
        await uploadAPI.deleteMedia(memberForm.image).catch(() => {});
      }
      const res = await uploadAPI.upload(file, 'members');
      setMemberForm((f) => ({ ...f, image: res.url }));
    } catch (err) {
      showMsg("Upload gagal: " + err.message);
    } finally {
      setMemberUploading(false);
    }
  };

  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    setMemberLoading(true);
    try {
      const data = { ...memberForm, order: Number(memberForm.order), active: Boolean(memberForm.active) };
      if (editMemberId) {
        await angkatanAPI.updateMember(editMemberId, data);
        showMsg("Anggota berhasil diupdate!");
      } else {
        await angkatanAPI.addMember(selectedAngkatan.id, data);
        showMsg("Anggota berhasil ditambahkan!");
      }
      setMemberForm(defaultMemberForm);
      setEditMemberId(null);
      load();
    } catch (err) {
      showMsg("Error: " + err.message);
    } finally {
      setMemberLoading(false);
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!confirm("Hapus anggota ini?")) return;
    await angkatanAPI.deleteMember(memberId);
    showMsg("Anggota dihapus");
    load();
  };

  const handleEditMember = (member) => {
    setEditMemberId(member.id);
    setMemberForm({ ...defaultMemberForm, ...member });
  };

  const currentAngkatan = selectedAngkatan
    ? angkatans.find((a) => a.id === selectedAngkatan.id)
    : null;

  return (
    <div className="space-y-6">
      {msg && (
        <div className="px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
          {msg}
        </div>
      )}

      {/* Form Angkatan */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          {editId ? "Edit Angkatan" : "Tambah Angkatan Baru"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Angkatan *</label>
              <input
                type="text"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                required
                placeholder="50/14, 51/15, 2024..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              >
                <option value="Aktif">Aktif</option>
                <option value="Alumni">Alumni</option>
                <option value="Demisioner">Demisioner</option>
                <option value="Calon">Calon</option>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              placeholder="Deskripsi singkat angkatan..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Background Image</label>
            <div className="flex gap-3 items-start">
              <input
                type="text"
                value={form.image || ""}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="URL gambar background"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
              <label className="cursor-pointer px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                {uploading ? "Uploading..." : "Upload"}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            {form.image && (
              <img src={form.image} alt="preview" className="mt-2 h-20 rounded-lg object-cover" />
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="angkatanActive"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="w-4 h-4 accent-green-500"
            />
            <label htmlFor="angkatanActive" className="text-sm font-medium text-gray-700">Aktif</label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : editId ? "Update Angkatan" : "Tambah Angkatan"}
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

      {/* List Angkatan */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Daftar Angkatan ({angkatans.length})</h2>
        {angkatans.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">Belum ada angkatan.</p>
        ) : (
          <div className="space-y-3">
            {angkatans.map((a) => (
              <div key={a.id} className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="flex items-center gap-4 p-4">
                  {a.image && (
                    <img src={a.image} alt="" className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">MONIERGRAD {a.nama}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        a.status === "Aktif" ? "bg-green-50 text-green-600" :
                        a.status === "Alumni" ? "bg-blue-50 text-blue-600" :
                        "bg-gray-100 text-gray-500"
                      }`}>{a.status}</span>
                      {!a.active && <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-500">Nonaktif</span>}
                    </div>
                    <p className="text-xs text-gray-500">{a.members?.length || 0} anggota</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => setSelectedAngkatan(selectedAngkatan?.id === a.id ? null : a)}
                      className="px-3 py-1.5 text-xs bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                    >
                      {selectedAngkatan?.id === a.id ? "Tutup" : "Anggota"}
                    </button>
                    <button
                      onClick={() => handleEdit(a)}
                      className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="px-3 py-1.5 text-xs bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                </div>

                {/* Member Panel */}
                {selectedAngkatan?.id === a.id && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50">
                    <h4 className="font-medium text-gray-900 text-sm mb-4">
                      Anggota {a.nama} ({currentAngkatan?.members?.length || 0})
                    </h4>

                    {/* Member Form */}
                    <form onSubmit={handleMemberSubmit} className="bg-white rounded-xl p-4 mb-4 space-y-3">
                      <p className="text-xs font-medium text-gray-700">
                        {editMemberId ? "Edit Anggota" : "Tambah Anggota"}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Nama *</label>
                          <input
                            type="text"
                            value={memberForm.name}
                            onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                            required
                            placeholder="Nama lengkap"
                            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Jabatan *</label>
                          <input
                            type="text"
                            value={memberForm.position}
                            onChange={(e) => setMemberForm({ ...memberForm, position: e.target.value })}
                            required
                            placeholder="Ketua, Sekretaris..."
                            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Bidang</label>
                          <input
                            type="text"
                            value={memberForm.bidang}
                            onChange={(e) => setMemberForm({ ...memberForm, bidang: e.target.value })}
                            placeholder="Kepemimpinan, Humas..."
                            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Instagram</label>
                          <input
                            type="text"
                            value={memberForm.instagram || ""}
                            onChange={(e) => setMemberForm({ ...memberForm, instagram: e.target.value })}
                            placeholder="https://instagram.com/..."
                            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Foto</label>
                          <div className="flex gap-1">
                            <input
                              type="text"
                              value={memberForm.image || ""}
                              onChange={(e) => setMemberForm({ ...memberForm, image: e.target.value })}
                              placeholder="URL foto"
                              className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-green-500"
                            />
                            <label className="cursor-pointer px-2 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs transition-colors">
                              {memberUploading ? "..." : "📷"}
                              <input type="file" accept="image/*" onChange={handleMemberImageUpload} className="hidden" />
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Urutan</label>
                          <input
                            type="number"
                            value={memberForm.order}
                            onChange={(e) => setMemberForm({ ...memberForm, order: e.target.value })}
                            min={1}
                            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-green-500"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={memberLoading}
                          className="px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg text-xs transition-colors disabled:opacity-50"
                        >
                          {memberLoading ? "..." : editMemberId ? "Update" : "Tambah"}
                        </button>
                        {editMemberId && (
                          <button
                            type="button"
                            onClick={() => { setEditMemberId(null); setMemberForm(defaultMemberForm); }}
                            className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-xs transition-colors"
                          >
                            Batal
                          </button>
                        )}
                      </div>
                    </form>

                    {/* Member List */}
                    {currentAngkatan?.members?.length === 0 ? (
                      <p className="text-gray-400 text-xs text-center py-4">Belum ada anggota.</p>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {currentAngkatan?.members?.map((m) => (
                          <div key={m.id} className="bg-white rounded-lg p-3 border border-gray-100">
                            {m.image && (
                              <img src={m.image} alt={m.name} className="w-full h-16 object-cover rounded-lg mb-2" />
                            )}
                            <p className="font-medium text-xs text-gray-900 truncate">{m.name}</p>
                            <p className="text-xs text-gray-500 truncate">{m.position}</p>
                            <div className="flex gap-1 mt-2">
                              <button
                                onClick={() => handleEditMember(m)}
                                className="flex-1 py-1 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteMember(m.id)}
                                className="flex-1 py-1 text-xs bg-red-50 text-red-600 hover:bg-red-100 rounded transition-colors"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
