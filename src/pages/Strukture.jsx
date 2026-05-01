import Card from "../components/molecules/Card";
import Orang from "../assets/orang/orangan.jpeg";
import Tittle from "../components/atoms/Tittle";
import Description from "../components/atoms/Description";
import Bg from "../assets/images/bg_home.jpeg";
import Bg2 from "../assets/images/bg_2.jpeg";
import Bga from "../assets/images/bga.jpg";
import Anggota from "../assets/images/anggota.png"
import { useState } from "react";
import Angkatan from "../pages/Angkatan";

export default function Strukture() {
  const organisasi = [
    {
      angkatan: "50/14",
      image: Bg,
      status: "Demisoner",
      members: [
        {
          image: Anggota,
          nama: "Ifan",
          bidang: "Logistik",
        },
        {
          image: Bg,
          nama: "HUMAS",
          bidang: "Hubungan Masyarakat",
        },
        {
          image: Bg,
          nama: "HUMAS",
          bidang: "Hubungan Masyarakat",
        },
        {
          image: Bg,
          nama: "HUMAS",
          bidang: "Hubungan Masyarakat",
        },
        {
          image: Bg,
          nama: "HUMAS",
          bidang: "Hubungan Masyarakat",
        },
        {
          image: Bg,
          nama: "HUMAS",
          bidang: "Hubungan Masyarakat",
        },
        {
          image: Bg,
          nama: "HUMAS",
          bidang: "Hubungan Masyarakat",
        },
        {
          image: Bg,
          nama: "HUMAS",
          bidang: "Hubungan Masyarakat",
        },
        {
          image: Bg,
          nama: "HUMAS",
          bidang: "Hubungan Masyarakat",
        },
        {
          image: Bg,
          nama: "HUMAS",
          bidang: "Hubungan Masyarakat",
        },
        {
          image: Bg,
          nama: "HUMAS",
          bidang: "Hubungan Masyarakat",
        },
        {
          image: Bg,
          nama: "HUMAS",
          bidang: "Hubungan Masyarakat",
        },
        {
          image: Bg,
          nama: "HUMAS",
          bidang: "Hubungan Masyarakat",
        },
        {
          image: Bg,
          nama: "HUMAS",
          bidang: "Hubungan Masyarakat",
        },
        {
          image: Bg,
          nama: "HUMAS",
          bidang: "Hubungan Masyarakat",
        },
        {
          image: Bg,
          nama: "HUMAS",
          bidang: "Hubungan Masyarakat",
        },
        {
          image: Bg,
          nama: "HUMAS",
          bidang: "Hubungan Masyarakat",
        },
        {
          image: Bg,
          nama: "HUMAS",
          bidang: "Hubungan Masyarakat",
        },
        {
          image: Bg,
          nama: "HUMAS",
          bidang: "Hubungan Masyarakat",
        },
        {
          image: Bg,
          nama: "HUMAS",
          bidang: "Hubungan Masyarakat",
        },
        {
          image: Bg,
          nama: "HUMAS",
          bidang: "Hubungan Masyarakat",
        },
        {
          image: Bg,
          nama: "HUMAS",
          bidang: "Hubungan Masyarakat",
        },
        {
          image: Bg,
          nama: "HUMAS",
          bidang: "Hubungan Masyarakat",
        },
        {
          image: Bg,
          nama: "HUMAS",
          bidang: "Hubungan Masyarakat",
        },
        {
          image: Bg,
          nama: "HUMAS",
          bidang: "Hubungan Masyarakat",
        },
        {
          image: Bg,
          nama: "HUMAS",
          bidang: "Hubungan Masyarakat",
        },
        {
          image: Bg,
          nama: "HUMAS",
          bidang: "Hubungan Masyarakat",
        },
        {
          image: Bg,
          nama: "HUMAS",
          bidang: "Hubungan Masyarakat",
        },
        {
          image: Bg,
          nama: "HUMAS",
          bidang: "Hubungan Masyarakat",
        },
      ],
    },
    {
      angkatan: "51/15",
      image: Bga,
      status: "Demisoner",
      members: [
        {
          image: Bg,
          nama: "KRANI",
          bidang: "Hubungan Krani",
        },
        {
          image: Bg,
          nama: "KRANI",
          bidang: "Hubungan Krani",
        },
      ],
    },
    {
      angkatan: "52/16",
      image: Bg2,
      status: "Demisoner",
      members: [
        {
          image: Bg2,
          nama: "Demisoner",
          bidang: "52/16",
        },
      ],
    },
  ];

  const [page, setPage] = useState(0);
  const current = organisasi[page];
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
          dataAngkatan={current}
          handlePrev={handlePrev}
          handleNext={handleNext}
        />
      </div>

      {/* <h2 className="text-xl font-bold mt-6">{current.angkatan}</h2> */}
    </section>
  );
}
