import { useState } from "react";
import CardPro from "../components/molecules/CardPro";
import bg from "../assets/images/home.jpeg";
import Title from "../components/atoms/Tittle";
import Description from "../components/atoms/Description";

const programs = [
  { id: 1, image: bg, title: "Program A", description: "Deskripsi singkat tentang program A." },
  { id: 2, image: bg, title: "Program B", description: "Deskripsi singkat tentang program B." },
  { id: 3, image: bg, title: "Program C", description: "Deskripsi singkat tentang program C." },
  { id: 4, image: bg, title: "Program D", description: "Deskripsi singkat tentang program D." },
  { id: 5, image: bg, title: "Program E", description: "Deskripsi singkat tentang program E." },
  { id: 6, image: bg, title: "Program F", description: "Deskripsi singkat tentang program F." },
  { id: 7, image: bg, title: "Program G", description: "Deskripsi singkat tentang program G." },
  { id: 8, image: bg, title: "Program H", description: "Deskripsi singkat tentang program H." },
  { id: 9, image: bg, title: "Program I", description: "Deskripsi singkat tentang program I." },
  { id: 10, image: bg, title: "Program J", description: "Deskripsi singkat tentang program J." },
  { id: 11, image: bg, title: "Program K", description: "Deskripsi singkat tentang program K." },
  { id: 12, image: bg, title: "Program L", description: "Deskripsi singkat tentang program L." },
];

const ITEMS_PER_PAGE = 1;

export default function Program() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(programs.length / ITEMS_PER_PAGE);

  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
  const currentPrograms = programs.slice(indexOfFirst, indexOfLast);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <section
      id="program"
      className="min-h-screen flex items-center justify-center bg-white py-10"
    >
      <div className="text-center max-w-7xl mx-auto px-4">

        <div className="flex gap-6 mt-10 justify-center flex-wrap">
          {currentPrograms.map((program) => (
            <div key={program.id} className="w-full max-w-[400px]">
              <CardPro
                image={program.image}
                tittle={program.title}
                description={program.description}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center gap-2 mt-10">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === page
                  ? "bg-sky-600 text-white"
                  : "bg-sky-500 text-white hover:bg-sky-600"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
