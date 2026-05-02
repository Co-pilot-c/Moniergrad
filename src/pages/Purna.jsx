import { useState, useEffect } from "react";
import Title from "../components/atoms/Tittle";
import Description from "../components/atoms/Description";
import CardCom from "../components/molecules/CardCom";
import { fetchContent } from "../utils/contentLoader.js";
import defaultProfile from "../assets/vector/orangk.jpg";

export default function Purna() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const loadPurnaData = async () => {
      const purnaItems = await fetchContent("purna");
      const formattedItems = purnaItems.map(item => ({
        profile: item.profile || defaultProfile,
        name: item.title,
        purna: item.angkatan,
        quetes: item.quotes,
      }));
      setTestimonials(formattedItems);
    };
    loadPurnaData();
  }, []);

  return (
    <section
      id="purna"
      className="relative bg-gradient-to-br from-white to-primary-50/30 py-16 lg:py-24 px-6 lg:px-2"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-green-light opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-200 opacity-10 rounded-full blur-2xl"></div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fadeSlideUp">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-green-light/20 rounded-full border border-primary-200/30 mb-6">
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-primary-700">Testimonials</span>
          </div>
          <Title>Kata Purna</Title>
          <Description>Cerita inspiratif dari alumni Dewan Ambalan</Description>
        </div>

        {/* Horizontal Auto-scroll Container */}
        <div className="relative overflow-hidden pb-20 hide-scrollbar">
          <div className="flex space-x-6 animate-scroll">
            {testimonials.map((item, index) => (
              <div key={index} className="flex-shrink-0 w-full max-w-md lg:max-w-lg">
                <CardCom
                  profile={item.profile}
                  name={item.name}
                  purna={item.purna}
                  quetes={item.quetes}
                />
              </div>
            ))}
            {/* Duplicate cards for seamless loop */}
            {testimonials.map((item, index) => (
              <div
                key={`dup-${index}`}
                className="flex-shrink-0 w-full max-w-md lg:max-w-lg"
              >
                <CardCom
                  profile={item.profile}
                  name={item.name}
                  purna={item.purna}
                  quetes={item.quetes}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-fadeSlideUp">
          <div className="bg-white rounded-3xl shadow-soft p-8 lg:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Bergabunglah dengan Keluarga Besar Dewan Ambalan
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Jadilah bagian dari perjalanan inspiratif dan bentuk karakter kepemimpinanmu bersama kami.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-green text-white rounded-full font-medium shadow-green hover:shadow-medium transition-all duration-400 transform hover:scale-105">
                Bergabung Sekarang
              </button>
              <button className="px-8 py-3 bg-white text-gray-900 border border-gray-200 rounded-full font-medium hover:border-primary-500 hover:bg-primary-50 transition-all duration-400">
                Pelajari Lebih Lanjut
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
