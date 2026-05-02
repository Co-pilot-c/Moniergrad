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
      className="relative bg-white py-16 lg:py-24 px-6 lg:px-20 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gradient-green-light opacity-10 rounded-full blur-3xl -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-200 opacity-10 rounded-full blur-2xl"></div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Image Gallery */}
          <div className="space-y-6 animate-fadeSlideIn">
            <div className="flex flex-col lg:flex-col gap-6">
              {current.images.map((image, i) => (
                <div key={i} className="relative group">
                  <div className="absolute inset-0 bg-gradient-green opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-400"></div>
                  <div className="aspect-[7/4] overflow-hidden rounded-3xl shadow-soft group-hover:shadow-medium transition-all duration-400">
                    <img 
                      src={image} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Image indicators */}
            <div className="flex justify-center gap-2">
              {programs.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-400 ${
                    index === page 
                      ? "w-8 bg-gradient-green" 
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8 animate-fadeSlideUp">
            <div className="space-y-4">
              <Tagline>Program Kami</Tagline>
              <div className="flex justify-between items-start">
                <div>
                  <Tittle>{current.title}</Tittle>
                  <Subtitle>{current.subtitle}</Subtitle>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrev}
                    className="w-12 h-12 bg-white rounded-full shadow-soft flex items-center justify-center text-gray-700 hover:bg-gradient-green hover:text-white hover:shadow-green transition-all duration-400 transform hover:scale-110"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    onClick={handleNext}
                    className="w-12 h-12 bg-white rounded-full shadow-soft flex items-center justify-center text-gray-700 hover:bg-gradient-green hover:text-white hover:shadow-green transition-all duration-400 transform hover:scale-110"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
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

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center group">
                <div className="bg-gradient-green-light/10 rounded-2xl p-6 transition-all duration-400 group-hover:shadow-green group-hover:scale-105">
                  <Score value={120} suffix="+" label="Active" />
                </div>
              </div>

              <div className="text-center group">
                <div className="bg-gradient-green-light/10 rounded-2xl p-6 transition-all duration-400 group-hover:shadow-green group-hover:scale-105">
                  <Score value={92} suffix="K" label="Users" />
                </div>
              </div>

              <div className="text-center group">
                <div className="bg-gradient-green-light/10 rounded-2xl p-6 transition-all duration-400 group-hover:shadow-green group-hover:scale-105">
                  <Score value={25} suffix="%" label="Growth" />
                </div>
              </div>

              <div className="text-center group">
                <div className="bg-gradient-green-light/10 rounded-2xl p-6 transition-all duration-400 group-hover:shadow-green group-hover:scale-105">
                  <Score value={12} suffix="K+" label="Testimonials" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
