import { useState } from "react";
import CardPro from "../components/molecules/CardPro";
import bg from "../assets/images/bg_home.jpeg";
import Description from "../components/atoms/Description";
import Tittle from "../components/atoms/Tittle";
import Subtitle from "../components/atoms/Subtitle";
import Tagline from "../components/atoms/Tagline";
import Perlak from "../assets/images/perlak.jpeg";
import Perlak1 from "../assets/images/perlak1.jpeg";
import Score from "../components/atoms/Score";

export default function Program() {
  const programs = [
    {
      images: [Perlak, Perlak1],
      title: "PECABA 2025",
      subtitle: "Pelantikan Calon Bantara",
    },
    {
      images: [Perlak1, Perlak],
      title: "Perlak",
      subtitle: "Pelantikan Calon Bantara",
    },
  ];

  const [page, setPage] = useState(0);
  const current = programs[page];
  const handleNext = () => {
    setPage((prev) => (prev === programs.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setPage((prev) => (prev === 0 ? programs.length - 1 : prev - 1));
  };

  return (
    <section
      id="program"
      className="min-h-screen bg-white py-10 px-10 xl:px-52 flex flex-col lg:flex-col xl:flex-row gap-10 justify-center items-center"
    >
      <div className="flex md:flex-row lg:flex-row xl:flex-col gap-5 md:w-full lg:w-full xl:w-2/3">
        {current.images.map((image, i) => (
          <div key={i} className="aspect-[7/4] overflow-hidden rounded-xl">
            <img src={image} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      <div className="mw-full xl:w-4/5">
        <Tagline>Pogram Kami</Tagline>
        <div className="flex justify-between">
          <div>
            <Tittle>{current.title}</Tittle>
            <Subtitle>{current.subtitle}</Subtitle>
          </div>
          <div className=" flex items-center gap-5">
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
        </div>

        <Description style="justify">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fuga
          voluptates nihil dolores sunt ipsam veniam neque repudiandae minus
          illum voluptas officiis hic, necessitatibus ullam, reprehenderit sint
          architecto praesentium sequi quaerat inventore obcaecati voluptatum?
          Reiciendis dicta maxime adipisci fugiat itaque, tempore facere dolor
          consequatur totam cum cumque repellendus accusamus, corporis laborum.
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fuga
          voluptates nihil dolores sunt ipsam veniam neque repudiandae minus
          illum voluptas officiis hic, necessitatibus ullam, reprehenderit sint
          architecto praesentium sequi quaerat inventore obcaecati voluptatum?
          Reiciendis dicta maxime adipisci fugiat itaque, tempore facere dolor
          consequatur totam cum cumque repellendus accusamus, corporis laborum.
        </Description>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-5 text-center">
          <div className="px-3 border-r border-gray-200">
            <Score value={120} suffix="+" label="Active" />
          </div>

          <div className="px-3 border-r border-gray-200">
            <Score value={92} suffix="K" label="Users" />
          </div>

          <div className="px-3 border-r border-gray-200">
            <Score value={25} suffix="%" label="Growth" />
          </div>

          <div className="px-3">
            <Score value={12} suffix="K+" label="Testimonials" />
          </div>
        </div>
      </div>
    </section>
  );
}
