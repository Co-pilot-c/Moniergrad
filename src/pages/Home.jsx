import maskot from "../assets/vector/maskot.png";
import Tittle from "../components/atoms/Tittle.jsx";
import Button from "../components/atoms/Button.jsx";
import Description from "../components/atoms/Description.jsx";
import Maskot from "../assets/vector/Maskot.png";
import Score from "../components/atoms/Score.jsx";
import bg_home from "../assets/images/bg_home.jpeg";

export default function Home() {
  const homeData = {
    tittle: "Dewan Ambalan Monierson & Gradison",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus, distinctio natus. Adipisci necessitatibus a consectetur.",
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex justify-center items-center m-4 lg:mx-10 rounded-3xl overflow-hidden animate-fadeIn"
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
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6 animate-scaleIn">
          <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></span>
          <span className="text-sm font-medium">Welcome to Our Community</span>
        </div>

        <h1 className="font-poppins font-bold text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-7xl leading-tight mb-2 lg:mb-6 animate-fadeSlideUp" style={{animationDelay: "0.3s"}}>
          {homeData.tittle}
        </h1>
        <p className="font-poppins text-base md:text-lg lg:text-xl text-gray-200 max-w-3xl mx-auto mb-8 leading-relaxed animate-fadeSlideUp" style={{animationDelay: "0.4s"}}>
          {homeData.description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeSlideUp" style={{animationDelay: "0.5s"}}>
          <Button variant="primary" href="#about">
            Jelajahi
          </Button>
          <Button variant="secondary" href="#strukture">
            Anggota
          </Button>
        </div>

        
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary-400/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary-500/10 rounded-full blur-xl animate-pulse" style={{animationDelay: "1s"}}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary-300/10 rounded-full blur-xl animate-pulse" style={{animationDelay: "0.5s"}}></div>
    </section>
  );
}
