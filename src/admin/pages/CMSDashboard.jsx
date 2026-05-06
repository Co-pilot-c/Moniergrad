import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { heroAPI, angkatanAPI, programAPI, purnaAPI, statsAPI } from "../../utils/api.js";

const StatCard = ({ label, count, icon, path, color }) => (
  <Link to={path} className="block">
    <div className={`bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-${color}-200`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-medium px-2 py-1 rounded-full bg-${color}-50 text-${color}-600`}>
          Kelola →
        </span>
      </div>
      <p className="text-3xl font-bold text-gray-900">{count}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  </Link>
);

export default function CMSDashboard() {
  const [counts, setCounts] = useState({
    hero: 0, angkatan: 0, program: 0, purna: 0, stats: 0,
  });

  useEffect(() => {
    Promise.allSettled([
      heroAPI.getAllAdmin(),
      angkatanAPI.getAllAdmin(),
      programAPI.getAllAdmin(),
      purnaAPI.getAllAdmin(),
      statsAPI.getAll(),
    ]).then(([hero, angkatan, program, purna, stats]) => {
      setCounts({
        hero: hero.status === "fulfilled" ? hero.value.length : 0,
        angkatan: angkatan.status === "fulfilled" ? angkatan.value.length : 0,
        program: program.status === "fulfilled" ? program.value.length : 0,
        purna: purna.status === "fulfilled" ? purna.value.length : 0,
        stats: stats.status === "fulfilled" ? stats.value.length : 0,
      });
    });
  }, []);

  const cards = [
    { label: "Hero / Home", count: counts.hero, icon: "🖼️", path: "/11.043-11.044/hero", color: "blue" },
    { label: "Angkatan", count: counts.angkatan, icon: "🎓", path: "/11.043-11.044/angkatan", color: "green" },
    { label: "Program Kerja", count: counts.program, icon: "📌", path: "/11.043-11.044/program", color: "purple" },
    { label: "Kata Purna", count: counts.purna, icon: "💬", path: "/11.043-11.044/purna", color: "yellow" },
    { label: "Stats", count: counts.stats, icon: "📊", path: "/11.043-11.044/stats", color: "red" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">Selamat Datang di CMS 👋</h1>
        <p className="text-green-100 text-sm">Kelola semua konten website Dewan Ambalan dari sini.</p>
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Konten</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {cards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Edit Hero Section", desc: "Ubah judul, deskripsi, dan tombol hero", path: "/11.043-11.044/hero", icon: "🖼️" },
            { label: "Edit About & Visi Misi", desc: "Ubah konten tentang kami, visi, dan misi", path: "/11.043-11.044/about", icon: "📋" },
            { label: "Kelola Stats", desc: "Ubah angka/teks statistik hijau", path: "/11.043-11.044/stats", icon: "📊" },
            { label: "Tambah Angkatan", desc: "Tambah data angkatan baru", path: "/11.043-11.044/angkatan", icon: "🎓" },
            { label: "Tambah Program", desc: "Tambah program kerja baru", path: "/11.043-11.044/program", icon: "📌" },
            { label: "Tambah Kata Purna", desc: "Tambah testimoni alumni baru", path: "/11.043-11.044/purna", icon: "💬" },
          ].map((action) => (
            <Link
              key={action.label}
              to={action.path}
              className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-green-200 transition-all duration-200"
            >
              <span className="text-2xl">{action.icon}</span>
              <div>
                <p className="font-medium text-gray-900 text-sm">{action.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
