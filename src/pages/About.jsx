import Button from "../components/atoms/Button.jsx";
import Tittle from "../components/atoms/Tittle.jsx";
import Bg_home from "../assets/images/bg_home.jpeg";
import Description from "../components/atoms/Description.jsx";
import Score from "../components/atoms/Score.jsx";
import Tagline from "../components/atoms/Tagline.jsx";
import Subtitle from "../components/atoms/Subtitle.jsx";

export default function About() {
  const aboutData = {
    tittle: "Wadah untuk Menampung Ide dan Gagasna",
  };
  return (
    <section
      id="about"
      className="relative bg-white py-5 px-10 lg:px-20 lg:py-20"
    >
      <div className="grid md:grid-cols-2 gap-20">
        <div>
          <Tagline>Tentang Kami</Tagline>
          <Tittle>{aboutData.tittle}</Tittle>
          <Description style="justify">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem
            officia mollitia magnam recusandae sequi? Ipsam assumenda facilis,
            repellendus quaerat, magnam repudiandae ducimus, dolores eum hic
            veniam soluta sit perferendis nulla.Lorem ipsum dolor sit amet,
            consectetur adipisicing elit. Rem officia mollitia magnam recusandae
            sequi? Ipsam assumenda facilis, repellendus quaerat, magnam
            repudiandae ducimus, dolores eum hic veniam soluta sit perferendis
            nulla. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem
            officia mollitia magnam recusandae sequi? Ipsam assumenda facilis,
            repellendus quaerat, magnam repudiandae ducimus, dolores eum hic
            veniam soluta sit perferendis nulla. Ipsam assumenda facilis,
            repellendus quaerat, magnam repudiandae ducimus, dolores eum hic
            veniam soluta sit perferendis nulla.
          </Description>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 text-center">
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

        <div className="flex flex-col">
          <div className="flex flex-col xl:flex-row gap-5 mb-10">
            <img
              src={Bg_home}
              alt=""
              className="w-full xl:w-1/2 object-cover rounded-xl"
            />
            <div>
              <h3 className="font-poppins font-bold text-4xl xl:text-5xl text-gray-900">
                Meninggalkan Jejak <br /> untuk Mengukir Sejarah{" "}
              </h3>
            </div>
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-5">
            <div className="bg-gray-500 p-5 rounded-3xl">
              <h1 className="font-poppins font-bold text-white text-3xl">
                Visi
              </h1>
              <p className="">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
                porro ad sed neque reiciendis corporis, consequatur, molestiae
                ea saepe inventore quis aut cupiditate fugit adipisci,
                voluptatibus tenetur dolores esse quibusdam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit.
              </p>
            </div>
            <div className="bg-gray-500 p-5 rounded-3xl">
              <h1 className="font-bold text-3xl text-white">Misi</h1>
              <p className="px-5">
                <li>Lorem ipsum dolor sit amet.</li>
                <li>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui,
                  delectus!
                </li>
                <li>Lorem ipsum dolor, sit amet consectetur adipisicing.</li>
                <li>Lorem ipsum dolor sit amet consectetur.</li>
                <li>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </li>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
