import Title from "../components/atoms/Tittle";
import Description from "../components/atoms/Description";
import CardCom from "../components/molecules/CardCom";
import My from "../assets/vector/orangk.jpg";

export default function Purna() {
  const testimonials = [
    {
      profile: My,
      name: "Alfath Rizqiy",
      purna: "Angkatan 51",
      quetes:
        "Pengalaman di Dewan Ambalan telah membentuk karakter kepemimpinan saya dan memberikan fondasi yang kuat untuk masa depan. Saya belajar tentang tanggung jawab, disiplin, dan pentingnya kerjasama tim.",
    },
    {
      profile: My,
      name: "Sarah Putri",
      purna: "Angkatan 50",
      quetes:
        "Dewan Ambalan bukan hanya organisasi, tapi keluarga kedua saya. Di sini saya menemukan teman sejati, mentor yang peduli, dan kesempatan untuk berkembang menjadi versi terbaik diri saya.",
    },
    {
      profile: My,
      name: "Muhammad Fajar",
      purna: "Angkatan 49",
      quetes:
        "Setiap kegiatan dan pelatihan di Dewan Ambalan telah memberikan saya skills yang berharga untuk kehidupan profesional. Saya sangat berterima kasih atas semua pengalaman yang tak terlupakan ini.",
    },
    {
      profile: My,
      name: "Rina Amelia",
      purna: "Angkatan 52",
      quetes:
        "Bergabung dengan Dewan Ambalan adalah keputusan terbaik yang pernah saya buat. Saya tidak hanya belajar tentang kepemimpinan, tapi juga tentang bagaimana menjadi orang yang lebih baik dan bertanggung jawab.",
    },
    {
      profile: My,
      name: "Budi Santoso",
      purna: "Angkatan 48",
      quetes:
        "Dewan Ambalan mengajarkan saya arti sebenarnya dari persaudaraan dan pengabdian. Pengalaman ini akan selalu menjadi bagian tak terpisahkan dari perjalanan hidup saya.",
    },
    {
      profile: My,
      name: "Dewi Lestari",
      purna: "Angkatan 47",
      quetes:
        "Melalui Dewan Ambalan, saya menemukan passion saya dalam mengorganisir dan memimpin. Ini adalah tempat di mana mimpi dan potensi saya bisa tumbuh dan berkembang dengan pesat.",
    },
  ];

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
