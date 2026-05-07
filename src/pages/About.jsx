import { useState, useEffect } from "react";
import Tittle from "../components/atoms/Tittle.jsx";
import Bg_home from "../assets/images/bg_home.jpeg";
import Description from "../components/atoms/Description.jsx";
import Score from "../components/atoms/Score.jsx";
import Tagline from "../components/atoms/Tagline.jsx";
import { aboutAPI, statsAPI } from "../utils/api.js";

export default function About() {
  const [aboutData, setAboutData] = useState({
    tagline: "Tentang Kami",
    title: "Wadah untuk Menampung Ide dan Gagasan",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem officia mollitia magnam recusandae sequi? Ipsam assumenda facilis, repellendus quaerat, magnam repudiandae ducimus, dolores eum hic veniam soluta sit perferendis nulla.",
    imageUrl: null,
    imageQuote: "Meninggalkan Jejak untuk Mengukir Sejarah",
    visiTitle: "Visi",
    visiContent: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum porro ad sed neque reiciendis corporis, consequatur, molestiae ea saepe inventore quis aut cupiditate fugit adipisci, voluptatibus tenetur dolores esse quibusdam.",
    misiTitle: "Misi",
    misiItems: JSON.stringify(["Lorem ipsum dolor sit amet.", "Lorem ipsum dolor, sit amet consectetur.", "Lorem ipsum dolor, sit amet consectetur.", "Lorem ipsum dolor sit amet consectetur."]),
  });

  const [stats, setStats] = useState([
    { value: "120", suffix: "+", label: "Active", isText: false },
    { value: "92", suffix: "K", label: "Users", isText: false },
    { value: "25", suffix: "%", label: "Growth", isText: false },
    { value: "12", suffix: "K+", label: "Testimonials", isText: false },
  ]);

  useEffect(() => {
    aboutAPI.get()
      .then((data) => { if (data) setAboutData(data); })
      .catch(() => {});
    statsAPI.getBySection("about")
      .then((data) => { if (data && data.length > 0) setStats(data); })
      .catch(() => {});
  }, []);

  let misiItems = [];
  try {
    misiItems = JSON.parse(aboutData.misiItems || "[]");
  } catch {
    misiItems = ["Lorem ipsum dolor sit amet.", "Lorem ipsum dolor, sit amet consectetur.", "Lorem ipsum dolor, sit amet consectetur.", "Lorem ipsum dolor sit amet consectetur."];
  }

  return (
    <section
      id="about"
      className="relative bg-white py-16 lg:py-24 px-6 lg:px-20 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-green-light opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-200 opacity-10 rounded-full blur-2xl"></div>

      <div className="relative max-w-7xl mx-auto">
        {/*
          Kedua kolom pakai flex-col + justify-between agar konten terbawah
          (stats di kiri, visi-misi di kanan) selalu sejajar satu sama lain.
          min-h memastikan kolom punya tinggi minimum yang sama.
        */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 lg:items-stretch">

          {/* ── Kolom Kiri ── */}
          <div className="flex flex-col gap-8 animate-fadeSlideIn">
            {/* Teks atas */}
            <div className="space-y-4 text-center">
              <Tagline>{aboutData.tagline || "Tentang Kami"}</Tagline>
              <Tittle size="medium">{aboutData.title}</Tittle>
              <Description style="justify">{aboutData.description}</Description>
            </div>

            {/* Stats — mt-auto mendorong ke bawah sejajar visi-misi */}
            <div className="mt-auto grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {stats.map((stat, index) => (
                <div key={stat.id || index} className="text-center group">
                  <div className="bg-gradient-green-light/10 rounded-2xl p-5 transition-all duration-400 group-hover:shadow-green group-hover:scale-105">
                    <Score
                      value={stat.isText ? stat.value : (parseFloat(stat.value) || 0)}
                      suffix={stat.suffix}
                      label={stat.label}
                      isText={stat.isText}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Kolom Kanan ── */}
          <div className="flex flex-col gap-6 animate-fadeSlideUp">
            {/* Gambar + kutipan */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-green opacity-10 rounded-3xl blur-xl group-hover:opacity-20 transition-opacity duration-400"></div>
              <div className="relative bg-white rounded-3xl shadow-soft overflow-hidden">
                <div className="flex flex-col">
                  <img
                    src={aboutData.imageUrl || Bg_home}
                    alt="About us"
                    loading="lazy"
                    className="w-full object-cover"
                  />
                  <div className="p-4 lg:px-5 lg:py-6 flex items-center">
                    <div>
                      <h3 className="font-poppins font-bold text-xl lg:text-2xl text-gray-900 leading-tight">
                        {aboutData.imageQuote || "Meninggalkan Jejak untuk Mengukir Sejarah"}
                      </h3>
                      <div className="mt-3 w-16 h-1 bg-gradient-green rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visi & Misi — mt-auto mendorong ke bawah sejajar stats */}
            <div className="mt-auto grid md:grid-cols-2 gap-6">
              {/* Visi */}
              <div className="group">
                <div className="bg-gradient-green rounded-3xl p-7 text-white transition-all duration-400 hover:shadow-medium hover:scale-105 relative overflow-hidden h-full">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -mr-14 -mt-14"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-6">
                          <path fill="rgb(255,255,255)" d="M416 224C398.3 224 384 209.7 384 192C384 174.3 398.3 160 416 160L576 160C593.7 160 608 174.3 608 192L608 352C608 369.7 593.7 384 576 384C558.3 384 544 369.7 544 352L544 269.3L374.6 438.7C362.1 451.2 341.8 451.2 329.3 438.7L224 333.3L86.6 470.6C74.1 483.1 53.8 483.1 41.3 470.6C28.8 458.1 28.8 437.8 41.3 425.3L201.3 265.3C213.8 252.8 234.1 252.8 246.6 265.3L352 370.7L498.7 224L416 224z" />
                        </svg>
                      </div>
                      <h1 className="font-poppins font-bold text-xl">{aboutData.visiTitle || "Visi"}</h1>
                    </div>
                    <p className="text-white/90 leading-relaxed text-sm">{aboutData.visiContent}</p>
                  </div>
                </div>
              </div>

              {/* Misi */}
              <div className="group">
                <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-7 text-white transition-all duration-400 hover:shadow-medium hover:scale-105 relative overflow-hidden h-full">
                  <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/10 rounded-full -ml-14 -mb-14"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-6">
                          <path fill="rgb(255,255,255)" d="M197.8 100.3C208.7 107.9 211.3 122.9 203.7 133.7L147.7 213.7C143.6 219.5 137.2 223.2 130.1 223.8C123 224.4 116 222 111 217L71 177C61.7 167.6 61.7 152.4 71 143C80.3 133.6 95.6 133.7 105 143L124.8 162.8L164.4 106.2C172 95.3 187 92.7 197.8 100.3zM197.8 260.3C208.7 267.9 211.3 282.9 203.7 293.7L147.7 373.7C143.6 379.5 137.2 383.2 130.1 383.8C123 384.4 116 382 111 377L71 337C61.6 327.6 61.6 312.4 71 303.1C80.4 293.8 95.6 293.7 104.9 303.1L124.7 322.9L164.3 266.3C171.9 255.4 186.9 252.8 197.7 260.4zM288 160C288 142.3 302.3 128 320 128L544 128C561.7 128 576 142.3 576 160C576 177.7 561.7 192 544 192L320 192C302.3 192 288 177.7 288 160zM288 320C288 302.3 302.3 288 320 288L544 288C561.7 288 576 302.3 576 320C576 337.7 561.7 352 544 352L320 352C302.3 352 288 337.7 288 320zM224 480C224 462.3 238.3 448 256 448L544 448C561.7 448 576 462.3 576 480C576 497.7 561.7 512 544 512L256 512C238.3 512 224 497.7 224 480zM128 440C150.1 440 168 457.9 168 480C168 502.1 150.1 520 128 520C105.9 520 88 502.1 88 480C88 457.9 105.9 440 128 440z" />
                        </svg>
                      </div>
                      <h1 className="font-poppins font-bold text-xl">{aboutData.misiTitle || "Misi"}</h1>
                    </div>
                    <ul className="space-y-1.5 text-white/90">
                      {misiItems.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-primary-300 mt-0.5 flex-shrink-0">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
