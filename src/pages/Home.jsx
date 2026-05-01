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
      className="relative h-screen flex justify-center items-center m-10 rounded-2xl"
      style={{
        backgroundImage: `url(${bg_home})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/50 rounded-2xl" />

      <div className="relative z-10 text-center text-white shadow-md">
        <h2 className="font-poppins font-bold text-xl md:text-2xl lg:text-3xl">
          WELCOME TO
        </h2>
        <h1 className="font-poopins font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl w-3/4 md:w-4/5 lg:w-4/5 xl:w-3/5 mx-auto">
          {homeData.tittle}
        </h1>
        <p className="font-poppins text-sm w-2/3 md:w-4/4 lg:w-3/5 xl:4/5 mx-auto mt-3">
          {homeData.description}
        </p>
        <button className="bg-white text-gray-900 font-semibold font-poppins px-6 py-2 rounded-full mt-5">
          Jelajahi
        </button>
      </div>
    </section>
  );
}
