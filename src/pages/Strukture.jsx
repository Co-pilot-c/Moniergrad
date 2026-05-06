import { useState, useEffect } from "react";
import Angkatan from "../pages/Angkatan";
import Bg from "../assets/images/bg_home.jpeg";
import { angkatanAPI } from "../utils/api.js";

// Fallback dummy data jika API tidak tersedia
const dummyAngkatanData = [
  {
    id: "dummy-1",
    nama: "50/14",
    status: "Demisioner",
    image: null,
    description: "Angkatan pertama dari Dewan Ambalan Monierson & Gradison",
    members: [],
  },
  {
    id: "dummy-2",
    nama: "51/15",
    status: "Alumni",
    image: null,
    description: "Angkatan kedua yang melanjutkan warisan dengan prestasi gemilang.",
    members: [],
  },
];

export default function Strukture() {
  const [organisasi, setOrganisasi] = useState([]);
  const [page, setPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState("next");

  useEffect(() => {
    angkatanAPI.getAll()
      .then((data) => {
        if (data && data.length > 0) {
          // Format data dari API ke format yang dibutuhkan Angkatan component
          const formatted = data.map((a) => ({
            id: a.id,
            angkatan: a.nama,
            status: a.status,
            image: a.image || null,
            description: a.description || "",
            members: (a.members || []).map((m) => ({
              id: m.id,
              name: m.name,
              position: m.position,
              image: m.image || null,
              bidang: m.bidang,
              social: {
                instagram: m.instagram || "",
                linkedin: m.linkedin || "",
              },
            })),
          }));
          setOrganisasi(formatted);
        } else {
          setOrganisasi(dummyAngkatanData);
        }
      })
      .catch(() => {
        setOrganisasi(dummyAngkatanData);
      });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isTransitioning) return;
      if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTransitioning, organisasi.length]);

  const current = organisasi.length > 0
    ? organisasi[page]
    : { angkatan: "Loading...", image: Bg, status: "Loading", members: [] };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection("prev");
    setTimeout(() => {
      setPage((prev) => (prev === 0 ? organisasi.length - 1 : prev - 1));
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection("next");
    setTimeout(() => {
      setPage((prev) => (prev === organisasi.length - 1 ? 0 : prev + 1));
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  };

  return (
    <section id="strukture" className="bg-white">
      {/* Content */}
      <div className="relative overflow-hidden">
        <div
          className={`transition-all duration-700 ease-in-out transform ${
            isTransitioning
              ? direction === "next"
                ? "translate-x-full opacity-0"
                : "-translate-x-full opacity-0"
              : "translate-x-0 opacity-100"
          }`}
        >
          <Angkatan
            {...current}
            angkatan={current.angkatan}
            image={current.image}
            status={current.status}
            members={current.members}
            dataAngkatan={current}
            handlePrev={handlePrev}
            handleNext={handleNext}
          />
        </div>
      </div>

      {/* Page Indicators */}
      <div className="flex justify-center items-center gap-3 mt-8 pb-8">
        {organisasi.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (isTransitioning) return;
              setIsTransitioning(true);
              setDirection(index > page ? "next" : "prev");
              setTimeout(() => {
                setPage(index);
                setTimeout(() => setIsTransitioning(false), 50);
              }, 300);
            }}
            className={`transition-all duration-300 ${
              index === page
                ? "w-8 h-2 bg-gradient-green rounded-full"
                : "w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400"
            }`}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
