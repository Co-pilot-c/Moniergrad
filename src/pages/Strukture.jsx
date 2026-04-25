import Card from "../components/molecules/Card";
import Orang from "../assets/orang/orangan.jpeg";
import Tittle from "../components/atoms/Tittle";
import Description from "../components/atoms/Description";
import Patt from "../assets/orang/patt.jpg";
import { useState } from "react";

export default function Strukture() {
  const organisasi = [
    {
      angkatan: "Monierson 51",
      members: [
        { image: Patt, name: "A", jabatan: "Ketua", periode: "51" },
        { image: Patt, name: "B", jabatan: "Wakil", periode: "51" },
        { image: Patt, name: "C", jabatan: "Anggota", periode: "51" },
        { image: Patt, name: "D", jabatan: "Anggota", periode: "51" },
        { image: Patt, name: "E", jabatan: "Anggota", periode: "51" },
        { image: Patt, name: "F", jabatan: "Anggota", periode: "51" },
        { image: Patt, name: "A", jabatan: "Ketua", periode: "51" },
        { image: Patt, name: "B", jabatan: "Wakil", periode: "51" },
        { image: Patt, name: "C", jabatan: "Anggota", periode: "51" },
        { image: Patt, name: "D", jabatan: "Anggota", periode: "51" },
        { image: Patt, name: "E", jabatan: "Anggota", periode: "51" },
        { image: Patt, name: "F", jabatan: "Anggota", periode: "51" },
        { image: Patt, name: "A", jabatan: "Ketua", periode: "51" },
        { image: Patt, name: "B", jabatan: "Wakil", periode: "51" },
        { image: Patt, name: "C", jabatan: "Anggota", periode: "51" },
        { image: Patt, name: "D", jabatan: "Anggota", periode: "51" },
        { image: Patt, name: "E", jabatan: "Anggota", periode: "51" },
        { image: Patt, name: "F", jabatan: "Anggota", periode: "51" },
      ],
    },
    {
      angkatan: "Monierson 52",
      members: [
        { image: Patt, name: "A", jabatan: "Ketua", periode: "51" },
        { image: Patt, name: "B", jabatan: "Wakil", periode: "51" },
        { image: Patt, name: "C", jabatan: "Anggota", periode: "51" },
        { image: Patt, name: "D", jabatan: "Anggota", periode: "51" },
        { image: Patt, name: "E", jabatan: "Anggota", periode: "51" },
        { image: Patt, name: "F", jabatan: "Anggota", periode: "51" },
        { image: Patt, name: "A", jabatan: "Ketua", periode: "51" },
        { image: Patt, name: "B", jabatan: "Wakil", periode: "51" },
        { image: Patt, name: "C", jabatan: "Anggota", periode: "51" },
        { image: Patt, name: "D", jabatan: "Anggota", periode: "51" },
        { image: Patt, name: "E", jabatan: "Anggota", periode: "51" },
        { image: Patt, name: "F", jabatan: "Anggota", periode: "51" },
        { image: Patt, name: "A", jabatan: "Ketua", periode: "51" },
        { image: Patt, name: "B", jabatan: "Wakil", periode: "51" },
        { image: Patt, name: "C", jabatan: "Anggota", periode: "51" },
        { image: Patt, name: "D", jabatan: "Anggota", periode: "51" },
        { image: Patt, name: "E", jabatan: "Anggota", periode: "51" },
        { image: Patt, name: "F", jabatan: "Anggota", periode: "51" },
      ],
    },
  ];

  const [page, setPage] = useState(0);
  const current = organisasi[page];

  return (
    <section
      id="strukture"
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-sky-200"
    >
      {/* Content */}
      <div className="text-center my-10">
        <div className="px-10 max-w-7xl mx-auto">
          <Tittle>
            <span className="text-gray-900">Struktur</span> Organisasi
          </Tittle>
          <Description>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam
            magnam corrupti dicta praesentium aspernatur eligendi deserunt esse
            officiis itaque nam eaque facere inventore adipisci vitae, velit sit
            tenetur delectus tempore?
          </Description>
        </div>

        {/* <h2 className="text-xl font-bold mt-6">{current.angkatan}</h2> */}
        <div className="mt-10 space-y-6 px-3 max-w-7xl">
          <div
            className="overflow-x-auto pb-10 scroll-smooth scrollbar-hide-mobile grid grid-cols-4
            md:grid md:grid-cols-4 "
          >
            <div className="grid grid-rows-2 grid-flow-col gap-5">
              {current.members.map((item, i) => (
                <div key={i} className="w-[250px]">
                  <Card {...item} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-3 mt-10">
          {organisasi.map((item, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`px-4 py-2 rounded ${
                i === page ? "bg-sky-500 text-white" : "bg-sky-100"
              }`}
            >
              {item.angkatan}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
