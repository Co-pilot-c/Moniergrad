import { useState, useEffect } from "react";
import Card from "../components/molecules/Card";
import Tittle from "../components/atoms/Tittle";
import Description from "../components/atoms/Description";
import Bg from "../assets/images/bg_home.jpeg";
import Angkatan, { angkatanData } from "../pages/Angkatan";

export default function Strukture() {
  const [organisasi, setOrganisasi] = useState([]);
  const [page, setPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState('next');

  useEffect(() => {
    // Use dummy data directly
    setOrganisasi(angkatanData);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isTransitioning) return;
      
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTransitioning, organisasi.length]);

  
  const current = organisasi.length > 0 ? organisasi[page] : {
    angkatan: "Loading...",
    image: Bg,
    status: "Loading",
    members: [],
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection('prev');
    setTimeout(() => {
      setPage((prev) => (prev === 0 ? organisasi.length - 1 : prev - 1));
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection('next');
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
              ? direction === 'next'
                ? 'translate-x-full opacity-0'
                : '-translate-x-full opacity-0'
              : 'translate-x-0 opacity-100'
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
              setDirection(index > page ? 'next' : 'prev');
              setTimeout(() => {
                setPage(index);
                setTimeout(() => setIsTransitioning(false), 50);
              }, 300);
            }}
            className={`transition-all duration-300 ${
              index === page
                ? 'w-8 h-2 bg-gradient-green rounded-full'
                : 'w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400'
            }`}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
