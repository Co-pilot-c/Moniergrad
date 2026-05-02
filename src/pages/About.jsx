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
      className="relative bg-white py-16 lg:py-24 px-6 lg:px-20 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-green-light opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-200 opacity-10 rounded-full blur-2xl"></div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fadeSlideIn">
            <div className="space-y-4">
              <Tagline>Tentang Kami</Tagline>
              <Tittle>{aboutData.tittle}</Tittle>
              <Description style="justify">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem
                officia mollitia magnam recusandae sequi? Ipsam assumenda
                facilis, repellendus quaerat, magnam repudiandae ducimus,
                dolores eum hic veniam soluta sit perferendis nulla.Lorem ipsum
                dolor sit amet, consectetur adipisicing elit. Rem officia
                mollitia magnam recusandae sequi? Ipsam assumenda facilis,
                repellendus quaerat, magnam repudiandae ducimus, dolores eum hic
                veniam soluta sit perferendis nulla. Lorem ipsum dolor sit amet,
                consectetur adipisicing elit. Rem officia mollitia magnam
                recusandae sequi? Ipsam assumenda facilis, repellendus quaerat,
                magnam repudiandae ducimus, dolores eum hic veniam soluta sit
                perferendis nulla. Ipsam assumenda facilis, repellendus quaerat,
                magnam repudiandae ducimus, dolores eum hic veniam soluta sit
                perferendis nulla.
              </Description>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
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

          {/* Right Content */}
          <div className="space-y-8 animate-fadeSlideUp">
            {/* Hero Image and Quote */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-green opacity-10 rounded-3xl blur-xl group-hover:opacity-20 transition-opacity duration-400"></div>
              <div className="relative bg-white rounded-3xl shadow-soft overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  <img
                    src={Bg_home}
                    alt="About us"
                    className="w-full lg:w-1/2 h-64 lg:h-auto object-cover"
                  />
                  <div className="p-8 lg:p-10 flex items-center">
                    <div>
                      <h3 className="font-poppins font-bold text-2xl lg:text-3xl text-gray-900 leading-tight">
                        Meninggalkan Jejak <br /> untuk Mengukir Sejarah
                      </h3>
                      <div className="mt-4 w-20 h-1 bg-gradient-green rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vision and Mission Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group">
                <div className="bg-gradient-green rounded-3xl p-8 text-white transition-all duration-400 hover:shadow-medium hover:scale-105 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 640"
                          className="w-8"
                        >
                          <path
                            fill="rgb(255, 255, 255)"
                            d="M416 224C398.3 224 384 209.7 384 192C384 174.3 398.3 160 416 160L576 160C593.7 160 608 174.3 608 192L608 352C608 369.7 593.7 384 576 384C558.3 384 544 369.7 544 352L544 269.3L374.6 438.7C362.1 451.2 341.8 451.2 329.3 438.7L224 333.3L86.6 470.6C74.1 483.1 53.8 483.1 41.3 470.6C28.8 458.1 28.8 437.8 41.3 425.3L201.3 265.3C213.8 252.8 234.1 252.8 246.6 265.3L352 370.7L498.7 224L416 224z"
                          />
                        </svg>
                      </div>
                      <h1 className="font-poppins font-bold text-2xl">Visi</h1>
                    </div>
                    <p className="text-white/90 leading-relaxed">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Laborum porro ad sed neque reiciendis corporis,
                      consequatur, molestiae ea saepe inventore quis aut
                      cupiditate fugit adipisci, voluptatibus tenetur dolores
                      esse quibusdam.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-8 text-white transition-all duration-400 hover:shadow-medium hover:scale-105 relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 640"
                          className="w-8"
                        >
                          <path
                            fill="rgb(255, 255, 255)"
                            d="M197.8 100.3C208.7 107.9 211.3 122.9 203.7 133.7L147.7 213.7C143.6 219.5 137.2 223.2 130.1 223.8C123 224.4 116 222 111 217L71 177C61.7 167.6 61.7 152.4 71 143C80.3 133.6 95.6 133.7 105 143L124.8 162.8L164.4 106.2C172 95.3 187 92.7 197.8 100.3zM197.8 260.3C208.7 267.9 211.3 282.9 203.7 293.7L147.7 373.7C143.6 379.5 137.2 383.2 130.1 383.8C123 384.4 116 382 111 377L71 337C61.6 327.6 61.6 312.4 71 303.1C80.4 293.8 95.6 293.7 104.9 303.1L124.7 322.9L164.3 266.3C171.9 255.4 186.9 252.8 197.7 260.4zM288 160C288 142.3 302.3 128 320 128L544 128C561.7 128 576 142.3 576 160C576 177.7 561.7 192 544 192L320 192C302.3 192 288 177.7 288 160zM288 320C288 302.3 302.3 288 320 288L544 288C561.7 288 576 302.3 576 320C576 337.7 561.7 352 544 352L320 352C302.3 352 288 337.7 288 320zM224 480C224 462.3 238.3 448 256 448L544 448C561.7 448 576 462.3 576 480C576 497.7 561.7 512 544 512L256 512C238.3 512 224 497.7 224 480zM128 440C150.1 440 168 457.9 168 480C168 502.1 150.1 520 128 520C105.9 520 88 502.1 88 480C88 457.9 105.9 440 128 440z"
                          />
                        </svg>
                      </div>
                      <h1 className="font-poppins font-bold text-2xl">Misi</h1>
                    </div>
                    <ul className="space-y-2 text-white/90">
                      <li className="flex items-start gap-2">
                        <span className="text-primary-300 mt-1">•</span>
                        <span>Lorem ipsum dolor sit amet.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary-300 mt-1">•</span>
                        <span>Lorem ipsum dolor, sit amet consectetur.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary-300 mt-1">•</span>
                        <span>Lorem ipsum dolor, sit amet consectetur.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary-300 mt-1">•</span>
                        <span>Lorem ipsum dolor sit amet consectetur.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
