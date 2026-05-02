import { useEffect, useState } from "react";
import Tittle from "../components/atoms/Tittle.jsx";
import Button from "../components/atoms/Button.jsx";
import Description from "../components/atoms/Description.jsx";
import Score from "../components/atoms/Score.jsx";
import bg_home from "../assets/images/bg_home.jpeg";
import { fetchContent } from "../utils/contentLoader.js";

export default function Home() {
  const [heroData, setHeroData] = useState({
    title: "Dewan Ambalan Monierson & Gradison",
    description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus, distinctio natus. Adipisci necessitatibus a consectetur.",
    maskot_image: null,
  });
  const [ctaButtons, setCtaButtons] = useState([]);

  useEffect(() => {
    const loadHeroData = async () => {
      const heroItems = await fetchContent("hero");
      if (heroItems.length > 0) {
        setHeroData(heroItems[0]);
      }
    };
    loadHeroData();
  }, []);

  useEffect(() => {
    const loadCtaButtons = async () => {
      const buttons = await fetchContent("cta", true);
      setCtaButtons(buttons);
    };
    loadCtaButtons();
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex justify-center items-center mx-4 my-10 lg:mx-10 rounded-3xl overflow-hidden animate-fadeIn"
      style={{
        backgroundImage: `url(${bg_home})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
      
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent" />

      <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-6 animate-fadeSlideUp">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-2 animate-scaleIn">
          <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></span>
          <span className="text-sm font-medium">Welcome to Our Community</span>
        </div>

        {/* <h2 className="font-poppins font-semibold text-lg md:text-xl lg:text-2xl text-primary-200 mb-2 animate-fadeSlideUp" style={{animationDelay: "0.2s"}}>
          WELCOME TO
        </h2> */}
        <h1 className="font-poppins font-bold text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl leading-tight mb-6 animate-fadeSlideUp" style={{animationDelay: "0.3s"}}>
          {heroData.title}
        </h1>
        <p className="font-poppins text-base md:text-lg lg:text-xl text-gray-200 max-w-3xl mx-auto mb-8 leading-relaxed animate-fadeSlideUp" style={{animationDelay: "0.4s"}}>
          {heroData.description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeSlideUp" style={{animationDelay: "0.5s"}}>
          {ctaButtons.map((button, index) => {
            let href = "#";
            
            if (button.link_type === "internal") {
              href = button.link_url || "#";
            } else if (button.link_type === "external") {
              href = button.link_url || "#";
            } else if (button.link_type === "whatsapp") {
              const phoneNumber = button.whatsapp_number || "6281234567890";
              href = `https://wa.me/${phoneNumber}`;
            }

            return (
              <Button 
                key={index} 
                variant={button.variant || "primary"} 
                href={href}
              >
                {button.label}
              </Button>
            );
          })}
        </div>

        {/* Scroll indicator
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div> */}
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary-400/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary-500/10 rounded-full blur-xl animate-pulse" style={{animationDelay: "1s"}}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary-300/10 rounded-full blur-xl animate-pulse" style={{animationDelay: "0.5s"}}></div>
    </section>
  );
}
