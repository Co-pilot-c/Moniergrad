import { useState, useEffect } from "react";
import Card from "../components/molecules/Card";
import Tittle from "../components/atoms/Tittle";
import Description from "../components/atoms/Description";
import Bg from "../assets/images/bg_home.jpeg";
import Angkatan from "../pages/Angkatan";
import { fetchContent } from "../utils/contentLoader.js";

export default function Strukture() {
  const [organisasi, setOrganisasi] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const angkatanData = await fetchContent("angkatan");
      setOrganisasi(angkatanData);
    };
    loadData();
  }, []);

  const current = organisasi.length > 0 ? organisasi[page] : {
    title: "Loading...",
    image: Bg,
    status: "Loading",
    members: [],
  };

  const handlePrev = () => {
    setPage((prev) => (prev === 0 ? organisasi.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setPage((prev) => (prev === organisasi.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="strukture" className="bg-white">
      {/* Content */}
      <div className="relative">
        <Angkatan
          {...current}
          angkatan={current.title}
          image={current.image}
          status={current.status}
          members={current.members}
          dataAngkatan={current}
          handlePrev={handlePrev}
          handleNext={handleNext}
        />
      </div>
    </section>
  );
}
