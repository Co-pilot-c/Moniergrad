import { useState, useEffect } from "react";
import Description from "../components/atoms/Description";
import Tittle from "../components/atoms/Tittle";
import Subtitle from "../components/atoms/Subtitle";
import Tagline from "../components/atoms/Tagline";
import Perlak from "../assets/images/perlak.jpeg";
import Perlak1 from "../assets/images/perlak1.jpeg";
import Score from "../components/atoms/Score";
import { programAPI, statsAPI } from "../utils/api.js";

const DEFAULT_STATS = [
  { value: "120", suffix: "+",  label: "Active",       isText: false },
  { value: "92",  suffix: "K",  label: "Users",        isText: false },
  { value: "25",  suffix: "%",  label: "Growth",       isText: false },
  { value: "12",  suffix: "K+", label: "Testimonials", isText: false },
];

export default function Program() {
  const [programs, setPrograms] = useState([
    {
      images: [Perlak, Perlak1],
      title: "PECABA 2025",
      subtitle: "Pelantikan Calon Bantara",
      description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
      programStats: [],
    },
  ]);

  const [globalStats, setGlobalStats] = useState(DEFAULT_STATS);
  const [page, setPage] = useState(0);

  useEffect(() => {
    programAPI.getAll()
      .then((data) => {
        if (data && data.length > 0) {
          const formatted = data.map((p) => {
            let images = [];
            try { images = JSON.parse(p.images || "[]"); } catch { images = []; }
            if (images.length === 0) images = [Perlak, Perlak1];

            let programStats = [];
            try { programStats = JSON.parse(p.stats || "[]"); } catch { programStats = []; }

            return { ...p, images, programStats };
          });
          setPrograms(formatted);
        }
      })
      .catch(() => {});

    statsAPI.getBySection("program")
      .then((data) => { if (data && data.length > 0) setGlobalStats(data); })
      .catch(() => {});
  }, []);

  const current = programs[page] || programs[0];
  const handleNext = () => setPage((p) => (p === programs.length - 1 ? 0 : p + 1));
  const handlePrev = () => setPage((p) => (p === 0 ? programs.length - 1 : p - 1));

  if (!current) return null;

  const activeStats = (current.programStats && current.programStats.length > 0)
    ? current.programStats
    : globalStats;

  return (
    <section
      id="program"
      className="relative bg-white py-16 lg:py-24 px-6 lg:px-20 overflow-hidden"
    >
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gradient-green-light opacity-10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-200 opacity-10 rounded-full blur-2xl" />

      <div className="relative max-w-7xl mx-auto">
        {/*
          Desktop (lg): grid 2 kolom — kiri gambar, kanan konten (tidak berubah)
          Mobile: flex-col dengan order CSS
            order-1 = Tagline + Judul + Nav (tampil pertama)
            order-2 = Gambar (tampil kedua)
            order-3 = Deskripsi + Stats (tampil ketiga)
        */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-20 lg:items-stretch gap-6">

          {/* ── MOBILE order-1: Header (Tagline, Judul, Nav) ── */}
          {/* ── DESKTOP: bagian dari kolom kanan ── */}
          <div className="order-1 lg:hidden space-y-3">
            <div className="text-center">
              <Tagline>Program Kami</Tagline>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <Tittle>{current.title}</Tittle>
                {current.subtitle && <Subtitle>{current.subtitle}</Subtitle>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 bg-white rounded-full shadow-soft flex items-center justify-center text-gray-700 hover:bg-gradient-green hover:text-white transition-all duration-400"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 bg-white rounded-full shadow-soft flex items-center justify-center text-gray-700 hover:bg-gradient-green hover:text-white transition-all duration-400"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* ── Kolom Kiri (Desktop) / order-2 (Mobile): Gambar ── */}
          <div className="order-2 lg:order-none flex flex-col gap-6 animate-fadeSlideIn">
            <div className="flex flex-col gap-4 lg:gap-6">
              {current.images.map((image, i) => (
                <div key={i} className="relative group">
                  <div className="absolute inset-0 bg-gradient-green opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-400" />
                  <div className="aspect-[7/4] overflow-hidden rounded-3xl shadow-soft group-hover:shadow-medium transition-all duration-400">
                    <img
                      src={image}
                      loading="lazy"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      alt={current.title}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Indikator */}
            <div className="flex justify-center gap-2">
              {programs.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index)}
                  className={`h-2 rounded-full transition-all duration-400 ${
                    index === page ? "w-8 bg-gradient-green" : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ── Kolom Kanan (Desktop) / order-3 (Mobile): Konten ── */}
          <div className="order-3 lg:order-none flex flex-col gap-6 animate-fadeSlideUp">

            {/* Header — hanya tampil di desktop */}
            <div className="hidden lg:block space-y-4">
              <div className="text-center">
                <Tagline>Program Kami</Tagline>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <Tittle>{current.title}</Tittle>
                  {current.subtitle && <Subtitle>{current.subtitle}</Subtitle>}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <button
                    onClick={handlePrev}
                    className="w-11 h-11 bg-white rounded-full shadow-soft flex items-center justify-center text-gray-700 hover:bg-gradient-green hover:text-white hover:shadow-green transition-all duration-400 transform hover:scale-110"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-11 h-11 bg-white rounded-full shadow-soft flex items-center justify-center text-gray-700 hover:bg-gradient-green hover:text-white hover:shadow-green transition-all duration-400 transform hover:scale-110"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Deskripsi */}
            <Description style="justify">{current.description}</Description>

            {/* Stats */}
            <div className="mt-auto flex flex-row flex-wrap justify-start gap-3">
              {activeStats.map((stat, index) => (
                <div key={stat.id || index} className="text-center group shrink-0">
                  <div className="bg-gradient-green-light/10 rounded-2xl px-5 py-5 transition-all duration-400 group-hover:shadow-green group-hover:scale-105 inline-block">
                    <Score
                      value={stat.value}
                      suffix={stat.suffix}
                      label={stat.label}
                      isText={stat.isText}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
