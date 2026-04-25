import maskot from "../assets/vector/maskot.png";
import Tittle from "../components/atoms/Tittle.jsx";
import Button from "../components/atoms/Button.jsx";
import Description from "../components/atoms/Description.jsx";
import Maskot from "../assets/vector/Maskot.png";

import Score from "../components/atoms/Score.jsx";

export default function Home() {
  return (
    <section
      id="home"
      className="relative h-screen flex justify-center items-end bg-gradient-to-tr from-white via-sky-100 to-sky-300 m-10 rounded-3xl "
    >
      <div className="text-center w-5/6 sm:w-5/6 md:w-4/6 lg:w-3/6 z-10">
        <div className="sm:mb-32 lg:mb-0">
          <Tittle>
            Selamat <span className="text-gray-900">Datang</span>
          </Tittle>
          <Description style="center">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Temporibus
            dolor, magnam fuga et inventore voluptate cumque obcaecati eum
            aliquid placeat.
          </Description>
        </div>

        <div className="relative">
          <img src={Maskot} alt="" />

          {/* <div className="absolute bottom-20 left-52 flex gap-5 backdrop-blur-lg bg-sky-100/50 border border-white shadow-xl rounded-2xl p-5 text-center hover-scale-105 trasition duration-300">
            <Score value={120} suffix="+" label="Anggota Active" />
            <Score value={120} suffix="+" label="Anggota Active" />
            <Score value={120} suffix="+" label="Anggota Active" />
          </div> */}
        </div>
      </div>
    </section>
  );
}
