import { HashLink } from "react-router-hash-link";
import Angkatan from "../pages/Angkatan";
import { useLocation, Link } from "react-router-dom";
import Card from "../components/molecules/Card";
import { useEffect, useState } from "react";

export default function Profile() {
  const { state } = useLocation();
  const data = state?.data;
  const [selectedBidang, setSelectedBidang] = useState("Seluruh");

  useEffect(() => {
    const el = document.getElementById("angkatan");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Data tidak ditemukan
          </h1>
          <Link
            to="/#strukture"
            className="text-primary-600 hover:text-primary-700"
          >
            ← Kembali ke Struktur
          </Link>
        </div>
      </div>
    );
  }

  // Get unique bidang for filter
  const bidangList = [
    "Seluruh",
    ...[...new Set(data.members.map((member) => member.bidang))],
  ];

  // Filter members based on selected bidang
  const filteredMembers =
    selectedBidang === "Seluruh"
      ? data.members
      : data.members.filter((member) => member.bidang === selectedBidang);

  return (
    <>
      {/* Hero Section - Angkatan Detail */}
      <section id="angkatan">
        <Angkatan {...data} mode="detail" />
      </section>

      {/* Members Section */}
      <section id="anggota" className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-green-light/20 rounded-full border border-primary-200/30 mb-6">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-primary-700">
                Tim Kami
              </span>
            </div>
            <h2 className="font-poppins font-bold text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-4">
              Anggota {data.angkatan}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Berkenalan dengan para pemimpin muda yang telah berkontribusi bagi
              Dewan Ambalan.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {bidangList.map((bidang) => (
              <button
                key={bidang}
                onClick={() => setSelectedBidang(bidang)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedBidang === bidang
                    ? "bg-gradient-green text-white shadow-medium"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {bidang} (
                {bidang === "Seluruh"
                  ? data.members.length
                  : data.members.filter((m) => m.bidang === bidang).length}
                )
              </button>
            ))}
          </div>

          {/* Members Grid */}
          <div className="grid justify-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMembers.map((member, index) => (
              <div
                key={member.id}
                className="animate-fadeSlideUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card
                  image={member.image}
                  nama={member.name}
                  bidang={member.bidang}
                />
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Tidak ada anggota di bidang {selectedBidang}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
