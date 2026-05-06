import { useState, useEffect, useRef } from "react";
import Angkatan from "../pages/Angkatan";
import Bg from "../assets/images/bg_home.jpeg";
import { angkatanAPI } from "../utils/api.js";

const dummyAngkatanData = [
  {
    id: "dummy-1",
    angkatan: "50/14",
    status: "Demisioner",
    image: null,
    description: "Angkatan pertama dari Dewan Ambalan Monierson & Gradison",
    members: [],
  },
  {
    id: "dummy-2",
    angkatan: "51/15",
    status: "Alumni",
    image: null,
    description: "Angkatan kedua yang melanjutkan warisan dengan prestasi gemilang.",
    members: [],
  },
];

export default function Strukture() {
  const [organisasi, setOrganisasi] = useState([]);
  const [page, setPage] = useState(0);
  // "idle" | "out" | "in"
  const [phase, setPhase] = useState("idle");
  const [direction, setDirection] = useState("next");
  const pendingPage = useRef(null);

  useEffect(() => {
    angkatanAPI.getAll()
      .then((data) => {
        if (data && data.length > 0) {
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
              instagram: m.instagram || null,
              social: { instagram: m.instagram || "", linkedin: m.linkedin || "" },
            })),
          }));
          setOrganisasi(formatted);
        } else {
          setOrganisasi(dummyAngkatanData);
        }
      })
      .catch(() => setOrganisasi(dummyAngkatanData));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (phase !== "idle") return;
      if (e.key === "ArrowLeft") goTo(page === 0 ? organisasi.length - 1 : page - 1, "prev");
      else if (e.key === "ArrowRight") goTo(page === organisasi.length - 1 ? 0 : page + 1, "next");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, page, organisasi.length]);

  /**
   * Smooth crossfade transition:
   * 1. phase="out" → current fades out (200ms)
   * 2. swap page
   * 3. phase="in"  → new content fades in (300ms)
   * 4. phase="idle"
   */
  const goTo = (nextPage, dir) => {
    if (phase !== "idle" || nextPage === page) return;
    setDirection(dir);
    pendingPage.current = nextPage;
    setPhase("out");

    setTimeout(() => {
      setPage(nextPage);
      setPhase("in");
      setTimeout(() => setPhase("idle"), 320);
    }, 200);
  };

  const handlePrev = () => {
    const next = page === 0 ? organisasi.length - 1 : page - 1;
    goTo(next, "prev");
  };

  const handleNext = () => {
    const next = page === organisasi.length - 1 ? 0 : page + 1;
    goTo(next, "next");
  };

  const current = organisasi.length > 0
    ? organisasi[page]
    : { angkatan: "Loading...", image: Bg, status: "Loading", members: [] };

  // CSS classes berdasarkan phase
  const transitionClass = (() => {
    if (phase === "out") {
      return direction === "next"
        ? "opacity-0 scale-[0.97] -translate-x-4"
        : "opacity-0 scale-[0.97] translate-x-4";
    }
    if (phase === "in") {
      return direction === "next"
        ? "opacity-0 scale-[0.97] translate-x-4"
        : "opacity-0 scale-[0.97] -translate-x-4";
    }
    return "opacity-100 scale-100 translate-x-0";
  })();

  return (
    <section id="strukture" className="bg-white">
      {/* Wrapper dengan overflow hidden agar tidak ada scroll horizontal saat transisi */}
      <div className="relative overflow-hidden">
        <div
          className={`transition-all ease-in-out transform ${transitionClass}`}
          style={{ transitionDuration: phase === "out" ? "200ms" : "320ms" }}
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

      {/* Dot Indicators */}
      <div className="flex justify-center items-center gap-3 mt-6 pb-8">
        {organisasi.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index, index > page ? "next" : "prev")}
            className={`transition-all duration-300 rounded-full ${
              index === page
                ? "w-8 h-2 bg-gradient-green"
                : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Angkatan ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
