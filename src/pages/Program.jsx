import { useState } from "react";
import CardPro from "../components/molecules/CardPro";
import bg from "../assets/images/home.jpeg";
import Title from "../components/atoms/Tittle";
import Description from "../components/atoms/Description";
import Tittle from "../components/atoms/Tittle";

const programs = [
  {
    id: 1,
    image: bg,
    title: "PECAPA",
    description: "Pelantikan Calon Panegak",
  },
  {
    id: 1,
    image: bg,
    title: "PECABA",
    description: "Pelantikan Calon Bantara",
  },
  {
    id: 1,
    image: bg,
    title: "PERLAK",
    description: "Perjalanan Laksana",
  },
  {
    id: 1,
    image: bg,
    title: "MUBAL",
    description: "Musyawarah Ambalan",
  },
  {
    id: 1,
    image: bg,
    title: "MILAD",
    description: "Menyambut Ulang Tahun Ambalan",
  },
  {
    id: 1,
    image: bg,
    title: "PASPRAMA",
    description: "Kegiatan Extrakullikuler",
  },
];

export default function Program() {
  return (
    <section
      id="program"
      className="min-h-screen bg-gradient-to-b from-sky-200 to-sky-300 py-10 px-4 sm:px-6 lg:px-10"
    >
      <div className="text-center my-10">
        <div className="max-w-5xl mx-auto">
          <Tittle>
            Program <span className="text-gray-900">Kerja</span>
          </Tittle>
          <Description>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea
            asperiores, minima optio eaque iusto dolorem aspernatur reiciendis
            facere at nemo inventore illo, voluptatum corporis itaque adipisci
            maxime nesciunt?
          </Description>
        </div>

        <div className="mt-20">
          <div className="flex gap-4 overflow-x-auto pb-10 scroll-smooth">
            {programs.map((program, i) => (
              <div
                key={i}
                className="min-w-[85%] sm:min-w-[300px] md:min-w-[350px] lg:min-w-[450px] flex-shrink-0"
              >
                <CardPro
                  image={program.image}
                  title={program.title}
                  description={program.description}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
