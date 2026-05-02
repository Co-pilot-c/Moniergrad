import { data, Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useEffect, useState } from "react";

export default function Angkatan({
  image,
  status,
  angkatan,
  handlePrev,
  handleNext,
  mode = "simple",
  dataAngkatan,
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="home"
      className={`relative flex justify-between items-end h-[60vh] sm:h-[70vh] md:h-screen mx-4 sm:m-6 rounded-xl overflow-hidden 
        ${mode === "simple" ? "md:m-0 md:rounded-none" : "md:m-10 md:rounded-2xl"}`}
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10" />

      {mode === "detail" && (
        <HashLink
          smooth
          to="/#strukture"
          className={`z-20 flex items-center  text-gray-900 bg-white py-2 px-3 lg:px-3 lg:py-2 rounded-full
          ${isScrolled ? "fixed top-8 left-16" : "absolute top-3 left-3"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            className="w-6"
          >
            <path
              fill="rgb(12, 12, 12)"
              d="M201.4 297.4C188.9 309.9 188.9 330.2 201.4 342.7L361.4 502.7C373.9 515.2 394.2 515.2 406.7 502.7C419.2 490.2 419.2 469.9 406.7 457.4L269.3 320L406.6 182.6C419.1 170.1 419.1 149.8 406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3L201.3 297.3z"
            />
          </svg>
          <span className="hidden sm:inline">Kembali</span>
        </HashLink>
      )}

      <div className="relative z-10 text-left p-5 sm:p-8 md:p-10 text-white shadow-md">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-2 animate-scaleIn">
          <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></span>
          <span className="text-sm font-medium">{status}</span>
        </div>
        <h2 className="font-poppins text-green-200 font-bold text-xl md:text-2xl lg:text-3xl">
          Dewan Ambalan
        </h2>
        <h1 className="font-poopins font-bold text-4xl md:text-6xl lg:text-7xl">
          MONIERGRAD {angkatan}
        </h1>

        {mode === "detail" && (
          <p className="w-3/3 text-xs lg:w-1/2 lg:text-base">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut
            dolores repudiandae tenetur iusto quas libero laboriosam ipsam ipsum
            a explicabo, obcaecati harum soluta dolorum, magni laudantium nemo
            illum quidem officia.
          </p>
        )}

        {mode === "simple" && (
          <button className="bg-white text-gray-900 mt-5 px-3 py-2 md:px-4 md:py2 lg:px-5 lg:py-3  hover:bg-white/50 text-sm font-semibold rounded-full">
            <Link to="/profile" state={{ data: dataAngkatan }}>
              {" "}
              Selengkapnya
            </Link>
          </button>
        )}
      </div>

      {mode === "simple" && (
        <div className="relative flex z-10 justify-end p-5 sm:p-8 md:p-10 gap-5">
          <button
            onClick={handlePrev}
            className="bg-white w-12 h-12 md:w-16 md:h-16 rounded-full"
          >
            ❮
          </button>

          <button
            onClick={handleNext}
            className="bg-white w-12 h-12 md:w-16 md:h-16  rounded-full"
          >
            ❯
          </button>
        </div>
      )}
    </section>
  );
}
